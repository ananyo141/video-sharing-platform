use rocket::http::{ContentType, Status};
use rocket::response::{Responder, Response};
use rocket::serde::json::{json, Json, Value};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorDetails {
    pub field: Option<String>,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomError {
    pub code: Status,
    pub message: String,
    pub error: Vec<ErrorDetails>,
}

#[allow(dead_code)]
impl CustomError {
    pub fn new(code: Status, message: String, error: Option<Vec<ErrorDetails>>) -> CustomError {
        CustomError {
            code,
            message,
            error: match error {
                Some(e) => e,
                None => vec![],
            },
        }
    }

    pub fn internal_server_error(message: String) -> CustomError {
        CustomError::new(Status::InternalServerError, message, None)
    }

    pub fn unauthorized(message: String, errors: Option<Vec<ErrorDetails>>) -> CustomError {
        CustomError::new(Status::Unauthorized, message, errors)
    }

    pub fn forbidden(message: String) -> CustomError {
        CustomError::new(Status::Forbidden, message, None)
    }
    pub fn not_found(message: String) -> CustomError {
        CustomError::new(Status::NotFound, message, None)
    }

    pub fn bad_request(message: String, errors: Option<Vec<ErrorDetails>>) -> CustomError {
        CustomError::new(Status::BadRequest, message, errors)
    }

    pub fn unprocessable_entity(message: String, errors: Option<Vec<ErrorDetails>>) -> CustomError {
        CustomError::new(Status::UnprocessableEntity, message, errors)
    }

    pub fn to_json(&self) -> Json<Value> {
        Json(json!({
            "success": false,
            "message": self.message,
            "error": self.error,
        }))
    }
}

impl<'b> Responder<'b, 'static> for CustomError {
    fn respond_to(self, r: &'b rocket::Request<'_>) -> rocket::response::Result<'static> {
        let json = Json(json!({
            "success": false,
            "message": self.message,
            "error": self.error,
        }));
        let response = Response::build_from(json.respond_to(&r).unwrap())
            .status(self.code)
            .header(ContentType::JSON)
            .finalize();
        Ok(response)
    }
}
