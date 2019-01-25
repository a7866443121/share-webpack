/*配置入口资源*/
'use strict'

 // const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = function(obj){
	const projectPath = obj.projectPath;
	const webpack = obj.webpack;
	const HtmlWebpackPlugin = obj.HtmlWebpackPlugin;
	const path = obj.path;
	//build文件执行的根目录(webpack服务器的目录)
	var buildRootPath = projectPath.buildRootPath.split('\\').join('/');
	//shell脚本执行的根目录(项目根目录)
	var shellDirPath = projectPath.shellDirPath;
	//输出目录分环境处理
	var buildRootPath = process.env.NODE_ENV == 'production' ? shellDirPath + '/release' : projectPath.buildRootPath.split('\\').join('/') ;
	return{
		//https://webpack.js.org/concepts/entry-points/  
		entry: {
			'app': shellDirPath + '/src/index.js',
			'login': shellDirPath + '/src/login/index.js',
			'resetpwd': shellDirPath + '/src/resetpwd/index.js',
			'font': [
				shellDirPath + '/src/assets/all_font.js', 
				shellDirPath + '/src/assets/colorful_all.js', 
				shellDirPath + '/src/assets/colorful_goods.js',
				shellDirPath + '/src/assets/colorful_system.js', 
				shellDirPath + '/src/assets/font.js', 
				shellDirPath + '/src/assets/views.font.js'
			]
		},
		plugins: [
			//https://webpack.docschina.org/plugins/commons-chunk-plugin
			new webpack.optimize.CommonsChunkPlugin({
				name: 'common' // 指定公共 bundle 的名称。
			}),
			//https://www.npmjs.com/package/html-webpack-plugin
			new HtmlWebpackPlugin({
				//输出   路径 + 文件名
				filename: buildRootPath + '/index.html', 
				//输入模板   路径 + 文件名
				template: shellDirPath + '/index.html', 
				//模板依赖资源注入
				chunks: ['common', 'font', 'app'] 
			}),
			new HtmlWebpackPlugin({
				filename: buildRootPath + '/login.html',
				template: shellDirPath + '/login.html',
				chunks: ['common', 'font', 'login']
			}),
			new HtmlWebpackPlugin({
				filename: buildRootPath + '/resetpwd.html',
				template: shellDirPath + '/resetpwd.html',
				chunks: ['common', 'font', 'resetpwd']
			}),			
		]
	}
}