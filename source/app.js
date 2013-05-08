
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

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

	
var clients = {
	'player1': 'open',
	'player2': 'open'
}
var MobilePlayer;

io.sockets.on('connection', function(socket){
	socket.emit('connected', {message: 'Connected to NodePong!', from: "System"});
	
	
	socket.on('player1', function(){
		clients.player1 = 'closed';
	})
	socket.on('player2', function(){
		clients.player2 = 'closed';
	})
	
	countUsers = function(){
		console.log(clients)
		socket.broadcast.emit('clients', {clients: clients})
	}
	
	setInterval(countUsers, 1000);
	
	
	socket.on('paddleLocation', function(data, MobilePlayer){
		socket.broadcast.emit('sendPaddledata', {data:data});
	});	
	socket.on('join', function (data, ball) {
	    RoomModel.findById(data.room, 'title', function(err, room){
	    	if(!err && data.room){
		    	socket.join(room._id);
		    	console.log('joined'); 	
		    }		
		}); // End RoomModel
	}); // End  Join
	
	socket.on('leave', function (data, MobilePlayer) { 
		socket.disconnect();
		if (data.MobilePlayer == 1){
			clients.player1 = 'open';
		}
		if (data.MobilePlayer == 2){		
			clients.player2 = 'open';
		}

	});
	socket.on('disconnect', function (data, MobilePlayer) { 
		/*
socket.disconnect();
		if (data.MobilePlayer == 1){
			clients.player1 = 'open';
		}
		if (data.MobilePlayer == 2){		
			clients.player2 = 'open';
		}
*/
	});
	
	
}); // End Connection

