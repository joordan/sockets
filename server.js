var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	})

}

// listen to events
io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	// socket idsconnect
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	// join room event
	socket.on('joinRoom', function(request) {
		clientInfo[socket.id] = request;
		socket.join(request.room);
		socket.broadcast.to(request.room).emit('message', {
			name: 'System',
			text: request.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});


	//emit message
	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);


		if (message.text === '@currentUsers') {
				sendCurrentUsers(socket);
			} else {
				// io.emit - for everyone including self
				message.timestamp = moment().valueOf();
				io.to(clientInfo[socket.id].room).emit('message', message); //only emit to same room
				//socket.broadcast.emit('message', message); // for everyone but not self

			}

	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server started!')
});