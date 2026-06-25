// SPDX-License-Identifier: AGPL-3.0

//The log shows a partial quote: 
// <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js> 
// With Apache-2.0 License

'use strict';
'require dom';
'require fs';
'require poll';
'require uci';
'require view';

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

    return E([
        E('style', [ css ]),
             E('div', {'class': 'cbi-map'}, [
                 E('div', {'class': 'cbi-section'}, [
                     log_textarea,
                     E('div', {'style': 'display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #666;'}, [
                         E('span', {}, [
                           _('To clear the log, please use: '),
                           E('code', { 'style': 'background:#eee; padding:2px 4px; border-radius:3px;' }, 'rm /etc/openlist/log/log.log')
                         ]),
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
