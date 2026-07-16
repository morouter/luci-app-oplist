"use strict";
"require uci";
"require rpc";
"require form";
"require poll";
"require view";
"require validation";

const callServiceList = rpc.declare({
  object: "service",
  method: "list",
  params: ["name"],
  expect: { "": {} },
});

function getServiceStatus() {
  return L.resolveDefault(callServiceList("oplist"), {}).then(function (res) {
    var isRunning = false;
    try {
      isRunning = res["oplist"]["instances"]["instance1"]["running"];
    } catch (e) {}
    return isRunning;
  });
}

function renderStatus(isRunning, port) {
  var spanTemp = '<span style="color:%s"><strong>%s %s</strong></span>';
  var renderHTML;
  if (isRunning) {
    renderHTML = spanTemp.format("green", _("OpenList"), _("RUNNING"));
  } else {
    renderHTML = spanTemp.format("red", _("OpenList"), _("NOT RUNNING"));
  }
  return renderHTML;
}

return view.extend({
  load: function () {
    return Promise.all([uci.load("oplist")]);
  },

  render: function (data) {
    let m, s, o;
    var webport = uci.get(data[0], "main", "port") || "5244";

    m = new form.Map(
      "oplist",
      _("OpenList"),
      _("LuCI support for OpenList") +
        "<br>" +
        _("Default username/password: admin/password"),
    );

    s = m.section(form.TypedSection);
    s.anonymous = true;
    s.render = function () {
      poll.add(function () {
        return L.resolveDefault(getServiceStatus()).then(function (res) {
          var view = document.getElementById("service_status");
          if (view) view.innerHTML = renderStatus(res, webport);
        });
      });

      return E("div", { class: "cbi-section", id: "status_bar" }, [
        E("p", { id: "service_status" }, _("Collecting data...")),
      ]);
    };

    s = m.section(form.NamedSection, "main", "oplist");

    o = s.option(form.Flag, "enabled", _("Enable Service"));
    o.rmempty = false;

    o = s.option(
      form.Value,
      "listen_addr",
      _("Listen Address"),
      _("Address on which OpenList listens. Use 0.0.0.0 for all IPv4 interfaces or :: for all IPv6 interfaces."),
    );
    o.datatype = "ipaddr";
    o.default = "0.0.0.0";
    o.placeholder = "0.0.0.0";
    o.rmempty = false;

    o = s.option(form.Value, "port", _("HTTP Listen Port"));
    o.datatype = "port";
    o.placeholder = "5244";

    o = s.option(form.Value, "site_url", _("Site URL"));
    o.placeholder = "https://openlist.example.com";

    o = s.option(form.Flag, "tls_enabled", _("Enable TLS"));
    o.rmempty = false;

    o = s.option(form.Value, "https_port", _("HTTPS Listen Port"));
    o.depends("tls_enabled", "1");
    o.datatype = "port";
    o.placeholder = "443";

    o = s.option(
      form.Value,
      "tls_cert",
      _("Certificate Path"),
      _("Path to your .crt / .cer file"),
    );
    o.depends("tls_enabled", "1");
    o.placeholder = "/root/.acme.sh/your_domain/fullchain.cer";

    o = s.option(
      form.Value,
      "tls_key",
      _("Private Key Path"),
      _("Path to your .key / .pem file"),
    );
    o.depends("tls_enabled", "1");
    o.placeholder = "/root/.acme.sh/your_domain/your_domain.key";

    o = s.option(form.Flag, "h3_enable", _("Enable HTTP3"));
    o.depends("tls_enabled", "1");

    o = s.option(form.Value, "delayed_start", _("Delayed Start (seconds)"));
    o.datatype = "uinteger";
    o.default = "0";
    o.placeholder = "0";

    o = s.option(
      form.Value,
      "temp_dir",
      _("Cache Directory"),
      _("Directory for temporary files during upload."),
    );
    o.placeholder = "/etc/openlist/temp";
    o.rmempty = false;

    o = s.option(form.Value, "site_login_expire", _("Login Expiration (hours)"));
    o.datatype = "uinteger";
    o.default = "48";
    o.placeholder = "48";

    o = s.option(form.Value, "site_max_connections", _("Max Connections"));
    o.datatype = "uinteger";
    o.default = "0";
    o.placeholder = "0";

    o = s.option(form.Value, "max_concurrency", _("Max Concurrency"));
    o.datatype = "uinteger";
    o.default = "64";
    o.placeholder = "64";

    o = s.option(form.Flag, "log_enable", _("Enable Logging"));
    o.default = "1";

    o = s.option(form.Value, "log_max_size", _("Max log size (MB)"));
    o.datatype = "uinteger";
    o.depends("log_enable", "1");
    o.placeholder = "5";

    o = s.option(form.Value, "log_max_backups", _("Max Log Backups"));
    o.datatype = "uinteger";
    o.depends("log_enable", "1");
    o.default = "30";
    o.placeholder = "30";

    o = s.option(form.Value, "log_max_age", _("Max Log Age (days)"));
    o.datatype = "uinteger";
    o.depends("log_enable", "1");
    o.default = "28";
    o.placeholder = "28";

    o = s.option(form.Flag, "log_compress", _("Compress Rotated Logs"));
    o.depends("log_enable", "1");
    o.default = "0";

    o = s.option(form.Flag, "log_filter_enable", _("Enable Log Filter"));
    o.depends("log_enable", "1");
    o.default = "0";

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
