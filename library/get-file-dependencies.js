'use strict';
var async = require('async');
var browserResolve = require('browser-resolve');
var bundleConfig = require('./bundle-config');
var detective = require('detective-es6');
var fs = require('fs');
var path = require('path');

function getFileDependencies(inputFile) {
    var main = path.basename(inputFile, path.extname(inputFile));
    var bundleExternal = bundleConfig[main].external;
    var bundleRequire = bundleConfig[main].require;
    var promise;

    function walk(file, callback) {
        file = path.resolve(file);
        fs.readFile(file, 'utf8', read);

        function read(error, contents) {
            var imports;

            if (error) {
                return callback(error);
            }

            imports = detective(contents).filter(function (name) {
                return (-1 === bundleExternal.indexOf(name));
            });
            async.map(imports, getDependencies, gotDependencies);
        }

        function getDependencies(name, callback) {
            function resolved(error, p) {
                if (error) {
                    return callback(error);
                }

                return walk(p, callback);
            }

            browserResolve(name, {
                filename: file
            }, resolved);
        }

        function gotDependencies(error, dependencies) {
            if (error) {
                return callback(error);
            }

            dependencies.push(path.relative(process.cwd(), file));
            callback(null, dependencies.concat.apply([], dependencies));
        }
    }

    function executor(resolve, reject) {
        function done(error, data) {
            if (error) {
                reject(error);
            }

            // add modules that are exposed by but not used in the bundle
            // nl.bednarz.todo: invoke earlier and asynchronously
            bundleRequire.forEach(function (name) {
                var filePath = browserResolve.sync(name);
                var relativePath = path.relative(process.cwd(), filePath);

                if (-1 === data.indexOf(relativePath)) {
                    data.push(relativePath);
                }
            });
            resolve(data);
        }

        walk(inputFile, done);
    }

    promise = new Promise(executor);
    return promise;
}

module.exports = getFileDependencies;
