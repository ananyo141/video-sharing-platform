use bcrypt::{hash, verify};

// Hash a password using argon2
pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, 8)
}

// Compare a password against a hashed password
pub fn compare_password(password: &str, hashed_password: &str) -> bool {
    match verify(password, hashed_password) {
        Ok(valid) => valid,
        Err(_) => false,
    }
}

// Example of using the functions
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_and_compare_password() {
        let password = "password123";
        let hashed_password = hash_password(password).unwrap();
        assert_ne!(password, hashed_password);
        assert!(compare_password(password, &hashed_password));
        assert_eq!(compare_password("invalid", &hashed_password), false);
    }
}
