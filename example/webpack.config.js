var path = require('path');

module.exports = {
    entry: {
        main: path.resolve('./app/main.js')
    },
    output: {
        path: path.resolve('./public'),
        filename: 'js/app.js'
    }
};
