use std::error::Error;

use rocket::{
    http::Status,
    response::status::Created,
    serde::json::{json, Json, Value},
};

use crate::{
    errors::custom_error::{CustomError, ErrorDetails},
    models::{
        auth_model::{LoginRequest, Token},
        user_model::{NewUser, User},
    },
    utils::{
        hash_passwd::compare_password,
        jwt::{generate_token, verify_token},
        res_fmt::ResFmt,
    },
    Db,
};

#[post("/login", data = "<login_request>")]
pub async fn login<'a>(
    connection: Db,
    login_request: Result<Json<LoginRequest>, rocket::serde::json::Error<'a>>,
) -> Result<Json<Value>, CustomError> {
    // Validate login request
    let validated_login = login_request.map_err(|err| {
        CustomError::bad_request(
            String::from("Invalid login request"),
            Some(vec![ErrorDetails {
                field: Some(err.to_string()),
                message: err.source().map_or_else(
                    || String::from("Unable to process login"),
                    |source| source.to_string(),
                ),
            }]),
        )
    })?;

    let user = User::find_by_email(connection, validated_login.email.to_string())
        .await
        .map_err(|err| {
            let error_details = vec![ErrorDetails {
                field: Some(err.to_string()),
                message: err.source().map_or_else(
                    || String::from("Invalid credentials"),
                    |source| source.to_string(),
                ),
            }];
            CustomError::bad_request(String::from("Invalid credentials"), Some(error_details))
        })?;

    // Perform authentication logic (replace this with your actual authentication logic)
    let is_authenticated = compare_password(&validated_login.password, &user.password);

    if is_authenticated {
        // Generate and return a token, or any other response you prefer for successful login
        Ok(ResFmt::new(true, "Login successful")
            .with_data(json!({ "access_token": generate_token(user.id).unwrap()}))
            .to_json())
    } else {
        // Return an error response for failed authentication
        Err(CustomError::new(
            Status::Unauthorized,
            String::from("Authentication failed"),
            None,
        ))
    }
}

#[post("/verify_token", data = "<token_request>")]
pub async fn verify_token_handler(
    connection: Db,
    token_request: Json<Token>,
) -> Result<Json<Value>, CustomError> {
    if let Some(claims) = verify_token(&token_request.access_token) {
        match User::find_by_id(connection, claims.user_id).await.map(Json) {
            Ok(user) => Ok(ResFmt::new(true, "user")
                .with_data(json!(user.into_inner()))
                .to_json()),
            Err(_) => Err(CustomError::unauthorized("Invalid token".to_string(), None)),
        }
    } else {
        Err(CustomError::unauthorized(
            String::from("Invalid token"),
            None,
        ))
    }
}

#[post("/register", data = "<user>")]
pub async fn register<'a>(
    connection: Db,
    user: Result<Json<NewUser>, rocket::serde::json::Error<'a>>,
) -> Result<Created<Json<Value>>, CustomError> {
    // Validate user
    let validated_user = user.map_err(|err| {
        CustomError::bad_request(
            String::from("Invalid schema"),
            Some(vec![ErrorDetails {
                field: Some(err.to_string()),
                message: err.source().map_or_else(
                    || String::from("Unable to create user"),
                    |source| source.to_string(),
                ),
            }]),
        )
    })?;

    // Create a new user in the database
    let user = User::create(connection, &validated_user.into_inner())
        .await
        .map_err(|err| {
            let error_details = vec![ErrorDetails {
                field: Some(err.to_string()),
                message: err.source().map_or_else(
                    || String::from("Unable to create user"),
                    |source| source.to_string(),
                ),
            }];

            CustomError::bad_request(String::from("Invalid schema"), Some(error_details))
        })?;

    Ok(
        Created::new(format!("/users/{}", user.id).to_string()).body(
            ResFmt::new(true, "User created")
                .with_data(json!(user))
                .to_json(),
        ),
    )
}

// TODO: Implement logout
#[get("/logout")]
pub async fn logout(__connection: Db) -> CustomError {
    CustomError::internal_server_error("Logout not implemented".to_string())
}

// export all the controllers
pub fn auth_routes() -> Vec<rocket::Route> {
    routes![login, register, logout, verify_token_handler,]
}
