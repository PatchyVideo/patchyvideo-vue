
const webpack = require('webpack')
const path = require("path");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
 
publicPath: './',
outputDir: 'dist',
    configureWebpack: {
        plugins: [
            new BundleAnalyzerPlugin(),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                'windows.jQuery':'jquery'
            })
        ]
    }
}
