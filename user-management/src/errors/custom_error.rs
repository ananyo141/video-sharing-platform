use rocket::http::Status;
use rocket::response::Responder;
use rocket::serde::json::{json, Json};

#[derive(Debug)]
pub enum CustomError {
    NotFound,
    Forbidden,
    Unauthorized,
    BadRequest,
    InternalServerError,
}

impl<'r> Responder<'r, 'static> for CustomError {
    fn respond_to(self, r: &'r rocket::Request<'_>) -> rocket::response::Result<'static> {
        let status_code = match self {
            CustomError::Unauthorized => Status::Unauthorized,
            CustomError::Forbidden => Status::Forbidden,
            CustomError::NotFound => Status::NotFound,
            CustomError::InternalServerError => Status::InternalServerError,
            CustomError::BadRequest => Status::BadRequest,
        };

        Json(json!({
            "success": false,
            "error": {
                "code": status_code.code,
                "message": status_code,
            },
        }))
        .respond_to(&r)
    }
}
