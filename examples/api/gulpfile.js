'use strict';
var jsxmas = require('@info.nl/jsxmas');
var gulp = require('gulp');

// use the `done` option
gulp.task('js-callback', function (callback) {
    jsxmas({
        done: function () {
            callback();
        }
    });
});

// use the returned promise
gulp.task('js-promise', ['js-callback'], function () {
    return jsxmas();
});

gulp.task('default', ['js-callback', 'js-promise']);
