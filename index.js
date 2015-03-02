'use strict';
var browserify = require('browserify');
var exorcist = require('exorcist');
var fs = require('fs');
var lodash = require('lodash');
var log = require('./library/log');
var mergeConfig = require('./library/merge-config');
var minstallify = require('minstallify');
var mkdirp = require('mkdirp');
var path = require('path');
var packageData = require('./package');
var q = require('q');
var sourcemapFilename = require('sourcemap-filename');

var MAGIC_NUMBER = 7;
var bundles;
var source;
var target;

/**
 * @param {string} id
 */
function getIndex(id) {
    var index;
    index = path.resolve(path.join(source, (id + '.js')));
    return index;
}

/**
 * @param {string} id
 * @returns {Object}
 */
function getWriteStream(id) {
    var fileName;
    var writeStream;
    fileName = path.join(target, id + '.js');
    writeStream = fs.createWriteStream(fileName, 'utf8');
    return writeStream;
}

/**
 * @param {Object} value
 * @param {string} key
 * @param {Object} deferred
 * @param {string} pattern
 */
function initialize(value, key, deferred, pattern) {
    var bundle;
    var mapFile = sourcemapFilename(key + '.js', pattern);
    var mapPath = path.join(target, mapFile);

    function build(action) {
        var startTime = +(new Date());

        function onError(error) {
            if (0 !== error.message.indexOf('JSHint')) {
                console.log(error.stack);
            }

            deferred.reject();
        }

        function onFinish() {
            var endTime = new Date();
            var performance = (+endTime - startTime) + ' ms';
            log([action, [key, 'magenta'], 'bundle in', performance]);
            deferred.resolve();
        }

        bundle
            .bundle()
            .on('error', onError)
            .pipe(exorcist(mapPath, '', '/SOURCEMAP'))
            .pipe(getWriteStream(key))
            .on('finish', onFinish);
    }

    bundle = browserify({
        debug: true
    });
    bundle
        .require(value.require || [])
        .external(value.external || [])
        .transform('lintify', {
            errors: {
                head: function (file) {
                    log(['errored', [file, 'cyan']]);
                },
                each: function (position, reason) {
                    while (position.length < MAGIC_NUMBER) {
                        position = ' ' + position;
                    }

                    log([position, [reason, 'red']]);
                },
                tail: function () {
                    log(['aborted', [key, 'magenta'], 'bundle']);
                },
                message: 'JSHint Error'
            },
            lintrc: require('./data/lintrc')
        })
        .transform('nocommentify')
        .transform('minstallify', {
            global: true
        })
        .add(getIndex(key));
    bundles[key] = build;
    build('created');
}

/**
 * @param {Object} options
 */
function browserifix(options) {
    var config;
    var queue = [];
    var watch;

    config = mergeConfig(require('./data/defaults'), options);
    source = config.source;
    target = config.target;
    mkdirp.sync(target);
    bundles = {};
    log(['started', packageData.name, packageData.version]);
    lodash
        .forIn(config.bundles, function (value, key) {
            var deferred = q.defer();
            queue.push(deferred.promise);
            initialize(value, key, deferred, config.pattern);
        });

    if (config.done) {
        q.all(queue).done(config.done);
    }

    if (config.watch) {
        watch = require('./library/watch');
        watch(source, bundles, config.app);
    }
}

module.exports = browserifix;
