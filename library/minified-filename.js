'use strict';
var path = require('path');
var expression = /(\S+)\.(\S+)$/;

function replace(sourceFile, pattern) {
    var dirName = path.dirname(sourceFile);
    var baseName = path.basename(sourceFile);
    var fileName = baseName.replace(expression, pattern);

    if (dirName) {
        fileName = path.join(dirName, fileName);
    }

    return fileName;
}

function minifiedFileName(inputFileName, pattern) {
    var extension = path.extname(inputFileName);
    var baseName = path.basename(inputFileName, extension);
    var fileName;

    fileName = (('string' == typeof pattern) && pattern) ?
        replace(inputFileName, pattern) :
        (baseName + '.min' + extension);

    return fileName;
}

module.exports = minifiedFileName;
