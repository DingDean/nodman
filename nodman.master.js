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

var rooms = [];
/* 监听main频道 */
// TODO: 获取服务器列表, 监听每一个服务器的信息
var serverListMock = ['TestServerLog', 'TServerLog'];

serverListMock.reduce((pre, server) => {
    subscriber.subscribe(server);
    return true;
}, true);

subscriber.on('message', (channel, msg) => {
    switch (msg) {
        default:
            console.log(msg);
            rooms.map((name) => name.split('_')).reduce((pre, cur)=>{
                console.log(channel);
                if (channel !== `${cur[0]}Log`) return true;
                console.log(cur);
                var serverLogInfo = {
                    server: cur[0],
                    msg: msg
                };
                io.to(cur[1]).emit('logInfo', JSON.stringify(serverLogInfo));
                return true;
            }, true);
    }
});

/*
subscriber.on('message', (channel, msg) => {
    console.log(msg);

    function getServerAndSocketID(server_socketId)
    {
        return server_socketId.split('_');
    }

    function getTheListenerForThisServer (serverSocketId)
    {
        return serverSocketId.filter((serverSocketId) => serverSocketId[0] === channel);
    }

    function sendMsgToSockets (pre, cur)
    {
        io.to(cur[1]).emit('logInfo', msg);
        return true;
    }

    rooms.map(getServerAndSocketID).filter(getTheListenerForThisServer).reduce(sendMsgToSockets, true);
});
*/


/* 监听socket.io */
io.on('connection', (socket) => {
    //var isJoinedRoom = false;
    var isJoinedRoom = {};
    console.log(`${socket.id} is connected`);

    socket.on('start', (server) => {
        console.log(`Starting ${server}`)
        publisher.publish(server, 'start');
    });

    socket.on('close', (server) => {
        publisher.publish(server, 'close');
    });

    socket.on('show log', (server) => {
        joinRoom(server, socket);
    });

    socket.on('close log', (server) => {
        rooms = rooms.filter((roomName) => roomName !== `${server}_${socket.id}`);
        isJoinedRoom = false;
    });

    function joinRoom (server, socket)
    {

        if (isJoinedRoom[server]) {
            publisher.publish(server, `${socket.id} is already outputing log`);
        } else {
            isJoinedRoom[server] = true;
            var roomName = `${server}_${socket.id}`;
            rooms.push(roomName);
        }
    }

});

/* Express 服务器开启监听 */
server.listen(4500, function () {
    console.log('Server Manager is hosting on port ' + 4500);
});
