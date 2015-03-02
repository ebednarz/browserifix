# Browserifix [![dependencies](https://david-dm.org/ebednarz/browserifix.svg)](https://david-dm.org/ebednarz/browserifix)

> Browser scripting quick-start kit.

## Status

You're Feeling Lucky

## This package is not interesting for you if

- you have bundles with huge ASTs; 
  use [watchify](https://www.npmjs.com/package/watchify).
- you want to factor out all shared dependencies to a separate file;
  use [factor-bundle](https://www.npmjs.com/package/factor-bundle).
- If you use lots o' transforms and plugins; 
  roll your own opinionated convenience package.

## Included

- lint source files and abort bundling on error
- line-by-line debugger friendly bundles
    - only minify installed modules
    - strip comments from user code

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
