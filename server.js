var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

// listen to events
io.on('connection', function  (socket) {
	console.log('User connected via socket.io!');

	//emit message
	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);

		// io.emit - for everyone including self
		socket.broadcast.emit('message', message); // for everyone but not self
	});

	socket.emit('message', {
		text: 'Welcome to chat application!'
	});
});

http.listen(PORT, function () {
	console.log('Server started!')
});

