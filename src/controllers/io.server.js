var fork = require('child_process').fork;

function ioOperation(socket, servers, ServerConfig) {
    for (var name in servers) {
        if (servers[name]) {
            (function (name) {
                var child = servers[name];
                socket.emit('server-status', {name: name, status: 0});
                // 监听正常的LOG信息
                child.stdout.on('data', function (data) {
                    socket.emit('server-res', data + '');
                });

            })(name);
        }
    }


    socket.on('rs', function (target) {
        if (servers[target]) {
            servers[target].stdin.write('rs');
        } else {
            socket.emit('server-res', target + ' is not running!');
        }
    });

    socket.on('start', function (target) {
        if (servers[target]) {
            socket.emit('server-res', target + ' is already running!');
        } else {
            // target is not running 
            var child = fork(ServerConfig[target].script, {silent: true, execPath: 'nodemon'});

            child.stderr.on('data', function (err) {
                console.log(target + '' + err);
            });

            child.on('close', function (status) {
                console.log(target + ' exited with ' + status );
            });

            console.log('Server ' + target + ' Started');
            servers[target] = child;
        }
    });
}

module.exports = ioOperation;
