#!/usr/bin/ucode

'use strict';

import { readfile } from 'fs';
import { cursor } from 'uci';

const uci = cursor();

function require_object(value, path) {
	if (type(value) != 'object')
		die(`OpenList config is missing object: ${path}\n`);
}

function parse_uint(value, path) {
	if (!match(value, /^(0|[1-9][0-9]*)$/))
		die(`Invalid unsigned integer for ${path}: ${value}\n`);

	return +value;
}

function get_option(name, default_value) {
	let value = uci.get('oplist', 'main', name);
	return value == null ? default_value : value;
}

function get_bool(name, default_value) {
	return get_option(name, default_value ? '1' : '0') == '1';
}

if (length(ARGV) != 1)
	die('Invalid argument count\n');

let config = json(readfile(ARGV[0]));
require_object(config, 'root');
require_object(config.scheme, 'scheme');
require_object(config.log, 'log');

config.scheme.address = get_option('listen_addr', '0.0.0.0');
config.scheme.http_port = parse_uint(get_option('port', '5244'), 'scheme.http_port');
config.scheme.force_https = get_bool('tls_enabled', false);

if (config.scheme.force_https) {
	config.scheme.https_port = parse_uint(get_option('https_port', '443'), 'scheme.https_port');

	let cert_file = get_option('tls_cert', '');
	if (length(cert_file))
		config.scheme.cert_file = cert_file;

	let key_file = get_option('tls_key', '');
	if (length(key_file))
		config.scheme.key_file = key_file;
}

config.scheme.enable_h3 = config.scheme.force_https && get_bool('h3_enable', false);
config.token_expires_in = parse_uint(get_option('site_login_expire', '48'), 'token_expires_in');
config.max_connections = parse_uint(get_option('site_max_connections', '0'), 'max_connections');
config.temp_dir = get_option('temp_dir', '/etc/openlist/temp');
config.log.enable = get_bool('log_enable', true);
config.log.max_size = parse_uint(get_option('log_max_size', '5'), 'log.max_size');
config.log.name = '/etc/openlist/log/log.log';
config.site_url = get_option('site_url', '');
config.max_concurrency = parse_uint(get_option('max_concurrency', '64'), 'max_concurrency');
config.delayed_start = parse_uint(get_option('delayed_start', '0'), 'delayed_start');
config.log.max_backups = parse_uint(get_option('log_max_backups', '30'), 'log.max_backups');
config.log.max_age = parse_uint(get_option('log_max_age', '28'), 'log.max_age');
config.log.compress = get_bool('log_compress', false);
require_object(config.log.filter, 'log.filter');
config.log.filter.enable = get_bool('log_filter_enable', false);

require_object(config.s3, 's3');
config.s3.enable = get_bool('s3_enable', false);
config.s3.port = parse_uint(get_option('s3_port', '5246'), 's3.port');
config.s3.ssl = get_bool('s3_ssl', false);

require_object(config.ftp, 'ftp');
config.ftp.enable = get_bool('ftp_enable', false);
config.ftp.listen = get_option('ftp_listen', ':5221');

require_object(config.sftp, 'sftp');
config.sftp.enable = get_bool('sftp_enable', false);
config.sftp.listen = get_option('sftp_listen', ':5222');

if (type(config.mcp) != 'object')
	config.mcp = {};

config.mcp.enable = get_bool('mcp_enable', false);

printf('%.J\n', config);
