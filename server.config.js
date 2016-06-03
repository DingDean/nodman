module.exports = {
    'DKWeb_Server' : {
        script: './ServerCode/ServerMain.js',
        args: ['DKWeb_Server'],
        options: {
            cwd: '/home/nagedk/QipaiServer/',
            silent: true,
            execPath: 'nodemon'
        }
    },
    'DKConnect_Server' : {
        script: './ServerCode/ServerMain.js',
        args: ['DKConnect_Server'],
        options: {
            cwd: '/home/nagedk/QipaiServer/',
            silent: true,
            execPath: 'nodemon'
        }
    },
    'DKModules_Server' : {
        script: './ServerCode/ServerMain.js',
        args: ['DKModules_Server'],
        options: {
            cwd: '/home/nagedk/QipaiServer/',
            silent: true,
            execPath: 'nodemon'
        }
    }
}
