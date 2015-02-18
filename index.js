'use strict';
var browserify = require('browserify');
var exorcist = require('exorcist');
var fs = require('fs');
var getBundleName = require('./library/get-bundle-name');
var glob = require('glob');
var lint = require('./library/lint');
var lodash = require('lodash');
var log = require('./library/log');
var mkdirp = require('mkdirp');
var path = require('path');
var packageData = require('./package');
var uncomment = require('./library/uncomment');

var bundles;
var source;
var target;

/**
 * @param {string} id
 */
function getIndex(id) {
    var index;
    index = path.resolve(path.join(source, id, 'index.js'));
    return index;
}

/**
 * @param {string} id
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
 */
function initialize(value, key) {
    var bundle;
    var mapFile = key + '-map.json';
    var mapPath = path.join(target, mapFile);

    function build(action, errors) {
        var startTime = +(new Date());

        function onError() {
            // Keep the process alive; error messages come from JSHint.
        }

        function onFinish() {
            var endTime = new Date();
            var performance = (+endTime - startTime) + ' ms';
            log([action, [key, 'magenta'], 'bundle in', performance]);
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
        .transform(uncomment)
        .add(getIndex(key));
    bundles[key] = build;

    if (this.errors[key]) {
        log(['aborted', [key, 'magenta'], 'bundle']);
    } else {
        build('created');
    }
}

/**
 * @param {Object} options
 */
function browserifix(options) {
    var errors = {};
    var watch;

    /**
     * @param {string} file
     */
    function forEachFile(file) {
        var filePath = path.join(source, file);
        var bundle = getBundleName(file);

        if (!errors.hasOwnProperty(bundle)) {
            errors[bundle] = 0;
        }

        errors[bundle] += lint(filePath, true);
    }

    source = options.source;
    target = options.target;
    mkdirp.sync(target);
    bundles = {};
    log(['started', packageData.name, packageData.version]);
    glob
        .sync('**/*.js', {
            cwd: source
        })
        .forEach(forEachFile);
    lodash
        .forIn(options.bundles, initialize, {
            errors: errors
        });

    if (options.watch) {
        watch = require('./library/watch');
        watch(source, bundles);
    }
}

module.exports = browserifix;
