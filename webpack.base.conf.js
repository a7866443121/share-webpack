'use strict'
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getPath = require('./getPath')();

const utils = require('./utils');
const vueLoaderConfig = require('./vue-loader.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//基础配置
const config = require(getPath.shellDirPath + '/configTest/config.js')({
	getPath: getPath,
	path: path,
	fs: fs
});
//入口
const entry = require(getPath.shellDirPath + '/configTest/entry.js')({
	getPath: getPath,
	path: path,
	webpack: webpack,
	HtmlWebpackPlugin: HtmlWebpackPlugin,
});
function resolve(dir) {
  return dir 
			? path.resolve(__dirname, getPath.shellDirPath, dir) 
			: path.resolve(__dirname, getPath.buildRootPath);
}
module.exports = merge(entry,{
  context: resolve(),
  output: {
    path: resolve(),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': resolve() + '/node_modules/vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
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
        include: [resolve('src'), resolve('test'), resolve('api')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: resolve() + '/node_modules/url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          publicPath:'../'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: resolve() + '/node_modules/url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
          publicPath:'../'
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
