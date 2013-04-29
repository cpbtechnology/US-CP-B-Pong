	var mobile = mobile || {};

	//centralize app settings
	mobile.config = {
		'server': {
			'url': 'http://localhost:3000'
		}
	};
	var socket = io.connect(window.location);

	var player;
	$('#player1').click(function(){
		player = 'player1';
	})
	$('#player2').click(function(){
		player = 'player2';
	})
		
	var mobile = 'mobile';
	
	var beta;
	var paddlePos = 215;
	var self = this;
	window.ondevicemotion = function(event) {
		beta = Math.round(event.accelerationIncludingGravity.y*100)/100;
		
		
		if (beta > .6){
			paddlePos = paddlePos+(beta*beta);
	
		}
		if (beta < -.3){
			paddlePos = paddlePos-(-beta*(-beta));
	
		}
		if (paddlePos <= 0){
			paddlePos = 0;
			
		}
		if (paddlePos >= 400){
			paddlePos = 400;
			
		}
		$('#power').html( '   Beta =  ' + beta);
	if(player = 'player1'){
		socket.emit('paddleLocation', {paddle1Pos: paddlePos});
	}
	if(player = 'player2'){
		socket.emit('paddleLocation', {paddle2Pos: paddlePos});
	}
	
		
	}

	
		

