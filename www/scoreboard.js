import * as wasm from "Project3Rust";

get_data();

function get_data(){
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
        display_array(JSON.parse(req.response));
    }

}

function display_array(arr){
    var data = arr['games']
    var perrow = 6,
    html = "<table><tr><th>Game-ID</th><th>Game Type</th><th>Player1</th><th>Player2</th><th>Winner</th><th>When Played</th></tr>"
    
    // Loop through array and add table cells
    for (var i=0; i<data.length; i++) {
        html += "<tr>" 
        + "<td>" + data[i]['gameID'] + "</td>" 
        + "<td>" + data[i]['gameType'] + "</td>" 
        + "<td>" + data[i]['player1'] + "</td>" 
        + "<td>" + data[i]['player2'] + "</td>" 
        + "<td>" + data[i]['winner'] + "</td>" 
        + "<td>" + data[i]['when'] + "</td>" 
        + "</tr>";
        console.log(data[i])
    }
    html += "</table>";

    // Attach HTML to container
    document.getElementById("gamehisory").innerHTML = html; 
    document.getElementById("gamehisory").classList.add('w3-striped')
    document.getElementById("gamehisory").classList.add('w3-bordered')
    document.getElementById("gamehisory").classList.add('w3-table')
    document.getElementById("gamehisory").classList.add('w3-hoverable')


    console.log(html);
}
