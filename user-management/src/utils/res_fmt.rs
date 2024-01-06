use rocket::serde::json::{json, Json, Value};
use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ResFmt<'a> {
    pub success: bool,
    pub message: &'a str,
    pub data: Value,
    pub page: i64,
}

impl<'a> ResFmt<'a> {
    pub fn new(success: bool, message: &'a str) -> Self {
        Self {
            success,
            message,
            data: json!({}),
            page: 1,
        }
    }

    pub fn with_data(mut self, data: Value) -> Self {
        self.data = data;
        self
    }

    pub fn with_page(mut self, page: i64) -> Self {
        self.page = page;
        self
    }

    pub fn to_json(&self) -> Json<Value> {
        Json(json!({
            "success": self.success,
            "message": self.message,
            "data": self.data,
            "page": self.page,
        }))
    }
}
