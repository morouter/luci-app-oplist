#!/usr/bin/ucode

'use strict';

import { readfile } from 'fs';

function require_object(value, path) {
	if (type(value) != 'object')
		die(`OpenList config is missing object: ${path}\n`);
}

function parse_uint(value, path) {
	if (!match(value, /^(0|[1-9][0-9]*)$/))
		die(`Invalid unsigned integer for ${path}: ${value}\n`);

	return +value;
}

if (length(ARGV) != 28)
	die('Invalid argument count\n');

let config = json(readfile(ARGV[0]));
require_object(config, 'root');
require_object(config.scheme, 'scheme');
require_object(config.log, 'log');

config.scheme.address = ARGV[1];
config.scheme.http_port = parse_uint(ARGV[2], 'scheme.http_port');
config.scheme.force_https = ARGV[3] == '1';

if (config.scheme.force_https) {
	config.scheme.https_port = parse_uint(ARGV[4], 'scheme.https_port');

	if (length(ARGV[5]))
		config.scheme.cert_file = ARGV[5];

	if (length(ARGV[6]))
		config.scheme.key_file = ARGV[6];
}

config.scheme.enable_h3 = ARGV[7] == '1';
config.token_expires_in = parse_uint(ARGV[8], 'token_expires_in');
config.max_connections = parse_uint(ARGV[9], 'max_connections');
config.temp_dir = ARGV[10];
config.log.enable = ARGV[11] == '1';
config.log.max_size = parse_uint(ARGV[12], 'log.max_size');
config.log.name = '/etc/openlist/log/log.log';
config.site_url = ARGV[13];
config.max_concurrency = parse_uint(ARGV[14], 'max_concurrency');
config.delayed_start = parse_uint(ARGV[15], 'delayed_start');
config.log.max_backups = parse_uint(ARGV[16], 'log.max_backups');
config.log.max_age = parse_uint(ARGV[17], 'log.max_age');
config.log.compress = ARGV[18] == '1';
require_object(config.log.filter, 'log.filter');
config.log.filter.enable = ARGV[19] == '1';

require_object(config.s3, 's3');
config.s3.enable = ARGV[20] == '1';
config.s3.port = parse_uint(ARGV[21], 's3.port');
config.s3.ssl = ARGV[22] == '1';

require_object(config.ftp, 'ftp');
config.ftp.enable = ARGV[23] == '1';
config.ftp.listen = ARGV[24];

require_object(config.sftp, 'sftp');
config.sftp.enable = ARGV[25] == '1';
config.sftp.listen = ARGV[26];

if (type(config.mcp) != 'object')
	config.mcp = {};

config.mcp.enable = ARGV[27] == '1';

printf('%.J\n', config);
