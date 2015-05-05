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
        react: 'React'
    }
};
