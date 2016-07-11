var express = require('express');
var app = express();
var server = require('http').Server(app);
var fork = require('child_process').fork;


/* Express 静态文件指向设置 */
app.use('/', express.static(__dirname));
//app.use('/public', express.static(__dirname + '/public'));
//app.use('/src', express.static(__dirname + '/src'));

/* Express 路由设置 */
app.route('/').get(function (req, res) {
    console.log('incomming req');
    res.sendFile(__dirname + '/public/index.html');
});

/* Express 服务器开启监听 */
server.listen(4501, function () {
    console.log('Client is hosting on port ' + 4501);
});

/* Setup Redis */
var redis = require('redis');
var subscriber = redis.createClient();
var publisher = redis.createClient();

subscriber.on('error', (err) => {
    console.log('Error: ' + err);
});
subscriber.on('connect', () => {
    console.log('subscriber connected!');
});
publisher.on('error', (err) => {
    console.log('Error: ' + err);
});
publisher.on('connect', () => {
    console.log('publiser connected!');
});

subscriber.subscribe('test channel');

// 此管理员管理的服务器
var server = null;

subscriber.on('message', (channel, msg) => {
    if (channel != "test channel") return;
    switch(msg)
    {
        case 'start': 
            if (server) {
                publisher.publish('status channel', "Server is already running!");
            } else {
                server = fork('./worker.js');
            }
            break;
        case 'close':
            if (!server){
                publisher.publish('status channel', "Server is already closed");
            } else {
                server.kill('SIGKILL');
            }
            break;
        default: 
            console.log(msg);
    }
});


