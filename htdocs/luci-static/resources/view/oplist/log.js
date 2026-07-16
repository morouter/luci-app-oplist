// The log shows a partial quote:
// <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js>
// With Apache-2.0 License , here changed to AGPL-v3.0

"use strict";
"require fs";
"require dom";
"require poll";
"require view";
"require ui";

return view.extend({
  render: function () {
    var css =
      "                     \
    #log_textarea {         \
    padding: 10px;          \
    text-align: left;       \
    }                       \
    #log_textarea pre {     \
    padding: .5rem;         \
    word-break: break-all;  \
    margin: 0;              \
    white-space: pre-wrap;  \
    max-height: 70vh;       \
    overflow-y: auto;       \
    background: #f4f4f4;  \
    border: 1px solid #ccc;\
    }";

    var log_textarea = E(
      "div",
      { id: "log_textarea" },
      E(
        "img",
        {
          src: L.resource("icons/loading.svg"),
          alt: _("Loading..."),
          style: "vertical-align:middle",
        },
        _("Collecting data..."),
      ),
    );

    function getLogView() {
      return log_textarea.querySelector("pre");
    }

    function isAtBottom(log) {
      return !log || log.scrollHeight - log.scrollTop - log.clientHeight <= 2;
    }

    function refreshLog(force) {
      var currentLog = getLogView();
      if (!force && !isAtBottom(currentLog)) return Promise.resolve();

      return fs
        .read_direct("/etc/openlist/log/log.log", "text")
        .then(function (res) {
          var log = E("pre", { wrap: "pre" }, [
            res.trim() || _("Log is empty."),
          ]);
          dom.content(log_textarea, log);
          log.scrollTop = log.scrollHeight;
        })
        .catch(function (err) {
          var log;
          if (err.toString().includes("NotFoundError"))
            log = E("pre", { wrap: "pre" }, [_("Log file does not exist.")]);
          else
            log = E("pre", { wrap: "pre" }, [
              _("Unknown error: %s").format(err),
            ]);
          dom.content(log_textarea, log);
        });
    }

    function handleClearLog(ev) {
      var btn = ev.target;
      return ui.showModal(_("Clear log"), [
        E(
          "p",
          {},
          _("This will permanently erase the current log file. Continue?"),
        ),
        E("div", { class: "right" }, [
          E(
            "button",
            {
              class: "btn",
              click: ui.hideModal,
            },
            _("Cancel"),
          ),
          " ",
          E(
            "button",
            {
              class: "btn cbi-button-save",
              click: function () {
                btn.disabled = true;
                return fs
                  .write("/etc/openlist/log/log.log", "")
                  .then(function () {
                    ui.hideModal();
                    dom.content(
                      log_textarea,
                      E("pre", { wrap: "pre" }, [_("Log is empty.")]),
                    );
                  })
                  .catch(function (err) {
                    ui.hideModal();
                    ui.addNotification(
                      null,
                      E("p", {}, _("Failed to clear log: %s").format(err)),
                      "error",
                    );
                  })
                  .finally(function () {
                    btn.disabled = false;
                  });
              },
            },
            _("Clear log"),
          ),
        ]),
      ]);
    }

    poll.add(L.bind(refreshLog, this, false), 5);

    return E([
      E("style", [css]),
      E("div", { class: "cbi-map" }, [
        E("div", { class: "cbi-section" }, [
          log_textarea,
          E(
            "div",
            {
              style:
                "display: flex; justify-content: space-between; align-items: center; margin-top: 10px;",
            },
            [
              E("div", {}, [
                E(
                  "button",
                  {
                    class: "btn cbi-button-save",
                    click: ui.createHandlerFn(this, handleClearLog),
                  },
                  _("Clear log"),
                ),
                " ",
                E(
                  "button",
                  {
                    class: "btn cbi-button-action",
                    click: ui.createHandlerFn(this, function () {
                      return refreshLog(true);
                    }),
                  },
                  _("Refresh now"),
                ),
              ]),
              E(
                "small",
                {},
                _("Auto-refreshes every 5 seconds while viewing the latest logs."),
              ),
            ],
          ),
        ]),
      ]),
    ]);
  },

  handleSaveApply: null,
  handleSave: null,
  handleReset: null,
});
