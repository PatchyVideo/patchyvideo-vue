
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
    },
    chainWebpack: config => {
        config.module
          .rule('i18n')
          .resourceQuery(/blockType=i18n/)
          .type('javascript/auto')
          .use('i18n')
          .loader('@kazupon/vue-i18n-loader')
          .end()
      }
}
