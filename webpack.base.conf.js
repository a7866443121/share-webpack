'use strict'
const path = require('path');
const fs=require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getProjectPath = require('./get-project-path')();
const utils = require('./utils')
const vueLoaderConfig = require('./vue-loader.conf')
const merge = require('webpack-merge')
var argv; 
try { 
  argv = JSON.parse(process.env.npm_config_argv).original; 
} catch(ex) { 
  argv = process.argv; 
} 
process.env.proj = argv.length >= 2 ? argv[1].split(':')[1] : '';
const CopyWebpackPlugin = require('copy-webpack-plugin')
const entryConfig = require(getProjectPath.shellDirPath + '/config/entry.js')({
	projectPath:getProjectPath,
	webpack:webpack,
	HtmlWebpackPlugin:HtmlWebpackPlugin,
	path:path,
	CopyWebpackPlugin: CopyWebpackPlugin,
	env: process.env.NODE_ENV
});
// 获取绝对路径
function resolve(dir) {
    return dir 
        ? path.resolve(__dirname, getProjectPath.shellDirPath, dir) 
        : path.resolve(__dirname, getProjectPath.buildRootPath)
}
module.exports = merge(entryConfig,{
	// 基础上下文
  context: entryConfig.context || resolve(),
  output: entryConfig.output || {
	 	//输出路径,(必须是绝对路径)build文件的执行的根目录
	    path: path.resolve(__dirname, getProjectPath.buildRootPath),
	    filename: '[name].js',
	    publicPath: "/",
  	},
   /**
   * 当webpack试图去加载模块的时候，它默认是查找以 .js 结尾的文件的，
   * 它并不知道 .vue 结尾的文件是什么鬼玩意儿，
   * 所以我们要在配置文件中告诉webpack，
   * 遇到 .vue 结尾的也要去加载，
   * 添加 resolve 配置项，如下：
   */
  resolve: entryConfig.resolve || {
    extensions: ['.js', '.vue', '.json'],
    alias: {
    	// 创建别名
      'vue$': resolve() + '/node_modules/vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  // 不同类型模块的处理规则 就是用不同的loader处理不同的文件
  module: {
    rules: [
			{
	        test: /\.vue$/,
	        loader: resolve() + '/node_modules/vue-loader',
	        options: vueLoaderConfig
			},
			{
	    	test: /\.js$/,
	        loader: resolve() + '/node_modules/babel-loader',
					exclude: ['/node_modules/', '/static/'],
			},
	  	{
	        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
	        loader: resolve() + '/node_modules/url-loader',
	        options: {
	          	limit: 10000,
	          	name: utils.assetsPath('img/[name].[ext]'),
	          	publicPath:'../../',
	        }
	  	},
	  	{
	        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
	        loader: resolve() + '/node_modules/url-loader',
	        options: {
	          	limit: 10000,
	          	name: utils.assetsPath('media/[name].[ext]')
	        }
	  	},
	  	{
	        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
	        loader: resolve() + '/node_modules/url-loader',
	        options: {
	          	limit: 10000,
	          	name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
	        }
	  	}
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
})
