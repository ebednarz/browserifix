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

function uglify(baseName, file, source, onResolved) {
    var input = split(source);
    var codeFileName = baseName + '.min.js';
    var mapFileName = codeFileName + '.map';
    var bundle;

    function filePromiseFactory(fileName, content) {
        var promise = new Promise(function (resolve, reject) {
            function callback(error) {
                if (error) {
                    reject(error)
                } else {
                    resolve();
                }
            }

            fs.writeFile(path.join(file, fileName), content, callback);
        });

        return promise;
    }

    function onRejected(reason) {
        console.log(reason);
    }

    bundle = uglifyJS.minify(input.code, {
        fromString: true,
        inSourceMap: JSON.parse(input.map),
        outSourceMap: mapFileName,
        sourceMapIncludeSources: true,
        sourceRoot: root
    });

    var codePromise = filePromiseFactory(codeFileName, bundle.code);
    var mapPromise = filePromiseFactory(mapFileName, bundle.map);
    Promise
        .all([codePromise, mapPromise])
        .then(onResolved)
        .then(null, onRejected);
}

module.exports = uglify;
