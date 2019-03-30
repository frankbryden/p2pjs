var tickRate = 32;

log("Setting up server...");

class World {
	constructor(){
		this.players = {};
		this.server = new Server();
		this.server.setOnNewPlayer((playerID) => {
			this.newPlayer(playerID);
		});
		this.server.setOnPlayerUpdate((state) => {
			this.playerUpdate(state);
		});
	}

	newPlayer(playerID){
		log("new player in world !");
		console.log(this.players);
		this.players[playerID] = new Player(playerID, Math.round(Math.random() * 200), Math.round(Math.random() * 200), "rgb(100, 200, 100)");
	}

	tick(){
		for (var playerID of Object.keys(this.players)){
			this.players[playerID].update();
		}
		if (this.players != {}){
			let keys = Object.keys(this.players);
			if (keys.length > 0){
				showX(this.players[Object.keys(this.players)].x);
			}
		}
		//console.log(this.players);
	}

	playerUpdate(state){
		//log("Player update : ");
		//log(state);
		this.players[state.playerID].updateState(state.keys);
	}
}

let world = new World();
tick();
function tick(){
	world.tick();
	setTimeout(tick, 1000/tickRate);
}