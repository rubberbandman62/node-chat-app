function scrollToBottom() {
    // selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    // heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');
    let params = $.deparam(window.location.search);

    socket.emit('join', params, function(err, user) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('Room entered!');
            if (user) {
                $('#title_sidebar').text(user.room);
                $('#title_main').text(user.name);
            }
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (message) {
    let template = jQuery('#message-template').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        text: message.text
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    let template = jQuery('#location-message-template').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('updateUserList', function(userNames) {
    let ol = jQuery('<ol></ol>');

    userNames.forEach(function(name) {
        ol.append(jQuery('<li></li>').text(name));
    });

    $('#users').html(ol);
});

$('#message-form').on('submit', function (event) {
    event.preventDefault();

    let messageInpuField = $('[name=message]');

    let message = messageInpuField.val();
    socket.emit('createMessage', {
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

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location!');
    })
});