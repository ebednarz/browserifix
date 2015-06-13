# browserifix [![npm version][npm-image]][npm-url]

> Browser scripting quick-start kit.

## Status

You're Feeling Lucky

## This package is not interesting for you if

- you have bundles with huge ASTs; 
  use [watchify](https://www.npmjs.com/package/watchify).
- you want to factor out all shared dependencies to a separate file;
  use [factor-bundle](https://www.npmjs.com/package/factor-bundle).
- you use lots o' transforms and plugins; 
  roll your own opinionated convenience package.

## Included

- build production bundles as you type
    - [JSHint](http://jshint.com/) (aborts build on error)
    - [Babel](https://babeljs.io/) ECMAScript 6 modules 
    - line-by-line debugger friendly [Uglification](https://github.com/mishoo/UglifyJS2)
    - source maps

## Installation

    $ npm install browserifix
    
## Usage

In lieu of documentation, the 
[GitHub repository](https://github.com/ebednarz/browserifix) 
includes some
[https://github.com/ebednarz/browserifix/tree/master/examples](https://github.com/ebednarz/browserifix/tree/master/examples);
it's probably a good idea to switch to the tag of your installed version 
on that page.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/browserifix.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/browserifix
