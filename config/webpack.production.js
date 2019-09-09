const { p } = require('./webpack.baseConfig');


module.exports = function () {
    return new Promise(resolve => {
        p.then(data => {
            console.log(data.prodConfig);
            resolve(data.prodConfig);
        });
    });
};