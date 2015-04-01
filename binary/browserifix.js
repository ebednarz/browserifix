#!/usr/bin/env node
'use strict';
var browserifix = require('..');

browserifix({
    watch: ('watch' == process.argv[2])
});
