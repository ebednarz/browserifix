'use strict';
var chokidar = require('chokidar');
var getProjectDependencies = require('./get-project-dependencies');
var log = require('./log');
var path = require('path');

function getBundleName(filePath) {
    var name = path.basename(filePath, path.extname(filePath));
    return name;
}

function hasContent(action) {
    switch (action) {
    case 'created':
    case 'changed':
        return true;
    }

    return false;
}

function watch(source, bundles, app) {
    var patternList;

    function onFileEventFactory(action) {
        function onFileEvent(filePath) {
            var pattern;

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
                })
                .then(null, function (reason) {
                    console.error(reason);
                });
        }

        return onFileEvent;
    }

    function onError(error) {
        log([['errored', 'red'], error]);
    }

    patternList = [
        path.join(source, '*.js'),
        path.join('node_modules', app, '**/*.{js,jsx}')
    ];
    chokidar
        .watch(patternList, {
            ignoreInitial: true
        })
        .on('add', onFileEventFactory('created'))
        .on('change', onFileEventFactory('changed'))
        .on('unlink', onFileEventFactory('removed'))
        .on('error', onError);
}

module.exports = watch;
