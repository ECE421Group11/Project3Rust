import * as wasm from "Project3Rust";

// wasm.greet();

var name1 = ""


hide();
range_changed();
document.getElementById("startbutton").addEventListener("click", startGame);
document.getElementById("drange").addEventListener("change", range_changed);

function range_changed(){
    var diff = parseInt(document.getElementById("drange").value,10);
    if (diff == 1){
        document.getElementById("difficulty").innerHTML = "Easy"
    }
    if (diff == 2){
        document.getElementById("difficulty").innerHTML = "Normal"
    }
    if (diff == 3){
        document.getElementById("difficulty").innerHTML = "Hard"
    }
}


function hide(){
    document.getElementById("names").style.display = "none";
    document.getElementById("gameboard").style.display = "none";
    document.getElementById("changediff").style.display = "none";
}

function show(){
    document.getElementById("names").style.display = "block";
    document.getElementById("gameboard").style.display = "block";
    document.getElementById("drange").style.display = "none";
    document.getElementById("changediff").style.display = "block";
}

function setText(){
    document.getElementById("newGameNames").innerHTML = "New Game: " + name1 + " Vs Computer";
    document.getElementById("winningcombo").innerHTML = "(Winning Combination: " + name1 + " - <b>TOOT</b> and Computer - <b>OTTO</b>)";
}

function startGame(){
    name1 = document.getElementById("textbox1").value;
    setText();
    show();
}