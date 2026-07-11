// SPDX-License-Identifier: AGPL-3.0

// The log shows a partial quote:
// <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js>
// With Apache-2.0 License

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
              class: "btn cbi-button-negative",
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

    poll.add(
      L.bind(function () {
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
      }),
    );

    return E([
      E("style", [css]),
      E("div", { class: "cbi-map" }, [
        E("div", { class: "cbi-section" }, [
          log_textarea,
          E(
            "div",
            {
              style:
                "display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #666;",
            },
            [
              E(
                "button",
                {
                  class: "btn cbi-button-negative",
                  click: ui.createHandlerFn(this, handleClearLog),
                },
                _("Clear log"),
              ),
              E("small", {}, _("Refresh every 5 seconds.")),
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
