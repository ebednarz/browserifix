'use strict';
var babelify = require('babelify');
var benchmark = require('./benchmark');
var browserify = require('browserify');
var getFileName = require('./get-file-name');
var getLintifyOptions = require('./get-lintify-options');
var lintify = require('lintify');
var lodash = require('lodash');
var log = require('./log');
var path = require('path');
var uglify = require('./uglify');
var watchify = require('watchify');

function logError(error) {
    if (0 !== error.message.indexOf('ESLint')) {
        console.error(error.stack);
    }
}

function initialize(value, key, deferred, config) {
    var fileName = getFileName(key, config.source);
    var lintifyOptions = getLintifyOptions(key, true);
    var action = 'created';
    var bundle;
    var external;
    var options;
    var startTime;
    var watcher;

    function onBuildError(error) {
        logError(error);
        deferred.reject(error);
    }

    function onBuildResolved() {
        var performance = benchmark(startTime);
        log([action, [key, 'magenta'], 'bundle in', performance]);
        deferred.resolve();
    }

    function onBuildRejected(reason) {
        console.error(reason);
        deferred.reject(reason);
    }

    function onBundle(error, buffer) {
        startTime = Number(new Date());

        if (error) {
            onBuildError(error);
        } else {
            uglify(key + '.js', String(buffer), config)
                .then(onBuildResolved)
                .then(null, onBuildRejected);
        }
    }

    external = lodash.union(
        lodash(config.vendors)
            .map(function (item) {
                return item;
            })
            .flatten()
            .value(),
        value.external
    );

    options = {
        basedir: config.source,
        debug: true,
        extensions: [
            '.jsx'
        ]
    };

    if (config.watch) {
        options.cache = {};
        options.poll = true;
        options.packageCache = {};
    }

    bundle = browserify(fileName, options)
        .require(value.require || [])
        .external(external)
        .transform(lintify, lintifyOptions)
        .transform(babelify.configure({
            sourceMapRelative: process.cwd(),
            only: config.babel
        }), {
            global: true
        });

    if (config.watch) {
        startTime = Number(new Date());
        watcher = watchify(bundle);
        watcher
            .on('update', function (ids) {
                ids.forEach(function (file) {
                    var relativePath = path.relative(process.cwd(), file);
                    log(['changed', [relativePath, 'cyan']]);
                });
                action = 'updated';
                watcher.bundle(onBundle);
            })
            .on('error', onBuildError)
            .bundle(function (error) {
                if (error) {
                    onBuildError(error);
                }

                deferred.resolve();
            });
    } else {
        bundle
            .bundle(onBundle)
            .on('error', onBuildError);
    }
}

module.exports = initialize;
