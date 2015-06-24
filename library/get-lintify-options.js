'use strict';
var log = require('./log');
var MAGIC_NUMBER = 7;

function lintifyOptions(key, global) {
    var options;

    function head(file) {
        log(['errored', [file, 'cyan']]);
    }

    function each(position, reason) {
        while (position.length < MAGIC_NUMBER) {
            position = ' ' + position;
        }

        log([position, [reason, 'red']]);
    }

    function tail() {
        log(['aborted', [key, 'magenta'], 'bundle']);
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

module.exports = lintifyOptions;
