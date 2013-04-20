

var PagesController = {
	
	index: function(req, res){
		res.render('pages/home');
		
	},
	
	list: function(req, res){
		res.render('/users');
		
	},
	gameroom: function(req, res){
		res.render('./gameroom');
	}
	
	
}


module.exports = PagesController;