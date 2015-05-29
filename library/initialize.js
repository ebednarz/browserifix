'use strict';
var browserify = require('browserify');
var exorcist = require('exorcist');
var getFileName = require('./get-file-name');
var getWriteStream = require('./get-write-stream');
var lintify = require('lintify');
var lintifyOptions = require('./lintify-options');
var log = require('./log');
var minstallify = require('minstallify');
var nocommentify = require('nocommentify');
var path = require('path');
var sourcemapFilename = require('sourcemap-filename');

function initialize(value, key, deferred, config) {
    var fileName = getFileName(key, config.source);
    var mapFile = sourcemapFilename(key + '.js', config.pattern);
    var mapPath = path.join(config.target, mapFile);
    var bundle;
    var browserifyOptions;
    var nocommentifyOptions;
    var minstallifyOptions;

    function build(action) {
        var startTime = Number(new Date());
        var writeStream = getWriteStream(key, config.target);
        var exorcism = exorcist(mapPath, '', '/SOURCEMAP');

        function onError(error) {
            if (0 !== error.message.indexOf('JSHint')) {
                console.log(error.stack);
            }

            deferred.reject();
        }

        function onFinish() {
            var endTime = Number(new Date());
            var performance = (endTime - startTime) + ' ms' ;
            log([action, [key, 'magenta'], 'bundle in', performance]);
            deferred.resolve();
        }

        bundle
            .bundle()
            .on('error', onError)
            .pipe(exorcism)
            .pipe(writeStream)
            .on('finish', onFinish);
    }

    browserifyOptions = {
        debug: true
    };
    minstallifyOptions = {
        global: true
    };
    nocommentifyOptions = {
        global: true
    };
    //lintifyOptions.global = true;
    bundle = browserify(browserifyOptions)
        .require(value.require || [])
        .external(value.external || [])
        .transform(lintify, lintifyOptions)
        .transform(nocommentify, nocommentifyOptions)
        .transform(minstallify, minstallifyOptions)
        .add(fileName);
    return build;
}

module.exports = initialize;
