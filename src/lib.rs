#![allow(non_snake_case)]
#![allow(unused_imports)]
mod utils;

use wasm_bindgen::prelude::*;
extern crate serde_json;
extern crate rand;

use std::fs;
use std::fs::OpenOptions;
use std::io::prelude::*;

use std::str::from_utf8;
use rand::prelude::*;

use chrono::prelude::*;

use serde::{Deserialize, Serialize};

#[macro_use]
extern crate serde_derive;

// For converting into a JS Array
use js_sys::Array;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static mut SEED:i64 = 17;

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

pub fn check_state_rust(state :&Vec<Vec<isize>>)->Vec<isize>{
    let mut winVal = 0;
    let mut chainVal = 0;
    
    for i in 0 .. 6 {
        for j in 0 .. 7 {

            let mut temp_r = 0;
            let mut temp_b = 0;
            let mut temp_br = 0;
            let mut temp_tr = 0;
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

pub fn value(state:&mut Vec<Vec<isize>>, depth:usize, alpha:isize, beta:isize, ai_move_val:isize)->Vec<isize>{
    let val = check_state_rust(state);

    if depth >= 3 {
        let win_val = val[0];
        let chain_val = val[1] * ai_move_val;
        let mut ret_val = chain_val;

        if win_val == 4 * ai_move_val {
            ret_val = 999999;
        }else if win_val == 4 * ai_move_val * -1 {
            ret_val = 999999 + 1 * -1;
        }
        ret_val = ret_val - (depth * depth) as isize;
        return vec![ret_val, -1];
    }

    let win = val[0];
    if win == 4 * ai_move_val {
        let temp = (999999 - depth * depth) as isize;
        return vec![temp, -1];
    }
    if win == 4 * ai_move_val * -1 {
        let temp = 999999 as isize * -1 - (depth * depth) as isize;
        return vec![temp, -1]
    }

    if depth % 2 == 0 {
        return min_state_rust(state, depth + 1, alpha, beta, ai_move_val);
    }
    return max_state_rust(state, depth + 1, alpha, beta, ai_move_val);

}

pub fn choose(choice:Vec::<usize>)->isize{
    // Rand crate not compatible with wasm bindgen
    let a:i64 = 25214903917;
    let c = 11;
    if choice.len() == 0 {
        unsafe{
            let r = (a * SEED + c) % (7 as i64);
            SEED = r + SEED % 977;
            return r as isize;
        }
    }
    else{
        unsafe{
            let r = (a * SEED + c) % (choice.len() as i64);
            SEED = r + SEED % 17;
            return choice[r as usize] as isize;
        }
    }
}

// Only function directly called from JS
#[wasm_bindgen]
pub fn max_state(js_ob: &JsValue, depth:usize, mut alpha:isize, beta:isize, ai_move_val:isize)->Vec<isize>{
    let mut v = -2147483638;
    let mut moveQueue = Vec::<usize>::new();
    let mut state: Vec<Vec<isize>> = js_ob.into_serde().unwrap();

    for j in 0 .. 7 {
        let mut temp_state = fill_map(&mut state, j, ai_move_val);

        if temp_state[0][0] != -420{
            let temp_val = value(&mut temp_state, depth, alpha, beta, ai_move_val);
            if temp_val[0] > v {
                v = temp_val[0];
                let mut moveQueue = Vec::<usize>::new();
                moveQueue.push(j);
            }else if temp_val[0] == v {
                moveQueue.push(j);
            }

            // alpha-beta pruning
            if v > beta {
                let mov = choose(moveQueue);
                return vec![v, mov];
            }
            if v > alpha{
                alpha = v;
            } 
        }
    }
    let mov = choose(moveQueue);
    return vec![v, mov as isize];
}

pub fn max_state_rust(state: &mut Vec<Vec<isize>>, depth:usize, mut alpha:isize, beta:isize, ai_move_val:isize)->Vec<isize>{
    let mut v = -2147483638;
    let mut moveQueue = Vec::<usize>::new();

    
    for j in 0 .. 7 {
        let mut temp_state = fill_map(state, j, ai_move_val);
        if temp_state[0][0] != -420 {
        let temp_val = value(&mut temp_state, depth, alpha, beta, ai_move_val);

        if temp_val[0] > v {
            v = temp_val[0];
            let mut moveQueue = Vec::<usize>::new();
            moveQueue.push(j);
        }else if temp_val[0] == v {
            moveQueue.push(j);
        }

        // alpha-beta pruning
        if v > beta {
            let mov = choose(moveQueue);
            return vec![v, mov];
        }
        if v > alpha{
            alpha = v;
        } 
    }
}
    let mov = choose(moveQueue);  
    return vec![v, mov as isize];
}


pub fn fill_map(temp_map: &mut Vec<Vec<isize>>, column:usize, value:isize) -> Vec<Vec<isize>>{
    let mut temp_state:Vec<Vec<isize>> = vec![vec![0; 7]; 6];
    for i in 0 ..6 {
        for j in 0 ..7 {
            if temp_map[i][j] == 1 { temp_state[i][j] = 1;}
            else if temp_map[i][j] == -1 { temp_state[i][j] = -1;}
        }
    }

    if temp_state[0][column] != 0 || column > 6 {
        temp_state[0][0] = -420;
        return temp_state;
    }

    let mut row = 0;
    let mut done = false;
    for i in 0 .. 5 {
        if temp_state[i+1][column] != 0 {
            done = true;
            row = i;
            break;
        }
    }
    if !done {
        row = 5;
    }
    temp_state[row][column] = value;
    return temp_state;
}

pub fn min_state_rust(state: &mut Vec<Vec<isize>>, depth:usize, alpha:isize, mut beta:isize, ai_move_val:isize)->Vec<isize>{
    let mut v = 2147483637;
    let mut moveQueue = Vec::<usize>::new();
    for j in 0 .. 7 {
        let mut temp_state = fill_map(state, j, ai_move_val * -1);
        if temp_state[0][0] != -420 {
            let temp_val = value(&mut temp_state, depth, alpha, beta, ai_move_val);
            if temp_val[0] < v {
                v = temp_val[0];
                let mut moveQueue = Vec::<usize>::new();
                moveQueue.push(j);
            }else if temp_val[0] == v {
                moveQueue.push(j);
            }

            // alpha-beta pruning
            if v < alpha {
                let mov = choose(moveQueue);
                return vec![v, mov];
            }
            if v < beta{
                beta = v;
            } 
        }
    }
    let mov = choose(moveQueue);
    return vec![v, mov as isize];
}