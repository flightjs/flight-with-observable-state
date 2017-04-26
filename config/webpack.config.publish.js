var constants = require('./constants');
var baseConfig = require('./webpack.config');

module.exports = Object.assign(baseConfig, {
    output: {
        library: 'withObservableState',
        filename: 'flight-with-observable-state.js',
        libraryTarget: 'umd',
        path: constants.BUILD_DIRECTORY
    },
    externals: [
        'rxjs',
        'flight',
        'flight-with-state'
    ]
});
