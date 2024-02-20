use std::env;

use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};

use crate::models::auth_model::Claims;

// FIXME: JWT secret is not being fetched from .env file
pub fn generate_token(user_id: i32 /*, role: &str*/) -> Result<String, String> {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|err| "jwt-secret".to_string());
    let validity = env::var("TOKEN_VALIDITY")
        .unwrap_or_else(|_| "30".to_string())
        .parse::<i64>()
        .unwrap_or(30);

    let claims = Claims {
        user_id,
        exp: (chrono::Utc::now() + chrono::Duration::days(validity)).timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    )
    .map_err(|e| e.to_string())?;

    Ok(token)
}

// FIXME: JWT secret is not being fetched from .env file
pub fn verify_token(token: &str) -> Option<Claims> {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|err| "jwt-secret".to_string());
    let validation = Validation::default();

    match decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_ref()),
        &validation,
    ) {
        Ok(token_data) => Some(token_data.claims),
        Err(_) => None,
    }
}
