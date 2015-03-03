'use strict';
var chokidar = require('chokidar');
var log = require('./log');
var path = require('path');

/**
 * @param {string} action
 * @returns {boolean}
 */
function hasContent(action) {
    switch (action) {
    case 'created':
    case 'changed':
        return true;
    }

    return false;
}

/**
 * @param {string} source
 * @param {Object} bundles
 * @param {string} app
 */
function watch(source, bundles, app) {
    var isReady;

    /**
     * @param {string} action
     * @returns {Function}
     */
    function onFileEventFactory(action) {
        /**
         * @param {string} filePath
         */
        function onFileEvent(filePath) {
            if (isReady) {
                log([action, [filePath, 'cyan']]);

                if (!hasContent(action)) {
                    return;
                }

                // nl.bednarz.fixme: use something smarter than brute force
                Object.keys(bundles).forEach(function (bundle) {
                    bundles[bundle]('updated');
                });
            }
        }

        return onFileEvent;
    }

    function onReady() {
        isReady = true;
    }

    function onError(error) {
        log([['errored', 'red'], error]);
    }

    chokidar
        .watch([
            path.join(source, '*.js'),
            path.join('node_modules', app, '**/*.js')
        ], {
            ignoreInitial: false
        })
        .on('add', onFileEventFactory('created'))
        .on('change', onFileEventFactory('changed'))
        .on('unlink', onFileEventFactory('removed'))
        .on('ready', onReady)
        .on('error', onError);
}

module.exports = watch;
