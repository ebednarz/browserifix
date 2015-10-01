'use strict';
var defaults = require('../data/defaults');
var lodash = require('lodash');
var reverseConfig = require('reverse-config');
var packageName = require('../package').name;

function expand(array) {
    var bundles = {};
    array.forEach(function (bundle) {
        if ('string' == typeof bundle) {
            bundles[bundle] = {};
        } else {
            lodash.merge(bundles, bundle);
        }
    });
    return bundles;
}

function sourceExpression(input) {
    var expression;

    if ('/' !== input.charAt(input.length)) {
        input += '/';
    }

    expression = input
        .replace(/^\.\//, '')
        .replace(/\//g, '[\\/\\\\]');

    return new RegExp(expression);
}

function mergeConfig(options) {
    var config = JSON.parse(JSON.stringify(defaults));
    var moduleConfig = reverseConfig.get(packageName);

    function setConfig(key) {
        config[key] = moduleConfig[key];
    }

    function setOption(key) {
        // runtime options can't overwrite package config options
        if (moduleConfig && moduleConfig.hasOwnProperty(key)) {
            throw new Error('Refusing to overwrite `' + key + '`');
        }

        config[key] = options[key];
    }

    if (moduleConfig) {
        Object.keys(moduleConfig).forEach(setConfig);
    }

    if (options) {
        Object.keys(options).forEach(setOption);
    }

    if (Array.isArray(config.bundles)) {
        config.bundles = expand(config.bundles);
    }

    config.babel = [
        /node_modules[\/\\]_app[\/\\]/,
        sourceExpression(config.babel || config.source)
    ];

    return config;
}

module.exports = mergeConfig;
