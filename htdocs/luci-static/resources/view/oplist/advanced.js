"use strict";
"require form";
"require view";

return view.extend({
  render: function () {
    var m, s, o;

    m = new form.Map("oplist", _("OpenList"));
    s = m.section(form.NamedSection, "main", "oplist");

    o = s.option(form.Flag, "s3_enable", _("Enable S3 Server"));
    o.default = "0";

    o = s.option(form.Value, "s3_port", _("S3 Listen Port"));
    o.datatype = "port";
    o.depends("s3_enable", "1");
    o.default = "5246";
    o.placeholder = "5246";

    o = s.option(form.Flag, "s3_ssl", _("Enable S3 TLS"));
    o.depends("s3_enable", "1");
    o.default = "0";

    o = s.option(form.Flag, "ftp_enable", _("Enable FTP Server"));
    o.default = "0";

    o = s.option(form.Value, "ftp_listen", _("FTP Listen Address"));
    o.depends("ftp_enable", "1");
    o.default = ":5221";
    o.placeholder = ":5221";
    o.rmempty = false;

    o = s.option(form.Flag, "sftp_enable", _("Enable SFTP Server"));
    o.default = "0";

    o = s.option(form.Value, "sftp_listen", _("SFTP Listen Address"));
    o.depends("sftp_enable", "1");
    o.default = ":5222";
    o.placeholder = ":5222";
    o.rmempty = false;

    o = s.option(form.Flag, "mcp_enable", _("Enable MCP Server"));
    o.default = "0";

    return m.render();
  },
});
