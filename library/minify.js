'use strict';
var through2 = require('through2');
var uglifyJs = require('uglify-js');

/**
 * @param {Object} buffer
 * @param {string} encoding
 * @param {Function} next
 */
function setBuffer(buffer, encoding, next) {
    var input = buffer.toString('utf8');
    input = uglifyJs.minify(input, {
        fromString: true,
        output: {
            comments: /^!|@preserve|@license|@cc_on/i
        },
        compress: true,
        mangle: true
    });
    this.push(input.code);
    next();
}

/**
 * @param {Object} buffer
 * @param {string} encoding
 * @param {Function} next
 */
function trim(buffer, encoding, next) {
    var input = buffer.toString('utf8').trim();
    this.push(input);
    next();
}

function minify(modulePath, options) {
    var stream;

    if (
        /\/?node_modules\//.test(modulePath) && !/\/?node_modules\/_/.test(modulePath)
    ) {
        stream = through2(setBuffer);
    } else {
        stream = through2(trim);
    }

    return stream;
}

module.exports = minify;
