'use strict';
var log = require('./log');
var MAGIC_NUMBER = 7;
var lintifyOptions;

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

lintifyOptions = {
    errors: {
        head: head,
        each: each,
        tail: tail,
        message: 'JSHint Error'
    },
    lintrc: require('../data/lintrc')
};

module.exports = lintifyOptions;
