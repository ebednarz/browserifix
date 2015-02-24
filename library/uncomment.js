'use strict';
var getComments = require('./get-comments');
var through2 = require('through2');

/**
 * @param {string} input
 * @param {number} start
 * @param {number} end
 * @param {boolean} trim
 * @returns {string}
 */
function spliceString(input, start, end, trim) {
    var head = input.substring(0, start);
    var tail = input.substring(end);

    if (trim) {
        head = head.replace(/\n[ \t]*$/, '');
    }

    return (head + tail);
}

/**
 * @param {Object} buffer
 * @param {string} encoding
 * @param {Function} next
 */
function setBuffer(buffer, encoding, next) {
    var input = buffer.toString('utf8').replace(/\r\n/g, '\n');
    var comments = getComments(input);
    var length = comments.length;
    var comment;

    input = input.substring(0, comments.endpos);

    if (length) {
        while (length--) {
            comment = comments[length];
            input = spliceString(input, comment.pos, comment.endpos, comment.nlb);
        }

        this.push(input.trim());
    } else {
        this.push(input);
    }

    next();
}

function uncomment() {
    var stream;
    stream = through2(setBuffer);
    return stream;
}

module.exports = uncomment;
