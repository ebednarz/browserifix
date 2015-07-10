'use strict';
var benchmark = require('./library/benchmark');
var getFileName = require('./library/get-file-name');
var initialize = require('./library/initialize');
var lodash = require('lodash');
var log = require('./library/log');
var mergeConfig = require('./library/merge-config');
var mkdirp = require('mkdirp');
var packageData = require('./package');
var vendor = require('./library/vendor');

function browserifix(options) {
    var appBundleQueue = [];
    var vendorBundleQueue = [];
    var all;
    var config;
    var promise;
    var startTime;

    function setAppBundlePromise(value, key) {
        var promise;

        function itemExecutor(resolve, reject) {
            var deferred = {
                resolve: resolve,
                reject: reject
            };
            initialize(value, key, deferred, config);
        }

        promise = new Promise(itemExecutor);
        appBundleQueue.push(promise);
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

            log(['prepare', [key, 'magenta'], ['library', 'cyan'], 'bundle']);

            value.forEach(function (dependency) {
                log(['package', [dependency, 'cyan']]);
            });

            vendor(vendorFileName, value, config)
                .then(onResolved)
                .then(null, onRejected);
        }

        promise = new Promise(itemExecutor);
        vendorBundleQueue.push(promise);
    }

    function queueExecutor(resolve, reject) {
        all.then(resolve, reject);
    }

    config = mergeConfig(options);
    mkdirp.sync(config.target);

    if (config.watch) {
        startTime = Number(new Date());
        lodash.forIn(config.bundles, setAppBundlePromise);
        Promise
            .all(appBundleQueue)
            .then(function () {
                var performance = benchmark(startTime);
                log(['watcher initialized in', performance]);
            });
        return;
    }

    log(['started', packageData.name, packageData.version]);

    if (config.vendor) {
        lodash.forIn(config.vendors, setVendorBundlePromise);
        all = Promise.all(vendorBundleQueue);
    } else if (config.bundle) {
        lodash.forIn(config.bundles, setAppBundlePromise);
        all = Promise.all(appBundleQueue);
    } else {
        lodash.forIn(config.vendors, setVendorBundlePromise);
        lodash.forIn(config.bundles, setAppBundlePromise);
        all = Promise.all(vendorBundleQueue.concat(appBundleQueue));
    }

    if (config.done) {
        all.then(config.done);
    }

    promise = new Promise(queueExecutor);
    return promise;
}

module.exports = browserifix;
