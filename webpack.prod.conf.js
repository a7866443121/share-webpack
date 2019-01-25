'use strict'
const path = require('path');
const fs=require('fs');
const utils = require('./utils')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// copy-webpack-plugin，用于将static中的静源复制到指定目录的
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin，用于优化和最小化css资源
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
// uglifyJs 混淆js插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
//自制路径获取插件
const getProjectPath = require('./get-project-path')();
//引入config
const config = require(getProjectPath.shellDirPath + '/config/index.js')({
	projectPath:getProjectPath,
	path:path,
	fs:fs,
});
const env = config.build.env;
//合并loader
config.loader && config.loader.length > 0 && baseWebpackConfig.module.rules.concat(config.loader);

const webpackConfig = merge(baseWebpackConfig, {
  module: {
  	// 样式文件的处理规则，对css/sass/scss等不同内容使用相应的styleLoaders
  	// 由utils配置出各种类型的预处理语言所需要使用的loader，例如sass需要使用sass-loader
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: false
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  // webpack输出路径和命名规则
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
     // 丑化压缩JS代码
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    // 将css提取到单独的文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
//  // Compress extracted CSS. We are using this plugin so that possible
//  // duplicated CSS from different components can be deduped.
	 // 优化、最小化css代码，如果只简单使用extract-text-plugin可能会造成css重复
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // 将所有从node_modules中引入的js提取到vendor.js，即抽取库文件
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor' 
	}),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname,getProjectPath.shellDirPath + '/static'),
        to: config.build.assetsSubDirectory,
        ignore: ['*.svn-base','all-wcprops','entries'] //忽略掉.svn里面的文件
      }
    ]),
    new ZipPlugin({
		    path:path.resolve(__dirname,getProjectPath.shellDirPath + '/dist'),
		    filename: 'dist.zip'
		}),
		new cleanWebpackPlugin([getProjectPath.shellDirPath + '\/dist', getProjectPath.shellDirPath + '\/release'], {
      root: path.resolve(__dirname,getProjectPath.shellDirPath, '../'),
      verbose: true,
      dry: false
  })
  ]
})
// 如果开启了产品gzip压缩，则利用插件将构建后的产品文件进行压缩
if (config.build.productionGzip) {
	// 一个用于压缩的webpack插件
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      // 压缩算法
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// 如果启动了report，则通过插件给出webpack构建打包后的产品文件分析报告
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
