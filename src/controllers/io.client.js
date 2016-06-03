var socket = io.connect('http://192.168.88.80:3010');

socket.on('server-status', function (info) {
    var name = info.name;
    var isRunning = info.status;
    if (isRunning) {
        console.log('xxx');
    } 
});

socket.on('server-res', function (result) {
    console.log(result);
})

function restart(target) {
    socket.emit('rs', target);
}

function start(target) {
    socket.emit('start', target);
}
