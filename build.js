'use strict'
require('./check-versions')();
const fs = require('fs');
process.env.NODE_ENV = 'production';
//ora,一个可以在终端显示spinner的插件
const ora = require('ora');
//rm,用于删除我呢见或文件夹的插件
const rm = require('rimraf');
//自适应路径插件
const path = require('path');
//用于控制到输出带颜色的字体
const chalk = require('chalk');
const webpack = require('webpack');
//自制路径插件
const getPath = require('./getPath.js')();
//引入config.js
//基础配置
const config = require(getPath.shellDirPath + '/configTest/config.js')({
	getPath: getPath,
	path: path,
	fs: fs
});
//引入production配置
const webpackConfig = require('./webpack.prod.conf');
//开启loading动画
const spinner = ora('building for production...');
spinner.start();
//首先将dist里面的文件删除
//删除后重新打包
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  //执行webpack构建打包,完成后再终端输出构建完成的相关信息或输出报错信息并退出程序
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
