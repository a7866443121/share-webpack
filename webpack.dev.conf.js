'use strict'
process.env.NODE_ENV = 'development'
const utils = require('./utils')
const webpack = require('webpack')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge')
const fs=require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin，用于优化和最小化css资源
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const getProjectPath = require('./get-project-path')();
const config = require(getProjectPath.shellDirPath + '/config/index.js')({
	projectPath:getProjectPath,
	path:path,
	fs:fs
});
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT);
//合并loader
config.loader && config.loader.length > 0 && baseWebpackConfig.module.rules.concat(config.loader);
// 合并baseWebpackConfig配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
  	// 对一些独立的css文件以及它的预处理文件做一个编译
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  //  webpack-dev-server服务器配置
  devServer: {
  	contentBase: path.resolve(__dirname, config.dev.assetsPublicPath),
  	publicPath: path.resolve(__dirname, config.dev.assetsPublicPath),
  	 // console 控制台显示的消息，可能的值有 none, error, warning 或者 info
    clientLogLevel: 'warning',
    historyApiFallback: true,
     // 开启热模块加载
    hot: true,
    stats: { colors: true },
    inline:true,
    progress:true,
    compress: true,
    // process.env 优先
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 代理设置
    proxy:config.proxy,
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改
    watchOptions: {
    	// 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。默认为false
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    //模块热替换它允许在运行时更新各种模块，而无需进行完全刷新
    new webpack.HotModuleReplacementPlugin({}),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 跳过编译时出错的代码并记录下来，主要作用是使编译后运行时的包不出错
    new webpack.NoEmitOnErrorsPlugin(),
    //把静态资源copy进server内存,
    new CopyWebpackPlugin([{
        from: getProjectPath.shellDirPath + '/static',
        to: getProjectPath.buildRootPath + '/static',
        ignore: ['.*']
    }]),
  ]
})

module.exports = new Promise((resolve, reject) => {
	// 获取当前设定的端口
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      // 发布新的端口，对于e2e测试
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://localhost:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
