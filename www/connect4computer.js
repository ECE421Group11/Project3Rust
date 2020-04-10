import * as wasm from "Project3Rust";

wasm.greet();

document.getElementById("newGameNames").innerHTML = wasm.return_name();