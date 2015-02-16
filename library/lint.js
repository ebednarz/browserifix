'use strict';
var fs = require('fs');
var jshint = require('jshint').JSHINT;
var lintrc = require('./lintrc');
var log = require('./log');

var MAGIC_NUMBER = 7;
var testFileExpression = /_test.js$/;
var globals = {
    console: false
};

/**
 * @param {string} file
 * @param logFile
 * @returns {number}
 */
function lint(file, logFile) {
    var source = fs.readFileSync(file, 'utf8');

    if ('production' == process.env.NODE_ENV) {
        lintrc.debug = false;
        lintrc.devel = false;
    }

    if (testFileExpression.test(file)) {
        lintrc.jasmine = true;
        lintrc.mocha = true;
        lintrc.qunit = true;
    }

    jshint(source, lintrc, globals);

    if (logFile && jshint.errors.length) {
        log(['errored', [file, 'cyan']]);
    }

    jshint.errors.forEach(function (error) {
        var location = [error.line, error.character].join(':');

        while (location.length < MAGIC_NUMBER) {
            location = ' ' + location;
        }

        log([location, [error.reason, 'red']]);
    });
    return jshint.errors.length;
}

module.exports = lint;
