(function(RoomModel, Templates){

	var GameController = can.Control({
	
		init: function(element, options){
			var self = this;
			self.socket= io.connect(window.location.origin);
			self.socket.on('connected', function(data, users){
				self.socket.socket.connect();
			});
		
		},
		 "form submit": function (form, event) {      	
	      	event.preventDefault();
	      	var title = $(form).children('input[type="text"]').val();
	      	var Room = new RoomModel({title:title});
	      	Room.save(function (room) {
	      		//can.route.attr({room_id: room._id})
	      		window.location.hash = '#!'+room._id;
	      	});
	      },

		"a click": function(button, event ) {
			
			var self = this;
			if (event.target.id === "Play"){
				event.preventDefault();
				self.isPlayer();
				
			}
			if (event.target.id === "Watch"){
				event.preventDefault();
				self.isViewer();
			}
			
		},
		'isViewer': function(){
			$('#instructions').hide();
			
		},
		'isPlayer': function(){
			$('#instructions').hide();
			var self = this;
			self.socket= io.connect(window.location.origin);
			self.socck
			self.socket.emit("addPlayer", function(){
				console.log('Add Player Controller');
				
			});
			self.socket.on('playerInitialize', function(){ 
				paddle_1['width'] = 18;
				paddle_1['height'] = 192;
				paddle_1['x'] = pa['player_margin'];
				paddle_1['y'] = (pa['height'] / 2) - (paddle_1['height'] / 2);
		
				paddle_2['width'] = 18;
				paddle_2['height'] = 192;
				paddle_2['x'] = (pa['width'] - pa['player_margin'] - paddle_2['width']);
				paddle_2['y'] = (pa['height'] / 2) - (paddle_2['height'] / 2);
			});
			
		},
		"route": function(data, room){
			var self=this;
		      /*
if(self.socket){
		     	self.socket.emit('leave', {room:self.room._id, from:self.options.user.displayName});
		      }
*/
		      RoomModel.findAll({}, function(rooms){ //.findAll is an ajax call to the back end
		        self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms})); //renders html partial.rooms.jade
		      });	
			
		},
		 ":room_id route": function(data, room) {
		    var self = this; // Self points to controller

		    RoomModel.findOne({id: data.room_id}, function(room){
				
				self.room = room;	
				self.element.html(Templates["pages/partial.room.jade"]);
					
				if(!self.socket){
					self.socket = io.connect(window.location.origin); // points to root of current domain name url
				}
				else{
					self.socket.socket.connect();					
				}
				self.socket.emit('join', {room:room._id, roomName:room.title}); 
				
				self.socket.on('Draw', function(){  
					console.log("onDraw from controller");
					console.log("emit.sendDraw from controller");
					self.socket.emit('sendDraw', {room:room._id, ball:ball})
					
					
					
				})
	
				console.log('joined room: '+ room.title);
			});
			
			
	    }
	
	});
	window.Application.Controllers.GameController = GameController;
})(window.Application.Models.Room, window.Application.Templates);