import domready from 'domready';
import bar from '_app/bar';
import foo from '_app/foo';

/**
 * JSDoc
 */
domready(function () {
    // line comment
    foo(bar); // out of place comment
});

// trailing comment

