	var mobile = mobile || {};

	//centralize app settings
	mobile.config = {
		'server': {
			'url': 'http://localhost:3000'
		}
	};
	var socket = io.connect(window.location);
	
	socket.on('getPlayers', function(data){
		if(data.MobilePlayer ==1){
			$('#player1').html('<p>connected</p>');
			$('#player2').show();
		}
		if(data.MobilePlayer ==2){
			$('#player1').html('<p>connected</p>');
			$('#player2').html('<p>connected</p>');
		}
		
	})
	
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
	var idleSeconds = 45;
	startPaddle = function(){ 
		//socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer:MobilePlayer});
		
		window.ondevicemotion = function(event) {
			//resetTimer();
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
			socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer:MobilePlayer});
		}
		
		window.addEventListener('touchmove', function(event){					
			resetTimer();
			event.preventDefault();
    		var touch = event.touches[0];
    		paddlePos = (touch.pageY / $(window).height() * 355);
    		$('#paddlePosition').html(paddlePos);
    		//$('#paddlePosition').html(touch.pageX + " - " + touch.pageY + " Height - " + $(window).height());
    		socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer:MobilePlayer});
	
		}, false);
		var idleTimer;
		function resetTimer(){
			clearTimeout(idleTimer)
			idleTimer = setTimeout(whenUserIdle, idleSeconds*1000);
		};
		function whenUserIdle(){ // Remove user from game if not active
			socket.emit('leave')
		};


	}

	
		

