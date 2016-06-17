'use strict';

var nodeWeixinUser = require('node-weixin-user');
var nodeWeixinAuth = require('node-weixin-auth');
var settings = require('node-weixin-settings');

var app = {
    id: 'wx7ca9c509abe55d26',
    secret: '05dfc2c82ccd8a6ef5f3713762632402',
    token: 'zhubg'
};

// //手动得到accessToken
// nodeWeixinAuth.tokenize(settings, app, function (error, json) {
//     var accessToken = json.access_token;
// });
//
// //自动获得accessToken，并发送需要accessToken的请求
// nodeWeixinAuth.determine(settings, app, function () {
//     //这里添加发送请求的代码
// });

// //获取服务器IP
// nodeWeixinAuth.ips(settings, app, function (error, data) {
//     //error == false
//     //data.ip_list获取IP列表
// });
//
// //获取用户信息
// nodeWeixinUser.profile(settings, app, process.env.APP_OPENID, function (error, data) {
//     console.log(data);
// });


//与微信对接服务器的验证
var errors = require('web-errors').errors;
// var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');

var server = express();

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// 微信服务器返回的ack信息是HTTP的GET方法实现的
server.get('/ack', function (req, res) {
    var data = nodeWeixinAuth.extract(req.query);
    nodeWeixinAuth.ack(app.token, data, function (error, data) {
        if (!error) {
            res.send(data);
            console.log('connetct done!:'+data);
            return;
        }
        switch (error) {
            case 1:
                res.send(errors.INPUT_INVALID);
                console.log(errors.INPUT_INVALID);
                break;
            case 2:
                res.send(errors.SIGNATURE_NOT_MATCH);
                console.log(errors.SIGNATURE_NOT_MATCH);
                break;
            default:
                res.send(errors.UNKNOWN_ERROR);
                console.log(errors.UNKNOWN_ERROR);
                break;
        }
    });
});

server.get('/', function (req, res) {
            // res.redirect('https://github.com/miss61008596');
            res.send(`<html>
<body>
<div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
<div style="display: flex">
<img style="width: 160px;height: 160px;border-radius: 80px;margin-right: 20px" src="http://120.27.124.108:10255/222.jpg" />
</div>
<div style="display: flex;flex-direction: column;">
<h1>个人技术分享</h1>
<h1>请访问我的github主页</h1><a href="https://github.com/miss61008596">https://github.com/miss61008596</a>
<h5>QQ:61008596</h5>
</div>
</div>
</body>
</html>`);
});

server.get('/test', function (req, res) {
    // res.redirect('https://github.com/miss61008596');
    //获取用户信息
    nodeWeixinUser.profile(settings, app, process.env.APP_OPENID, function (error, data) {
        console.log(data);
        res.send('data:'+JSON.stringify(data));
    });
});



var  listener = server.listen(80, function () {
    let host = listener.address().address;
    let port = listener.address().port;
    console.log('hello,http://' + host + ':' + port);
});