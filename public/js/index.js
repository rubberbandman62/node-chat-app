let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('getRooms', function(rooms) {
        if(!rooms) {
            return;
        }

        for (var index=0; index<rooms.length; index++) {
            var option = jQuery('<option></option>').text(rooms[index]);
            $('#currentRooms').append(option);
        }
    });
});
