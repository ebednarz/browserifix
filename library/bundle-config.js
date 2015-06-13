'use strict';
var lodash = require('lodash');
var packageName = require('../package').name;
var reverseConfig = require('reverse-config');

var bundleConfig = reverseConfig[packageName].bundles;
var properties = ['external', 'require'];

lodash.forIn(bundleConfig, function (value, key, object) {
    var entry = object[key];
    lodash.forEach(properties, function (property) {
        if (!entry.hasOwnProperty(property)) {
            entry[property] = [];
        } else if (!Array.isArray(entry[property])) {
            throw new TypeError(property + ' must be an Array');
        }
    });
});

module.exports = bundleConfig;
