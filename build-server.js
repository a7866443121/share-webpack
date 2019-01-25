var path = require('path')
const fs=require('fs');
var express = require('express')
// express接收'post'请求的参数处理插件
// var bodyParser = require("body-parser")
var proxyMiddleware = require('http-proxy-middleware')
const getProjectPath = require('../build/get-project-path')();
const config = require(getProjectPath.shellDirPath + '/config/index.js')({
	projectPath:getProjectPath,
	path:path,
	fs:fs
});
var build = config.build
var proxys = config.proxy

var app = express()
var port = 3001


// 接口代理
Object.keys(proxys).forEach(function(context) {
    var options = proxys[context]
    if (typeof options === 'string') {
        options = {
            target: options,
            onProxyReq:function(proxyReq, req, res){
            	console.log(proxyReq)
            }
        }
    }
    app.use(proxyMiddleware(options.filter || context, options));
})


app.use(express.static(getProjectPath.shellDirPath + '/dist'));

var uri = `http://localhost:${port}`;

console.log('> Listening at ' + uri + '\n')

var server = app.listen(port)
