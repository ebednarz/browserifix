'use strict';
var babelify = require('babelify');
var browserify = require('browserify');
var getFileName = require('./get-file-name');
var lintify = require('lintify');
var getLintifyOptions = require('./get-lintify-options');
var log = require('./log');
var path = require('path');
var uglify = require('./uglify');

function initialize(value, key, deferred, config) {
    var fileName = getFileName(key, config.source);
    var lintifyOptions = getLintifyOptions(key, true);
    var bundle;

    function build(action) {
        var startTime = Number(new Date());

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
            deferred.resolve();
        }

        function onBundle(error, buffer) {
            if (error) {
                onError(error);
            } else {
                uglify(key, config.target, String(buffer), onFinish);
            }
        }

        bundle
            .bundle(onBundle)
            .on('error', onError);
    }

    bundle = browserify(fileName, {
        debug: true,
        extensions: [
            '.jsx'
        ]
    })
        .require(value.require || [])
        .external(value.external || [])
        //.transform(lintify, lintifyOptions)
        .transform(babelify.configure({
            sourceMapRelative: process.cwd(),
            ignore: /\/node_modules\/(?!_app\/)/
        }), {
            global: true
        });
    return build;
}

module.exports = initialize;
