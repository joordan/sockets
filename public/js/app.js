var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

//update h1
jQuery('.room-title').text(room);


//when someone connects io succesuuyl request to join room
socket.on('connect', function () {
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');


	console.log('new message');
	console.log(message.text);

	$message.append('<p><strong>'+ message.name + ' ' + momentTimestamp.local().format('h:mm:ss a') +'</strong></p>');
	$message.append('<p>'+ message.text + '</p>');
	$messages.append($message);
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault(); // prevent form refreshing on submit

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');

});