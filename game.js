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
});

addEventListener("keyup", event => {
  delete pressed[event.key.toLowerCase()];
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
			console.log("received data of type : " + data.type);
			switch (data.type) {
				case "state":
					let playerIDs = Object.keys(data.data);
					for (var playerID of playerIDs) {
						let playerData = data.data[playerID];
						/* balls[playerID].x = playerData.x;
						balls[playerID].y = playerData.y; */
						balls[playerID].addPosition(playerData.x, playerData.y);
						//serverInterpBall.addPosition(playerData.x, playerData.y + 100);
				  	}
				 	/* if (playerIDs.length > 0) {
						let playerData = data.data[playerIDs[0]];
						serverBall.x = playerData.x;
						serverBall.y = playerData.y;
						serverInterpBall.addPosition(playerData.x, playerData.y + 100);
				  	} */
				  	break;
			  	case "newPlayers":
				  	console.log("New player : ");
					console.log(data.data);
					for (var playerID of data.data.playerIDs){
						balls[playerID] = new Player(playerID, 0, 0, "rgb(100, 50, " + (Math.random() * 255) + ")");
					}
				  	//console.log(data);	
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

function init(){

}

var count = 0;
var balls = {};
var peers = [];
var peer = new Peer();
var server;
var serverBall = new Player("server", 10, 0, "rgb(0, 0, 0)");
var serverInterpBall = new Player("server", 10, 0, "rgb(0, 0, 0)");
var clientBall = new Player("client", 50, 50, "rgb(100, 250, 90)");
var balls = {};


function animate(){
  //console.log(spawnPoints);
  //count++;
  if (count < 5){
    //requestAnimationFrame(animate);
    setTimeout(animate, 1000/tickrate);
    //setTimeout(animate, 1000);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  serverBall.draw(ctx);
  serverInterpBall.draw(ctx);
  clientBall.draw(ctx);
  for (var playerID of Object.keys(balls)){
	  balls[playerID].draw(ctx);
  }
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
});