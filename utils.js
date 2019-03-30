var txtArea;
var playerX;

function log(txt){
    console.log(txt);
    if (txtArea){
        txtArea.value += txt + "\n";
    } else {
        console.log("txt area still not ready");
    }
}

function showX(data){
    playerX.innerText = data;
}

document.addEventListener('DOMContentLoaded', function() {
    txtArea = document.getElementById("statusTxt");
    playerX = document.getElementById("playerX");
    console.log("hey");
    console.log(txtArea);
    console.log(playerX);
});