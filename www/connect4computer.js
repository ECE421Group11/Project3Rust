import * as wasm from "Project3Rust";

// wasm.greet();

var name1 = ""
var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext('2d');
var map = [];
var paused = false;
var won = false;
var rejectClick = false;
var move = 0;
var aiHistory = [];

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
    document.getElementById("discs").innerHTML = "(Disc Colors: " + name1 + " - <b>Red</b> and Computer - <b>Yellow</b>)";
}

function startGame(){
    name1 = document.getElementById("textbox1").value.trim();
    if (name1 == ""){
        document.getElementById("textbox1").value = ""
        alert("Your name cannot be empty");
    }
    else{
        setText();
        show();
        drawBoard();
    }
}

function drawBoard(){
    //var canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener('click', function (e) {
        onclick(canvas, e);
    });
    init();
}