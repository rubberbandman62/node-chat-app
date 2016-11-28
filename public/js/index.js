let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (message) {
    console.log('New message:', message);
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    let msg = message.from + ' ' + formattedTime + ': ' + message.text;
    li.text(msg);
    $('#messages').append(li);
});

socket.on('newLocationMessage', function(locationMessage) {
    let li = $('<li></li>');
    let a = $('<a target="_blank">My current location</a>')
    let formattedTime = moment(locationMessage.createdAt).format('h:mm a');

    li.text(locationMessage.from + ' ' + formattedTime + ': ');
    a.attr('href', locationMessage.url);
    li.append(a);

    $('#messages').append(li);
});

$('#message-form').on('submit', function (event) {
    event.preventDefault();

    let messageInpuField = $('[name=message]');

    let message = messageInpuField.val();
    console.log(message);
    socket.emit('createMessage', {
        from: 'User',
        text: message
    }, function () {
        messageInpuField.val('');
    });
});

let locationButton = $('#send-location');
locationButton.on('click', function () {
   if (!navigator.geolocation) {
       return alert('Geolocation not supported by your browser!');
   }

   locationButton.attr('disabled', 'disable').text('Sending location...');

   navigator.geolocation.getCurrentPosition(function(position) {
       locationButton.removeAttr('disabled').text('Send location');
       socket.emit('createLocationMessage', {
           from: 'User',
           coords: {
               latitude: position.coords.latitude,
               longitude: position.coords.longitude
           }
       });
   }, function() {
       locationButton.removeAttr('disabled').text('Send location');
       alert('Unable to fetch location!');
   })
});