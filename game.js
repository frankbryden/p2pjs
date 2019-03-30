var ctx;
var canvas;
var pressed={};
var tickrate = 32;
//AZERTY mapping
var keyMapping = {"z": "up",
                  "s": "down",
                  "q": "left",
                  "d": "right"
}

//QWERTY mapping
/*var keyMapping = {"w": "up",
                  "s": "down",
                  "a": "left",
                  "d": "right"
}*/

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
  pressed[event.key.toLowerCase()] = true;
  switch(event.key.toLowerCase()){
    case "z":
      ball.move(0, -1);
      break;
    case "s":
      ball.move(0, 1);
      break;
    case "q":
      ball.move(-1, 0);
      break;
    case "d":
      ball.move(1, 0);
      break;
  }
});

addEventListener("keyup", event => {
  delete pressed[event.key.toLowerCase()];
  switch(event.key.toLowerCase()){
    case "z":
      ball.stopY(-1);
      break;
    case "s":
      ball.stopY(1);
      break;
    case "q":
      ball.stopX(-1);
      break;
    case "d":
      ball.stopX(1);
      break;
  }
});

addEventListener('resize', function(event){
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
});

function getState(){
  let state = {};
  for (var k of Object.keys(pressed)){
    state[keyMapping[k]] = true;
  }
  return state;
}

function Ball(x, y, radius, colour){
  this.update = function(){
    this.x += this.velX * 1;
    this.y += this.velY * 1;
    if (this.velX != 0 || this.velY != 0){
      //send update to peers as ball has moved
      sendData();
    }
  };
  
  this.move = function(deltaX, deltaY){
    this.velX = deltaX ? deltaX : this.velX;
    this.velY = deltaY ? deltaY : this.velY;
  };
  
  this.stopX = function(dir){
    if (dir == this.velX){
      this.velX = 0;
    }
  };
  
  this.stopY = function(dir){
    if (dir == this.velY){
      this.velY = 0;
    }
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

  this.getObj = function(){
    return {x: this.x, y : this.y, radius : this.radius, colour : this.colour}
  }
  
  
  this.x = x;
  this.y = y;
  this.velX = 0;
  this.velY = 0;
  this.radius = radius;
  this.colour = colour;
  
}

function drawPeerBall(ball){
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI, false);
  ctx.fillStyle = ball.colour;
  ctx.fill();
}

//Peer-related functions
function connect(roomID){
  var dataConnection = peer.connect(roomID);
  connectToServer(dataConnection);
}

function connectToServer(dataConnection){
  server = dataConnection;
  dataConnection.on("open", () => {
    console.log("ready to receive data");
    dataConnection.on("data", data => {
      console.log(data);
      let keys = Object.keys(data);
      if (keys.length > 0){
        let playerData = data[keys[0]];
        serverBall.x = playerData.x;
        serverBall.y = playerData.y;
      }
      
      
    });
  });

  dataConnection.on("close", () => {
    console.log("lost connection to server with id " + dataConnection.id);
    peers.splice(peers.indexOf(dataConnection), 1);
  });
  startTransmission();
}

function startTransmission(){
  transmitState();
}

function transmitState(){
  let state = getState();
  server.send(state);
  setTimeout(transmitState, 1000/tickrate);
}

function sendData(){
  for (var k of Object.keys(peers)){
    peers[k].send({type: "ball", ball : ball.getObj()});
  }
}

function sendPeers(){
  for (var k of Object.keys(peers)){
    var peersToSend = {};
    for (var j of Object.keys(peers)){
      if (j != k){
        peersToSend[j] = peers[j];
        console.log("Need to send " + j + " to " + k + " as it is a different peer");
      } else {
        console.log("Not sending peer " + j + " to " + k + " as it is himself");
      }
    }
    peers[k].send({type: "peers", peers : peersToSend});
  }
}

function init(){

}

var count = 0;
var ball = new Ball(150, 100, 20, "rgb(200, 90, 150)");
var balls = {};
var peers = [];
var peer = new Peer();
var server;
var serverBall = new Ball(0, 0, 10, "rgb(0, 0, 0)");


function animate(){
  //console.log(spawnPoints);
  //count++;
  if (count < 5){
    requestAnimationFrame(animate);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  ball.draw();
  for (var ballID of Object.keys(balls)){
    drawPeerBall(balls[ballID]);
  }
  serverBall.draw();
  
}



document.addEventListener('DOMContentLoaded', function() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext('2d');
  var roomIDInput = document.getElementById("roomIDInput");
  var connectBtn = document.getElementById("joinBtn");
  connectBtn.addEventListener("click", ev => {
    let roomID = roomIDInput.value;
    console.log("connecting to " + roomID);
    //connect("p2pYavor");
    connect(roomID);
  });


  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
  init();
  animate();

  peer.on("error", err => {
    console.log(err);
    peer = new Peer();
  })

  /* peer.on('open', id => {
      console.log("connected");
      roomIDLbl.innerHTML = id;
  }); */
});