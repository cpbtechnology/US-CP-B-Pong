	//make a namespace
	var app = app || {};
	//centralize app settings
	app.config = {
		'server': {
			'url': window.location.origin
		},
		'speed': 2, //controls the speed of the ball
		'paddle_inc': 3, //how many pixels paddle can move in either direction
		'pause': false,
		'gameOver': 2,
		'playersReady': false,
		'paddleHeight': 20,
		'ballInPlay': false
	};
	
	var socket = io.connect(app.config.server.url);
	//setup dat-gui for visually modifying app settings
	app.gui = new dat.GUI();
	app.gui.vars = {};
	app.gui.vars.paddle_inc = app.gui.add(app.config, 'paddle_inc');
	app.gui.vars.speed = app.gui.add(app.config, 'speed', {
		'Slow': 2,
		'Normal': 4,
		'Fast': 16
	});
	
	app.gui.vars.speed.onChange(function(value) {
		//do something when dat-gui updates the app setting value
		init();
	});

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))) {
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
	
	// Generate an unique ID
	var id = Math.round($.now() * Math.random());

	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};

	playarea_canvas = $('#paper');
	playarea = playarea_canvas[0].getContext('2d');
		
	p1_scr = $('#p1_scr');
	p2_scr = $('#p2_scr');

	speed = app.config.speed; //controls the speed of the ball
	paddle_inc = app.config.paddle_inc; //how many pixels paddle can move in either direction
	pause = app.config.pause;

	player_1 = 0;
	player_2 = 1;

	player_1_scr = 0; //player scores
	player_2_scr = 0;
	player_1_direction = null;
	player_2_direction = null;
	
	pa = new Array();
	divider = new Array();
	paddle_1 = new Array();
	paddle_2 = new Array();
	ball = new Array();
	paddle_1['height'] = 120;
	paddle_2['height'] = 120;
	ball_direction = 0;
	
	function sleep(numberMillis) {
		var now = new Date();
		var exitTime = now.getTime() + numberMillis;
		while(true) {
			now = new Date();
			if(now.getTime() > exitTime) return;
		}
	}
	
	function init() {
		pa['width'] = 900;
		pa['height'] = 400;
		pa['player_margin'] = 15; //area behind player paddles
		pa['foreground'] = "#ec008c";
		pa['background'] = "#000000";
		pa['ball'] = "#fff22d";
		img = new Image();
		img.src = '../images/pong-bg.jpg';
		
		playarea.drawImage(img,0,0);
		
		divider['pos'] = pa['width'] / 2;
		divider['width'] = 4;

		paddle_1['width'] = 8;
		
		paddle_1['x'] = pa['player_margin'];
		paddle1Pos = (pa['height'] / 2) - (paddle_1['height'] / 2);

		paddle_2['width'] = 8;
		
		paddle_2['x'] = (pa['width'] - pa['player_margin'] - paddle_2['width']);
		paddle2Pos = (pa['height'] / 2) - (paddle_2['height'] / 2);
		
	}
	
	var renderBall = function(){
		app.config.ballInPlay = true;
		ball['width'] = 20;
		ball['height'] = 20;
		ball['x'] = (pa['width'] / 2) - (ball['width'] / 2);
		ball['y'] = (pa['height'] / 2) - (ball['height'] / 2);
		
		function ballDirection(){
			ball_direction = Math.random() * 360;
			if ( ball_direction > 120 && ball_direction < 60 || ball_direction > 240 && ball_direction < 300 ){
				ballDirection() //run again
			}	
		}
		
		ballDirection()
		speed = app.config.speed;
		
	}
	
	
	var paddle2Pos, paddle1Pos;
	
	var renderPlayarea = function () {	
		
		playarea.beginPath();
		playarea.clearRect(0, 0, pa.width, pa.height);
		playarea.fillStyle = pa['background'];
		playarea.strokeStyle = pa['foreground'];
		playarea.fillRect(0, 0, pa['width'], pa['height']);
		playarea.drawImage(img,0, 0);
		
		if(paddle1Pos <= 10){		//make sure paddles don't go beyond play area
			paddle1Pos = 10
		} 
		if(paddle1Pos >= (pa['height'] - paddle_1['height'])){
			paddle1Pos = (pa['height'] - paddle_1['height']);
		} 
		
		if(paddle2Pos <= 10){		//make sure paddles don't go beyond play area
			paddle2Pos = 10
		} 
		if(paddle2Pos >= (pa['height'] - paddle_2['height'])){
			paddle2Pos = (pa['height'] - paddle_2['height']);
		} 
		playarea.rect(paddle_1.x, paddle1Pos, paddle_1.width, paddle_1.height);	
		playarea.rect(paddle_2.x, paddle2Pos, paddle_2.width, paddle_2.height);
		playarea.fillStyle = pa['foreground'];
		playarea.fill();
		
		//move ball
		if(app.config.ballInPlay){	
			playarea.rect(ball['x'], ball['y'], ball['width'], ball['height']);
			ball['x'] = ball['x'] + Math.cos((ball_direction) * Math.PI / 180) * speed;
			ball['y'] = ball['y'] + Math.sin((ball_direction) * Math.PI / 180) * speed;
		}

		//app.config.ballInPlay 
		playarea.fillStyle = pa['ball'];
		playarea.fill();
		//redraw divider
		playarea.lineWidth = divider['width'];
		playarea.lineTo(divider['pos'], 0);
		playarea.lineTo(divider['pos'], pa['height'] = 467);
		playarea.lineWidth = 1;
		

		playarea.closePath();
		
	};
	
	var testCollisions = function() {
			//check to see if ball went beyond paddles, and if so, score accordingly and reset playarea
			if(ball['x'] <= 0) {
				if (app.config.playersReady == true){
					setScore(player_2);
					
					renderBall();
				}
				sleep(500);
			}
			if(ball['x'] >= (pa['width'] - ball['width'])) {
				if (app.config.playersReady == true){
					setScore(player_1);
					renderBall();
				}
				sleep(500);
			}

			//check to see if ball hit top or bottom wall. if so, change direction
			if((ball['y'] >= (pa['height'] - ball['height'])) || ball['y'] <= 8) {
				ball_direction = -ball_direction;
			}

			//check to see if the ball hit a paddle, and if so, change ball angle dependant on where it hit the paddle
			if((ball['x'] <= (paddle_1['x'] + paddle_1['width'])) && (ball['y'] >= paddle1Pos) && (ball['y'] <= (paddle1Pos + paddle_1['height']))) {
				ball_direction = -ball_direction / 2;
				speed += .5;
			}
			
			if(((ball['x'] + ball['width']) >= paddle_2['x']) && (ball['y'] >= paddle2Pos) && (ball['y'] <= (paddle2Pos + paddle_2['height']))){
				ball_direction = (180 + ball_direction) / 2;
				speed += .5;
			}
	}
	
	
	var setScore = function(p) {
			app.config.ballInPlay = false;
			if(p == player_1) {
				player_1_scr++;
			}
			if(p == player_2) {
				player_2_scr++;
			}
			if(player_2_scr >= app.config.gameOver || player_1_scr >= app.config.gameOver){
				console.log('player wins');
				playerWins();
			}
			else{
				updateScore(p);
				
			}
			
			
	};
	var updateScore = function(p){
			console.log(p);
			if(p == 0) {
				$('#p1_scr').fadeOut('slow', function(){
					$('#p1_scr').html(player_1_scr);
					$('#p1_scr').fadeIn();	
				});
			}
			if(p == 1) {
				$('#p2_scr').fadeOut('slow', function(){
					$('#p2_scr').html(player_2_scr);
					$('#p2_scr').fadeIn();
				});
			}	
	};
	var playerWins = function(){
		console.log('player win function');
		$('#winner').html('Player1 Wins!');
		if (player_1_scr == app.config.gameOver){
			$('#winner').html('Player1 Wins!');
		}
		if (player_2_scr == app.config.gameOver){
			$('#winner').html('Player2 Wins!');
		}
		$('#winner').fadeIn('slow', function(){
			console.log('finishgame');
			finishGame = setInterval(endGame, 5000)
			//clearInterval(finishGame)
			console.log('finish finish');
		})
	}
	var endGame = function(){
		console.log('game end');
		socket.emit('newGame');
		
		//$('#winner').fadeOut()
		player_1_scr = 0
		$('#p1_scr').html(player_1_scr);
		player_2_scr = 0
		$('#p2_scr').html(player_2_scr);
		
		$('#instructions').fadeIn()
	};
	var newGame = function(){
		var timer;
		$('#instructions').fadeOut( function(){
			$('#instructions').hide();
			timer = setInterval(function() { handleTimer(count); }, 1000);
		});
		
	
		console.log('new game');
		$('#countdown').show();
		var count = 3;
		handleTimer = function() {
		  if(count === 0) {
		    clearInterval(timer);
		    endCountdown();
		  } else {
		    $('#countdown').html(count);
		    count--;
		  }
		}
		function endCountdown() {
		  app.config.ballInPlay = true;
		  $('#countdown').fadeOut('slow',function(){
			  renderBall();
		  });
		  
		}
	
		player_1_scr = 0
		$('#p1_scr').html(player_1_scr);
		player_2_scr = 0
		$('#p2_scr').html(player_2_scr);
		
		paddle_2['height'] =  120;
		paddle_1['height'] =  120;
		
	}
	var main = function() {
		self.renderPlayarea();
    }

	var self = this;
	var isMoving1 = false;
	var isMoving2 = false;
	var paddle1Direction = 0;
	var paddle2Direction = 0;

	// Player1 moving function
	startPaddle1 = function(){
		if(!isMoving1){
			paddle1Speed = setInterval(movePaddle1, 10)
		}
	}
	 movePaddle1 = function() {
		isMoving1 = true;
		console.log('player1 moving' + paddle1Pos);
		paddle1Pos =  paddle1Pos + paddle1Direction
	}
	stopPaddle1 = function(){
		isMoving1 = false;
		clearInterval(paddle1Speed);
	}
	
	
	// Player2 Moving function
	startPaddle2 = function(){
		if(!isMoving2){
			paddle2Speed = setInterval(movePaddle2, 10)
		}
	}
	movePaddle2 = function() {
		isMoving2 = true;
		console.log('player2 moving'+ paddle2Pos);
		paddle2Pos =  paddle2Pos + paddle2Direction
	}
	stopPaddle2 = function(){
		isMoving2 = false;
		clearInterval(paddle2Speed); 
	}
		
	socket.on('sendPaddledata', function(data){
		currentPlayer = data.data.MobilePlayer;
		
		if (currentPlayer == 1){
			
			if(data.data.paddlePos == 'up'){
				paddle1Direction= + 4;
			}
			if(data.data.paddlePos == 'down'){
				paddle1Direction = -4;
			}	
			if(data.data.paddlePos == 'stop'){
				stopPaddle1()
			}
			if(data.data.paddlePos == 'start'){
				startPaddle1()
			}
			
		}
		if (currentPlayer == 2){		
			
			if(data.data.paddlePos == 'up'){
				paddle2Direction= + 3;
			}
			if(data.data.paddlePos == 'down'){
				paddle2Direction = -3
			}
			if(data.data.paddlePos == 'stop'){
				stopPaddle2()
			}
			if(data.data.paddlePos == 'start'){
				startPaddle2()
			}		
		}
	});
	setInterval(sendPaddleData, 10);
	function sendPaddleData(){
		this.renderPlayarea(paddle2Pos, paddle1Pos);
		this.testCollisions(paddle2Pos, paddle1Pos);
	};

	socket.on('clients', function(data){ // Logic to say which players are connected on game
		if(data.clients.player1.position == 'closed'){ 
			$('#player1').addClass('connected');
			init();
		}
		if(data.clients.player2.position  == 'closed'){
			$('#player2').addClass('connected');
			init();
		}
		if(data.clients.player1.position  == 'open'){
			$('#player1').removeClass('connected');
			//paddle1Pos = (pa['height'] / 2) - (paddle_1['height'] / 2);	
		}
		if(data.clients.player2.position  == 'open'){
			$('#player2').removeClass('connected');
			//paddle2Pos = (pa['height'] / 2) - (paddle_2['height'] / 2);
		}
		if(data.clients.player1.position  == 'open' || data.clients.player2.position == 'open' ){
			$('#instructions').show();
		}
		if(data.clients.player1.position  == 'closed' && data.clients.player2.position  == 'closed' ){

			newGame();
			app.config.playersReady = true;
			
		}
	})
	
	
init();
	
	
	
	
	
	
    

