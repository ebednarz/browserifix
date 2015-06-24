'use strict';
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');
var uglify = require('./uglify');

function vendor(fileName, dependencies) {
    var outputPromise;

    function executor(resolve, reject) {
        function onError(error) {
            console.error(error);
            reject(error);
        }

        function bundle(error, buffer) {
            var buildPath = path.dirname(fileName);
            var extension = path.extname(fileName);
            var baseName = path.basename(fileName, extension);
            var input;

            if (error) {
                onError(error);
            } else {
                input = buffer.toString();
                uglify(baseName, buildPath, input)
                    .then(resolve)
                    .then(null, onError);
            }
        }

        browserify(dependencies)
            .bundle(bundle)
            .on('error', onError);
    }

    outputPromise = new Promise(executor);
    return outputPromise;
}

module.exports = vendor;
