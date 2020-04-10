import * as wasm from "Project3Rust";

// wasm.greet();

var name1 = ""
var name2 = ""


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
    document.getElementById("newGameNames").innerHTML = "New Game: " + name1 + " Vs " + name2;
    document.getElementById("winningcombo").innerHTML = "(Winning Combination: " + name1 + " - <b>TOOT</b> and " + name2 + " - <b>OTTO</b>)";
}

function startGame(){
    name1 = document.getElementById("textbox1").value;
    name2 = document.getElementById("textbox2").value;
    setText();
    show();
}