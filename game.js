var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var scale = 3;
canvas.width = canvas.width * scale;
canvas.height = canvas.height * scale;

//=================== VARIABLES, CONSTANTS AND OBJECTS ====================
let LIFE = 5; 
let SCORE = 0;
const SCORE_UNIT = 1;
let GAME_OVER = false;

let isPaused = true;

let leftArrow = false;
let rightArrow = false;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 20;
const PADDLE_FILL = "#fff";

let paddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: 5
};

const BALL_RADIUS = 8;
const BALL_SPEED = 10;
const BALL_COLOR = "#00c8ff";

let ball = {
    x: canvas.width / 2,
    y: paddle.y-BALL_RADIUS,
    radius: BALL_RADIUS,
    speedX: 0,
    speedY: -BALL_SPEED,
};

//=================== FUNCTIONS ====================

setInterval(draw, 10);

// Function to draw the game over screen
function draw(){
    // Move elements
    movePaddle();

    
    // Cleans the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height)
    // Draw elements
    drawPaddle();
    drawBall();
}

// Function to draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.width,paddle.height);
    ctx.fillStyle=PADDLE_FILL;
    ctx.fill();
    ctx.closePath();
}

// Function to move the paddle
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.speed;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
}

// Function to draw the ball
function drawBall(){
    ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
	ctx.fillStyle=BALL_COLOR;
	ctx.fill();
	ctx.closePath();
}

//=================== EVENT LISTENERS ====================

// Event listener to move the paddle when the left or right arrow is pressed
document.addEventListener("keydown", function (event) {
    const keyCode = event.code;
  if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
      leftArrow = true;
    isPaused = false;
} else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
    rightArrow = true;
    isPaused = false;
}
});

// Event listener to stop the paddle when the left or right arrow is released
document.addEventListener("keyup", function (event) {
    const keyCode = event.code;
    if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
        leftArrow = false;
    } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
        rightArrow = false;
  }
});