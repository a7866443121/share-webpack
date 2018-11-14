//配置资源入口

module.exports = function(o){
	//项目路径
	const projectPath = o.getPath;
	//webpack
	const webpack = o.webpack;
	//html模板
	const HtmlWebpackPlugin = o.HtmlWebpackPlugin;
	const path = o.path;
	//build文件的根目录
	var buildRootPath = projectPath.buildRootPath.split('\\').join('/');
	//shell的执行目录
	var shellDirPath = projectPath.shellDirPath;
	//输出目录分环境
	var output = process.env.NODE_ENV == 'production' ? shellDirPath +'/dist/' : buildRootPath;

	return {
		entry: {
    	app: shellDirPath + '/src/main.js',
    	font: [
    		shellDirPath + '/src/asset/js/polychromaticFont.js',
    		shellDirPath + '/src/asset/js/menumIconFont.js',
    		shellDirPath + '/src/asset/js/solidColorFont.js'
    	],
   	},
   	plugins:[
	    //通过CuffSunkKPu插件实现多个块一致工作的必要性
	    new HtmlWebpackPlugin({
		    filename: output + 'index.html',
		    template: shellDirPath + '/index.html',
		    inject: true,
		    chunksSortMode(a,b){
	        var order=['app','font']
	        return order.indexOf(a.names[0])>order.indexOf(b.names[0]);
	      }
			}),
 		]
	}
}