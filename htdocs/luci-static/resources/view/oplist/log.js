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
    var lastLogContent = null;
    var autoRefresh = true;
    var pauseButton;

    function setPauseButtonLabel() {
      dom.content(
        pauseButton,
        autoRefresh ? _("Pause auto-refresh") : _("Resume auto-refresh"),
      );
    }

    function refreshLog(force) {
      if (!force && !autoRefresh) return Promise.resolve();

      return fs
        .exec_direct("/usr/share/oplist/tail-log", [], "text")
        .then(function (res) {
          var content = res.trim();
          if (content === lastLogContent) return;

          lastLogContent = content;
          var log = E("pre", { wrap: "pre" }, [content || _("Log is empty.")]);
          dom.content(log_textarea, log);
          log.scrollTop = log.scrollHeight;
        })
        .catch(function (err) {
          var error = err.toString();
          var content =
            error.includes("NotFoundError") || error.includes("No such file")
              ? _("Log file does not exist.")
              : _("Unknown error: %s").format(err);
          if (content === lastLogContent) return;

          lastLogContent = content;
          var log = E("pre", { wrap: "pre" }, [content]);
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
                    lastLogContent = "";
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

    pauseButton = E(
      "button",
      {
        class: "btn cbi-button-action",
        click: ui.createHandlerFn(this, function () {
          autoRefresh = !autoRefresh;
          setPauseButtonLabel();
          return autoRefresh ? refreshLog(true) : Promise.resolve();
        }),
      },
      _("Pause auto-refresh"),
    );

    return E([
      E("style", [css]),
      E("div", { class: "cbi-map" }, [
        E("div", { class: "cbi-section" }, [
          E(
            "div",
            {
              style:
                "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;",
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
                pauseButton,
                " ",
                E(
                  "button",
                  {
                    class: "btn cbi-button-action",
                    click: ui.createHandlerFn(this, function () {
                      return refreshLog(true);
                    }),
                  },
                  _("Refresh"),
                ),
              ]),
              E(
                "small",
                {},
                _(
                  "Shows the last 1000 lines and auto-refreshes every 5 seconds.",
                ),
              ),
            ],
          ),
          log_textarea,
        ]),
      ]),
    ]);
  },

  handleSaveApply: null,
  handleSave: null,
  handleReset: null,
});
