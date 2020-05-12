const path = require ('path');
const HardSourceWebpackPlugin = require ('hard-source-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const CompressionWebpackPlugin = require ('compression-webpack-plugin');

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  // 'element-ui': 'ELEMENT',
  // 'js-cookie': 'Cookies',
  // 'nprogress': 'NProgress'
};
const cdn = {
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  build: {
    css: [],
    js: [
      'https://cdn.bootcdn.net/ajax/libs/vue-router/3.1.3/vue-router.min.js',
      'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
      'https://cdn.bootcss.com/vuex/3.1.3/vuex.min.js',
    ],
  },
};

const productionGzip = true;
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/prod/' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? 'prod' : 'dist',
  assetsDir: 'assets',
  runtimeCompiler: true,
  productionSourceMap: true,

  configureWebpack: config => {
    let prodPlugins = [
      ...config.plugins,
      new HardSourceWebpackPlugin (),
      new HardSourceWebpackPlugin.ExcludeModulePlugin ([
        {
          // HardSource works with mini-css-extract-plugin but due to how
          // mini-css emits assets, assets are not emitted on repeated builds with
          // mini-css and hard-source together. Ignoring the mini-css loader
          // modules, but not the other css loader modules, excludes the modules
          // that mini-css needs rebuilt to output assets every time.
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        },
      ]),
    ];

    Object.assign (config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve (__dirname, './src'),
          '@A': path.resolve (__dirname, './src/assets'),
          '@C': path.resolve (__dirname, './src/components'),
          '@V': path.resolve (__dirname, './src/views'),
        }, // 别名配置
      },
      externals: process.env.NODE_ENV === 'production' ? externals : {},
      plugins: process.env.NODE_ENV === 'production'
        ? [...config.plugins]
        : prodPlugins,
    });
  },

  chainWebpack: config => {
    config.module.rule ('images').use ('url-loader').tap (options => {
      return Object.assign (options, {limit: 10240});
    });
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin ('html').tap (args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build;

        //生产环境gzip webpack打包
        // config.plugin ('CompressionWebpackPlugin').use (
        //   new CompressionWebpackPlugin ({
        //     filename: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: productionGzipExtensions,
        //     threshold: 10240,
        //     minRatio: 0.8,
        //     deleteOriginalAssets: true,
        //   })
        // );
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev;
      }
      return args;
    });
  },

  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false,
  },

  devServer: {
    hot: true,
    host: '0.0.0.0', //ip地址
    port: 8085, //端口
    https: false, //false关闭https，true为开启
    open: true, //自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://www.baidu.com',
        changeOrigin: true,
      },
    },
  },
};

// module.exports = {
//   publicPath: './', // 基本路径
//   outputDir: 'dist', // 输出文件目录
//   lintOnSave: false, // eslint-loader 是否在保存的时候检查
//   // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
//   // webpack配置
//   chainWebpack: config => {},
//   configureWebpack: config => {
//     if (process.env.NODE_ENV === 'production') {
//       // 为生产环境修改配置...
//       config.mode = 'production';
//     } else {
//       // 为开发环境修改配置...
//       config.mode = 'development';
//     }
//     Object.assign (config, {
//       // 开发生产共同配置
//       resolve: {
//         alias: {
//           '@': path.resolve (__dirname, './src'),
//           '@c': path.resolve (__dirname, './src/components'),
//           '@p': path.resolve (__dirname, './src/pages'),
//         }, // 别名配置
//       },
//     });
//   },
//   productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
//   // css相关配置
//   css: {
//     extract: true, // 是否使用css分离插件 ExtractTextPlugin
//     sourceMap: false, // 开启 CSS source maps?
//     loaderOptions: {
//       css: {}, // 这里的选项会传递给 css-loader
//       postcss: {}, // 这里的选项会传递给 postcss-loader
//     }, // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
//     modules: false, // 启用 CSS modules for all css / pre-processor files.
//   },
//   parallel: require ('os').cpus ().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
//   pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
//   // webpack-dev-server 相关配置
//   devServer: {
//     open: process.platform === 'darwin',
//     host: '0.0.0.0', // 允许外部ip访问
//     port: 8022, // 端口
//     https: false, // 启用https
//     overlay: {
//       warnings: true,
//       errors: true,
//     }, // 错误、警告在页面弹出
//     proxy: {
//       '/api': {
//         target: 'http://www.baidu.com/api',
//         changeOrigin: true, // 允许websockets跨域
//         // ws: true,
//         pathRewrite: {
//           '^/api': '',
//         },
//       },
//     }, // 代理转发配置，用于调试环境
//   },
//   // 第三方插件配置
//   pluginOptions: {},
// };
