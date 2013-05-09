	//make a namespace
	var app = app || {};
	console.log('app read');
	//centralize app settings
	app.config = {
		'server': {
			'url': window.location.origin
		},
		'speed': 2, //controls the speed of the ball
		'paddle_inc': 30, //how many pixels paddle can move in either direction
		'pause': false,
		'gameOver': 5,
		'playersReady': false
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

	//var socket = io.connect(app.config.server.url);

	playarea_canvas = $('#paper');
	playarea = playarea_canvas[0].getContext('2d');
	
	
	p1_scr = document.getElementById('p1_scr');
	p2_scr = document.getElementById('p2_scr');
	
	
	status_msg = document.getElementById('status');
	debug = document.getElementById('debug');

	up = -1;
	down = 1;

	//key codes
	key_up = 38;
	key_down = 40;
	key_W = 87;
	key_S = 83;
	key_pause = 32;

	speed = app.config.speed; //controls the speed of the ball
	paddle_inc = app.config.paddle_inc; //how many pixels paddle can move in either direction
	pause = app.config.pause;
	var playerId = 0;
	playerId = 2;
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
		pa['foreground'] = "#ffffff";
		pa['background'] = "#3193a5";
		img = new Image();
		img.src = '../images/pong-bg.jpg';
		
		playarea.drawImage(img,0,0);
		
		divider['pos'] = pa['width'] / 2;
		divider['width'] = 4;

		paddle_1['width'] = 8;
		paddle_1['height'] = 120;
		paddle_1['x'] = pa['player_margin'];
		paddle_1['y'] = (pa['height'] / 2) - (paddle_1['height'] / 2);

		paddle_2['width'] = 8;
		paddle_2['height'] = 120;
		paddle_2['x'] = (pa['width'] - pa['player_margin'] - paddle_2['width']);
		paddle_2['y'] = (pa['height'] / 2) - (paddle_2['height'] / 2);

		ball['width'] = 20;
		ball['height'] = 20;
		ball['x'] = (pa['width'] / 2) - (ball['width'] / 2);
		ball['y'] = (pa['height'] / 2) - (ball['height'] / 2);
		
		function ballDirection(){
			ball_direction = Math.random() * 360;
			if ( ball_direction > 110 && ball_direction < 70 || ball_direction > 250 && ball_direction < 290 ){
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
		
		//move paddles
		if(player_1_direction != null) {
			if(player_1_direction == up) paddle_1['y'] = paddle_1['y'] - paddle_inc;
			else paddle_1['y'] = paddle_1['y'] + paddle_inc;
		}
		if(player_2_direction != null) {
			if(player_2_direction == up) paddle_2['y'] = paddle_2['y'] - paddle_inc;
			else paddle_2['y'] = paddle_2['y'] + paddle_inc;
		}

		playarea.rect(paddle_1.x, paddle1Pos, paddle_1.width, paddle_1.height);	
		playarea.rect(paddle_2.x, paddle2Pos, paddle_2.width, paddle_2.height);
		
		
		//move ball
		playarea.rect(ball['x'], ball['y'], ball['width'], ball['height']);
		ball['x'] = ball['x'] + Math.cos((ball_direction) * Math.PI / 180) * speed;
		ball['y'] = ball['y'] + Math.sin((ball_direction) * Math.PI / 180) * speed;


		playarea.fillStyle = pa['foreground'];
		playarea.fill();

		//redraw divider
		playarea.lineWidth = divider['width'];
		playarea.lineTo(divider['pos'], 0);
		playarea.lineTo(divider['pos'], pa['height'] = 467);
		playarea.lineWidth = 1;
		playarea.closePath();
	
		
	};
	
	var testCollisions = function() {

		//make sure paddles don't go beyond play area
			if(((paddle1Pos <= 0) && (player_1_direction == up)) || ((paddle1Pos >= (pa['height'] - paddle_1['height'])) && (player_1_direction == down))) player_1_direction = null;
			if(((paddle2Pos <= 0) && (player_2_direction == up)) || ((paddle2Pos >= (pa['height'] - paddle_2['height'])) && (player_2_direction == down))) player_2_direction = null;

			//check to see if ball went beyond paddles, and if so, score accordingly and reset playarea
			if(ball['x'] <= 0) {
				if (app.config.playersReady == true){
					setScore(player_2);
				}
				init()
				sleep(1000);
			}
			if(ball['x'] >= (pa['width'] - ball['width'])) {
				if (app.config.playersReady == true){
					setScore(player_1);
				}
				init();
				sleep(1000);
			}

			//check to see if ball hit top or bottom wall. if so, change direction
			if((ball['y'] >= (pa['height'] - ball['height'])) || ball['y'] <= 8) {
					ball_direction = -ball_direction;
					var audioElement = document.createElement('audio');
				audioElement.setAttribute('src', 'http://www.sounddogs.com/sound-effects/2219/mp3/413585_SOUNDDOGS__sp.mp3');
				audioElement.play();
				}

			//check to see if the ball hit a paddle, and if so, change ball angle dependant on where it hit the paddle
			if((ball['x'] <= (paddle_1['x'] + paddle_1['width'])) && (ball['y'] >= paddle1Pos) && (ball['y'] <= (paddle1Pos + paddle_1['height']))) {
				ball_direction = -ball_direction / 2;
				speed += .5;
				var audioElement = document.createElement('audio');
				audioElement.setAttribute('src', 'http://www.sounddogs.com/sound-effects/2219/mp3/413585_SOUNDDOGS__sp.mp3');
				audioElement.play();
				
			}
			
			if(((ball['x'] + ball['width']) >= paddle_2['x']) && (ball['y'] >= paddle2Pos) && (ball['y'] <= (paddle2Pos + paddle_2['height']))) {
				ball_direction = (180 + ball_direction) / 2;
				speed += .5;
				var audioElement = document.createElement('audio');
				audioElement.setAttribute('src', 'http://www.sounddogs.com/sound-effects/2219/mp3/413585_SOUNDDOGS__sp.mp3');
				audioElement.play();
			}
	}
	
	
	
	var setScore = function(p) {
			if(p == player_1) {
				player_1_scr++;
				$('#p1_scr').html(player_1_scr);
			}
			if(p == player_2) {
				player_2_scr++;
				$('#p2_scr').html(player_2_scr);
			}
			if(player_2_scr === app.config.gameOver || player_1_scr == app.config.gameOver){
				console.log('game over');
				socket.emit('newGame');
				console.log(currentPlayer);
				playerWins();
			}
		}
	var playerWins = function(){
		player_1_scr = 0
		$('#p1_scr').html(player_1_scr);
		player_2_scr = 0
		$('#p2_scr').html(player_2_scr);
	
		if (player_1_scr == app.config.gameOver){
			$('#congrats').html('Player1 Wins!');
		}
		if (player_2_scr == app.config.gameOver){
			$('#congrats').html('Player2 Wins!');
		}
		
		$('#winner').animate({
		    opacity: 0.25,
		    left: '+=50',
		    height: 'toggle'
		  }, 5000, function() {
		    // Animation complete.
		  });
		
	}
	//handle input
	document.onkeydown = function(ev) {
		switch(ev.keyCode) {
		case key_W:
			player_1_direction = up;
			break;
		case key_S:
			player_1_direction = down;
			break;
		case key_up:
			player_2_direction = up;
			break;
		case key_down:
			player_2_direction = down;
			break;
		}
	}

	document.onkeyup = function(ev) {
		switch(ev.keyCode) {
		case key_W:
		case key_S:
			player_1_direction = null;
			break;
		case key_up:
		case key_down:
			player_2_direction = null;
			break;
		case key_pause:
			if(pause == false) {
				clearInterval(game);
				status_msg.style.visibility = "visible";
				pause = true;
			} else {
				game = setInterval(main, 25);
				status_msg.style.visibility = "hidden";
				pause = false;
			}
			break;
		}
	}


	var main = function() {
		self.renderPlayarea();
    }

    var self = this;

	socket.on('sendPaddledata', function(data){
		currentPlayer = data.data.MobilePlayer;
		if (data.data.MobilePlayer == 1){
			paddle1Pos = data.data.paddlePos;
		}
		if (data.data.MobilePlayer == 2){		
			paddle2Pos = data.data.paddlePos;
		}
		
	});
	setInterval(sendPaddleData, 10);
	function sendPaddleData(){
		this.renderPlayarea(paddle2Pos, paddle1Pos);
		this.testCollisions(paddle2Pos, paddle1Pos);
	};

	socket.on('clients', function(data){ // Logic to say which players are connected on game
		if(data.clients.player1 == 'closed'){ 
			$('#player1').addClass('connected');
		}
		if(data.clients.player2 == 'closed'){
			$('#player2').addClass('connected');
		}
		if(data.clients.player1 == 'open'){
			$('#player1').removeClass('connected');
			paddle1Pos = -1000;
		}
		if(data.clients.player2 == 'open'){
			$('#player2').removeClass('connected');
			paddle2Pos = -1000;
		}
		if(data.clients.player1 == 'open' || data.clients.player2 == 'open' ){
			$('#instructions').show();
		}
		if(data.clients.player1 == 'closed' && data.clients.player2 == 'closed' ){
			$('#instructions').hide();
			app.config.playersReady = true;
			
			
		}
		
	})
	
	
		init();
	
	
	
	
	
	
    

