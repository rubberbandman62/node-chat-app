const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("user connected!");
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to Chat App!',
        createdAt: new Date().toTimeString()
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined!',
        createdAt: new Date().toTimeString()
    });

    socket.on('createMessage', (message) => {
        console.log('New user connected!');

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().toTimeString()
        });
    });

    socket.on('disconnect', () => {
        console.log("user disconnected!");
    });
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
