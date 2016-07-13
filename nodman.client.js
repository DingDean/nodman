var express = require('express');
var app = express();
var server = require('http').Server(app);
var fork = require('child_process').fork;


/* global variables */
var config = require(`./${process.argv[2]}`);

/* Express 服务器开启监听 */
server.listen(config.port, function () {
    console.log('Client is hosting on port ' + config.port);
});

/* Setup Redis */
var redis = require('redis');
var subscriber = redis.createClient(config.redis);
var publisher = redis.createClient(config.redis);

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

subscriber.subscribe(config.subscribe);

// 此管理员管理的服务器
var child_node = null;

subscriber.on('message', (channel, msg) => {
    if (channel != config.subscribe) return;
    switch(msg)
    {
        case 'start': 
            if (child_node) {
                publish("Server is already running!");
            } else {
                child_node = forkNode(config.fork);
                if (child_node) {
                    publish('Server is running!');
                    /* configure std, stderr */
                    child_node.stdout.on('data', (data) => {
                        publish(data);
                    });
                }
            }
            break;
        case 'close':
            if (!child_node) {
                publish("Server is already closed");
            } else {
                child_node.kill('SIGKILL');
                child_node = null;
                publish('Server is closed!');
            }
            break;
        default: 
            console.log(msg);
    }
});


function publish (msg)
{
    publisher.publish(config.publish, msg);
}

function forkNode (config)
{
    var modulePath = config.modulePath ? config.modulePath : null;
    var args = config.args ? config.args : [];
    var options = config.options ? config.options : {};
    if (!modulePath) return null;
    return fork(modulePath, args, options);
}
