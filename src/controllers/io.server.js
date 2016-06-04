var fork = require('child_process').fork;

function ioOperation(socket, servers, ServerConfig) {
    // 监听活服务器的状态
    for (var name in servers) {
        if (servers[name]) {
            (function (name) {
                var child = servers[name];
                var status = child.status;
                var server = child.server;

                socket.emit('server-status', JSON.stringify({name: name, status: status }));
                // 监听正常的LOG信息
                if (server) {
                    //TODO:
                    process.stdout.on('data', function (data) {
                        socket.emit('server-res', data + '');
                    });

                    process.stderr.on('data', function (err) {
                        console.log(name + '' + err);
                    });

                    // 处理子进程退出事件
                    server.on('exit', function (status) {
                        if (servers[name].status == constant.WAITING) return;

                        servers[name] = {
                            server: null,
                            status: constant.POWEROFF
                        };
                        console.log(name + ' 退出 ' + status );
                        socket.emit('server-status', JSON.stringify({name: name, status: constant.POWEROFF}));
                    });

                    // 处理主次进程通信失败
                    server.on('error', function (err) {
                        // 检测错误消息是否已经被处理
                        if (servers[name].status == constant.POWEROFF) return;

                        servers[x] = {
                            server: null,
                            status: constant.WAITING
                        };
                        console.log(name + '消息无法被处理' + status );
                        socket.emit('server-status', JSON.stringify({name: name, status: constant.WAITING}));
                    });

                }
            })(name);
        }
    }

    socket.on('regist', function () {
        console.log('A user connected');
        userIsOnline = true;
    });

    socket.on('restart', function (target) {
        var childProc = servers[target];
        if (childProc.server) {
            childProc.server.stdin.write('rs');
        } else {
            // target is not running 
            var config = ServerConfig[target];

            var script = config.script;
            var options = config.options;
            var args = config.args;

            var child = spawn(script, args, options);

            process.stdout.on('data', function (data) {
                console.log(data);
            });

            child.on('exit', function (status) {
                servers[target].server = null;
                servers[target].status = constant.POWEROFF;
                socket.emit('server-status', JSON.stringify({name: name, status: constant.POWROFF}));
                console.log(target + ' 退出 ' + status );
            });

            process.stderr.on('data', function (data){
                socket.emit('server-status', JSON.stringify({name: target, status: constant.WAITING}));
                console.log(data);
            });

            console.log('Server ' + target + ' Started');

            servers[target] = {
                server: child,
                status: constant.RUNNING
            };

            socket.emit('server-status', JSON.stringify({name: target, status: constant.RUNNING}));

        }
    });

    socket.on('shutdown', function (target) {
        if (servers[target].server) {
            //servers[target].server.kill('SIGHUP');
            process.kill(-servers[target].server.pid);
            console.log('关闭' + target);
            servers[target].server = null; // 删除子进程
            servers[target].status = constant.POWEROFF; 
            socket.emit('server-status', JSON.stringify({name: target, status: constant.POWEROFF}));
            socket.emit('server-res', target + " is terminated");
        } else {
            socket.emit('server-res', target + ' is not running!');
        }
    });

}

module.exports = ioOperation;
