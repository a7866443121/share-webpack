'use strict'
module.exports = function(o){
	const path = o.path;
	const fs = o.fs;
	const projectPath = o.getPath;
	function resolve (dir) {
	  return dir 
				? path.resolve(__dirname, projectPath.buildDirPath, dir) 
				: path.resolve(__dirname, projectPath.buildDirPath);
	}
	return{
		resolve: resolve,
	  dev: {
	  	//静态资源文件夹，默认“static”，
	    assetsSubDirectory: './static',
	    //发布路径，
	    assetsPublicPath: '/',
	    host: '192.168.0.173', //地址
	    port: 8082, 
	    // 下面表示项目启动后是否自动打开开浏览器
	    autoOpenBrowser: false,
	    //是否查询错误
	    errorOverlay: true,
	    //是否通知错误
	    notifyOnErrors: true,
	    //是跟devserver相关的一个配置，webpack为我们提供的devserver是可以监控文件改动的，但在有些情况下却不能工作，我们可以设置一个轮询（poll）来解决
	    poll: false,
	    //是否使用eslint检测代码
	    useEslint: true,
	    //是否展示eslint的错误提示
	    showEslintErrorsInOverlay: false,
	    //webpack提供的用来方便调试的配置，它有四种模式，可以查看webpack文档了解更多
	    devtool: 'cheap-module-eval-source-map',
	    //一个配合devtool的配置，当给文件名插入新的hash导致清楚缓存时是否生成souce maps，默认在开发环境下为true
	    cacheBusting: true,
	    //是否开启cssSourceMap
	    cssSourceMap: true,
	    env: {
	    	NODE_ENV: '"development"',
	    },
	  },
	
	  build: {
	    // 编译输入的index.html文件。node.js中，在任何模块文件内部，可以使用__filename变量获取当前模块文件的带有完整绝对路径的文件名,
//	    index: path.resolve(__dirname, projectPath.shellDirPath + '/index.html'),
	    // 编译输出的静态资源路径
	    assetsRoot: path.resolve(__dirname, projectPath.shellDirPath + '/dist'),
	    // 编译输出的二级目录
	    assetsSubDirectory: path.resolve(__dirname, projectPath.shellDirPath + '/dist/static'),
	    // 编译发布的根目录，可配置为资源服务器或者cdn域名
	    assetsPublicPath: path.resolve(__dirname, projectPath.shellDirPath + '/dist'),
	    //是否开启cssSourceMap
	    productionSourceMap: false,
	    devtool: false,
	    // 是否开启gzip(压缩成zip包)
	    productionGzip: false,
	    // gzip模式下需要压缩的文件的扩展名，设置后会对相应扩展名的文件进行压缩
	    productionGzipExtensions: ['js', 'css'],
	    //是否开启打包后的分析报告
	    bundleAnalyzerReport: false,
	    env: {
	    	NODE_ENV: '"production"',
	    },
	  },
	  proxyTable: {
		//匹配项,如果接口其中 '/tags' 为匹配项，target 为被请求的地址
			//因为在 ajax 的 url 中加了前缀 '/tags'，而原本的接口是没有这个前缀的
			//所以需要通过 pathRewrite 来重写地址，将前缀 '/tags' 转为 ''
			//如果本身的接口地址就有 '/tags' 这种通用前缀，就可以把 pathRewrite 删掉
	//	    '/tags': {    
	//	        target: 'https://loan.moneytocar.com/yuegeche-wap/',  // 你需要请求数据的接口域名
	//	        changeOrigin: false,  //是否跨域
	//	        pathRewrite: {
	//	            '^/tags': ''   //如果接口包含该字段都会被代理到本地(该接口就不会跨域了,可以正常请求),
	//	        }              
	//	    }
		},
	}		
}
