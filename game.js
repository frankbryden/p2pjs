var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

function randInt(min, max) {
    let r = Math.floor(Math.random() * (max - min + 1) + min);
    return r;
}

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

function getRandColour(){
  return 'rgb(' + randInt(0, 255) + ',' + randInt(0, 255) + ',' + randInt(0, 255) + ')';
}

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('click', event => {
  
});

addEventListener("keydown", event => {
  switch(event.key.toLowerCase()){
    case "w":
      ball.move(0, -1);
      break;
    case "s":
      ball.move(0, 1);
      break;
    case "a":
      ball.move(-1, 0);
      break;
    case "d":
      ball.move(1, 0);
      break;
  }
});

addEventListener("keyup", event => {
  switch(event.key.toLowerCase()){
    case "w":
      ball.stopY();
      break;
    case "s":
      ball.stopY();
      break;
    case "a":
      ball.stopX();
      break;
    case "d":
      ball.stopX();
      break;
  }
});

addEventListener('resize', function(event){
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
});


function Ball(x, y, radius, colour){
  this.update = function(){
    this.x += this.velX * 3;
    this.y += this.velY * 3;
  };
  
  this.move = function(deltaX, deltaY){
    this.velX = deltaX ? deltaX : this.velX;
    this.velY = deltaY ? deltaY : this.velY;
  };
  
  this.stopX = function(){
    this.velX = 0;
  };
  
  this.stopY = function(){
    this.velY = 0;
  };
  
  this.getX = function(){
    return this.x;
  };
  
  this.getY = function(){
    return this.y;
  };
  
  this.draw = function(){
    ctx.beginPath();
    ctx.arc(this.getX(), this.getY(), this.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
  };
  
  
  this.x = x;
  this.y = y;
  this.velX = 0;
  this.velY = 0;
  this.radius = radius;
  this.colour = colour;
  
}

function init(){

}

var count = 0;
var ball = new Ball(150, 100, 20, "rgb(200, 90, 150)");

function animate(){
  //console.log(spawnPoints);
  //count++;
  if (count < 5){
    requestAnimationFrame(animate);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  ball.draw();
  
}

init();
animate();
