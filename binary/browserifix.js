#!/usr/bin/env node
'use strict';
var browserifix = require('..');
var argument = process.argv[2];

browserifix({
    vendor: ('vendor' == argument),
    watch: ('watch' == argument)
});
