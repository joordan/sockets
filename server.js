var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

// listen to events
io.on('connection', function  (socket) {
	console.log('User connected via socket.io!');

	//emit message
	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);

		// io.emit - for everyone including self
		message.timestamp = moment().valueOf();
		io.emit('message', message);
		//socket.broadcast.emit('message', message); // for everyone but not self
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started!')
});

