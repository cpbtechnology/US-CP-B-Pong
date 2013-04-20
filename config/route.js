var PagesController = require('../controllers/pagescontroller')
	,RoomController = require('../controllers/roomcontroller')
	;

route = function(app, user){
	
	app.get('/', PagesController.index);
	app.get('/gameroom', PagesController.gameroom);
		
	app.get('/rooms', RoomController.index);
	app.get('/rooms/:id', RoomController.show);
	app.post('/rooms', RoomController.create);
	app.put('/rooms/:id', RoomController.update);
	app.delete('/rooms/:id', RoomController.delete);
		
}

module.exports = route;
