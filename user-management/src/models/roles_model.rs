use diesel::{self, prelude::*};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Serialize, Deserialize)]
#[diesel(table_name=roles)]
pub struct Role {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}
