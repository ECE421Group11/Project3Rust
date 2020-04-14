#![allow(non_snake_case)]
#![allow(unused_imports)]
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
    
    let state: Vec<Vec<isize>> = js_ob.into_serde().unwrap();
    
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

