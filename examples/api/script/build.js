var browserifix = require('browserifix');

browserifix({
    bundles: {
        beep: {
            require: [
                './source/beep/module/foo',
                {
                    file: './source/beep/module/bar',
                    expose: 'bar'
                }
            ]
        },
        boop: {
            external: [
                '../beep/module/foo',
                'bar'
            ]
        }
    },
    source: './source',
    target: './target',
    watch: false
});
