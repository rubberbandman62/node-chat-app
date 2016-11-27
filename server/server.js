const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("user connected!");
    socket.emit('newMessage',
        generateMessage('Admin', 'Welcome to Chat App!'));

    socket.broadcast.emit('newMessage',
        generateMessage('Admin', 'New user joined!'));

    socket.on('createMessage', (message, callback) => {
        console.log('ceateMessage', message);
        io.emit('newMessage',
            generateMessage(message.from, message.text));
        callback({
            statusCode: '1',
            statusText: 'Message received!'
        });
    });

    socket.on('createLocationMessage', (locationData) => {
       io.emit('newLocationMessage',
       generateLocationMessage(locationData.from, locationData.coords));
    });

    socket.on('disconnect', () => {
        console.log("user disconnected!");
    });
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
