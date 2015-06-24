#!/usr/bin/env node
'use strict';
var browserifix = require('..');
var argument = process.argv[2];

browserifix({
    resume: ('resume' == argument),
    watch: ('watch' == argument)
});
