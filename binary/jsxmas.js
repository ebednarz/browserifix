#!/usr/bin/env node
'use strict';
var jsxmas = require('..');
var argument = process.argv[2];

jsxmas({
    bundle: ('bundle' == argument),
    vendor: ('vendor' == argument),
    watch: ('watch' == argument)
});
