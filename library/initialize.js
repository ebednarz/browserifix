'use strict';
var babelify = require('babelify');
var browserify = require('browserify');
var getFileName = require('./get-file-name');
var getWriteStream = require('./get-write-stream');
var lintify = require('lintify');
var lintifyOptions = require('./lintify-options');
var log = require('./log');
var path = require('path');
var sourcemapFilename = require('sourcemap-filename');
var uglify = require('./uglify');

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

        function onError(error) {
            if (0 !== error.message.indexOf('JSHint')) {
                console.log(error.stack);
            }

            deferred.reject(error);
        }

        function onFinish() {
            var endTime = Number(new Date());
            var performance = (endTime - startTime) + ' ms' ;
            log([action, [key, 'magenta'], 'bundle in', performance]);
            deferred.resolve({
                code: path.join(config.target, key + '.js'),
                map: mapPath
            });
        }

        bundle
            .bundle()
            .on('error', onError)
            .pipe(uglify(key, config.target))
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
    bundle = browserify(fileName, browserifyOptions)
        .require(value.require || [])
        .external(value.external || [])
        .transform(lintify, lintifyOptions)
        .transform(babelify.configure({
            sourceMapRelative: process.cwd(),
            ignore: /\/node_modules\/(?!_app\/)/
        }), {
            global: true
        });
    return build;
}

module.exports = initialize;
