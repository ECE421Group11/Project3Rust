import * as wasm from "Project3Rust";

var path = window.location.pathname;
var page = path.split("/").pop().split(".")[0];

if (page == "Connect4Human"){
    import("./Connect4Human.js")
  .catch(e => console.error("Error importing `Connect4Human.js`:", e));
}
if (page == "Connect4Computer"){
    import("./Connect4Computer.js")
  .catch(e => console.error("Error importing `Connect4Computer.js`:", e));
}
if (page == "TootOttoHuman"){
    import("./TootOttoHuman.js")
  .catch(e => console.error("Error importing `TootOttoHuman.js`:", e));
}
if (page == "TootOttoComputer"){
    import("./TootOttoComputer.js")
  .catch(e => console.error("Error importing `TootOttoComputer.js`:", e));
}
// if (page == "ScoreBoard"){
//     import("./ScoreBoard.js")
//   .catch(e => console.error("Error importing `ScoreBoard.js`:", e));
// }
// if (page == "Scores"){
//     import("./Scores.js")
//   .catch(e => console.error("Error importing `Scores.js`:", e));
// }
