var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pushbots = require('./pushbots');
var user = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
io.on('connection', function (socket) {
    console.log('one user connected ' + socket.id);

    socket.on('join', function (data) { //Every time the user connect to the socket, map his username with the socket he connected to
        user[data.username] = socket;
        console.log("Saved username: " + data.username);
        console.log("Saved socket: " + user[data.username].id);
    })

    socket.on('message', function (data) {
        console.log("Data received from the socket: " + data);
        if (user[data.receiver] != null) { // If the receiver is now connected to the socket, send him the message
            user[data.receiver].emit('message', {message: data.text, image: data.image});
            console.log("Receiver socket: " + user[data.receiver].toString());
            console.log("No notification needed");
        }else if(user[data.receiver] == null) {
            console.log("Calling Notification", data.receiver, data.text);
            pushbots.send(data);
        }

    })

    socket.on('offline', function (data) { // When the user is not connected to the socket, set his socket to null
        user[data.username] = null;
        console.log("Deleted username: " + data.username);
        console.log("Deleted socket_id: " + user[data.username]);
    })

    socket.on('disconnect', function () {
        console.log('one user disconnected ' + socket.id);
    })
})


http.listen(3000, function () {
    console.log('server listening on port 3000');
})