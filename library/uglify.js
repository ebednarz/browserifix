'use strict';
var fs = require('fs');
var path = require('path');
var sourcemapFilename = require('sourcemap-filename');
var uglifyJS = require('uglify-js');

function split(content) {
    var splitExpression = /\/\/#\s+sourceMappingURL=data:application\/json;base64,/mg;
    var parts = content.split(splitExpression);
    return {
        code: parts[0],
        map: decodeBase64(parts[1])
    };
}

function decodeBase64(base64) {
    return new Buffer(base64, 'base64').toString();
}

module.exports = function (baseName, file, source, callback) {
    var input = split(source);
    var codeFileName = baseName + '.min.js';
    var mapFileName = codeFileName + '.map';
    var bundle;

    bundle = uglifyJS.minify(input.code, {
        fromString: true,
        inSourceMap: JSON.parse(input.map),
        outSourceMap: mapFileName,
        sourceMapIncludeSources: true,
        sourceRoot: root
    });

    var codePromise = new Promise(function (resolve, reject) {
        fs.writeFile(path.join(file, codeFileName), bundle.code, 'utf8', function (error) {
            if (error) {
                reject(error)
            } else {
                resolve();
            }
        });
    });

    var mapPromise = new Promise(function (resolve, reject) {
        fs.writeFile(path.join(file, mapFileName), bundle.map, 'utf8', function (error) {
            if (error) {
                reject(error)
            } else {
                resolve();
            }
        });
    });

    Promise
        .all([codePromise, mapPromise])
        .then(callback)
        .then(null, function (reason) {
            console.log(reason);
        });
};
