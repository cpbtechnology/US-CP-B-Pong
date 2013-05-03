	var mobile = mobile || {};

	//centralize app settings
	mobile.config = {
		'server': {
			'url': 'http://localhost:3000'
		}
	};
	var socket = io.connect(window.location);

	socket.emit('mobilePlayer', {players: 'players'});
	socket.on('PlayerCount', function(data){
		var MobilePlayer = 0;

	$('#player1').click(function(){
		MobilePlayer = 1;
		$('#player').html( 'Player =  ' + MobilePlayer );
		$('#mobileContent').hide();
		this.startPaddle();
		alert('made it');
	})
	$('#player2').click(function(){
		MobilePlayer = 2;
		$('#player').html( 'Player =  ' + MobilePlayer );
		$('#mobileContent').hide();
		startPaddle();
	})
	/*
	
		//if (data.MobilePlayer == 1){
			$('#player').html( 'Player =  ' + data.MobilePlayer );
			$('#mobileContent').hide();
			$('#player1').addClass('connected');
			startPaddle();
				
		//}
		if (data.MobilePlayer == 2) {
			$('#player').html( 'Player =  ' + data.MobilePlayer );
			$('#mobileContent').hide();
			$('#player2').addClass('connected');
			startPaddle();	
		}
*/
	});
	
	var beta;
	var paddlePos = 400;
	var self = this;
	startPaddle = function(){
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
			if (paddlePos >= 355){
				paddlePos = 355;
				
			}
			socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer: MobilePlayer});
			

		}
	}

	
		

