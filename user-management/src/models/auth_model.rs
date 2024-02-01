use rocket::http::Status;
use rocket::outcome::Outcome;
use rocket::request;
use rocket::request::{FromRequest, Request};
use serde::{Deserialize, Serialize};

use crate::utils::jwt::verify_token;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Serialize, Deserialize)]
pub struct Token {
    pub access_token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub user_id: i32,
    pub exp: usize,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Claims {
    type Error = ();

    /// Extract Claims token from the "Authorization" header.
    ///
    /// Handlers with Claims guard will fail with 503 error.
    /// Handlers with Option<Claims> will be called with None.
    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Claims, Self::Error> {
        if let Some(auth) = req
            .headers()
            .get_one("Authorization")
            .and_then(|header| header.split_whitespace().nth(1))
            .and_then(|token| verify_token(token))
        {
            Outcome::Success(auth)
        } else {
            Outcome::Error((Status::Forbidden, ()))
        }
    }
}
