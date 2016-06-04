var socket = io.connect('http://server2.lzztech.com:3010');
var constant = {};
constant.RUNNING = 0;
constant.WAITING = 1;
constant.POWEROFF = 2;
// 马上通知服务器用户上线
(function () {
    socket.emit('regist');
})();

// 接收并渲染服务器信息
socket.on('server-status', function (info) {
    var data = JSON.parse(info);
    var name = data.name;
    var code = data.status;
    var div = document.getElementById(name);
    if (div) {
        // 如果已存在这个服务器列表，则更新其数据
        var statusP = document.getElementById(name+"_status");
        if (statusP) {
            var status = null;
            switch (code) {
                case constant.RUNNING:
                    status = "运行中!";
                    break;
                case constant.WAITING:
                    status = "出错了!";
                    break;
                case constant.POWEROFF:
                    status = "已关闭!";
                    break;
                default:
                    status = "状态未知";
            }
            statusP.innerHTML = name + status + "";
        }
    } else {
        // 无此服务器信息，创建之
        document.body.innerHTML += "<div id=\'"+ name +"\'class=\'server\'></div>"
        var serverDiv = document.getElementById(name);
        serverDiv.innerHTML += "<p id=\'"+ name +"_status\'class=\"status\">" +name + " 运行中!" + "</p>";
        serverDiv.innerHTML += "<div id=\""+ name +"-operation\"class=\"server-operation\"></ul>";
        var opUL = document.getElementById(name+"-operation"); 
        opUL.innerHTML += "<button class=\"sop-button\" type='button' onClick=\"start(\'"+name+"\')\">启动"+ name + "</button>";
        opUL.innerHTML += "<button class=\"sop-button\" type='button' onClick=\"restart(\'"+name+"\')\">重启"+ name + "</button>";
        opUL.innerHTML += "<button class=\"sop-button\" type='button' onClick=\"shutdown(\'"+name+"\')\">关闭"+ name + "</button>";
        opUL.innerHTML += "<button class=\"sop-button\" type='button' onClick=\"log(\'"+name+"\')\">显示"+ name + "日志</button>";
    }
});

socket.on('server-res', function (result) {
    console.log(result);
})

function restart(target) {
    socket.emit('restart', target);
}

function start(target) {
    socket.emit('start', target);
}

function shutdown(target) {
    socket.emit('shutdown', target);
}

function log(target) {
    socket.emit('start', target);
}

