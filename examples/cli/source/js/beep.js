import domready from 'domready';
import React from 'react';
import foo from '_app/foo';
import Hello from '_app/hello';

domready(function () {
    React.render(
        <Hello/>,
        document.body
    );

    foo(12);
});
