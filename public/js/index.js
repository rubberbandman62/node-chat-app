let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('createMessage', {
        from: "Mike",
        text: "Hello everybody!"
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (message) {
    console.log('New message:');
    console.log(JSON.stringify(message, undefined, 4));
});