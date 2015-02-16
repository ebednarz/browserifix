'use strict';
var pettyPrint = require('petty-print');
var packageName = require('../package').name;
var log = pettyPrint(packageName);

module.exports = log;
