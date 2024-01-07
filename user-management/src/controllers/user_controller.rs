use rocket::{
    http::Status,
    serde::json::{json, Json, Value},
};

use crate::{
    errors::custom_error::{CustomError, ErrorDetails},
    models::user_model::User,
};
use crate::{models::user_model::NewUser, utils::res_fmt::ResFmt};
use crate::{models::user_model::UpdateUser, Db};

#[get("/")]
pub async fn get_all_users(connection: Db) -> Result<Json<Value>, CustomError> {
    match User::find_all(connection).await.map(Json) {
        Ok(users) => Ok(ResFmt::new(true, "users")
            .with_data(json!(users.into_inner()))
            .to_json()),
        Err(_) => Err(CustomError::not_found("No users found".to_string())),
    }
}

#[get("/<id>")]
pub async fn get_user_by_id(connection: Db, id: i32) -> Result<Json<Value>, Status> {
    match User::find_by_id(connection, id).await.map(Json) {
        Ok(user) => Ok(ResFmt::new(true, "user")
            .with_data(json!(user.into_inner()))
            .to_json()),
        Err(_) => Err(Status::NotFound),
    }
}

#[post("/", data = "<user>")]
pub async fn create_user(connection: Db, user: Json<NewUser>) -> Result<Json<Value>, CustomError> {
    match User::create(connection, user.into_inner()).await {
        Ok(user) => Ok(ResFmt::new(true, "User created")
            .with_data(json!(user))
            .to_json()),
        Err(err) => Err(CustomError::bad_request(
            String::from("Invalid schema"),
            Some(vec![ErrorDetails {
                field: None,
                message: err.to_string(),
            }]),
        )),
    }
}

#[patch("/<id>", data = "<user>")]
pub async fn update_user(
    connection: Db,
    id: i32,
    user: Json<UpdateUser>,
) -> Result<Json<Value>, CustomError> {
    match User::update(connection, id, user.into_inner()).await {
        Ok(user) => Ok(ResFmt::new(true, "User updated")
            .with_data(json!(user))
            .to_json()),
        Err(err) => Err(CustomError::bad_request(err.to_string(), None)),
    }
}

#[delete("/<id>")]
pub async fn delete_user(connection: Db, id: i32) -> Result<Json<Value>, CustomError> {
    match User::delete(connection, id).await {
        Ok(user) => Ok(ResFmt::new(true, "User deleted")
            .with_data(json!(user))
            .to_json()),
        Err(_) => Err(CustomError::internal_server_error(String::from(
            "Unable to delete User",
        ))),
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
