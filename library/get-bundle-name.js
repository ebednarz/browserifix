'use strict';
var path = require('path');

/**
 * @param {string} path
 * @returns {string}
 */
function strip(path) {
    path = path.replace(/^\.\//, '');
    return path;
}

/**
 * @param {string} filePath
 * @param {string} [source]
 * @returns {string}
 */
function getBundleName(filePath, source) {
    var bundleName;
    var extension;
    var index;
    filePath = strip(filePath);

    if (source) {
        source = strip(source);
        index = (filePath.lastIndexOf(source) + source.length + 1);
        filePath = filePath.substring(index);
    }

    bundleName = filePath.split('/')[0];
    extension = path.extname(bundleName);
    bundleName = path.basename(bundleName, extension);
    return bundleName;
}

module.exports = getBundleName;
