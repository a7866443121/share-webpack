'use strict'
const path = require('path')
const utils = require('./utils')
const fs = require('fs');
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const zipPlugin = require('zip-webpack-plugin')

const getPath = require('./getPath')();
//基础配置
const config = require(getPath.shellDirPath + '/configTest/config.js')({
	getPath: getPath,
	path: path,
	fs: fs
});

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
  	//清掉dist文件夹
	  new cleanWebpackPlugin([getPath.shellDirPath + '/dist'], {
	  	//根目录
      root: path.resolve(getPath.shellDirPath, '../'),   
      //开启在控制台输出信息
      verbose:  true,        　　　　　　　　　　
		}),
		//配置webpack的全局标识,可以全局调用
    new webpack.DefinePlugin({
      'process.env': 'production'
    }),
    //压缩丑化代码
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    //将css提取到单独文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
    }),
    //优化最小化css代码,如果只使用简单的ExtractTextPlugin可能造成css重复
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    //根据模块的相对路径生成一个四位数的hash作为模块id,
    new webpack.HashedModuleIdsPlugin(),
   	// 启用作用域提升，作用是让代码文件更小、运行的更快
    new webpack.optimize.ModuleConcatenationPlugin(),
		//将所有从node_modules中引入的js提取到vendor.js中,即抽取库文件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
       minChunks: function (module, count) {
        //节点模块中的任何必需模块都被提取到vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 复制静态资源
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, getPath.shellDirPath + '/static'),
        to: path.resolve(__dirname, getPath.shellDirPath + '/dist/static'),
        ignore: ['*.svn-base', 'all-wcprops', 'entries']
      }
    ]),
    //生成zip包
    new zipPlugin({
    	path: path.resolve(__dirname, getPath.shellDirPath + '/dist'),
    	filename:'dist.zip'
    })
  ]
})

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
