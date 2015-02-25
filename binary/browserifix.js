#!/usr/bin/env node
'use strict';
var browserifix = require('..');
var minimist = require('minimist');
var options = minimist(process.argv.slice(2));

browserifix({
    watch: options.watch
});
