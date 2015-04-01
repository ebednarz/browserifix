'use strict';
var fs = require('fs');
var path = require('path');

function getWriteStream(id, target) {
    var fileName;
    var writeStream;
    fileName = path.join(target, id + '.js');
    writeStream = fs.createWriteStream(fileName, 'utf8');
    return writeStream;
}

module.exports = getWriteStream;
