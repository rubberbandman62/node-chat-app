let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (message) {
    var template = jQuery('#message-template').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        text: message.text
    });

    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
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