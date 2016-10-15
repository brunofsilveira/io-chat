var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 8000);
console.log('Server RODANO na porta', "3000");

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);


	// Disconexão
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	// Mandar mensgem
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
		console.log(data);
	});

	// Novo usuário
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUserNames();
	});

	function updateUserNames(){
		io.sockets.emit('get users', users);
	}



});

