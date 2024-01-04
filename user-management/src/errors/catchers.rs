use super::custom_error::CustomError;

use rocket::http::Status;
use rocket::Request;

#[catch(404)]
pub fn not_found() -> CustomError {
    CustomError::NotFound
}

#[catch(403)]
pub fn forbidden() -> CustomError {
    CustomError::Forbidden
}

#[catch(500)]
pub fn internal_server_error() -> CustomError {
    CustomError::InternalServerError
}

#[catch(400)]
pub fn bad_request() -> CustomError {
    CustomError::BadRequest
}

#[catch(401)]
pub fn unauthorized() -> CustomError {
    CustomError::Unauthorized
}

#[catch(422)]
pub fn unprocessable_entity() -> CustomError {
    CustomError::UnprocessableEntity
}

#[catch(default)]
pub fn default_catcher(status: Status, _: &Request) -> CustomError {
    CustomError::new(status.code)
}

pub fn get_catchers() -> Vec<rocket::Catcher> {
    catchers![
        not_found,
        forbidden,
        unauthorized,
        bad_request,
        unprocessable_entity,
        default_catcher,
        internal_server_error,
    ]
}
