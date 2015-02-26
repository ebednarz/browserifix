'use strict';
var chokidar = require('chokidar');
var getBundleName = require('./get-bundle-name');
var log = require('./log');

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
 */
function watch(source, bundles) {
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
            var bundle;

            if (isReady) {
                log([action, [filePath, 'cyan']]);

                if (!hasContent(action)) {
                    return;
                }

                bundle = getBundleName(filePath, source);
                bundles[bundle]('updated');
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
        .watch(source, {
            ignored: /(?:\.(md|markdown)|_test.js)$/,
            ignoreInitial: false
        })
        .on('add', onFileEventFactory('created'))
        .on('change', onFileEventFactory('changed'))
        .on('unlink', onFileEventFactory('removed'))
        .on('ready', onReady)
        .on('error', onError);
}

module.exports = watch;
