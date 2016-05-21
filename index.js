var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pushbots = require('./pushbots');
var user = {};
var chatWith = {};
var index = 1;
var msgBuffer = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
io.on('connection', function (socket) {
    console.log('one user connected ' + socket.id);

    socket.on('join', function (data) { //Every time the user connect to the socket, map his username with the socket he connected to
        user[data.username] = socket;
        chatWith[data.username] = data.receiver; // To ensure both users are iin the same chatroom
        console.log("Saved username: " + data.username);
        console.log("Saved socket: " + user[data.username].id);
        console.log(data.username + " is chatting with: " + data.receiver);
    })

    socket.on('message', function (data) {
        console.log("Data received from the socket: " + data);
        console.log("chatWith[data.receiver]: "+chatWith[data.receiver]);
        if (user[data.receiver] != null && chatWith[data.receiver]==data.sender) { // If the receiver is now connected to the socket, send him the message
            user[data.receiver].emit('message', {message: data.text, image: data.image});
            console.log("Receiver: " + data.receiver);
            console.log("No notification needed");
        }else {
            console.log("Calling Notification", data.receiver, data.text);
            if(data.isPhoto == "true"){
                console.log("Handling photo offline");
                msgBuffer[index] = data.image;
                pushbots.send(data, index);
                index = index + 1;
            }else{
                pushbots.send(data, null);
            }
        }

    })
    socket.on('retrievePhoto', function(data){
        console.log(data.receiver + " retrieving photo");
        user[data.receiver].emit('message', {image: msgBuffer[data.index]});
        msgBuffer[data.index] = null;
    })

    socket.on('offline', function (data) { // When the user is not connected to the socket, set his socket to null
        user[data.username] = null;
        chatWith[data.username] = null;
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