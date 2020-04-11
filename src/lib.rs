mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, project3-rust!");
}

#[wasm_bindgen]
pub fn return_name() -> String{
    return String::from("testing");
}

#[wasm_bindgen]
fn get_number_of_games() -> usize {
    let client = Client::with_uri_str("mongodb://localhost:27017/");
    let db = client.unwrap().database("connect4");
    let collection = db.collection("games");

    let find_options = FindOptions::builder().build();
    let cursor = collection.find(None, find_options);
    let mut length : usize = 0;
    for result in cursor.unwrap() {
        match result {
            Ok(document) => {
                length = length + 1;
            }
            Err(e) => {},
        }
    }
    length
}

#[wasm_bindgen]
fn insert_game(gameNumber: &str, gameType: &str, player1Name: &str, player2Name: &str, winnerName: &str){
    let local: DateTime<Local> = Local::now();
    let date = doc! {
        "hour" : local.hour(),
        "minute" : local.minute(),
        "month" : local.month(),
        "day" : local.day(),
        "year" : local.year()};

    let client = Client::with_uri_str("mongodb://localhost:27017/");
    let db = client.unwrap().database("connect4");
    let collection = db.collection("games");
    let doc = doc! {  "gameNumber": gameNumber, "gameType": gameType,
                "player1Name": player1Name, "player2Name": player2Name,
                "winnerName": winnerName, "gameDate": &date };
    collection.insert_one(doc, None);
}

#[wasm_bindgen]
fn get_number_of_games_against_computer() -> usize {
    let client = Client::with_uri_str("mongodb://localhost:27017/");
    let db = client.unwrap().database("connect4");
    let collection = db.collection("games");

    let filter = doc! { "player2Name": "Computer" };
    let find_options = FindOptions::builder().build();
    let cursor = collection.find(filter, find_options);
    let mut length : usize = 0;
    for result in cursor.unwrap() {
        match result {
            Ok(document) => {
                length = length + 1;
            }
            Err(e) => {},
        }
    }
    length
}

#[wasm_bindgen]
fn get_number_of_games_computer_won() -> usize {
    let client = Client::with_uri_str("mongodb://localhost:27017/");
    let db = client.unwrap().database("connect4");
    let collection = db.collection("games");

    let filter = doc! { "winnerName": "Computer" };
    let find_options = FindOptions::builder().build();
    let cursor = collection.find(filter, find_options);
    let mut length : usize = 0;
    for result in cursor.unwrap() {
        match result {
            Ok(document) => {
                length = length + 1;
            }
            Err(e) => {},
        }
    }
    length
}

#[wasm_bindgen]
fn get_all_games(playerName : &str) -> Vec<Document> {
    let mut games : Vec<Document> = Vec::new();

    let client = Client::with_uri_str("mongodb://localhost:27017/");
    let db = client.unwrap().database("connect4");
    let collection = db.collection("games");

    let filter = doc! { "player1Name": playerName };
    let find_options = FindOptions::builder().build();
    let cursor = collection.find(filter, find_options);
    for result in cursor.unwrap() {
        match result {
            Ok(document) => {
                games.push(document);
            }
            Err(e) => {},
        }
    }

    let filter = doc! { "player2Name": playerName };
    let find_options = FindOptions::builder().build();
    let cursor = collection.find(filter, find_options);
    for result in cursor.unwrap() {
        match result {
            Ok(document) => {
                games.push(document);
            }
            Err(e) => {},
        }
    }
    games
}

#[wasm_bindgen]
fn get_all_games_won(playerName : &str) -> Vec<Document> {
    let mut games : Vec<Document> = Vec::new();

    let client = Client::with_uri_str("mongodb://localhost:27017/");
    let db = client.unwrap().database("connect4");
    let collection = db.collection("games");

    let filter = doc! { "winnerName": playerName };
    let find_options = FindOptions::builder().build();
    let cursor = collection.find(filter, find_options);
    for result in cursor.unwrap() {
        match result {
            Ok(document) => {
                games.push(document);
            }
            Err(e) => {},
        }
    }
    games
}
