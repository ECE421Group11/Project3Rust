import * as wasm from "Project3Rust";

// wasm.greet();

var name1 = ""


hide();
document.getElementById("startbutton").addEventListener("click", startGame);

function hide(){
    document.getElementById("names").style.display = "none";
    document.getElementById("gameboard").style.display = "none";
}

function show(){
    document.getElementById("names").style.display = "block";
    document.getElementById("gameboard").style.display = "block";
}

function setText(){
    document.getElementById("newGameNames").innerHTML = "New Game: " + name1 + " Vs Computer";
    document.getElementById("discs").innerHTML = "(Disc Colors: " + name1 + " - <b>Red</b> and Computer - <b>Yellow</b>)";
}

function startGame(){
    name1 = document.getElementById("textbox1").value;
    setText();
    show();
}