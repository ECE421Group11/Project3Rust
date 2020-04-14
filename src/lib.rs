mod utils;

use wasm_bindgen::prelude::*;

use std::fs;
use std::fs::OpenOptions;
use std::io::prelude::*;

use std::str::from_utf8;

use chrono::prelude::*;

use serde::{Deserialize, Serialize};

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

#[wasm_bindgen]
pub fn player_move(val:usize) -> isize{
    if val % 2 == 0 {
        return 1;
    }
    return -1;
}
