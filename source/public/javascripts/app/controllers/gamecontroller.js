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
		"route": function(data, room){
			var self=this;
		    
		      RoomModel.findAll({}, function(rooms){ //.findAll is an ajax call to the back end
		        self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms})); //renders html partial.rooms.jade
		      });
	
		},
		 ":room_id route": function(data, room) {
		    var self = this; // Self points to controller
		    
		    RoomModel.findOne({id: data.room_id}, function(room){
				var aryQueryString = self.getQueryString();
								
				self.room = room;	
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || aryQueryString.mobile == "true") {
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
	    },
	    getQueryString: function(){
	    	// This function is anonymous, is executed immediately and 
			// the return value is assigned to QueryString!
			var query_string = {};
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
				  query_string[pair[0]] = pair[1];
					// If second entry with this name
				} else if (typeof query_string[pair[0]] === "string") {
				  var arr = [ query_string[pair[0]], pair[1] ];
				  query_string[pair[0]] = arr;
					// If third or later entry with this name
				} else {
				  query_string[pair[0]].push(pair[1]);
				}
			} 
			return query_string;
	    }
	
	});
	window.Application.Controllers.GameController = GameController;
})(window.Application.Models.Room, window.Application.Templates);