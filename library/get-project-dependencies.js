'use strict';
var bundleConfig = require('./bundle-config');
var getFileDependencies = require('./get-file-dependencies');
var glob = require('glob');
var path = require('path');

function getProjectDependencies(pattern) {
    var map = {};
    var files = [];
    var bundles = [];
    var promise;

    function setDependencies(file) {
        files.push(file);
        bundles.push(getFileDependencies(file));
    }

    function executor(resolve, reject) {
        function onAllResolved(values) {
            files.forEach(function (file, index) {
                map[file] = values[index];
            });
            resolve(map);
        }

        function onRejected(reason) {
            reject(reason);
        }

        function globCallback(error, matches) {
            matches.forEach(setDependencies);
            Promise
                .all(bundles)
                .then(onAllResolved)
                .then(null, onRejected);
        }

        glob(pattern, globCallback);
    }

    promise = new Promise(executor);
    return promise;
}

module.exports = getProjectDependencies;
