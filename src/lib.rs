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
