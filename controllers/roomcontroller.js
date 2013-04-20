var RoomModel = require('../models/roommodel.js')
	;



var RoomController = {
	
		index: function(req, res){
			RoomModel.find({}, function(err, rooms){
				if (err) return res.json(500, {error:'internal'});
				res.json(200, rooms);
			});
		},
		
		show: function(req, res){
			RoomModel.findById(req.params.id, function(err, room){
				console.log(room);
				if (err) return res.json(500, {error:'internal'});
				res.json(200, room);
			});
			
		},
		
		create: function(req, res){
			RoomModel.create(req.body, function(err, room){ //req.body represents all the data that came through post
				res.json(201, room);
			}); 

		},
		
		update: function(req, res){
			
		},
		
		delete: function(req, res){
			
		}

		
}

module.exports = RoomController;