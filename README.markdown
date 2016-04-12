# JSXmas [![npm version][npm-image]][npm-url] [![code climate][code-climate-image]][code-climate-url]

> Info.nl browser scripting quick-start kit.

<p align="center">
  <a href="https://info.nl/"><img 
    src="https://raw.githubusercontent.com/infonl/jsxmas/master/image/jsxmas.png"
    width="400"
    height="400"
  ></a>
</p>

## Installation

    $ npm i @info.nl/jsxmas -S

## Features

Build your client-side script on the fly with
 
    - CommonJS modules
    - npm dependency management
    - instant linting
    - ECMAScript 2015 (optional)
    - React JSX (optional)
    - source maps

### ECMAScript 2015

- [Specification](http://www.ecma-international.org/ecma-262/6.0/)
- [Babel features](http://kangax.github.io/compat-table/es6/#babel)

### ESLint

If you use ECMAScript 2015 or JSX syntax, you *must* enable them with an 
`eslintConfig` entry in your `package.json` file. See
[Specifying Environments](http://eslint.org/docs/user-guide/configuring#specifying-environments)
and
[Specifying Language Options](http://eslint.org/docs/user-guide/configuring#specifying-language-options) 
in the ESLint user guide. The best way to set rules is to extend an installed configuration. See
[Extending Configuration Files](http://eslint.org/docs/user-guide/configuring#extending-configuration-files)
for more info.

The [browserify transform](https://github.com/substack/browserify-handbook#transforms) 
that provides linting uses the simple 
[linter](http://eslint.org/docs/developer-guide/nodejs-api#linter)
Node.js API module for fast on the fly processing; 
plugins and `.eslintrc` files will not work in that context.

## Zero configuration

- your source file is `./source/script/main.js`
- your target file is `./public/script/main.min.js`
- your target source map file is `./public/script/main.min.js.map`
    
## Custom configuration

Use the package name as a property in the standard 
`package.json`'s `config` entry. 
All configuration options are optional.

    {
      "config": {
        "@info.nl/jsxmas": {
          "bundles": [],
          "vendors": {},
          "source": "",
          "target": "",
          "map": ""
        }
      }
    }

### `{Array|Object} bundles`

#### Default value: 

    "bundles": [
      "main"
    ]

#### Array

    "bundles": [
      "main",
      "special"
    ]
    
#### Object

When you generate multiple bundles, the object syntax gives
you more control about what to expose and to exclude in which bundle.

This corresponds to the browserify
[require](https://github.com/substack/node-browserify#brequirefile-opts)
and
[external](https://github.com/substack/node-browserify#bexternalfile)
methods.

    "bundles": {
      "main": {
        "require": [
          "foo"
        ]
      },
      "special": {
        "external": [
          "foo"
        ]
      }
    }
    
- `main.js` defines the `foo` module and exposes it
- if `special.js` requires `foo`, it is *not* included in its bundle 

#### Mixed

As a convenience, you can mix the array and object syntax.

    "bundles": [
      "main",
      "special", 
      {
        "more-special": {
          "require": [
            "foo"
          ]
        },
        "super-special": {
          "external": [
            "foo"
          ]
        }
      }
    ]

### `{Object} vendors`

Every vendor file requires all of its dependencies 
and makes them available outside of the bundle.

    "vendors": {
        "jquery": [
          "jquery",
          "jquery-ui"
        ]
    }

Vendor bundles do **not** generate source maps.

### `{string} source`

#### Default value

    "source": "./source/script"

### `{string} target`

#### Default value

    "target": "./public/script"

### `{string} map`

The convention for source maps is to use the generated file name and append `.map`.
If you need to customize that, you can provide a `map` string with two 
regular expression back-references in the form `$[substring-index]`, 
one for the base name without extension,
and one for the extension.

#### Example

- generated file base name: `main.js` 
- `map` value: `"$1-$2-map.json"`
- source map base name: `main-js-map.json` 

## Pronunciation

### If your glass is half full

    dʒeɪ-ɛs christmas

### If your glass is half empty

    dʒeɪ-ɛs-ɛks mess 

## FAQ

### Q: Why not webpack?

A: Because then the question would be: "Why not browserify?"

## License

MIT

[npm-image]: https://img.shields.io/npm/v/@info.nl/jsxmas.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@info.nl/jsxmas
[code-climate-image]: https://img.shields.io/codeclimate/github/infonl/jsxmas.svg?style=flat-square
[code-climate-url]: https://codeclimate.com/github/infonl/jsxmas
