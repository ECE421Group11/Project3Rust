import * as wasm from "Project3Rust";

// wasm.greet();

var name1 = ""
var name2 = ""
var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext('2d');
var map = [];
var dummyMap = [];
var paused = false;
var won = false;
var rejectClick = false;
var move = 0;
var that = this;
var aiHistory =[];

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
    name1 = document.getElementById("textbox1").value.trim();
    name2 = document.getElementById("textbox2").value.trim();
    if (name1 == "" || name2 == ""){
        document.getElementById("textbox1").value = ""
        document.getElementById("textbox2").value = ""
        alert("Names cannot be empty");
    }
    else{
        setText();
        show();
        drawBoard();
    }
}

function drawBoard(){
    canvas.addEventListener('click', function (e) {
        onclick(canvas, e);
    });
    init();
}

function init() {
    //initOnce();
    map = [];
    dummyMap = [];
    paused = false;
    won = false;
    rejectClick = false;
    move = 0;
    aiHistory = [];
    var i, j;
    context.font = "bold 25px serif";
    
    for (i = 0; i <= 6; i++) {
        map[i] = [];
        dummyMap[i] = [];
        for (j = 0; j <= 7; j++) {
            map[i][j] = 0;
            dummyMap[i][j] = 0;
        }
    }
    
    clear();
    drawMask();
    print();
};

function playerMove() {
    if (move % 2 === 0) {
        return 1;
    }
    return -1;
};

function print() {
    var i, j, msg, dummymsg;
    msg = "\n";
    msg += "Move: " + move;
    msg += "\n";
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            msg += " " + map[i][j];
            dummymsg += " " + dummyMap[i][j];
        }
        msg += "\n";
        dummymsg += "\n";
    }
    console.log(msg);
    console.log(dummymsg);
};

function printState(state) {
    var i, j, msg = "\n";
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            msg += " " + state[i][j];
        }
        msg += "\n";
    }
    console.log(msg);
};

function win(player) {
    paused = true;
    won = true;
    rejectClick = false;
    var msg = null;
    if (player > 0) {
        msg = name1 + " wins";
        //$scope.newGame.WinnerName=$scope.newGame.Player1Name;
    } else if (player < 0) {
        msg = name2 + " wins";
        //$scope.newGame.WinnerName=$scope.newGame.Player2Name;
    } else {
        msg = "It's a draw";
        //$scope.newGame.WinnerName='Draw';
    }
    msg += " - Click on game board to reset";
    context.save();
    context.font = '14pt sans-serif';
    context.fillStyle = "#111";
    context.fillText(msg, 150, 20);
    postService.save($scope.newGame, function(){

        console.log("succesfully saved");
    });

    canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener('click', function (e) {
        location.reload();
    });
    //context.restore();
    button.disabled = false;    

    console.info(msg);
};

function fillMap(state, column, value) {
    var tempMap = state.clone();
    if (tempMap[0][column] !== 0 || column < 0 || column > 6) {
        return -1;
    }

    var done = false,
        row = 0,
        i;
    for (i = 0; i < 5; i++) {
        if (tempMap[i + 1][column] !== 0) {
            done = true;
            row = i;
            break;
        }
    }
    if (!done) {
        row = 5;
    }
    tempMap[row][column] = value;
    return tempMap;

};

function action(column, callback) {
    if (paused || won) {
        return 0;
    }
    if (map[0][column] !== 0 || column < 0 || column > 6) {
        return -1;
    }
    
    var done = false;
    var row = 0, i;
    for (i = 0; i < 5; i++) {
        if (map[i + 1][column] !== 0) {
            done = true;
            row = i;
            break;
        }
    }
    
    if (!done) {
        row = 5;
    }
    animate(column, playerMove(move), row, 0, function () {
        map[row][column] = playerMove(move);
        var token = document.getElementsByName('choice');
        if(token[0].checked){
            dummyMap[row][column] = 'T';
        }
        else{
            dummyMap[row][column] = 'O';
        }
        move++;
        draw();
        check();
        print();
        //callback();
    });
    paused = true;
    return 1;
};

