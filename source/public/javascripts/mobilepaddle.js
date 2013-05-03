	var mobile = mobile || {};

	//centralize app settings
	mobile.config = {
		'server': {
			'url': 'http://localhost:3000'
		}
	};
	var socket = io.connect(window.location);

	var MobilePlayer = 0;
	
	$('#player1').click(function(){
		MobilePlayer = 1;
		$('#player').html( 'Player =  ' + MobilePlayer );
		$('#mobileContent').hide();
		startPaddle();
	})
	$('#player2').click(function(){
		MobilePlayer = 2;
		$('#player').html( 'Player =  ' + MobilePlayer );
		$('#mobileContent').hide();
		startPaddle();
	})
		

	
	var beta;
	var paddlePos = 400;
	var self = this;
	startPaddle = function(){ 
		// Uses the phone acceleramater 
		/*
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
		*/

		window.addEventListener('touchmove', function(event){
			event.preventDefault();
    		var touch = event.touches[0];
    		var paddlePos = (touch.pageY / $(window).height() * 355);
    		$('#paddlePosition').html(paddlePos);
    		//$('#paddlePosition').html(touch.pageX + " - " + touch.pageY + " Height - " + $(window).height());
    		socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer: MobilePlayer});
    		


		}, false);
	}

	
		

