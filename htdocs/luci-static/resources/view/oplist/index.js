"use strict";
"require uci";
"require form";
"require poll";
"require rpc";
"require validation";
"require view";

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
        _("Default username: admin ; Default password: password"),
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

    o = s.option(form.Value, "port", _("HTTP Listen Port"));
    o.datatype = "port";
    o.placeholder = "5244";

    o = s.option(form.Flag, "tls_enabled", _("Enable TLS"));
    o.rmempty = false;

    o = s.option(form.Value, "https_port", _("HTTPS Listen Port"));
    o.depends("tls_enabled", "1");
    o.datatype = "port";
    o.placeholder = "5245";

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

    o = s.option(form.Flag, "log_enable", _("Enable Logging"));
    o.default = "1";

    o = s.option(form.Value, "log_max_size", _("Max log size (MB)"));
    o.datatype = "uinteger";
    o.depends("log_enable", "1");
    o.placeholder = "5";

    o = s.option(
      form.Value,
      "temp_dir",
      _("Cache Directory"),
      _("Directory for temporary files during upload/download."),
    );
    o.placeholder = "/etc/openlist/temp";
    o.rmempty = false;

    return m.render();
  },
});
