$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var url = 'http://localhost:8080';
	var socket = io.connect(url);
	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
	
	// Generate an unique ID
	var id = Math.round($.now()*Math.random());
	
	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};

	var socket = io.connect(url);

socket.on('connect', function(obj){
	socket.emit('connect');
});

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

speed = 2;			//controls the speed of the ball
paddle_inc = 30;	//how many pixels paddle can move in either direction
pause = false;
var playerId = 0;
playerId = 2;
player_1 = 0;
player_2 = 1;

socket.on('get_players', function(data){
var get_players = function(){
	$('#User1').click(function(){
		playerId = 0;
		console.log(playerId);
		$('#instructions').hide();
	
	});
	$('#User2').click(function(){
		player_2 = 1;
		$('#instructions').hide();
		console.log(playerId);	
	});
}

});


player_1_scr = 0;	//player scores
player_2_scr = 0;
player_1_direction = null;	
player_2_direction = null;

pa = new Array();
divider = new Array();
paddle_1 = new Array();
paddle_2 = new Array();
ball = new Array();


function sleep(numberMillis) 
{
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime)
			return;
	}
}

var init = function() {
	pa['width'] = 960;
	pa['height'] = 600;
	pa['player_margin'] = 30;		//area behind player paddles
	pa['foreground'] = "#EC008C";
	pa['background'] = "#FFF22D";
	
	divider['pos'] = pa['width']/2;
	divider['width'] = 4;
	
	paddle_1['width'] = 18;
	paddle_1['height'] = 192;
	paddle_1['x'] = pa['player_margin'];
	paddle_1['y'] = (pa['height'] /2 ) - (paddle_1['height'] / 2);
	
	paddle_2['width'] = 18;
	paddle_2['height'] = 192;
	paddle_2['x'] = (pa['width'] - pa['player_margin'] - paddle_2['width']);
	paddle_2['y'] = (pa['height'] /2 ) - (paddle_2['height'] / 2);
	
	ball['width'] = 30;
	ball['height'] = 30;
	ball['x'] = (pa['width']/2) - (ball['width'] / 2);
	ball['y'] = (pa['height']/2) - (ball['height'] / 2);
	
	ball_direction = Math.random() * 360;	//initialize ball direction, which is determined by angle, at random
	speed = 2;
}
socket.on('renderPlayarea', function(data){
var renderPlayarea = function() {
	playarea.beginPath();
	
	playarea.clearRect(0,0,pa['width'],pa['height']);
	playarea.fillStyle = pa['background'];
	playarea.strokeStyle = pa['foreground'];
	playarea.fillRect(0,0, pa['width'], pa['height']);
	
	
	//move paddles
	if(player_1_direction != null)
	{
		if(player_1_direction == up)
			paddle_1['y'] = paddle_1['y'] - paddle_inc;
		else
			paddle_1['y'] = paddle_1['y'] + paddle_inc;
	}
	if(player_2_direction != null)
	{
		if(player_2_direction == up)
			paddle_2['y'] = paddle_2['y'] - paddle_inc;
		else
			paddle_2['y'] = paddle_2['y'] + paddle_inc;
	}
	playarea.rect(paddle_1['x'],paddle_1['y'],paddle_1['width'],paddle_1['height']);
	playarea.rect(paddle_2['x'],paddle_2['y'],paddle_2['width'],paddle_2['height']);
	
	//move ball
	playarea.rect(ball['x'], ball['y'], ball['width'], ball['height']);
	ball['x'] = ball['x'] + Math.cos((ball_direction)*Math.PI/180) * speed;
	ball['y'] = ball['y'] + Math.sin((ball_direction)*Math.PI/180) * speed;
	
	
	playarea.fillStyle = pa['foreground'];
	playarea.fill();
	
	//redraw divider
	playarea.lineWidth = divider['width'];
	playarea.lineTo(divider['pos'], 0);
	playarea.lineTo(divider['pos'], pa['height'] = 600);
	playarea.lineWidth = 1;
	playarea.closePath();
}

});


var testCollisions = function() {
	//make sure paddles don't go beyond play area
	if(((paddle_1['y'] <= 0) &&	(player_1_direction == up)) || ((paddle_1['y'] >= (pa['height'] - paddle_1['height'])) && (player_1_direction == down)))
		player_1_direction = null;
	if(((paddle_2['y'] <= 0) &&	(player_2_direction == up)) || ((paddle_2['y'] >= (pa['height'] - paddle_2['height'])) && (player_2_direction == down)))
		player_2_direction = null;
		
	//check to see if ball went beyond paddles, and if so, score accordingly and reset playarea
	if(ball['x'] <= 0)
	{
		setScore(player_2);
		init()
		sleep(1000);
	}
	if(ball['x'] >= (pa['width'] - ball['width']))
	{
		setScore(player_1);
		init();
		sleep(1000);
	}
	
	//check to see if ball hit top or bottom wall. if so, change direction
	if((ball['y'] >= (pa['height'] - ball['height'])) || ball['y'] <= 0)
		ball_direction = -ball_direction;
	
	//check to see if the ball hit a paddle, and if so, change ball angle dependant on where it hit the paddle
	if((ball['x'] <= (paddle_1['x'] + paddle_1['width'])) && (ball['y'] >= paddle_1['y']) && (ball['y'] <= (paddle_1['y'] + paddle_1['height']))) 
	{
		ball_direction = -ball_direction/2;
		speed += .5;
	}
	if(((ball['x'] + ball['width']) >= paddle_2['x']) && (ball['y'] >= paddle_2['y']) && (ball['y'] <= (paddle_2['y'] + paddle_2['height'])))
	{
		ball_direction = (180+ball_direction)/2;
		speed += .5;
	}
}

var setScore = function (p)
{
	if(p == player_1)
	{
		player_1_scr++;
		p1_scr.firstChild.nodeValue = player_1_scr;
	}
	if(p == player_2)
	{
		player_2_scr++;
		p2_scr.firstChild.nodeValue = player_2_scr;
	}
}


//handle input
document.onkeydown = function(ev)
{
	switch(ev.keyCode)
	{
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

document.onkeyup = function(ev)
{
	switch(ev.keyCode)
	{
		case key_W:
		case key_S:
			player_1_direction = null;
			break;
		case key_up:
		case key_down:
			player_2_direction = null;
			break;
		case key_pause:
			if(pause == false)
			{
				clearInterval(game);
				status_msg.style.visibility = "visible";
				pause = true;
			}
			else
			{
				game = setInterval(main, 25);
				status_msg.style.visibility = "hidden";
				pause = false;
			}
			break;
	}
}

socket.emit('run_game', function(data){
	var main = function(){
		testCollisions();
		renderPlayarea();
	}
	init();
	game = setInterval(main, 25);

});

	
});