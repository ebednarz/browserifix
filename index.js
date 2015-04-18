'use strict';
var initialize = require('./library/initialize');
var lodash = require('lodash');
var log = require('./library/log');
var mergeConfig = require('./library/merge-config');
var mkdirp = require('mkdirp');
var packageData = require('./package');

function browserifix(options) {
    var bundles = {};
    var queue = [];
    var all;
    var config;
    var promise;
    var watch;

    function setPromise(value, key) {
        var promise;

        function itemExecutor(resolve, reject) {
            var deferred = {
                resolve: resolve,
                reject: reject
            };
            var build = initialize(value, key, deferred, config);
            bundles[key] = build;

            if (!config.watch) {
                build('created');
            }
        }

        promise = new Promise(itemExecutor);
        queue.push(promise);
    }

    function queueExecutor(resolve, reject) {
        all.then(resolve, reject);
    }

    config = mergeConfig(options);
    mkdirp.sync(config.target);
    log(['started', packageData.name, packageData.version]);
    lodash.forIn(config.bundles, setPromise);
    all = Promise.all(queue);

    if (config.done) {
        all.then(config.done);
    }

    if (config.watch) {
        watch = require('./library/watch');
        watch(config.source, bundles, config.app);
    }

    promise = new Promise(queueExecutor);
    return promise;
}

module.exports = browserifix;
