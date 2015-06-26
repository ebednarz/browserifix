'use strict';
var log = require('./log');
var MAGIC_NUMBER = 7;

function getLintifyOptions(key, global) {
    var options;

    function head(file) {
        log(['errored', [file, 'cyan']]);
    }

    function each(position, reason, source, url) {
        while (position.length < MAGIC_NUMBER) {
            position = ' ' + position;
        }

        log([position, [reason, 'red']]);

        if (source) {
            log([position, source]);
        }

        log([position, url]);
    }

    function tail() {
        log([['aborted', 'red'], [key, 'magenta'], 'bundle']);
    }

    options = {
        errors: {
            head: head,
            each: each,
            tail: tail,
            message: 'ESLint Error'
        },
        global: !!global
    };

    return options;
}

module.exports = getLintifyOptions;
