const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config.js');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
});

io.on('connection', (socket) => {

    socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', (data) => {
        console.log("disconnect", data);
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
        console.log("chat-message", data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
        console.log("typing", data);
    });

    socket.on('stopTyping', (data) => {
        socket.broadcast.emit('stopTyping', (data));
        console.log("stopTyping", data);
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
        console.log("joined", data);
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
        console.log("leave", data);
    });
});