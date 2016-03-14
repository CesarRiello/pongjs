var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
var background = '#000000';
var foreground = '#FFFFFF';
var paddleSize = {width: 100, height: 20};
var ballSpeed = 3;
var ballSiza = 8;
var score = {player:0, computer:0};

canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;

  var top_x = this.x - ballSiza;
  var top_y = this.y - ballSiza;
  var bottom_x = this.x + ballSiza;
  var bottom_y = this.y + ballSiza;

  if(this.x - ballSiza < 0) { // hitting the left wall
    this.x = ballSiza;
    this.x_speed = -this.x_speed;
  } else if(this.x + ballSiza > width) { // hitting the right wall
    this.x = width - ballSiza;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > height) { // a point was scored
  	if (this.y < 0) {
  		score.player++;
  	} else {
  		score.computer++;
  	}
  	console.log(score);
    this.x_speed = 0;
    this.y_speed = ballSpeed;
    this.x = width/2;
    this.y = height/2;
  }

  if(top_y > height/2) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -ballSpeed;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = ballSpeed;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = foreground;
  context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > width) { // all the way to the right
    this.x = width - this.width;
    this.x_speed = 0;
  }
}

function Player() {
	var x = ((width/2) - (paddleSize.width/2));
	var y = height - paddleSize.height * 2;
   	this.paddle = new Paddle(x, y, paddleSize.width, paddleSize.height);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-ballSpeed, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(ballSpeed, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

function Computer() {
	var x = ((width/2) - (paddleSize.width/2));
	var y = paddleSize.height;
  	this.paddle = new Paddle(x, y, paddleSize.width, paddleSize.height);
}

Computer.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.update = function(ball) {
	var ballSpeed = 1
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -ballSpeed) { // max speed left
    diff = -ballSpeed;
  } else if(diff > 0 && diff > ballSpeed) { // max speed right
    diff = ballSpeed;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > height) {
    this.paddle.x = height - this.paddle.width;
  }
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = ballSpeed;
  this.radius = ballSiza;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = foreground;
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(width/2, height/2);

var render = function() {
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

var step = function() {
  update();
  render();
  animate(step);
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};