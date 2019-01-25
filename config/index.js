'use strict'
module.exports = function(obj){
	var path = obj.path;
	var fs = obj.fs;
	var projectPath = obj.projectPath;
	
	//把一个路径或路径片段的序列解析为一个绝对路径。 _dirname 当前模块的文件夹名称
	function resolve(dir) {
		var src = dir 
	        ? path.resolve(__dirname, projectPath.buildRootPath, dir) 
	        : path.resolve(__dirname, projectPath.buildRootPath);
	        console.log(src)
	    return src;
	}
	var cookie = '';
	return {
	    resolve: resolve,
	    dev: {
		  	//静态资源文件夹，默认“static”，
		    assetsSubDirectory: './static',
		    //发布路径，
		    assetsPublicPath: '/',
		    host: 'localhost', //地址  localhost or 本地 id 都可以访问
		    port: 8000, 
		    // 下面表示项目启动后是否自动打开开浏览器
		    autoOpenBrowser: false,
		    //是否查询错误
		    errorOverlay: true,
		    //是否通知错误
		    notifyOnErrors: true,
		    //是跟devserver相关的一个配置，webpack为我们提供的devserver是可以监控文件改动的，但在有些情况下却不能工作，我们可以设置一个轮询（poll）来解决
		    poll: false,
		    //是否使用eslint检测代码
		    useEslint: false,
		    //是否展示eslint的错误提示
		    showEslintErrorsInOverlay: false,
		    //webpack提供的用来方便调试的配置，它有四种模式，可以查看webpack文档了解更多
		    devtool: true,
		    //一个配合devtool的配置，当给文件名插入新的hash导致清楚缓存时是否生成souce maps，默认在开发环境下为true
		    cacheBusting: true,
		    //是否开启SourceMap
		    cssSourceMap: true,
		    env: {
	            NODE_ENV: '"development"'
	        }
	  	},
	
	  	build: {
		    // 编译输出的静态资源路径
		    assetsRoot:path.resolve(__dirname, projectPath.shellDirPath, 'dist'),
		    // 编译输出的二级目录
		    assetsSubDirectory: path.resolve(__dirname, projectPath.shellDirPath, 'dist/static'),
		    // 编译发布的根目录，可配置为资源服务器或者cdn域名
		    assetsPublicPath: path.resolve(__dirname, projectPath.shellDirPath, 'dist'),
		    //是否开启SourceMap
		    productionSourceMap: false,
		    devtool: false,
		    // 是否开启gzip(压缩成zip包)
		    productionGzip: false,
		    // gzip模式下需要压缩的文件的扩展名，设置后会对相应扩展名的文件进行压缩
		    productionGzipExtensions: ['js', 'css'],
		    //是否开启打包后的分析报告
		    bundleAnalyzerReport: true,
		    env: {
	            NODE_ENV: '"production"'
	        }
	  	},
	
	    proxy: {
	    	//配置了router target实际没有用了，还是要写
	        '/Pc.do': {
		        target: 'http://10.0.0.120:8089',
		        // 如果是https接口，需要配置这个参数
//		        secure: false,  
		        changeOrigin: true,
	//	        pathRewrite: {
	//	            '^/api': '' 
	//      	},
		        //请求发送前的回调函数,不代理该接口则返回false,需要代理则返回地址,
				router: function(req) {
					// 动态取代理地址，实现实时调整
					var proxys=JSON.parse(fs.readFileSync('./config/proxy.json'));
			    	return proxys[proxys.test];
				}
	     	},
	      	'/pc.do': {
		        target: 'http://10.0.0.120:8089',
//		        secure: false,
		        changeOrigin: true,
				router: function(req) {
					var proxys=JSON.parse(fs.readFileSync('./config/proxy.json'));
			    	return proxys[proxys.test];
				}
	      	}
	    },	
	    loader: [
	    	
	    ]
	}
}