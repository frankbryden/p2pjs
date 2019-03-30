var txtArea;

function log(txt){
    console.log(txt);
    if (txtArea){
        txtArea.value += txt + "\n";
    } else {
        console.log("txt area still not ready");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    txtArea = document.getElementById("statusTxt");
    console.log("hey");
    console.log(txtArea);
});