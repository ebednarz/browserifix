import domready from 'domready';
import foo from '_app/foo';
import render from '_app/render';

domready(function onDomReady() {
    render();
    foo(12);
});
