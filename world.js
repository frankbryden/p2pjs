var tickRate = 1;

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
		this.lastTick = new Date();
	}

	newPlayer(playerID){
		log("new player in world !");
		console.log(this.players);
		this.players[playerID] = new Player(playerID, Math.round(Math.random() * 200), Math.round(Math.random() * 200), "rgb(100, 200, 100)");
	}

	get worldState(){
		let state = {};
		for (var playerID of Object.keys(this.players)){
			state[playerID] = this.players[playerID].serialise();
		}
		return state;
	}

	tick(){
		let delta = (new Date()) - this.lastTick;
		//console.log("last update was " + delta + " ms ago");
		//update server state
		for (var playerID of Object.keys(this.players)){
			this.players[playerID].update(delta/1000);
		}
		if (this.players != {}){
			let keys = Object.keys(this.players);
			if (keys.length > 0){
				showX(this.players[keys[0]].x);
			}
		}
		//console.log(this.players);
		//send updated server state to players
		let state = this.worldState;
		for (var playerID of Object.keys(this.players)){
			this.server.send(playerID, state);
		}
		this.lastTick = new Date();
	}

	playerUpdate(state){
		//log("Player update : ");
		//log(state);
		console.log("player update");
		this.players[state.playerID].updateState(state.keys);
	}
}

let world = new World();
tick();
function tick(){
	world.tick();
	setTimeout(tick, 1000/tickRate);
}