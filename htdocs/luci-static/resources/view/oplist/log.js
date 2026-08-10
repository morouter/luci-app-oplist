// The log shows has included this project:
// https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js
// Licensed under the Apache-2.0 License , here changed to AGPL-v3.0

"use strict";
"require fs";
"require dom";
"require poll";
"require view";
"require ui";

return view.extend({
  render: function () {
    var css =
      '                                             \
    #log_textarea {                                 \
    padding: 10px;                                  \
    text-align: left;                               \
    }                                               \
    #log_textarea pre {                             \
    padding: .5rem;                                 \
    word-break: break-all;                          \
    margin: 0;                                      \
    white-space: pre-wrap;                          \
    max-height: 70vh;                               \
    overflow-y: auto;                               \
    background: #f4f4f4;                            \
    border: 1px solid #ccc;                         \
    }                                               \
    :root[data-darkmode="true"] #log_textarea pre {\
    background: #1e1e1e;                            \
    border: 1px solid #444;                         \
    color: #d4d4d4;                                 \
    }                                               \
    @media (prefers-color-scheme: dark) {           \
    #log_textarea pre {                             \
    background: #1e1e1e;                            \
    border: 1px solid #444;                         \
    color: #d4d4d4;                                 \
    }                                               \
    }';

    // Text cannot be rendered inside an <img> element, so keep the spinner and the label as siblings.
    var log_textarea = E("div", { id: "log_textarea" }, [
      E("img", {
        src: L.resource("icons/loading.svg"),
        alt: _("Loading..."),
        style: "vertical-align:middle",
      }),
      " " + _("Collecting data..."),
    ]);
    var lastLogContent = null;
    var lastTotal = 0;
    var autoRefresh = true;
    var refreshing = false;
    var refreshInterval = 5;
    var pauseButton;

    function setPauseButtonLabel() {
      dom.content(
        pauseButton,
        autoRefresh ? _("Pause auto-refresh") : _("Resume auto-refresh"),
      );
    }

    function fetchTail(start) {
      if (start == null) start = lastTotal > 0 ? lastTotal + 1 : 0;

      return fs.exec_direct(
        "/usr/share/oplist/tail-log",
        [String(start)],
        "text",
      );
    }

    function renderLog(text) {
      var oldPre = log_textarea.querySelector("pre");
      var wasNearBottom = true;
      if (oldPre)
        wasNearBottom =
          oldPre.scrollHeight - oldPre.scrollTop - oldPre.clientHeight < 50;

      var log = E("pre", { wrap: "pre" }, [text]);
      dom.content(log_textarea, log);
      if (wasNearBottom) log.scrollTop = log.scrollHeight;
    }

    function handleTail(res, start) {
      var nl = res.indexOf("\n");
      var total = parseInt(res.substring(0, nl), 10);
      var content = nl >= 0 ? res.substring(nl + 1).replace(/\n$/, "") : "";

      if (isNaN(total)) total = 0;

      if (total < lastTotal) {
        // The log was rotated or truncated, refetch everything from scratch.
        lastTotal = 0;
        lastLogContent = null;
        return fetchTail(0).then(function (res2) {
          return handleTail(res2, 0);
        });
      }

      var newLines = content === "" ? 0 : content.split("\n").length;
      if (start > 0) {
        if (newLines === 0 && total === lastTotal) return;
        lastTotal += newLines;
      } else {
        lastTotal = total;
        lastLogContent = null;
      }

      var combined = (lastLogContent ? lastLogContent + "\n" : "") + content;
      var lines = combined.split("\n");
      if (lines.length > 1000) lines = lines.slice(lines.length - 1000);

      lastLogContent = lines.join("\n");
      renderLog(lastLogContent || _("Log is empty."));
    }

    function handleLogError(err) {
      var error = err.toString();
      var content =
        error.includes("NotFoundError") ||
        error.includes("No such file") ||
        error.includes("not found")
          ? _("Log file does not exist.")
          : _("Unknown error: %s").format(err);
      if (content === lastLogContent) return;

      lastLogContent = content;
      lastTotal = 0;
      dom.content(log_textarea, E("pre", { wrap: "pre" }, [content]));
    }

    function refreshLog(force) {
      // Guard against overlapping polls: a slow fetch (large log, slow
      // connection) must not run concurrently with the next one, otherwise
      // the incremental line counter would be applied twice.
      if (refreshing || (!force && !autoRefresh)) return Promise.resolve();

      refreshing = true;
      var start = lastTotal > 0 ? lastTotal + 1 : 0;
      return fetchTail(start)
        .then(function (res) {
          return handleTail(res, start);
        })
        .catch(handleLogError)
        .finally(function () {
          refreshing = false;
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
              class: "btn cbi-button-negative",
              click: function () {
                btn.disabled = true;
                return fs
                  .write("/etc/openlist/log/log.log", "")
                  .then(function () {
                    ui.hideModal();
                    lastLogContent = "";
                    lastTotal = 0;
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
            _("Delete"),
          ),
        ]),
      ]);
    }

    poll.add(L.bind(refreshLog, this, false), refreshInterval);

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
                _("Refresh every %s seconds.").format(refreshInterval),
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
