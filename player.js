class Player {
    constructor(name, x, y, col){
        this.name = name;
        this.x = x;
        this.y = y;
        this.col = col;
        this.speed = 1;
        this.keys = {"up": false, "down": false, "left": false, "right": false}
    }

    update(){
        if (this.keys == undefined){
            console.error("we have a problem with undefined keys");
            return;
        }
        if (this.keys["up"]){
            this.y -= this.speed;
        }

        if (this.keys["down"]){
            this.y += this.speed;
        }

        if (this.keys["left"]){
            this.x -= this.speed;
        }

        if (this.keys["right"]){
            this.x += this.speed;
        }
    }

    serialise(){
        return {x : this.x, y : this.y};
    }

    updateState(state){
        this.keys = state;
    }
}