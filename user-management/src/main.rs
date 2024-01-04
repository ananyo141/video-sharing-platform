#[macro_use]
extern crate rocket;

use rocket::http::Status;
use rocket::serde::json::{Json, Value};
use rocket_sync_db_pools::database;

mod controllers;
mod db;
mod errors;
mod models;
mod schema;
mod serializers;
mod utils;

use controllers::user_controller::user_routes;
use errors::catchers::get_catchers;
use utils::res_fmt::ResFmt;

#[database("user_db")]
pub struct Db(diesel::PgConnection);

#[get("/")]
fn index() -> Result<Json<Value>, Status> {
    Ok(ResFmt::new(true, "Backend is running!".to_string())
        .with_page(1)
        .to_json())
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Db::fairing())
        .register("/", get_catchers())
        .mount("/", routes![index])
        .mount("/users", user_routes())
}
