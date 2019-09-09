const { p } = require('./webpack.baseConfig');


module.exports = function () {
    return new Promise(resolve => {
        p.then(data => {
            data.devConfig.devServer.proxy = {
                '/api': {
                    target: 'http://localhost:4000',
                    pathRewrite: {'^/api' : ''},
                }
            }
            console.log(data.devConfig);
            resolve(data.devConfig);
        });
    });
};