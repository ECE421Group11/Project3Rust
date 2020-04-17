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
        display_games_won_by_computer(JSON.parse(req.response));
        display_details_won_by_computer(JSON.parse(req.response));
        display_details_won_by_players(JSON.parse(req.response));
    }
}

function get_games_against_computer(data){
    var count=0;
    for (var i = 0; i < data.length; i++){
        var d = data[i];
        if (d.player1 == "Computer" || d.player2 == "Computer"){
            count = count + 1;
        }
    }
    return count;
}

function get_games_computer_won(data){
    var count=0;
    for (var i = 0; i < data.length; i++){
        var d = data[i];
        if (d.winner == "Computer"){
            count = count + 1;
        }
    }
    return count;
}

function display_games_won_by_computer(arr){
    var data = arr['games']
    var html = "<table><tr><th>Total Games Played</th><th>Games Against Computer</th><th>Games Computer Won</th></tr>"
    var total_games_played = data.length;
    var games_against_computer = get_games_against_computer(data);
    var games_computer_won = get_games_computer_won(data);
    html += "<tr><td>" + total_games_played + "</td><td>"+ games_against_computer + "</td><td>" + games_computer_won + "</td></tr></table>"

    // Attach HTML to container
    document.getElementById("display_games_won_by_computer").innerHTML = html; 
    document.getElementById("display_games_won_by_computer").classList.add('w3-striped')
    document.getElementById("display_games_won_by_computer").classList.add('w3-bordered')
    document.getElementById("display_games_won_by_computer").classList.add('w3-table')
    document.getElementById("display_games_won_by_computer").classList.add('w3-hoverable')
}
function display_details_won_by_computer(arr){
    var data = arr['games']
    var html = "<table><tr><th>Sl. No.</th><th>Game Type</th><th>Winner</th><th>Played Against</th><th>When Played</th></tr>"

      // Loop through array and add table cells
    for (var i=0; i<data.length; i++) {
        html += "<tr>" 
        + "<td>" + data[i]['gameID'] + "</td>" 
        + "<td>" + data[i]['gameType'] + "</td>" 
        + "<td>" + data[i]['winner'] + "</td>";

        if (data[i]['winner'] == data[i]['player1']){
            html += "<td>" + data[i]['player2'] + "</td>" 
        }
        else{
            html += "<td>" + data[i]['player1'] + "</td>" 
        }

        html += "<td>" + data[i]['when'] + "</td>" 
        + "</tr>";
    }
    
    html += "</table>"
        
    // Attach HTML to container
    document.getElementById("display_details_won_by_computer").innerHTML = html; 
    document.getElementById("display_details_won_by_computer").classList.add('w3-striped')
    document.getElementById("display_details_won_by_computer").classList.add('w3-bordered')
    document.getElementById("display_details_won_by_computer").classList.add('w3-table')
    document.getElementById("display_details_won_by_computer").classList.add('w3-hoverable')
    
}

function reduce_data(data){
    var new_data_names = [];
    var new_data_count = [];

    for (var i = 0; i < data.length; i++){
        var name = data[i].winner.toLowerCase();
        if (!new_data_names.includes(name)){
            new_data_names.push(name);
            new_data_count.push(1);
        }
        else{
            new_data_count[new_data_names.indexOf(name)] += 1;
        }
    }

    var new_data = [];
    for (var i = 0; i < new_data_names.length; i++){
        new_data.push({name: new_data_names[i], wins: new_data_count[i]})
    }

    return new_data.sort(function (data1, data2){
        return data2.wins - data1.wins
    });

}

function display_details_won_by_players(arr){
    var data = arr['games']
    var reduced_data = reduce_data(data);
    var html = "<table><tr><th>Sl. No.</th><th>Winner or Draw</th><th>No. of Wins</th></tr>"

    for (var i=0; i<reduced_data.length; i++) {
        html += "<tr>" 
        + "<td>" + (i + 1) + "</td>" 
        + "<td>" + reduced_data[i]['name'] + "</td>" 
        + "<td>" + reduced_data[i]['wins'] + "</td>";
        + "</tr>";
    }

    html += "</table>"
    // Attach HTML to container
    document.getElementById("display_details_won_by_players").innerHTML = html; 
    document.getElementById("display_details_won_by_players").classList.add('w3-striped')
    document.getElementById("display_details_won_by_players").classList.add('w3-bordered')
    document.getElementById("display_details_won_by_players").classList.add('w3-table')
    document.getElementById("display_details_won_by_players").classList.add('w3-hoverable')
}