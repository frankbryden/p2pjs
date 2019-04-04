class Server {
    constructor(){
        this.peer = new Peer();
        this.setupServer();
        this.peers = {};
        this.init();
    }

    setOnNewPlayer(newPlayerCallback){
        this.onNewPlayer = newPlayerCallback;
    }

    setOnPlayerUpdate(onPlayerUpdateCallback){
        this.onPlayerUpdate = onPlayerUpdateCallback;
    }

    init(){
        this.peer.on("connection", (dataConnection) => {
            log("New connection");
            this.setupConnection(dataConnection);
        });
    }

    setupConnection(dataConnection){
        this.peers[dataConnection.id] = dataConnection;
        log(dataConnection.id);
        if (this.onNewPlayer){
            this.onNewPlayer(dataConnection.id);
        }
        dataConnection.on("open", () => {
            dataConnection.on("data", (data) => {
                if (this.onPlayerUpdate){
                    this.onPlayerUpdate({"playerID" : dataConnection.id, keys : data});
                }
            });
        });
    }

    send(playerID, data, type){
        if (this.peers[playerID].open){
            this.peers[playerID].send({data : data, type: type});
        } else {
            this.peers[playerID].on("open", () => {
                this.peers[playerID].send({data : data, type: type});
            });
        }
        
    }

    setupServer(){
        this.peer.on("open", (id) => {
            log("Server listening with id " + id);
        });
    }
}
