'use strict'
// 引入nodejs路径模块
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
//引入自制路径获取插件
const getProjectPath = require('./get-project-path')();
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require(getProjectPath.shellDirPath + '/package.json');

function fsExistsSync(path) {
  try{
      fs.accessSync(path,fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}

const loaderconf = fsExistsSync(getProjectPath.shellDirPath + '/config/loader.js') ? require(getProjectPath.shellDirPath + '/config/loader.js')({
	projectPath:getProjectPath,
	webpack:webpack,
	path:path,
	env: process.env.NODE_ENV
}) : false;

function resolve(dir) {
  return dir 
      ? path.resolve(__dirname, getProjectPath.shellDirPath, dir) 
      : path.resolve(__dirname, getProjectPath.buildRootPath)
}

exports.assetsPath = function (_path) {
	// 如果是生产环境assetsSubDirectory就是'static'，否则还是'static'，
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? './static'
    : './static'
    // path.join和path.posix.join的区别就是，前者返回的是完整的路径，后者返回的是完整路径的相对根路径
    //返回完整的相对路径
  return path.posix.join(assetsSubDirectory, _path)
}
 // 下面是导出cssLoaders的相关配置
exports.cssLoaders = function (options) {
  options = options || {}
  // cssLoader的基本配置
  const cssLoader = {
    loader: resolve() + '/node_modules/css-loader',
    options: {
      // options是用来传递参数给loader的
      // minimize表示压缩，如果是生产环境就压缩css代码
       minimize: process.env.NODE_ENV === 'production',
       // 是否开启cssmap，默认是false
      sourceMap: options.sourceMap
    }
  }
  //postcss-loader,resolve()从build目录获取loader插件
  const postcssLoader = {
    loader: resolve() + '/node_modules/postcss-loader',
    options: {
      sourceMap: false
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
  	// 将上面的基础cssLoader配置放在一个数组里面
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
	// 如果该函数传递了单独的loader就加到这个loaders数组里面，这个loader可能是less,sass之类的
    if (loader) {
      loaders.push({
      	// 加载对应的loader
        loader:resolve() + '/node_modules/' + loader + '-loader',
         // Object.assign是es6的方法，主要用来合并对象的，浅拷贝
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // 注意这个extract是自定义的属性，可以定义在options里面，主要作用就是当配置为true就把文件单独提取，false表示不单独提取，这个可以在使用的时候单独配置
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: resolve() + '/node_modules/vue-style-loader'
      })
    } else {
      return [resolve() + '/node_modules/vue-style-loader'].concat(loaders)
    }
     // 上面这段代码就是用来返回最终读取和导入loader，来处理对应类型的文件
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
  	// css对应 vue-style-loader 和 css-loader
    css: generateLoaders(),
    // postcss对应 vue-style-loader 和 css-loader
    postcss: generateLoaders('postcss'),
    // less对应 vue-style-loader 和 less-loader
    less: generateLoaders('less'),
     // sass对应 vue-style-loader 和 sass-loader
    sass: generateLoaders('sass', { indentedSyntax: true }),
    // scss对应 vue-style-loader 和 sass-loader
    scss: loaderconf.scss ? generateLoaders('sass').concat(loaderconf.scss) :  generateLoaders('sass'),
    // stylus对应 vue-style-loader 和 stylus-loader
    stylus: generateLoaders('stylus'),
    // styl对应 vue-style-loader 和 styl-loader 
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 下面这个主要处理import这种方式导入的文件类型的打包，上面的exports.cssLoaders是为这一步服务的
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  // 下面就是生成的各种css文件的loader对象
  for (const extension in loaders) {
  	// 把每一种文件的laoder都提取出来
    const loader = loaders[extension]
    // 把最终的结果都push到output数组中，大事搞定
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
