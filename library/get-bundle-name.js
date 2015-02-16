'use strict';

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
    var index;
    filePath = strip(filePath);

    if (source) {
        source = strip(source);
        index = (filePath.lastIndexOf(source) + source.length + 1);
        filePath = filePath.substring(index);
    }

    bundleName = filePath.split('/')[0];
    return bundleName;
}

module.exports = getBundleName;
