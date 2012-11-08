
var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	static = require('node-static');
	
var fileServer = new static.Server('./');
app.listen(8080);

function handler (request, response) {
	request.addListener('end', function () {
        fileServer.serve(request, response);
    });
}

var buffer = []

io.sockets.on('connection', function (socket) { 
	socket.on('connect', function (data) {
		//socket.broadcast.emit('renderPlayarea', renderPlayerarea());
		
		var howmanyconnected = io.sockets.clients().length;
		console.log("Connect Socket === " + socket.id);
		console.log("How Many Connected === " + howmanyconnected);
	});
	
	socket.broadcast.emit('init', function (data) {
	
	});
	socket.broadcast.emit('get_players', function (data) {

	});
	socket.broadcast.emit('render_Player_area', function (data) {
		
	});
	socket.emit('run_game', function (data) {
		
	});


});



 
