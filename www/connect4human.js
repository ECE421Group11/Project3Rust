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
    document.getElementById("discs").innerHTML = "(Disc Colors: " + name1 + " - Red and " + name2 + " - Yellow)";
}

function drawBoard(){
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener('click', function (e) {
        wasm.greet();
    });
    
    var context = canvas.getContext('2d');
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create a canvas that we will use as a mask
    context.save();
    context.fillStyle = "black";
    context.beginPath();
    var x, y;
    for (y = 0; y < 6; y++) {
        for (x = 0; x < 7; x++) {
            context.arc(75 * x + 100, 75 * y + 50, 25, 0, 2 * Math.PI);
            context.rect(75 * x + 150, 75 * y, -100, 100);
        }
    }
    context.fill();

    context.restore();
    context.drawImage(maskCanvas, 0, 0);    
}


function startGame(){
    name1 = document.getElementById("textbox1").value;
    name2 = document.getElementById("textbox2").value;
    setText();
    show();
    drawBoard();
}