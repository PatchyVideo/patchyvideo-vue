const webpack = require("webpack");
const packageJson = require("./package.json");
process.env.VUE_APP_VERSION = packageJson.version;
const moment = require("moment");
process.env.VUE_APP_BUILDTIME = moment().format("YYYY-MM-DD HH:mm");

module.exports = {
  publicPath: "./",
  outputDir: "dist",
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
      }),
    ],
  },
  devServer: {
    host: "127.0.0.1",
    port: "8080",
    proxy: {
      "/v/": {
        target: "https://thvideo.tv/v/",
        changeOrigin: true,
        pathRewrite: {
          "^/v/": "",
        },
      },
      "/be/": {
        target: "https://thvideo.tv/be/",
        changeOrigin: true,
        pathRewrite: {
          "^/be/": "",
        },
      },
      "/images/": {
        target: "https://thvideo.tv/images/",
        changeOrigin: true,
        pathRewrite: {
          "^/images/": "",
        },
      },
      "/autocomplete/ ": {
        target: "https://thvideo.tv/autocomplete/",
        changeOrigin: true,
        pathRewrite: {
          "^/autocomplete/": "",
        },
      },
      "/proxy/bili/x/player/videoshot": {
        target: "https://api.bilibili.com/x/player/videoshot",
        changeOrigin: true,
        headers: {
          host: "api.bilibili.com",
          origin: "https://t.bilibili.com",
          referer: "https://t.bilibili.com/",
        },
        pathRewrite: {
          "^/proxy/bili/x/player/videoshot": "",
        },
      },
      "/proxy/bili/cover/bfs/videoshot/": {
        target: "http://i0.hdslb.com/bfs/videoshot/",
        changeOrigin: true,
        headers: {
          host: "i0.hdslb.com",
          origin: "https://t.bilibili.com",
          referer: "https://t.bilibili.com/",
        },
        pathRewrite: {
          "^/proxy/bili/cover/bfs/videoshot/": "",
        },
      },
      "/proxy/bili/x/player/": {
        target: "https://api.bilibili.com/x/player/",
        changeOrigin: true,
        headers: {
          host: "api.bilibili.com",
          origin: "https://www.bilibili.com",
          referer: "https://www.bilibili.com",
        },
        pathRewrite: {
          "^/proxy/bili/x/player/": "",
        },
      },
      "/proxy/u2b/watch": {
        target: "https://www.youtube.com/watch",
        changeOrigin: true,
        pathRewrite: {
          "^/proxy/u2b/watch": "",
        },
      },
      "/proxy/u2b/i9ytimg/sb/": {
        target: "https://i9.ytimg.com/sb/",
        changeOrigin: true,
        pathRewrite: {
          "^/proxy/u2b/i9ytimg/sb/": "",
        },
      },
    },
  },

  chainWebpack: (config) => {
    if (process.env.NODE_ENV == "production") {
      config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
    config.plugin("html").tap((args) => {
      if (process.env.NODE_ENV === "production") {
        args[0].minify.removeComments = false;
        args[0].minify.minifyCSS = true;
        args[0].minify.minifyJS = true;
      }
      return args;
    });
    /* 自动注入 i18nf */
    config.module
      .rule("i18nf-auto-inject")
      .test(/\.vue$/)
      .pre()
      .use("i18nf-auto-inject")
      .loader("./plugins/i18nf-auto-inject.js")
      .end();
    /* i18nf loader */
    config.module
      .rule("i18nf")
      .resourceQuery(/blockType=i18nf/)
      .type("javascript/auto")
      .use("i18nf-loader")
      .loader("./plugins/i18nf-loader.js")
      .end();
  },
};
