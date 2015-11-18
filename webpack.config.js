var webpack = require('webpack'),
    util = require('util'),
    pkg = require('./package.json');

var bannerString = util.format('ReactMiniRouter %s - https://github.com/larrymyers/react-mini-router', pkg.version);

module.exports = {
    entry: {
        main: './index.js'
    },
    output: {
        path: './dist',
        filename: 'react-mini-router.js',
        library: 'ReactMiniRouter',
        libraryTarget: 'var'
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new webpack.BannerPlugin(bannerString, { entryOnly: true })
    ]
};
