'use strict'
const utils = require('./utils');
const path = require('path');
const fs=require('fs');
const getProjectPath = require('./get-project-path')();
const config = require(getProjectPath.shellDirPath + '/config/index.js')({
	projectPath:getProjectPath,
	path:path,
	fs:fs
});
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: !!config.build.extract,
    usePostCSS: true
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  preserveWhitespace: false,
  postcss: isProduction ? function () {
    return [require('postcss-salad')];
  } : false
}
