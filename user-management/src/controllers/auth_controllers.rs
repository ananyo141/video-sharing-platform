use rocket::{
    http::Status,
    request::{self, FromRequest},
    Request,
};
use serde::{Deserialize, Serialize};

use crate::{
    models::{
        auth_model::{Claims, LoginRequest, LoginResponse},
        user_model::{NewUser, UpdateUser, User, UserWithRole},
    },
    utils::res_fmt::ResFmt,
};

#[derive(Serialize, Deserialize)]
pub struct AuthResponse {
    pub user: UserWithRole,
    pub access_token: String,
    pub refresh_token: String,
}
