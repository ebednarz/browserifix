'use strict';
var chokidar = require('chokidar');
var getProjectDependencies = require('./get-project-dependencies');
var log = require('./log');
var path = require('path');

function getBundleName(filePath) {
    var name = path.basename(filePath, path.extname(filePath));
    return name;
}

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
            var pattern;

            if (isReady) {
                log([action, [filePath, 'cyan']]);

                if (!hasContent(action)) {
                    return;
                }

                if (path.dirname(filePath) == source) {
                    bundles[getBundleName(filePath)]('updated');
                    return;
                }

                pattern = path.join(source, '*.js');
                getProjectDependencies(pattern)
                    .then(function (map) {
                        Object.keys(map).forEach(function (key) {
                            if (-1 !== map[key].indexOf(filePath)) {
                                bundles[getBundleName(key)]('updated');
                            }
                        });
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
