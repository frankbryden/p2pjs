class Server {
    constructor(){
        this.peer = new Peer();
        this.setupServer();
        this.peers = [];
        this.init();
    }

    init(){
        this.peer.on("connection", (dataConnection) => {
            log("New connection");
            this.setupConnection(dataConnection);
        });
    }

    setupConnection(dataConnection){
        this.peers.push(dataConnection);
        dataConnection.on("open", () => {
            dataConnection.on("data", (data) => {
                log(data);
            });
        });
    }

    setupServer(){
        this.peer.on("open", (id) => {
            log("Server listening with id " + id);
        });
    }
}
