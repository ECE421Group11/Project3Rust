#![allow(non_snake_case)]
mod utils;

use wasm_bindgen::prelude::*;
extern crate serde_json;

use std::fs;
use std::fs::OpenOptions;
use std::io::prelude::*;

use std::str::from_utf8;

use chrono::prelude::*;

use serde::{Deserialize, Serialize};

#[macro_use]
extern crate serde_derive;

// For converting into a JS Array
use js_sys::Array;

#[derive(Serialize, Deserialize)]
struct Date {
    hour: u32,
    minute: u32,
    month: u32,
    day: u32,
    year: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Game {
    game_number: String,
    game_type: String,
    player1_name: String,
    player2_name: String,
    winner_name: String,
    date: Date,
}

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

// Check which players turn 
#[wasm_bindgen]
pub fn player_move(val:usize) -> isize{
    if val % 2 == 0 {
        return 1;
    }
    return -1;
}

// Check current state for ai moves
#[wasm_bindgen]
pub fn check_state(js_ob: &JsValue)->Vec<isize>{
    //alert("Check_State");
    let mut winVal = 0;
    let mut chainVal = 0;
    let mut temp_r = 0;
    let mut temp_b = 0;
    let mut temp_br = 0;
    let mut temp_tr = 0;
    let state: Vec<Vec<isize>> = js_ob.into_serde().unwrap();
    
    for i in 0 .. 6 {
        for j in 0 .. 7 {
            temp_r = 0;
            temp_b = 0;
            temp_br = 0;
            temp_tr = 0;
            for k in 0 .. 4 {
                //from (i,j) to right
                if j + k < 7 {
                    temp_r = temp_r + state[i][j+k];
                }
                //from (i,j) to bottom
                if i + k < 6 {
                    temp_b = temp_b + state[i+k][j];
                }
                //from (i,j) to bottom-right
                if i + k < 6 && j + k < 7 {
                    temp_br = temp_br + state[i+k][j+k];
                }
                //from (i,j) to top-right
                if i >= k && j + k < 7 {
                    temp_tr = temp_tr + state[i-k][j+k];
                }
            }
            chainVal = chainVal + (temp_r * temp_r * temp_r);
            chainVal = chainVal + (temp_b * temp_b * temp_b);
            chainVal = chainVal + (temp_br * temp_br * temp_br);
            chainVal = chainVal + (temp_tr * temp_tr * temp_tr);

            if temp_r.abs() == 4{
                winVal = temp_r;
            }else if temp_b.abs() == 4{
                winVal = temp_b;
            }else if temp_br.abs() == 4{
                winVal = temp_br;
            }else if temp_tr.abs() == 4{
                winVal = temp_tr;
            }
        }
    }
    return vec![winVal, chainVal];
}

#[wasm_bindgen]
pub fn return_name() -> String{
    return String::from("testing");
}

// Want to take in game info and append it to a text file, in the form:
// game_number~game_type~player1_name~player2_name~winner_name~hour~minute~month~day~year\n
#[wasm_bindgen]
pub fn insert_game(game_number: &str, game_type: &str, player1_name: &str, player2_name: &str, winner_name: &str){
    let local: DateTime<Local> = Local::now();

    let output : String = game_number.to_owned() + &"~".to_owned() + game_type +
                &"~".to_owned() + player1_name + &"~".to_owned() +  player2_name +
                &"~".to_owned() + winner_name + &"~".to_owned() + &local.hour().to_string() +
                &"~".to_owned() + &local.minute().to_string() + &"~".to_owned() + &local.month().to_string() +
                &"~".to_owned() + &local.day().to_string() + &"~".to_owned() + &local.year().to_string() +
                &"\n".to_owned();

    let mut file = OpenOptions::new()
        .write(true)
        .append(true)
        .create(true)
        .open("database.txt")
        .unwrap();

    file.write(&output.as_bytes()).expect("Unable to write file");
}

// Want to get the number of games a player has played
#[wasm_bindgen]
pub fn get_number_of_games(player_name : &str) -> usize {
    let data = fs::read("database.txt").expect("Unable to read file");
    let lines = from_utf8(&data).unwrap().lines();
    let mut number_of_games : usize = 0;
    for line in lines{
        let v: Vec<&str> = line.split('~').collect();
        if v[2] == player_name || v[3] == player_name {
            number_of_games = number_of_games + 1;
        }
    }
    number_of_games
}

// Want to get the number of games a player has won
#[wasm_bindgen]
pub fn get_number_of_games_won(player_name : &str) -> usize {
    let data = fs::read("database.txt").expect("Unable to read file");
    let lines = from_utf8(&data).unwrap().lines();
    let mut won : usize = 0;
    for line in lines{
        let v: Vec<&str> = line.split('~').collect();
        if v[4] == player_name {
            won = won + 1;
        }
    }
    won
}

// Want to get a game from a line, in the text file format of:
// game_number~game_type~player1_name~player2_name~winner_name~hour~minute~month~day~year\n
pub fn get_game_struct(v: Vec<&str>) -> Game {
    let date = Date {
        hour: v[5].parse::<u32>().unwrap(),
        minute: v[6].parse::<u32>().unwrap(),
        month: v[7].parse::<u32>().unwrap(),
        day: v[8].parse::<u32>().unwrap(),
        year: v[9].parse::<i32>().unwrap(),
    };
    let game = Game {
        game_number: v[0].to_string(),
        game_type: v[1].to_string(),
        player1_name: v[2].to_string(),
        player2_name: v[3].to_string(),
        winner_name: v[4].to_string(),
        date: date,
    };
    game
}

// Want to get all the games associated with a player and return a vector of strings in JSON format
#[wasm_bindgen]
pub fn get_all_games(player_name : &str) -> Array {
    let mut games : Vec<String> = Vec::new();

    let data = fs::read("database.txt").expect("Unable to read file");
    let lines = from_utf8(&data).unwrap().lines();

    for line in lines{
        let v: Vec<&str> = line.split('~').collect();
        if v[2] == player_name {
            let v_clone = v.clone();
            let game : Game = get_game_struct(v_clone);
            let game_string = serde_json::to_string(&game).unwrap();
            games.push(game_string);
        }
        else if v[3] == player_name {
            let v_clone = v.clone();
            let game : Game = get_game_struct(v_clone);
            let game_string = serde_json::to_string(&game).unwrap();
            games.push(game_string);
        }
    }
    games.into_iter().map(JsValue::from).collect()
}

// Want to get all the games won by a player and return a vector of strings in JSON format
#[wasm_bindgen]
pub fn get_all_games_won(player_name : &str) -> Array {
    let mut games : Vec<String> = Vec::new();

    let data = fs::read("database.txt").expect("Unable to read file");
    let lines = from_utf8(&data).unwrap().lines();

    for line in lines{
        let v: Vec<&str> = line.split('~').collect();
        if v[4] == player_name {
            let v_clone = v.clone();
            let game : Game = get_game_struct(v_clone);
            let game_string = serde_json::to_string(&game).unwrap();
            games.push(game_string);
        }
    }
    games.into_iter().map(JsValue::from).collect()
}

#[wasm_bindgen]
pub fn clear_db(){
    fs::write("database.txt", "").expect("Unable to write file");
}

// Populate the database with random data
#[wasm_bindgen]
pub fn add_data(){
    insert_game("1", "connect4", "Glenn", "Computer", "Computer");
    insert_game("2", "connect4", "Andrew", "Computer", "Computer");
    insert_game("3", "connect4", "Glenn", "Andrew", "Andrew");
    insert_game("4", "connect4", "Glenn", "Andrew", "Glenn");
    insert_game("5", "toot", "Micheal", "Computer", "Computer");
    insert_game("6", "connect4", "Tymoore", "Computer", "Computer");
    insert_game("7", "connect4", "Micheal", "Tymoore", "Tymoore");
    insert_game("8", "connect4", "Micheal", "Tymoore", "Micheal");
    insert_game("9", "toot", "Tymoore", "Andrew", "Tymoore");
    insert_game("10", "toot", "Glenn", "Micheal", "Glenn");
}
