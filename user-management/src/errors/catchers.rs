use super::custom_error::CustomError;

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
