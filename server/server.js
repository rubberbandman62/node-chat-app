const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {Users, Person} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.on('getRooms', (callback) => {
        callback(Array.from(users.getRoomList()));
    });

    socket.on('getAllUsers', (callback) => {
        callback(Array.from(users.getAllUserNames()));
    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required!');
        }

        let room = params.room.toLowerCase();

        socket.join(room);
        users.removeUser(socket.id);

        let user = new Person(socket.id, params.name, params.room);
        if (!users.addUser(user)) {
            console.log(users.names);
            return callback('Duplicate Name!', user);
        }

        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.emit('newMessage', generateMessage('Admin', `Hi ${params.name}, welcome to ChatApp in Room ${params.room}!`));
        let message = generateMessage('Admin', `${params.name} has joined!`);
        socket.broadcast.to(room).emit('newMessage', message);

        callback(null, user);
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage',
                generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (locationData) => {
        let user = users.getUser(socket.id);

        if (user && locationData && locationData.coords) {
            io.to(user.room).emit('newLocationMessage',
                generateLocationMessage(user.name, locationData.coords));
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if (user) {
            console.log(`User ${user.name} has left room ${user.room}`);
            let message = generateMessage('Admin', `${user.name} has left!`);
            io.to(user.room).emit('newMessage', message);
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        }
    });
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
