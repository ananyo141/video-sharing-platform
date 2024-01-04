use diesel::RunQueryDsl;
use rocket::{
    http::Status,
    serde::json::{Json, Value},
};

use crate::models::user_model::User;
use crate::utils::res_fmt::ResFmt;
use crate::Db;

use crate::schema::users;

// #[get("/")]
// pub async fn get_all_users(connection: Db) -> Result<Json<Value>, Status> {

#[get("/")]
pub async fn get_all_users(connection: Db) -> Json<Vec<User>> {
    connection
        .run(|c| users::table.load(c))
        .await
        .map(Json)
        .expect("Failed to fetch blog posts")
}

#[get("/<id>")]
pub fn get_user_by_id(id: i32) -> Result<Json<Value>, Status> {
    match id {
        1 => Ok(ResFmt::new(true, format!("User with id: {}", id)).to_json()),
        _ => Err(Status::NotFound),
    }
}

// #[post("/", data = "<user>")]
// pub fn create_user(user: Json<User>) -> Result<Json<Value>, Status> {
//     Ok(ResFmt::new(true, format!("User with name: {}", user.id)).to_json())
// }

#[post("/", data = "<user>")]
pub async fn create_user(connection: Db, user: Json<User>) -> Json<User> {
    connection
        .run(move |c| {
            diesel::insert_into(users::table)
                .values(&user.into_inner())
                .get_result(c)
        })
        .await
        .map(Json)
        .expect("boo")
}

#[put("/<id>", data = "<user>")]
pub fn update_user(id: i32, user: Json<Value>) -> Result<Json<Value>, Status> {
    match user["name"].as_str() {
        Some(name) => {
            Ok(ResFmt::new(true, format!("User with id: {} and name: {}", id, name)).to_json())
        }
        None => Err(Status::BadRequest),
    }
}

#[delete("/<id>")]
pub fn delete_user(id: i32) -> Result<Json<Value>, Status> {
    match id {
        1 => Ok(ResFmt::new(true, format!("User with id: {} deleted", id)).to_json()),
        _ => Err(Status::NotFound),
    }
}

// export all the controllers
pub fn user_routes() -> Vec<rocket::Route> {
    routes![
        get_all_users,
        get_user_by_id,
        create_user,
        update_user,
        delete_user
    ]
}
