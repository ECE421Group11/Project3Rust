import * as wasm from "Project3Rust";

var name1 = "";
var name2 = "Computer";
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

function init() {
    //initOnce();
    map = [];
    paused = false;
    won = false;
    rejectClick = false;
    move = 0;
    aiHistory = [];
    var i, j;
    for (i = 0; i <= 6; i++) {
        map[i] = [];
        for (j = 0; j <= 7; j++) {
            map[i][j] = 0;
        }
    }
    clear();
    drawMask();
    print();
};

function print() {
    var i, j, msg;
    msg = "\n";
    msg += "Move: " + move;
    msg += "\n";
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            msg += " " + map[i][j];
        }
        msg += "\n";
    }
    console.log(msg); 
};

function store_win(winner){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
    }
    };

    req.open("GET", "https://api.jsonbin.io/b/5e9648362940c704e1d82cea/latest", true);
    req.setRequestHeader("secret-key", "$2b$10$jqnL1kWdKnd4NwKxvcE9QOYMBNq6gS1qIfKA0SEJUq90W1o5v/Umq");
    req.send();
    req.onload = () => {
        var data = JSON.parse(req.response);
        var arr = data['games'];

        var currentdate = new Date().toLocaleString();
        arr.push({
            "gameID": arr[arr.length - 1]["gameID"] + 1,
            "gameType": "Connect-4",
            "player1": name1,
            "player2": name2,
            "winner": winner,
            "when": currentdate,
        });
        data['games'] = arr;

        let putreq = new XMLHttpRequest();
        putreq.onreadystatechange = () => {
        if (putreq.readyState == XMLHttpRequest.DONE) {
            console.log(putreq.responseText);
        }
        };

        putreq.open("PUT", "https://api.jsonbin.io/b/5e9648362940c704e1d82cea", true);
        putreq.setRequestHeader("secret-key", "$2b$10$jqnL1kWdKnd4NwKxvcE9QOYMBNq6gS1qIfKA0SEJUq90W1o5v/Umq");
        putreq.setRequestHeader('Content-type','application/json');
        putreq.onload = () => {
        }
        putreq.send(JSON.stringify(data))
    }
}

function win(player) {
    paused = true;
    won = true;
    rejectClick = false;
    var msg = null;
    if (player > 0) {
        msg = name1 + " wins";
		store_win(name1);
        //$scope.newGame.WinnerName=$scope.newGame.Player1Name;
    } else if (player < 0) {
        msg = name2 + " wins";
		store_win(name2);
        //$scope.newGame.WinnerName=$scope.newGame.Player2Name;
    } else {
        msg = "It's a draw";
		store_win("Draw");
        //$scope.newGame.WinnerName='Draw';
    }
    msg += " - Click on game board to reset";
    context.save();
    context.font = '14pt sans-serif';
    context.fillStyle = "black";
    context.fillText(msg, 150, 20);

    canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener('click', function (e) {
        location.reload();
    });
};
function fillMap(state, column, value) {
    //var tempMap = state.clone();
    var tempMap = JSON.parse(JSON.stringify(state));

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
    animate(column, wasm.player_move(move), row, 0, function () {
        map[row][column] = wasm.player_move(move);
        //map[row][column] = playerMove(move);
        move++;
        draw();
        check();
        print();
        callback();
    });
    paused = true;
    return 1;
};

function check() {
    var i, j, k;
    var temp_r = 0, temp_b = 0, temp_br = 0, temp_tr = 0;
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            temp_r = 0;
            temp_b = 0;
            temp_br = 0;
            temp_tr = 0;
            for (k = 0; k <= 3; k++) {
                //from (i,j) to right
                if (j + k < 7) {
                    temp_r += map[i][j + k];
                }
                //from (i,j) to bottom
                if (i + k < 6) {
                    temp_b += map[i + k][j];
                }

                //from (i,j) to bottom-right
                if (i + k < 6 && j + k < 7) {
                    temp_br += map[i + k][j + k];
                }

                //from (i,j) to top-right
                if (i - k >= 0 && j + k < 7) {
                    temp_tr += map[i - k][j + k];
                }
            }
            if (Math.abs(temp_r) === 4) {
                win(temp_r);
            } else if (Math.abs(temp_b) === 4) {
                win(temp_b);
            } else if (Math.abs(temp_br) === 4) {
                win(temp_br);
            } else if (Math.abs(temp_tr) === 4) {
                win(temp_tr);
            }

        }
    }
    // check if draw
    if ((move === 42) && (!won)) {
        win(0);
    }
};

function drawCircle(x, y, r, fill, stroke) {
        context.save;
        context.beginPath();
        context.fillStyle = fill;
        context.strokeStyle = "black";
        context.font = "20px Georgia";
        context.lineWidth = 10;
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        context.fill();
        context.beginPath();
        if (fill == "#ff4136"){
            context.fillStyle = "black";
            context.fillText("R", x-6, y+6);
        }
        else if (fill == "#ffff00"){
            context.fillStyle = "black";
            context.fillText("Y", x-6, y+6);
        }
        context.fill();
        context.restore();
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
            fg_color = "transparent";
            if (map[y][x] >= 1) {
                fg_color = "#ff4136";
            } else if (map[y][x] <= -1) {
                fg_color = "#ffff00";
            }
            drawCircle(75 * x + 100, 75 * y + 50, 25, fg_color, "black");
        }
    }
};
function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
};
function animate(column, move, to_row, cur_pos, callback) {
    var fg_color = "transparent";
    if (move >= 1) {
        fg_color = "#ff4136";
    } else if (move <= -1) {
        fg_color = "#ffff00";
    }
    if (to_row * 75 >= cur_pos) {
        clear();
        draw();
        drawCircle(75 * column + 100, cur_pos + 50, 25, fg_color, "black");
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
            valid = action(j, function () {
                ai(-1);
            }); 
            //action(j);
            if (valid === 1) { // give user retry if action is invalid
                rejectClick = true;
            }
            break; //because there will be no 2 points that are clicked at a time
        }
    }
};

function ai(aiMoveValue) {
    function hardAi(){
        // Hard Ai
        var choice = null;
        var state = JSON.parse(JSON.stringify(map));
        var choice_val = wasm.max_state(state, 0, -2147483648, 2147483647, aiMoveValue);
        choice = choice_val[1];
        var val = choice_val[0];
        console.info("AI " + aiMoveValue + " choose column: " + choice + " (value: " + val + ")");
    
        paused = false;
        
        var done = action(choice, function () {
            rejectClick = false;
        });
        // if fail, then random
        while (done < 0) {
            console.error("Falling back to random agent");
            choice = Math.floor(Math.random() * 7);
            done = action(choice, function () {
                rejectClick = false;
            });
        }
    }

    function easyAi(){
        // Random choice for easy setting
        var choice = Math.floor(Math.random() * 7);
        paused = false;
        action(choice);
        rejectClick = false;
    }

    function normalAi(){
        // Randomly choose either hard or easy for normal difficulty
        if (Math.random() > 0.7){
            easyAi();
        }
        else{
            hardAi();
        }
    }
    
    // Choose which dificulty is selected and play accordingly
    var difficulty = document.getElementById("drange").value;
    if (difficulty == '1'){
        // Easy
        easyAi();
    }
    else if (difficulty == '2'){
        // Normal
        normalAi();
    }
    else{
        // Hard
        hardAi();
    }
};

