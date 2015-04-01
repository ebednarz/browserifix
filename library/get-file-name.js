'use strict';
var path = require('path');

function getFileName(id, source) {
    var fileName;
    fileName = path.resolve(path.join(source, (id + '.js')));
    return fileName;
}

module.exports = getFileName;
