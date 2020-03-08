const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config.js');

const colors = require('./colors.js');

http.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
});

var userList = [];

io.on('connection', (socket) => {
    socket.emit('connections', Object.keys(io.sockets.connected).length);
    socket.emit('userlist', userList);

    socket.on('error', (err) => {
        console.error(err);
    });
    socket.on('connect', (data) => {
        console.log(
            `${colors.red}DISCONNECT${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('disconnect', (data) => {
        console.log(
            `${colors.red}DISCONNECT${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('disconnecting', (data) => {
        console.log(
            `${colors.red}DISCONNECTING${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    
    socket.on('chat', (data) => {
        socket.broadcast.emit('chat', (data));
        console.log(
            `${colors.green}CHAT${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('delete', (data) => {
        socket.emit('delete', (data));
        socket.broadcast.emit('delete', (data));
        console.log(
            `${colors.red}DELETE${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('pin', (data) => {
        socket.broadcast.emit('pin', (data));
        console.log(
            `${colors.blue}PIN${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('unpin', (data) => {
        socket.broadcast.emit('unpin', (data));
        console.log(
            `${colors.blue}UNPIN${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
        console.log(
            `${colors.yellow}TYPING${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('stopTyping', (data) => {
        socket.broadcast.emit('stopTyping', (data));
        console.log(
            `${colors.yellow}STOPTYPING${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );
    });
    socket.on('join', (data) => {
        socket.broadcast.emit('join', (data));
        console.log(
            `${colors.green}JOINED${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );

        if (userList.findIndex(user => user.id == data.id) === -1) {
            userList.push(data);
        }
        
        socket.broadcast.emit('userlist', userList);
        socket.emit('userlist', userList);
        console.log('Userlist: ', userList.length);

        // console.log(io.sockets.sockets);
        // io.sockets.sockets.map((e) => e.username);
    });
    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
        console.log(
            `${colors.red}LEAVE${colors.clear}\n`+
            JSON.stringify(data, null, 4)
        );

        if (userList.includes(data)) {
            let i = userList.findIndex(u => u.id === data.id);
            userList.splice(i, i >= 0 ? 1 : 0 );
        }
        
        socket.broadcast.emit('userlist', userList);
        console.log('Userlist: ', userList.length);
    });
});