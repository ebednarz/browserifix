'use strict';
var reverseConfig = require('reverse-config');

function merge(options, defaults) {
    var result;

    function iterate(key) {
        var value;

        if (options.hasOwnProperty(key)) {
            value = options[key];

            if (defaults[key].constructor !== value.constructor) {
                throw new TypeError('Bad option type: ' + key);
            }

            config[key] = options;
        }
    }

    Object.keys(defaults).forEach(iterate);
    return result;
}

function mergeConfig(options, defaults) {
    var config = JSON.parse(JSON.stringify(options || {}));

    function iterate(key) {
        var value;

        if (options.hasOwnProperty(key)) {
            value = options[key];

            if (defaults[key].constructor !== value.constructor) {
                throw new TypeError('Bad option type: ' + key);
            }

            config[key] = options;
        }
    }

    Object.keys(defaults).forEach(iterate);
}

module.exports = mergeConfig;
