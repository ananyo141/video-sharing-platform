#[macro_use]
extern crate rocket;

use rocket::http::Status;
use rocket::serde::json::{json, Json, Value};

mod errors;
mod models;
mod routes;
mod utils;

use utils::res_fmt::ResFmt;

#[get("/")]
fn index() -> Result<Json<Value>, Status> {
    Ok(Json(json!(ResFmt::new(
        true,
        "Backend is running!".to_string(),
        json!({}),
    )
    .with_page(1))))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .register(
            "/",
            catchers![
                errors::catchers::not_found,
                errors::catchers::forbidden,
                errors::catchers::unauthorized,
                errors::catchers::bad_request,
                errors::catchers::internal_server_error,
            ],
        )
        .mount("/", routes![index])
}
