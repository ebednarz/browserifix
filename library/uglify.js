'use strict';
var fs = require('fs');
var mold = require('mold-source-map');
var path = require('path');
var uglifyJS = require('uglify-js');

function separate(src, file, root, base, url) {
    src.sourceRoot(root || '');

    if (base) {
        src.mapSources(mold.mapPathRelativeTo(base));
    }

    var json = src.toJSON(2);

    url = url || path.basename(file);

    var comment = '';
    var commentRx = /^\s*\/(\/|\*)[@#]\s+sourceMappingURL/mg;
    var commentMatch = commentRx.exec(src.source);
    var commentBlock = (commentMatch && commentMatch[1] === '*');

    if (commentBlock) {
        comment = '/*# sourceMappingURL=' + url + ' */';
    } else {
        comment = '//# sourceMappingURL=' + url;
    }

    return {
        json: json,
        comment: comment
    };
}

/**
 * @param {String} baseName full path to the map file to which to write the extracted source map
 * @param {String} file full path to the map file to which to write the extracted source map
 * @param {String=} url full URL to the map file, set as `sourceMappingURL` in the streaming output (default: file)
 * @param {String=} root root URL for loading relative source paths, set as `sourceRoot` in the source map (default: '')
 * @param {String=} base base path for calculating relative source paths (default: use absolute paths)
 * @return {TransformStream} transform stream into which to pipe the code containing the source map
 */
module.exports = function (baseName, file, url, root, base) {
    var stream = mold.transform(function (src, write) {
        var bundle;
        var separated;
        var codeFileName = baseName + '.js';
        var mapFileName = codeFileName + '.map';

        if (!src.sourcemap) {
            stream.emit(
                'missing-map'
                , 'The code that you piped into exorcist contains no source map!\n'
                + 'Therefore it was piped through as is and no external map file generated.'
            );
            return write(src.source);
        }

        separated = separate(src, file, root, base, url);

        bundle = uglifyJS.minify(src.source, {
            fromString: true,
            inSourceMap: JSON.parse(separated.json),
            outSourceMap: mapFileName,
            sourceMapIncludeSources: true,
            sourceRoot: root
        });

        var codePromise = new Promise(function (resolve, reject) {
            fs.writeFile(path.join(file, codeFileName), bundle.code, 'utf8', function (error) {
                if (error) {
                    reject(error)
                } else {
                    resolve();
                }
            });
        });

        var mapPromise = new Promise(function (resolve, reject) {
            fs.writeFile(path.join(file, mapFileName), bundle.map, 'utf8', function (error) {
                if (error) {
                    reject(error)
                } else {
                    resolve();
                }
            });
        });

        Promise
            .all([codePromise, mapPromise])
            .then(function () {
                write('');
            });
    });

    return stream;
};
