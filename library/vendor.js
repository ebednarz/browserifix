'use strict';
var browserify = require('browserify');
var fs = require('fs');
var uglifyJS = require('uglify-js');

function bundle(fileName, dependencies) {
    var outputPromise;

    function executor(resolve, reject) {
        function onError(error) {
            console.log(error);
            reject(error);
        }

        function bundle(error, buffer) {
            var input;
            var output;

            if (error) {
                onError(error);
            } else {
                input = buffer.toString();
                output = uglifyJS.minify(input, {
                    fromString: true,
                    mangle: true,
                    compress: true
                });
                fs.writeFile(fileName, output.code, function (error) {
                    if (error) {
                        onError(error);
                    }

                    resolve();
                });
            }
        }

        browserify(dependencies)
            .bundle(bundle)
            .on('error', onError);
    }

    outputPromise = new Promise(executor);
    return outputPromise;
}

module.exports = bundle;
