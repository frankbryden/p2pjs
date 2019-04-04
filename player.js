class Player {
    constructor(name, x, y, col){
        this.name = name;
        this.x = x;
        this.y = y;
        this.col = col;
        this.speed = 100; //px/s
        this.keys = {"up": false, "down": false, "left": false, "right": false}
        this.positionBuffer = [];
    }

    update(delta){
        if (this.keys == undefined){
            console.error("we have a problem with undefined keys");
            return;
        }
        let vel = this.speed * delta; //if it's been 1/2 sec, only move by half the speed
        if (this.keys["up"]){
            this.y -= vel;
        }

        if (this.keys["down"]){
            this.y += vel;
        }

        if (this.keys["left"]){
            this.x -= vel;
        }

        if (this.keys["right"]){
            this.x += vel;
        }

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    serialise(){
        return {x : this.x, y : this.y};
    }

    updateState(state){
        this.keys = state;
    }

    //Client side position buffering and interpolation of position
    addPosition(x, y){
        this.positionBuffer.push({x: x, y: y, t: new Date()});
        if(this.positionBuffer.length > 2){
            this.positionBuffer.shift();
        }
    }

    get posInterpolated(){
        if (this.positionBuffer.length == 2){
            let tMax = this.positionBuffer[1].t - this.positionBuffer[0].t;
            let delta = (new Date()) - this.positionBuffer[1].t;
            let xInterpolated = this.interpolate(this.positionBuffer[0].x, this.positionBuffer[1].x, delta/tMax);
            let yInterpolated = this.interpolate(this.positionBuffer[0].y, this.positionBuffer[1].y, delta/tMax);
            return {x: xInterpolated, y: yInterpolated}; 
        } else if (this.positionBuffer.length == 1){
            return {x: this.x, y: this.y};
        } else {
            return {x: 0, y: 0};
        }
    }

    interpolate(p1, p2, t){
        return (1 - t) * p1 + t * p2;
    }

    //Render functions
    draw(ctx){
        let x, y;
        if (this.positionBuffer.length > 0){
            const posObj = this.posInterpolated;
            x = posObj.x;
            y = posObj.y;
        } else {
            x = this.x;
            y = this.y;
        }

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2*Math.PI, false);
        ctx.fillStyle = this.col;
        ctx.fill();
    }
}