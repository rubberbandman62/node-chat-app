let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (message) {
    console.log('New message:', message);
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text} at: ${message.createdAt}`);
    $('#messages').append(li);
});

jQuery('#message-form').on('submit', function (event) {
    event.preventDefault();
    let message = $('[name=message]').val();
    console.log(message);
    socket.emit('createMessage', {
        from: 'me',
        text: message
    }, function (data) {
        console.log('Result: ', data);
    });
});