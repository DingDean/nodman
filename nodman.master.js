var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.sockets.setMaxListeners(0);
var spawn = require('child_process').fork;


/* Express 静态文件指向设置 */
app.use('/', express.static(__dirname));
//app.use('/public', express.static(__dirname + '/public'));
//app.use('/src', express.static(__dirname + '/src'));

/* Express 路由设置 */
app.route('/').get(function (req, res) {
    console.log('incomming req');
    res.sendFile(__dirname + '/index.html');
});

/* 设置Redis, 一个用来监听，一个用来发布 */
var redis = require('redis');

// 发布者
var publisher = redis.createClient();
publisher.on('error', (err) => {
    console.log('Error: ' + err);
});
publisher.on('connect', () => {
    console.log('publisher connected!');
});

//监听者
var subscriber = redis.createClient();
subscriber.on('error', (err) => {
    console.log('Error: ' + err);
});
subscriber.on('connect', () => {
    console.log('subscriber connected!');
});

/* 监听main频道 */
subscriber.subscribe('feedback');
subscriber.on('message', (channel, msg) => {
    if (channel!= 'feedback') {
        return;
    }
    switch (msg) {
        default:
            console.log(msg);
    }
});



/* 监听socket.io */
io.on('connection', (socket) => {
    socket.on('start', (server) => {
        console.log('start');
        publisher.publish(server, 'start');
    });

    socket.on('close', (server) => {
        publisher.publish(server, 'close');
    });

    socket.on('restart', (server) => {
        publisher.publish(server, 'restart');
    });

    socket.on('reload', (server) => {
        publisher.publish(server, 'reload');
    });

    socket.on('log', (server) => {
        publisher.publish(server, 'log');
    });
});

/* Express 服务器开启监听 */
server.listen(4500, function () {
    console.log('Server Manager is hosting on port ' + 4500);
});

