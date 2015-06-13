'use strict';
var async = require('async');
var browserResolve = require('browser-resolve');
var bundleConfig = require('./bundle-config');
var detective = require('detective-es6');
var fs = require('fs');
var lodash = require('lodash');
var path = require('path');

function relative(absolutePath) {
    return path.relative(process.cwd(), absolutePath);
}

function getFileDependencies(inputFile) {
    var main = path.basename(inputFile, path.extname(inputFile));
    var bundleExternal = bundleConfig[main].external;
    var bundleRequire = bundleConfig[main].require;
    var bundleRequireQueue;
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

            dependencies.push(relative(file));
            callback(null, dependencies.concat.apply([], dependencies));
        }
    }

    function dependencyExecutor(resolve, reject) {
        function done(error, data) {
            if (error) {
                reject(error);
            }

            resolve(data);
        }

        walk(inputFile, done);
    }

    function forEachRequiredBundle(name) {
        function executor(resolve, reject) {
            function callback(error, filePath) {
                if (error) {
                    reject(error);
                } else {
                    resolve(relative(filePath));
                }
            }

            browserResolve(name, {}, callback);
        }

        this.push(new Promise(executor));
    }

    bundleRequireQueue = [];
    bundleRequire.forEach(forEachRequiredBundle, bundleRequireQueue);

    promise = new Promise(function (resolve, reject) {
        Promise
            .all([
                Promise.all(bundleRequireQueue),
                new Promise(dependencyExecutor)
            ])
            .then(function (value) {
                var union = lodash.union.apply(null, value);
                resolve(union);
            })
            .then(null, function (reason) {
                reject(reason);
            });
    });
    return promise;
}

module.exports = getFileDependencies;