function check() {
    var i, j, k;
    var temp_r = 0, temp_b = 0, temp_br = 0, temp_tr = 0;
    var temp_r1 = [], temp_b1 = [], temp_br1 = [], temp_br2 =[];
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            // temp_r = 0;
            // temp_b = 0;
            // temp_br = 0;
            // temp_tr = 0;
            temp_r1[0] = 0; temp_r1[1] = 0; temp_r1[2] = 0; temp_r1[3] = 0;
            temp_b1[0] = 0; temp_b1[1] = 0; temp_b1[2] = 0; temp_b1[3] = 0;
            temp_br1[0] = 0; temp_br1[1] = 0; temp_br1[2] = 0; temp_br1[3] = 0;
            temp_br2[0] = 0; temp_br2[1] = 0; temp_br2[2] = 0; temp_br2[3] = 0;
            for (k = 0; k <= 3; k++) {
                //from (i,j) to right
                if (j + k < 7) {
                    //temp_r += map[i][j + k];
                    //temp_r1[k]=map[i][j+k];
                    temp_r1[k]=dummyMap[i][j+k];
                }
                //from (i,j) to bottom
                if (i + k < 6) {
                    //temp_b += map[i + k][j];
                    //temp_b1[k] = map[i + k][j];
                    temp_b1[k] = dummyMap[i + k][j];
                }

                //from (i,j) to bottom-right
                if (i + k < 6 && j + k < 7) {
                    //temp_br += map[i + k][j + k];
                    //temp_br1[k] = map[i + k][j + k];
                    temp_br1[k] = dummyMap[i + k][j + k];
                }

                //from (i,j) to top-right
                if (i - k >= 0 && j + k < 7) {
                    //temp_tr += map[i - k][j + k];
                    //temp_br2[k] = map[i - k][j + k];
                    temp_br2[k] = dummyMap[i - k][j + k];
                }
            }
            if(temp_r1[0] === 'T' && temp_r1[1] === 'O' && temp_r1[2] === 'O' && temp_r1[3] === 'T'){
                win(1);
            }
            else if(temp_r1[0] === 'O' && temp_r1[1] === 'T' && temp_r1[2] === 'T' && temp_r1[3] === 'O'){
                win(-1);
            }
            else if(temp_b1[0] === 'T' && temp_b1[1] ==='O' && temp_b1[2] === 'O' && temp_b1[3] === 'T'){
                win(1);
            }
            else if(temp_b1[0] === 'O' && temp_b1[1] === 'T' && temp_b1[2] === 'T' && temp_b1[3] === 'O'){
                win(-1);
            }
            else if(temp_br1[0] === 'T' && temp_br1[1] === 'O' && temp_br1[2] === 'O' && temp_br1[3] === 'T'){
                win(1);
            }
            else if(temp_br1[0] ==='O' && temp_br1[1] === 'T' && temp_br1[2] === 'T' && temp_br1[3] === 'O'){
                win(-1);
            }
            else if(temp_br2[0] === 'T' && temp_br2[1] ==='O' && temp_br2[2] === 'O' && temp_br2[3] === 'T'){
                win(1);
            }
            else if(temp_br2[0] === 'O' && temp_br2[1] === 'T' && temp_br2[2] === 'T' && temp_br2[3] === 'O'){
                win(-1);
            }

        }
    }
    // check if draw
    if ((move === 42) && (!won)) {
        win(0);
    }
};

function drawCircle(x, y, r, fill, stroke, text) {
    context.save();
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fill();
    context.font = "bold 25px serif";
    context.restore();
    context.fillText(text, x-8.5, y+8);
};

function drawMask() {
    // draw the mask
    // http://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas
    // -->  http://stackoverflow.com/a/11770000/917957

    context.save();
    context.fillStyle = "#00bfff";
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
};

function draw() {
    var x, y;
    var fg_color;
    for (y = 0; y < 6; y++) {

        for (x = 0; x < 7; x++) {
            var text="";
            fg_color = "transparent";
            if (map[y][x] >= 1 && dummyMap[y][x] === 'T') {
                fg_color = "#99ffcc";
                text="T";
                //text=$scope.newGame.Label;
            }else if (map[y][x] >= 1 && dummyMap[y][x] === 'O') {
                fg_color = "#99ffcc";
                text="O";
               // text=$scope.newGame.Label;
            }else if (map[y][x] <= -1 && dummyMap[y][x] === 'T') {
                fg_color = "#ffff99";
                text="T";
               // text=$scope.newGame.Label;
            }else if (map[y][x] <= -1 && dummyMap[y][x] === 'O') {
                fg_color = "#ffff99";
                text="O";
               // text=$scope.newGame.Label;
            }

            drawCircle(75 * x + 100, 75 * y + 50, 25, fg_color, "black", text);
        }
    }
};

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

function animate(column, move, to_row, cur_pos, callback) {
    var text = "";
    var token = document.getElementsByName('choice');
        if(token[0].checked){
            text = 'T';
        }
        else{
            text = 'O';
        }
    var fg_color = "transparent";
    if (move >= 1) {
        fg_color = "#ff4136";
        //TO DO need t or o
        //text = $scope.newGame.Label;
    } else if (move <= -1) {
        fg_color = "#ffff00";
        //text = $scope.newGame.Label;
    }
    if (to_row * 75 >= cur_pos) {
        clear();
        draw();
        drawCircle(75 * column + 100, cur_pos + 50, 25, fg_color, "black", text);
        drawMask();
        window.requestAnimationFrame(function () {
            animate(column, move, to_row, cur_pos + 25, callback);
        });
    } else {
        callback();
    }
};

function onregion(coord, x, radius) {
    if ((coord[0] - x)*(coord[0] - x) <=  radius * radius) {
        return true;
    }
    return false;
};

function oncircle(coord, centerCoord, radius) {
    if ((coord[0] - centerCoord[0]) * (coord[0] - centerCoord[0]) <=  radius * radius
            && (coord[1] - centerCoord[1]) * (coord[1] - centerCoord[1]) <=  radius * radius) {
        return true;
    }
    return false;
};

function onclick(canvas, e) {
    if (rejectClick) {
        return false;
    }
    if (won) {
        //init();
        //drawBoard();
        location.reload();
        return false;
    }
    var rect = canvas.getBoundingClientRect(),
        x = e.clientX - rect.left,// - e.target.scrollTop,
        y = e.clientY - rect.top;// - e.target.scrollLeft;

    //console.log("(" + x + ", " + y + ")");
    var j, valid;
    
    for (j = 0; j < 7; j++) {
        if (onregion([x, y], 75 * j + 100, 25)) {
            // console.log("clicked region " + j);
            paused = false;
            
            action(j);
            
            if (valid === 1) { // give user retry if action is invalid
                rejectClick = true;
            }
            break; //because there will be no 2 points that are clicked at a time
        }
    }
};