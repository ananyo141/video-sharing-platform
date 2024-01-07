use super::custom_error::CustomError;

use rocket::http::Status;
use rocket::Request;

#[catch(404)]
pub fn not_found() -> CustomError {
    CustomError::not_found("The requested resource could not be found".to_string())
}

#[catch(403)]
pub fn forbidden() -> CustomError {
    CustomError::forbidden("You do not have permission to access this resource".to_string())
}

#[catch(500)]
pub fn internal_server_error() -> CustomError {
    CustomError::internal_server_error(
        "The server encountered an unexpected condition which prevented it from fulfilling the request"
            .to_string(),
    )
}

#[catch(400)]
pub fn bad_request() -> CustomError {
    CustomError::bad_request(
        "The server could not understand the request due to invalid syntax".to_string(),
        None,
    )
}

#[catch(401)]
pub fn unauthorized() -> CustomError {
    CustomError::unauthorized(
        "The request has not been applied because it lacks valid authentication credentials for the target resource"
            .to_string(),
        None)
}

#[catch(422)]
pub fn unprocessable_entity(_req: &Request) -> CustomError {
    CustomError::unprocessable_entity(
        "The request was well-formed but was unable to be followed due to semantic errors"
            .to_string(),
        None,
    )
}

#[catch(default)]
pub fn default_catcher(status: Status, r: &Request) -> CustomError {
    CustomError::new(status, r.to_string(), None)
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
