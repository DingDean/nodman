module.exports = {
    'DKWeb_Server' : {
        script: './ServerCode/ServerMain.js',
        args: ['DKWeb_Server'],
        options: {
            detached: true, // 用来关闭该进程的所有子进程
            stdio: ['pipe', process.stdout, process.stderr]
        }
    },
    'DKConnect_Server' : {
        script: './ServerCode/ServerMain.js',
        args: ['DKConnect_Server'],
        options: {
            detached: true, // 用来关闭该进程的所有子进程
            stdio: ['pipe', process.stdout, process.stderr]
        }
    },
    'DKModules_Server' : {
        script: './ServerCode/ServerMain.js',
        args: ['DKModules_Server'],
        options: {
            detached: true, // 用来关闭该进程的所有子进程
            stdio: ['pipe', process.stdout, process.stderr]
        }
    }
}
