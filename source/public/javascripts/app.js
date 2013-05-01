(function(){
	window.Application = can.Construct({
	
		Models: {}, 
		Controllers: {}, 
		boot: function(data){
			new window.Application.Controllers.GameController('body', data);
		}
		},{
			
		
		});
		
})()