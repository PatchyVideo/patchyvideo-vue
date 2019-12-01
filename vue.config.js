
const webpack = require('webpack')
const path = require("path");
module.exports = {
 
publicPath: './',
outputDir: 'dist',
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                'windows.jQuery':'jquery'
            })
        ]
    }
}
