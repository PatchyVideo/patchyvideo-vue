
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
        ],
        performance: {
            hints:'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    },
    devServer: {
        proxy: {
            '/be/': {
                target: "https://thvideo.tv/be/",
                changeOrigin: true,
                pathRewrite: {
                    '^/be/': ''
                }
            },
            '/images/': {
                target: "https://thvideo.tv/images/",
                changeOrigin: true,
                pathRewrite: {
                    '^/images/': ''
                }
            },
            '/autocomplete/ ': {
                target: "https://thvideo.tv/autocomplete/",
                changeOrigin: true,
                pathRewrite: {
                    '^/autocomplete/': ''
                }
            }
        }

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
