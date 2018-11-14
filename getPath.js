const path = require('path');
module.exports = function(){
	//shell脚本的执行目录
	var shellDirPath = process.cwd();
	//build文件的执行目录
	var buildDirPath = path.resolve(__dirname,'./');
	//
	var shellDirRelPath = '';
	buildDirPath.split('\\').forEach(function(v,i){
		shellDirRelPath = shellDirPath.replace(new RegExp(v,'g'),'');
	});
	//切割成数组并去重复
	var shellDirPathArr = shellDirPath.split('\\').filter(d=>d);
	//相对路径
	var relPath = shellDirPathArr.join('/');
	return {
		//path工具
		path: path,
		//去除shell脚本执行目录与build文件的相同路径到shell的相对路径
		relPath: relPath,
		//shell脚本的执行目录路径
		shellDirPath: process.cwd().split('\\').join('/'),
		//build文件的执行目录
		buildDirPath: buildDirPath,
		//buildRootPath
		buildRootPath:path.resolve(__dirname,'../'),
		//env
		env: process.env.NODE_ENV
	}
}
