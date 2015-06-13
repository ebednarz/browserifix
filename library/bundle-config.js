'use strict';
var lodash = require('lodash');
var packageName = require('../package').name;
var reverseConfig = require('reverse-config');

var bundleConfig = reverseConfig[packageName].bundles;
var properties = ['external', 'require'];

function normalizeProperty(property) {
    if (!this.hasOwnProperty(property)) {
        this[property] = [];
    } else if (!Array.isArray(this[property])) {
        throw new TypeError(property + ' must be an Array');
    }
}

function normalizeBundle(value, key, object) {
    lodash.forEach(properties, normalizeProperty, object[key]);
}

lodash.forIn(bundleConfig, normalizeBundle);

module.exports = bundleConfig;
