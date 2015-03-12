'use strict';
var defaults = require('../data/defaults');
var reverseConfig = require('reverse-config');

var packageName = require('../package').name;

function matchType(candidate, reference, key) {
    var referenceValue = (reference.hasOwnProperty(key) && reference[key]);

    if (referenceValue) {
        if (candidate[key].constructor !== referenceValue.constructor) {
            throw new TypeError('Bad type: `' + key + '`');
        }
    }
}

function mergeConfig(options) {
    var config = JSON.parse(JSON.stringify(defaults));
    var moduleConfig = reverseConfig[packageName];

    function setConfig(key) {
        matchType(moduleConfig, defaults, key);
        config[key] = moduleConfig[key];
    }

    function setOption(key) {
        // runtime options can't overwrite package config options
        if (moduleConfig && moduleConfig.hasOwnProperty(key)) {
            throw new Error('Refusing to overwrite `' + key + '`');
        }

        matchType(options, defaults, key);
        config[key] = options[key];
    }

    if (moduleConfig) {
        Object.keys(moduleConfig).forEach(setConfig);
    }

    if (options) {
        Object.keys(options).forEach(setOption);
    }

    return config;
}

module.exports = mergeConfig;
