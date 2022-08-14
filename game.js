let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let scale = 3;
canvas.width = canvas.width * scale;
canvas.height = canvas.height * scale;

//=================== GAME VARIABLES, CONSTANTS AND OBJECTS ====================

let LIFES = 5; 
let CURRENT_LEVEL = 1;
let MAX_LEVEL = 6;

const GAME_SONG = new Audio();
GAME_SONG.src = "./assets/audio/gameOn.mp3";

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
const BRICK_OFFSET_Y = 10;
const BRICK_DISTANCE_X = 5;
const BRICK_DISTANCE_Y = 15;

const NORMAL_BRICK_FILL = "#fed900";
const NORMAL_BRICK_STROKE = "#847101";
const MID_STRONG_BRICK_FILL = "#80097e"
const MID_STRONG_BRICK_STROKE = "#3c003b";
const STRONG_BRICK_FILL = "#00439f";
const STRONG_BRICK_STROKE = "#001351";
const SUPER_STRONG_BRICK_FILL = "#f78501";
const SUPER_STRONG_BRICK_STROKE = "#a75501";

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
[ [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

const level2 =
[ [2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

const level3 = 
[ [3, 3, 3, 3, 3, 3, 3, 3],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

const level4 = 
[ [3, 3, 3, 3, 3, 3, 3, 3],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

const level5 =
[ [3, 1, 1, 3, 3, 1, 1, 3],
  [2, 3, 3, 2, 2, 3, 3, 2],
  [2, 3, 3, 2, 2, 3, 3, 2],
  [3, 1, 1, 3, 3, 1, 1, 3],
];

const level6 = 
[ [3, 3, 3, 3, 3, 3, 3, 3],
  [1, 1, 4, 4, 4, 4, 1, 1],
  [2, 2, 4, 4, 4, 4, 2, 2],
  [1, 1, 4, 4, 4, 4, 1, 1],
  [3, 3, 3, 3, 3, 3, 3, 3],
];

//=================== FUNCTIONS ====================

setBricksByLevel(CURRENT_LEVEL);
setInterval(draw, 10);

// Function to draw the game over screen
function draw(){
  // Update States
  update();
  // Cleans the canvas
  ctx.clearRect(0,0,canvas.width,canvas.height)
  // Draw elements
  drawPaddle();
  drawBall();
  drawBricks();
  
  showLifesLevel();

  winLevel();
  gameOver();
}

// Function that updates the states of the game
function update(){
  // Verifica colisões
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  
  // Move elements
  movePaddle();
  moveBall()

  //Sounds
  GAME_SONG.play();
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
      case 4: 
        ctx.fillStyle = SUPER_STRONG_BRICK_FILL;
        ctx.strokeStyle = SUPER_STRONG_BRICK_STROKE;
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
  //Se colidir com a parede direita
  if (ball.x + ball.radius >= canvas.width) {
    ball.speedX = -Math.abs(ball.speedX);
  }
  //Se colidir com a parede esquerda
  if (ball.x - ball.radius <= 0){
    ball.speedX = Math.abs(ball.speedX);
  }
  //Se colidir com o teto
  if (ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY;
  }
  // Se colidir com o piso
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
    let angle = 150 - (ball.x - paddle.x) * 120 / PADDLE_WIDTH;
    console.log(angle);
    ball.speedX = BALL_SPEED * Math.cos(angle*Math.PI/180);
    ball.speedY = -BALL_SPEED * Math.sin(angle*Math.PI/180);
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
  LIFES--; // Lose Life
  resetBall();
}

// Function that resets the ball when the player loses a life
function resetBall() {
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
    case 3:
      positions = level3;
      break;
    case 4:
      positions = level4;
      break;
    case 5:
      positions = level5;
      break;
    case 6:
      positions = level6;
      break;
    default:
      positions = [];
      break;
  }

  bricks=[];

  for(let row=0; row<positions.length; row++){
    for(let column=0; column<positions[row].length; column++){
      //Cria um novo bloco
      let newBrick = Object.assign({}, brick);
      newBrick.x = column * (BRICK_WIDTH+(canvas.width-BRICK_WIDTH*positions[row].length)/(positions[row].length+1)) 
                    + (canvas.width-BRICK_WIDTH*positions[row].length)/(positions[row].length+1);
      newBrick.y = row * (BRICK_HEIGHT + BRICK_DISTANCE_Y) + BRICK_DISTANCE_Y + BRICK_OFFSET_Y;
      newBrick.lifes = positions[row][column];
      //Adiciona ele na lista bricks
      bricks.push(newBrick);   
    }    
  }
}

// Function to start another level when the player wins the current level
function winLevel(){
  if (CURRENT_LEVEL > MAX_LEVEL) {
    alert("You Win!");
    resetGame();
  } else if (bricks.length == 0) {
    CURRENT_LEVEL++;
    setBricksByLevel(CURRENT_LEVEL);
    resetBall();
  }
}

// Function to show current number of lifes and current level
function showLifesLevel() {
  ctx.font = '16px Lato';
  ctx.fillStyle = 'white';
  ctx.fillText('Level: '+ CURRENT_LEVEL+'/'+MAX_LEVEL, 8, 16); //position score on the x,y axis of the canvas
  ctx.fillText('Lifes: '+ LIFES, 840, 16); //position score on the x,y axis of the canvas
}

// Function to end game when the player loses all lifes
function gameOver() {
  if (LIFES == 0) {
    alert("Game Over");
    resetGame();
  }
}


function resetGame() {
  LIFES = 5; 
  CURRENT_LEVEL=1;
  setBricksByLevel(CURRENT_LEVEL);
  resetBall();
  leftArrow=false;
  rightArrow=false;
}

//=================== EVENT LISTENERS ====================

// Event listener to move the paddle when the left or right arrow is pressed
document.addEventListener("keydown", function (event) {
  const keyCode = event.code;
  if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
    leftArrow = true;
  } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
    rightArrow = true;
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