use rocket::serde::{json, Serialize};

#[derive(Serialize)]
pub struct ResFmt {
    pub success: bool,
    pub message: String,
    pub data: json::Value,
    pub page: i64,
}

impl ResFmt {
    pub fn new(success: bool, message: String, data: json::Value) -> Self {
        Self {
            success,
            message,
            data,
            page: 1,
        }
    }

    pub fn with_page(mut self, page: i64) -> Self {
        self.page = page;
        self
    }
}
