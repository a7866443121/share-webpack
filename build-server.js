const path = require('path')
const fs = require('fs');
const express = require('express');
var app = express()
const proxyMiddleware = require('http-proxy-middleware');
const getPath = require('./getPath')();
//基础配置
const config = require(getPath.shellDirPath + '/configTest/config.js')({
	getPath: getPath,
	path: path,
	fs: fs
});

var build = config.build || {};
var proxys = config.proxy || {};
var port = config.port || 3001;

Object.keys(proxys).forEach(val => {
	var options = proxys[val];
	if(typeof options === 'string'){
		options = {
			target: options,
			onProxyReq: (proxyReq, req, res) => {
				console.log(proxyReq)
			}
		}
	}
	app.use(proxyMiddleware(options.filter || val,options));
});

app.use(express.static(getPath.shellDirPath + '/dist'));

var url = `http://localhost:${port}/index.html`;
console.log(`监听地址:${url}\n`)
var server = app.listen(port);
