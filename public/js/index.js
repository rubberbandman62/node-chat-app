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
    let msg = message.from + ': ' + message.text + ' at: ' + message.createdAt;
    li.text(msg);
    $('#messages').append(li);
});

socket.on('newLocationMessage', function(locationMessage) {
    let li = $('<li></li>');
    let a = $('<a target="_blank">My current location</a>')

    li.text(locationMessage.from + ': ');
    a.attr('href', locationMessage.url);
    li.append(a);

    $('#messages').append(li);
});

$('#message-form').on('submit', function (event) {
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

let locationButton = $('#send-location');
locationButton.on('click', function () {
   if (!navigator.geolocation) {
       return alert('Geolocation not supported by your browser!');
   }

   navigator.geolocation.getCurrentPosition(function(position) {
       console.log(position.coords);
       socket.emit('createLocationMessage', {
           from: 'me',
           coords: {
               latitude: position.coords.latitude,
               longitude: position.coords.longitude
           }
       });
   }, function() {
       alert('Unable to fetch location!');
   })
});