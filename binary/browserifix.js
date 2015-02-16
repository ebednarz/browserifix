#!/usr/bin/env node
'use strict';
var browserifix = require('../library');
var minimist = require('minimist');
var reverseConfig = require('reverse-config');

var options = minimist(process.argv.slice(2));

browserifix({
    bundles: reverseConfig.browserifix.bundles,
    source: reverseConfig.browserifix.source,
    target: reverseConfig.browserifix.target,
    watch: options.watch
});
