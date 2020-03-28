#![feature(proc_macro_hygiene)]
#![feature(decl_macro)]
#[macro_use] extern crate rocket;

use rocket::request::{Form, FormError, FormDataError};
use rocket::response::NamedFile;
use rocket::http::RawStr;
use rocket::Request;

#[cfg(test)] mod tests;

#[derive(Debug, FromFormValue)]
enum FormOption {
    A, B, C
}

#[derive(Debug, FromForm)]
struct FormInput<'r> {
    checkbox: bool,
    number: usize,
    #[form(field = "type")]
    radio: FormOption,
    password: &'r RawStr,
    #[form(field = "textarea")]
    text_area: String,
    select: FormOption,
}

#[post("/", data = "<sink>")]
fn sink(sink: Result<Form<FormInput<'_>>, FormError<'_>>) -> String {
    match sink {
        Ok(form) => format!("{:?}", &*form),
        Err(FormDataError::Io(_)) => format!("Form input was invalid UTF-8."),
        Err(FormDataError::Malformed(f)) | Err(FormDataError::Parse(_, f)) => {
            format!("Invalid form input: {}", f)
        }
    }
}

#[get("/")]
fn index() -> Option<NamedFile> {
    NamedFile::open("static/index.html").ok()
}

#[get("/HowToConnect4")]
fn howtoconnect4() -> Option<NamedFile> {
    NamedFile::open("static/HowToConnect4.html").ok()
}

#[get("/Connect4Computer")]
fn connect4computer() -> Option<NamedFile> {
    NamedFile::open("static/Connect4Computer.html").ok()
}

#[get("/Connect4Human")]
fn connect4human() -> Option<NamedFile> {
    NamedFile::open("static/Connect4Human.html").ok()
}

#[get("/HowToToot")]
fn howtotoot() -> Option<NamedFile> {
    NamedFile::open("static/HowToToot.html").ok()
}

#[get("/TootOttoComputer")]
fn tootottocomputer() -> Option<NamedFile> {
    NamedFile::open("static/TootOttoComputer.html").ok()
}

#[get("/TootOttoHuman")]
fn tootottohuman() -> Option<NamedFile> {
    NamedFile::open("static/TootOttoHuman.html").ok()
}

#[get("/ScoreBoard")]
fn scoreboard() -> Option<NamedFile> {
    NamedFile::open("static/ScoreBoard.html").ok()
}

#[get("/Scores")]
fn scores() -> Option<NamedFile> {
    NamedFile::open("static/Scores.html").ok()
}

fn rocket() -> rocket::Rocket {
    rocket::ignite().mount("/", routes![index, howtoconnect4, connect4computer,
     connect4human, howtotoot, tootottocomputer, tootottohuman, scoreboard, scores])
}

fn main() {
    rocket().launch();
}