	var mobile = mobile || {};

	//centralize app settings
	mobile.config = {
		'server': {
			'url': 'http://localhost:3000'
		}
	};
	var socket = io.connect(window.location);
	
	socket.on('clients', function(data){
		if(data.clients.player1 == 'closed'){
			$('#player1').html('<p>connected</p>');
		}
		if(data.clients.player1 == 'open'){
			$('#player1').html('<p>Join as Player 1</p>');
		}
		if(data.clients.player2 == 'closed'){
			$('#player2').html('<p>connected</p>');
		}
		if(data.clients.player2 == 'open'){
			$('#player2').html('<p>Join as Player 2</p>');
		}
	})
	
	$('#player1').click(function(){
		socket.emit('player1');
		MobilePlayer = 1;	
		$('#player').html( 'Player =  ' + MobilePlayer );
		startPaddle();
	})
	$('#player2').click(function(){
		socket.emit('player2');
		MobilePlayer = 2;
		$('#player').html( 'Player =  ' + MobilePlayer );
		startPaddle();
	})


	
	var beta;
	var paddlePos = 165;
	var self = this;
	var idleSeconds = 30;
	startPaddle = function(){ 
		$('#mobileContent').hide();
		socket.emit('paddleLocation', {paddlePos: paddlePos});
		
		window.addEventListener('touchmove', function(event){					
			resetTimer();
			event.preventDefault();
    		var touch = event.touches[0];
    		paddlePos = (touch.pageY / $(window).height() * 355);
    		$('#paddlePosition').html(paddlePos);
    		socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer:MobilePlayer});
	
		}, false);
	
		var idleTimer;
		function resetTimer(){
			clearTimeout(idleTimer)
			idleTimer = setTimeout(whenUserIdle, idleSeconds*1000);
		};
		function whenUserIdle(){ // Remove user from game if not active	
			socket.emit('leave', {MobilePlayer:MobilePlayer})
			location.reload();
		};




	}

	
		

