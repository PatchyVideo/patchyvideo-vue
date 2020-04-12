
const webpack = require('webpack')
const path = require("path");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const utils = {
    assetsPath: function (_path) {
        const assetsSubDirectory = process.env.NODE_ENV === 'production'
            // 生产环境下的 static 路径
            ? 'static'
            // 开发环境下的 static 路径
            : 'static'

        return path.posix.join(assetsSubDirectory, _path)
    },
    resolve: function(dir) {
        return path.join(__dirname, '..', dir)
    }
};

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
        module:{
            rules:[
                {
                    test:/\.(woff2?|eot|ttf|otf)(\?.*)$/,
                    loader:'url-loader',
                    options:{
                        limit: 10000,
                        name: utils.assetsPath('fonrs/[name].[hash:7].[ext]')
                    }
                }
            ]
        },
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
            '/v/': {
                target: "https://thvideo.tv/v/",
                changeOrigin: true,
                pathRewrite: {
                    '^/v/': ''
                }
            },
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
