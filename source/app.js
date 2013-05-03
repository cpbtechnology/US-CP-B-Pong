
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./config/route')
  , http = require('http')
  , path = require('path')
  , app = express()
  , mongoose =  require('mongoose')
  , mongoStore = require('connect-mongo')(express)
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, '/public')));
  
  app.locals.title ="NodePong";
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/nodePong');
});


route(app)

var server = http.createServer(app)
var io = require('socket.io').listen(server);
var RoomModel = require('./models/roommodel');

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var MobilePlayer = 0;

io.sockets.on('connection', function(socket){
	socket.emit('connected', {message: 'Connected to NodePong!', from: "System"});
	socket.on('mobilePlayer', function(data){
		console.log('mobileplayer');
		socket.emit('PlayerCount',{data: data});
		socket.set('playerType','mobile'); 
		   	
	});	
	
	socket.on('join', function (data, ball) {
	    RoomModel.findById(data.room, 'title', function(err, room){
	    	if(!err && data.room){
		    	socket.join(room._id);
		    	console.log('joined');
		    }	 			    
			var users = io.sockets.clients(room._id).length; // count users in room
			for (var socketId in io.sockets.sockets) {   
			    io.sockets.sockets[socketId].get('playerType', function(err, playerType) {
			       //MobilePlayer = io.sockets.clients(socketId).length; // Count mobile users 
			    });
			}
		    var whichPlayer = data.MobilePlayer;
			socket.on('paddleLocation', function(data){
				socket.broadcast.emit('sendPaddledata', { playerPaddle: whichPlayer, data:data});
			});	

		}); // End RoomModel
	}); // End  Join
	
	
	io.sockets.on('disconnect', function () { 
		socket.get('playerType', function (err, playerType) {
			// disconnect users
	    });
	});
	
	
}); // End Connection

