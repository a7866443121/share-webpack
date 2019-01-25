const path = require('path');
module.exports = function (){
	//shell的执行目录
	var shellDirPath = process.cwd();
	//webpack的执行目录
	var buildDirPath = path.resolve(__dirname, '..');
	var shellDirPathArr = [];
	var buildDirPathArr = buildDirPath.split('\\');
	buildDirPathArr.forEach(function(v,i){
		shellDirPath = shellDirPath.replace(new RegExp(v,'g'),'');
	});
	shellDirPathArr = shellDirPath.split('\\').filter(d=>d);
	var relPath = shellDirPathArr.join('/');
	return{
		//path对象
		path:path,
		//去除shell脚本执行目录与build文件的执行目录的的相同部分到shell的路径
		relPath: relPath,
		//shell脚本执行目录
		shellDirPath: process.cwd().split('\\').join('/'),
		//build文件的执行目录
		buildDirPath: path.resolve(__dirname, '..'),
		//build文件的根目录
		buildRootPath: path.resolve(__dirname, '../../'),
		env: process.env.NODE_ENV,
	}
}