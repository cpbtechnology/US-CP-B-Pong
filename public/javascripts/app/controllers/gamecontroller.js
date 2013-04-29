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
			self.socket.emit("addPlayer", function(){
				console.log('Add Player Controller');
				
			});
			self.socket.on('playerInitialize', function(){ 
			
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
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
					self.element.html(Templates["pages/partial.mobileroom.jade"]); 
				}	
				else {		
					self.element.html(Templates["pages/partial.room.jade"]);
					//self.element.html(Templates["pages/partial.mobileroom.jade"]); 
				}
				if(!self.socket){
					self.socket = io.connect(window.location.origin); // points to root of current domain name url
				}
				else{
					self.socket.socket.connect();					
				}
				self.socket.emit('join', {room:room._id, roomName:room.title});  

				console.log('joined room: '+ room.title);
			});
			
			
	    }
	
	});
	window.Application.Controllers.GameController = GameController;
})(window.Application.Models.Room, window.Application.Templates);