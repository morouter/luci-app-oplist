// SPDX-License-Identifier: Apache-2.0
// Changed from https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js
'use strict';
'require dom';
'require fs';
'require poll';
'require uci';
'require view';
'require ui';

return view.extend({
    render: function() {
        var css = '                     \
        #log_textarea {                 \
        padding: 10px;              \
        text-align: left;           \
    }                               \
    #log_textarea pre {             \
    padding: .5rem;             \
    word-break: break-all;      \
    margin: 0;                  \
    white-space: pre-wrap;      \
    max-height: 70vh;           \
    overflow-y: auto;           \
    background: #f4f4f4;        \
    border: 1px solid #ccc;     \
    }                               \
    .description {                  \
    background-color: #33ccff;  \
    }';

    var log_textarea = E('div', { 'id': 'log_textarea' },
                         E('img', {
                             'src': L.resource('icons/loading.svg'),
                           'alt': _('Loading...'),
                           'style': 'vertical-align:middle'
                         }, _('Collecting data...'))
    );

    poll.add(L.bind(function() {
        return fs.read_direct('/etc/openlist/log/log.log', 'text')
        .then(function(res) {
            var log = E('pre', { 'wrap': 'pre' }, [
                res.trim() || _('Log is empty.')
            ]);
            dom.content(log_textarea, log);
            log.scrollTop = log.scrollHeight;
        }).catch(function(err) {
            var log;
            if (err.toString().includes('NotFoundError'))
                log = E('pre', { 'wrap': 'pre' }, [ _('Log file does not exist.') ]);
            else
                log = E('pre', { 'wrap': 'pre' }, [ _('Unknown error: %s').format(err) ]);
            dom.content(log_textarea, log);
        });
    }));

    var handleClearLog = function(ev) {
        if (!confirm(_('Are you sure you want to delete the log file?')))
            return;

        return fs.exec('/bin/rm', ['/etc/openlist/log/log.log']).then(function() {
            ui.addNotification(null, E('p', _('Log file deleted successfully.')), 'info');
            dom.content(log_textarea, E('pre', { 'wrap': 'pre' }, [ _('Log is empty.') ]));
        }).catch(function(err) {
            ui.addNotification(null, E('p', _('Failed to delete log file: %s').format(err)), 'danger');
        });
    };

    return E([
        E('style', [ css ]),
             E('div', {'class': 'cbi-map'}, [
                 E('div', {'class': 'cbi-section'}, [
                     log_textarea,
                   E('div', {'style': 'display: flex; justify-content: space-between; align-items: center; margin-top: 10px;'}, [
                       E('button', {
                           'class': 'btn cbi-button-remove',
                           'click': ui.createHandlerFn(this, handleClearLog)
                       }, [ _('Clear Log') ]),
                     E('small', {}, _('Refresh every 5 seconds.'))
                   ])
                 ])
             ])
    ]);
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
