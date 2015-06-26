'use strict';
var fs = require('fs');
var lodash = require('lodash');
var path = require('path');
var minifiedFileName = require('./minified-filename');
var sourcemapFilename = require('sourcemap-filename');
var uglifyJS = require('uglify-js');

function split(content) {
    var splitExpression = /\/\/#\s+sourceMappingURL=data:application\/json;base64,/mg;
    var parts = content.split(splitExpression);
    return {
        code: parts[0],
        map: (parts[1] && decodeBase64(parts[1]))
    };
}

function decodeBase64(base64) {
    return new Buffer(base64, 'base64').toString();
}

function filePromiseFactory(filePath, content) {
    var promise;

    function writeExecutor(resolve, reject) {
        function callback(error) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve();
            }
        }

        fs.writeFile(filePath, content, callback);
    }

    promise = new Promise(writeExecutor);
    return promise;
}

function getQueue(fileName, input, config) {
    var codeFileName = minifiedFileName(fileName, config.min);
    var queue = [];
    var mapFileName;
    var output;
    var options;

    options = {
        fromString: true,
        output: {
            comments: /(^!|@license|@preserve)/
        }
    };

    if (input.map) {
        mapFileName = sourcemapFilename(codeFileName, config.map);
        lodash.merge(options, {
            compress: false,
            mangle: false,
            inSourceMap: JSON.parse(input.map),
            outSourceMap: mapFileName,
            sourceMapIncludeSources: true
        });
    }

    output = uglifyJS.minify(input.code, options);
    queue.push(filePromiseFactory(path.join(config.target, codeFileName), output.code));

    if (output.map) {
        queue.push(filePromiseFactory(path.join(config.target, mapFileName), output.map));
    }

    return queue;
}

/**
 * @param {string} fileName
 * @param {string} source
 * @param {Object} config
 * @returns {Promise}
 */
function uglify(fileName, source, config) {
    var promise;

    function executor(resolve, reject) {
        var input = split(source);
        var queue = getQueue(fileName, input, config);
        Promise
            .all(queue)
            .then(resolve)
            .then(null, reject);
    }

    promise = new Promise(executor);
    return promise;
}

module.exports = uglify;
