var express = require('express'),
	app = express();
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/app'));
var secret = 'kittens';

var server = io.on('connection', function (socket) {

	// A new client has come online.
	socket.on('load', function(data){
		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});
	});

	socket.on('data-updated', function(data){
		if(data.key === secret) {
			server.emit('set-data', {
				hash: data.hash
			});
		}
	});

	socket.on('brush:draw', function(data) {
		server.emit('canvas:draw', {
			acceleration: data.acceleration,
			color: data.color
		});
	});

	socket.on('brush:move', function(data) {
		server.emit('canvas:move', {
			acceleration: data.acceleration
		});
	});
});

console.log('Your app is running on http://localhost:' + port);