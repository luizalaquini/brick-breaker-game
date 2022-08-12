let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let scale = 3;
canvas.width = canvas.width * scale;
canvas.height = canvas.height * scale;

//=================== GAME VARIABLES, CONSTANTS AND OBJECTS ====================

let LIFE = 3; 
let SCORE = 0;
const SCORE_UNIT = 1;
let GAME_OVER = false;

let isPaused = true;

let leftArrow = false;
let rightArrow = false;

// Paddle configs
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 12;
const PADDLE_FILL = '#fff';
const PADDLE_STROKE_WIDTH = 2.0;
const PADDLE_STROKE = "#807d7a";
const PADDLE_SPEED = 5;

let paddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: PADDLE_SPEED
};

// Ball configs
const BALL_RADIUS = 8;
const BALL_SPEED = 4;
const BALL_COLOR = "#7db9d2";
const BALL_STROKE = "#5193af";
const BALL_STROKE_WIDTH = 1.5;

let ball = {
  x: canvas.width / 2,
  y: paddle.y-BALL_RADIUS-1,
  radius: BALL_RADIUS,
  moving: false,
  speedX: 0,
  speedY: -BALL_SPEED,
};

//Brick configs

const BRICK_HEIGHT = 20;
const BRICK_WIDTH = 75;
const BRICK_DISTANCE_X = 5;
const BRICK_DISTANCE_Y = 15;

const NORMAL_BRICK_FILL = "#fed900";
const NORMAL_BRICK_STROKE = "#847101";
const MID_STRONG_BRICK_FILL = "#80097e"
const MID_STRONG_BRICK_STROKE = "#3c003b";
const STRONG_BRICK_FILL = "#00439f";
const STRONG_BRICK_STROKE = "#001351";

const BRICK_STROKE_WIDTH = 2.5;

let brick = {
  x: 0,
  y: 0,
  height: BRICK_HEIGHT,
  width: BRICK_WIDTH,
  lifes: 0, // 0 - 3 - Mudando a cor do bloco
}

let bricks = [];


//==================== LEVELS =====================

const level1 = 
[[1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1],
];

const level2 = 
[[1, 1, 1, 3, 3, 1, 1, 1],
 [2, 2, 1, 1, 1, 1, 2, 2],
 [2, 2, 3, 3, 3, 3, 2, 2],
];


//=================== FUNCTIONS ====================

setBricksByLevel(2);
setInterval(draw, 10);

// Function to draw the game over screen
function draw(){
  //Update states
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  
  // Move elements
  movePaddle();
  moveBall()
  
  // Cleans the canvas
  ctx.clearRect(0,0,canvas.width,canvas.height)
  // Draw elements
  drawPaddle();
  drawBall();
  drawBricks();
}

// Function to draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x,paddle.y,paddle.width,paddle.height);
  ctx.fillStyle=PADDLE_FILL;
  ctx.fill();
  ctx.lineWidth = PADDLE_STROKE_WIDTH;
  ctx.strokeStyle=PADDLE_STROKE;
  ctx.stroke();
  ctx.closePath();
}

// Function to draw the ball
function drawBall(){
  ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
	ctx.fillStyle=BALL_COLOR;
  ctx.strokeStyle=BALL_STROKE;
  ctx.lineWidth=BALL_STROKE_WIDTH;
	ctx.fill();
  ctx.stroke();
	ctx.closePath();
}

// Function to draw the bricks 
function drawBricks(){
  bricks.forEach((thisbrick)=>{
    switch(thisbrick.lifes){
      case 1: 
        ctx.fillStyle = NORMAL_BRICK_FILL;
        ctx.strokeStyle = NORMAL_BRICK_STROKE;
        break;
      case 2: 
        ctx.fillStyle = MID_STRONG_BRICK_FILL;
        ctx.strokeStyle = MID_STRONG_BRICK_STROKE;
        break;
      case 3: 
        ctx.fillStyle = STRONG_BRICK_FILL;
        ctx.strokeStyle = STRONG_BRICK_STROKE;
        break;
    }
    
    ctx.beginPath();
    ctx.rect(thisbrick.x,thisbrick.y,thisbrick.width,thisbrick.height);
    ctx.fill();
    ctx.lineWidth = BRICK_STROKE_WIDTH;
    ctx.stroke();
    ctx.closePath();
  })
}

// Function to move the paddle
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.speed;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
}

// Function to move the ball. Must be called after "movepaddle"
function moveBall() {
  if(ball.moving){
    ball.x += ball.speedX;
    ball.y += ball.speedY;
  } else { ball.x = paddle.x + paddle.width / 2; }
}

// Function that treats when the ball hits the wall
function ballWallCollision() {
  //Se colidir com o teto
  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ball.speedX = -ball.speedX;
  }
  //Se colidir com as paredes
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.width) {
    ball.speedY = -ball.speedY;
  }

  if (ball.y + ball.radius >= canvas.height) {
    loseLife();
  }
}

// Function that treats when the ball hits the paddle
function ballPaddleCollision() {
  if (ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width && ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height) {
    // ball.x - paddle.x
    // 0 - 150°
    // PADDLE_WIDTH - 20°
    let angle = 150 - (ball.x - paddle.x) * 130 / PADDLE_WIDTH;
    ball.speedX = BALL_SPEED * Math.cos(angle*Math.PI/180);
    ball.speedY = -BALL_SPEED * Math.sin(angle*Math.PI/180);
    
    //console.log(angle);
    //ball.speedY = -ball.speedY;
    //ball.speedX = (ball.x - (paddle.x + paddle.width / 2)) * 0.35;
  }
}

// Function that treats when the ball hits the bricks
function ballBrickCollision() {
  bricks.forEach((thisbrick)=>{
    if (ball.x + ball.radius >= thisbrick.x && ball.x - ball.radius <= thisbrick.x + thisbrick.width && ball.y + ball.radius >= thisbrick.y && ball.y - ball.radius <= thisbrick.y + thisbrick.height) {
      ball.speedY = -ball.speedY;
      thisbrick.lifes--;
      if (thisbrick.lifes == 0) {
        bricks.splice(bricks.indexOf(thisbrick), 1);
      }
    }
  });
}

// Function that treats when the player loses a life
function loseLife(){
  LIFE--; // Lose Life
  resetBall();
}

// Function that resets the ball when the player loses a life
function resetBall() {
  isPaused = true;
  ball.x = canvas.width / 2 - BALL_RADIUS / 2;
  ball.y = paddle.y - BALL_RADIUS - 1;
  ball.moving = false;
  ball.speedX = 0;
  ball.speedY = -BALL_SPEED;
}

// Function to set the bricks by level 
function setBricksByLevel(level){
  let positions;
  switch(level){
    case 1:
      positions = level1;
      break;
    case 2:
      positions = level2;
      break;
    default:
      positions = level1;
      break;
  }

  for(let row=0; row<positions.length; row++){
    for(let column=0; column<positions[row].length; column++){
      //Cria um novo bloco
      let newBrick = Object.assign({}, brick);
      newBrick.x = column * (BRICK_WIDTH+(canvas.width-BRICK_WIDTH*positions[row].length)/(positions[row].length+1)) 
                    + (canvas.width-BRICK_WIDTH*positions[row].length)/(positions[row].length+1);
      newBrick.y = row * (BRICK_HEIGHT + BRICK_DISTANCE_Y) + BRICK_DISTANCE_Y;
      newBrick.lifes = positions[row][column];
      //Adiciona ele na lista bricks
      bricks.push(newBrick);   
    }    
  }
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
  } else if (keyCode === "Space") {
    ball.moving = true;
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