#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

use rocket::serde::json::{Json, Value};
use rocket_sync_db_pools::database;

mod controllers;
mod errors;
mod models;
mod schema;
mod utils;

use controllers::user_controller::user_routes;
use errors::catchers::get_catchers;
use utils::res_fmt::ResFmt;

#[database("user_db")]
pub struct Db(diesel::PgConnection);

#[get("/")]
fn index() -> Json<Value> {
    ResFmt::new(true, "Welcome to Rust Rocket API").to_json()
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Db::fairing())
        .register("/", get_catchers())
        .mount("/", routes![index])
        .mount("/users", user_routes())
}
