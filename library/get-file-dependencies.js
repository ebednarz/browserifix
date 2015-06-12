'use strict';
var async = require('async');
var browserResolve = require('browser-resolve');
var detective = require('detective-es6');
var fs = require('fs');
var packageName = require('../package').name;
var path = require('path');
var reverseConfig = require('reverse-config');

var config = reverseConfig[packageName].bundles;

function getFileDependencies(inputFile) {
    var main = path.basename(inputFile, path.extname(inputFile));
    var external = config[main].hasOwnProperty('external') ?
        config[main].external :
        [];
    var promise;

    function walk(file, callback) {
        file = path.resolve(file);
        fs.readFile(file, 'utf8', read);

        function read(error, contents) {
            var requires;

            if (error) {
                return callback(error);
            }

            requires = detective(contents).filter(function (name) {
                return (-1 === external.indexOf(name));
            });
            async.map(requires, getDependencies, gotDependencies);
        }

        function getDependencies(name, callback) {
            browserResolve(name, {
                filename: file
            }, resolved);

            function resolved(error, p) {
                if (error) {
                    return callback(error);
                }

                return walk(p, callback);
            }
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

            resolve(data);
        }

        walk(inputFile, done);
    }

    promise = new Promise(executor);
    return promise;
}

module.exports = getFileDependencies;
