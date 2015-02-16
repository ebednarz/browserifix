'use strict';

var jshintrc = {
    // globals
    ignore: false,
    ignoreDelimiters: false,
    indent: false,
    latedef: 'nofunc',
    maxcomplexity: 5,
    maxdepth: 3,
    maxerr: false,
    maxlen: 100,
    maxparams: 3,
    maxstatements: 10,
    quotmark: 'single',
    scope: false,
    shadow: 'outer',
    unused: 'vars',

    // enforcing
    bitwise: true,
    camelcase: true,
    curly: true,
    enforceall: false,
    eqeqeq: false,
    // es3/es5 are obsolete
    forin: true,
    freeze: true,
    funcscope: true,
    globalstrict: true,
    immed: true,
    iterator: true,
    newcap: true,
    noarg: true,
    // nocomma is currently broken
    // https://github.com/jshint/jshint/issues/2044
    nocomma: false,
    noempty: true,
    nonbsp: true,
    nonew: true,
    notypeof: true,
    singleGroups: false,
    undef: true,

    // relaxing
    asi: false,
    boss: false,
    evil: false,
    debug: true,
    elision: false,
    eqnull: false,
    esnext: false,
    expr: false,
    lastsemic: false,
    laxbreak: false,
    laxcomma: false,
    loopfunc: false,
    multistr: false,
    noyield: false,
    plusplus: false,
    proto: false,
    scripturl: false,
    // cf. globalstrict
    strict: false,
    sub: true,
    supernew: false,
    validthis: false,
    withstmt: false,

    // environments
    browser: false,
    browserify: true,
    couch: false,
    devel: true,
    dojo: false,
    jasmine: false,
    jquery: false,
    mocha: false,
    mootools: false,
    moz: false,
    node: false,
    nonstandard: false,
    phantom: false,
    prototypejs: false,
    qunit: false,
    rhino: false,
    shelljs: false,
    typed: false,
    worker: false,
    wsh: false,
    yui: false
};

module.exports = jshintrc;
