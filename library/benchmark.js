'use strict';

function benchmark(startTime) {
    var endTime = Number(new Date());
    var performance = (endTime - startTime) + ' ms' ;
    return performance;
}

module.exports = benchmark;
