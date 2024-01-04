use rocket::http::Status;
use rocket::response::Responder;
use rocket::serde::json::{json, Json};

#[derive(Debug)]
pub enum CustomError {
    NotFound,
    Forbidden,
    Unauthorized,
    BadRequest,
    UnprocessableEntity,
    InternalServerError,
}

impl CustomError {
    pub fn new(code: u16) -> CustomError {
        match code {
            401 => CustomError::Unauthorized,
            403 => CustomError::Forbidden,
            404 => CustomError::NotFound,
            500 => CustomError::InternalServerError,
            400 => CustomError::BadRequest,
            _ => CustomError::InternalServerError,
        }
    }
}

impl<'r> Responder<'r, 'static> for CustomError {
    fn respond_to(self, r: &'r rocket::Request<'_>) -> rocket::response::Result<'static> {
        let (status_code, message) = match self {
            CustomError::Unauthorized => (Status::Unauthorized, "Unauthorized"),
            CustomError::Forbidden => (Status::Forbidden, "Forbidden"),
            CustomError::NotFound => (Status::NotFound, "Not Found"),
            CustomError::BadRequest => (Status::BadRequest, "Bad Request"),
            CustomError::UnprocessableEntity => {
                (Status::UnprocessableEntity, "Invalid data or param type")
            }
            CustomError::InternalServerError => {
                (Status::InternalServerError, "Internal Server Error")
            }
        };
        // build response
        Json(json!({
            "success": false,
            "message": message,
            "error": {
                "code": status_code.code,
            },
        }))
        .respond_to(&r)
    }
}
