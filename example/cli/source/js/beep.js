import domready from 'domready';
import foo from 'foo';
import render from 'render';

domready(function onDomReady() {
    render();
    foo(12);
});
