'use strict';
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');
var uglify = require('./uglify');

function vendor(fileName, dependencies, config) {
    var outputPromise;

    function executor(resolve, reject) {
        function onError(error) {
            console.error(error);
            reject(error);
        }

        function bundle(error, buffer) {
            var buildPath = path.dirname(fileName);
            var input;

            if (error) {
                onError(error);
            } else {
                input = buffer.toString();
                uglify(fileName, input, config)
                    .then(resolve)
                    .then(null, onError);
            }
        }

        browserify(dependencies)
            .require(dependencies)
            .bundle(bundle)
            .on('error', onError);
    }

    outputPromise = new Promise(executor);
    return outputPromise;
}

module.exports = vendor;
