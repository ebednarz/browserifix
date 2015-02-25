'use strict';
var lodash = require('lodash');
var uglifyJs = require('uglify-js');

/**
 * @param {string} code
 * @returns {Array}
 */
function getComments(code) {
    var ast;
    var comments = [];
    var endpos = 0;

    function iterate(comment) {
        comments.push(JSON.stringify(comment));
    }

    function processNode(node) {
        endpos = Math.max(node.end.endpos, endpos);

        if (node.start.comments_before.length) {
            node.start.comments_before.forEach(iterate);
        }

        if (node.end.comments_before.length) {
            node.end.comments_before.forEach(iterate);
        }
    }

    function toObject(comment) {
        return JSON.parse(comment);
    }

    try {
        ast = uglifyJs.parse(code);
    } catch (error) {
        return comments;
    }

    ast.walk(new uglifyJs.TreeWalker(processNode));
    comments = lodash.uniq(comments).map(toObject);
    comments = lodash.sortBy(comments, 'pos');
    comments.endpos = endpos;
    return comments;
}

module.exports = getComments;
