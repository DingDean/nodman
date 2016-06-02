var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ioOperations = require('./src/controllers/ioOperations');

app.use('/public', express.static(__dirname + '/public'));
app.use('/html', express.static(__dirname + '/html'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', ioOperations);

server.listen(3000, function () {
    console.log('Server is listening on 3000');
});
