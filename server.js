var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fork = require('child_process').fork;
//var fork = require('child_process').spawn;
var ServerGroup = null;
var ioOperation = require('./src/controllers/io.server.js');
var constant = require('./src/common/const.js');
var port = 3005;

/* Express 静态文件指向设置 */
app.use('/', express.static(__dirname));
app.use('/public', express.static(__dirname + '/public'));
app.use('/src', express.static(__dirname + '/src'));

/* Express 路由设置 */
app.route('/').get(function (req, res) {
    console.log('incomming req');
    res.sendFile(__dirname + '/public/index.html');
});

/* Express 服务器开启监听 */
server.listen(port, function () {
    console.log('Server Manager is hosting on port ' + port);
});

/* 获取游戏服务器群设置信息 */
//TODO: 要和远端的redis设置信息匹配
var ServerConfig = require('./server.config.js');

/* 启动游戏服务器群 */
ServerGroup = initServers(ServerConfig);

/* 监听Socket.io链接*/
io.on('connection', function (socket) {
    ioOperation(socket, ServerGroup, ServerConfig);
})

/* 当此进程退出时，终止所有子进程 */
process.on('SIGINT', function (code) {
    for (var x in ServerGroup) {
        var server = ServerGroup[x].server;
        if (server) {
            process.kill(-server.pid);
        }
    }
});

/* 辅助函数 */
function initServers (ServerConfig) {
    var servers = {};
    for(var x in ServerConfig) {
        if (!ServerConfig[x]) break;

        (function(x){
            var config = ServerConfig[x];

            var script = config.script;
            var options = config.options;
            var args = config.args; 

            try {
                var child = fork(script, args, options); 
            } catch (e) {
                console.log(e);
                return;
            }
            servers[x] = {
                server: child,
                status: constant.RUNNING
            };
            console.log('Server ' + x + ' Started');
        })(x);
    }
    return servers;
}
