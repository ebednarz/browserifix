#!/usr/bin/env node
'use strict';
var browserifix = require('..');
var argument = process.argv[2];

browserifix({
    bundle: ('bundle' == argument),
    vendor: ('vendor' == argument),
    watch: ('watch' == argument)
});
