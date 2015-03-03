'use strict';
var browserifix = require('browserifix');
var gulp = require('gulp');

// use the `done` option
gulp.task('js-callback', function (callback) {
    browserifix({
        done: function () {
            callback();
        }
    });
});

// use the returned promise
gulp.task('js-promise', ['js-callback'], function () {
    return browserifix();
});

gulp.task('default', ['js-callback', 'js-promise']);
