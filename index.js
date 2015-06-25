'use strict';
var getFileName = require('./library/get-file-name');
var initialize = require('./library/initialize');
var lodash = require('lodash');
var log = require('./library/log');
var mergeConfig = require('./library/merge-config');
var mkdirp = require('mkdirp');
var packageData = require('./package');
var vendor = require('./library/vendor');

function browserifix(options) {
    var bundles = {};
    var queue = [];
    var all;
    var config;
    var promise;
    var watch;

    function setAppBundlePromise(value, key) {
        var promise;

        function itemExecutor(resolve, reject) {
            var deferred = {
                resolve: resolve,
                reject: reject
            };
            var build = initialize(value, key, deferred, config);
            bundles[key] = build;

            if (!config.watch) {
                //build('created');
            }
        }

        promise = new Promise(itemExecutor);
        queue.push(promise);
    }

    function setVendorBundlePromise(value, key) {
        var startTime = Number(new Date());
        var vendorFileName = getFileName(key, config.target);
        var promise;

        function itemExecutor(resolve, reject) {
            function onResolved() {
                var endTime = Number(new Date());
                var performance = (endTime - startTime) + ' ms' ;
                log(['created', [key, 'magenta'], ['library', 'cyan'], 'bundle in', performance]);
                resolve();
            }

            function onRejected(error) {
                console.error(error);
                reject(error);
            }

            vendor(vendorFileName, value)
                .then(onResolved)
                .then(null, onRejected);
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
    lodash.forIn(config.bundles, setAppBundlePromise);

    if (config.watch) {
        watch = require('./library/watch');
        watch(config.source, bundles, config.app);
    } else if (!config.resume) {
        lodash.forIn(config.vendors, setVendorBundlePromise);
    }

    all = Promise.all(queue);

    if (config.done) {
        all.then(config.done);
    }

    promise = new Promise(queueExecutor);
    return promise;
}

module.exports = browserifix;
