use crate::Db;
use crate::{schema::users, utils::hash_passwd::hash_password};

use chrono::prelude::*;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Insertable, Serialize, Deserialize)]
#[diesel(table_name=users)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub password: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name=users)]
pub struct NewUser {
    pub email: String,
    pub password: String,
}

#[derive(AsChangeset, Serialize, Deserialize)]
#[diesel(table_name=users)]
pub struct UpdateUser {
    pub email: Option<String>,
    pub password: Option<String>,
}

impl User {
    pub async fn find_all(connection: Db) -> QueryResult<Vec<User>> {
        connection
            .run(move |c| users::table.order(users::id.desc()).load::<User>(c))
            .await
    }

    pub async fn find_by_id(conn: Db, user_id: i32) -> QueryResult<User> {
        conn.run(move |c| users::table.find(user_id).first(c)).await
    }

    pub async fn find_by_email(conn: Db, user_email: String) -> QueryResult<User> {
        conn.run(move |c| users::table.filter(users::email.eq(user_email)).first(c))
            .await
    }

    pub async fn create(conn: Db, new_user: &NewUser) -> QueryResult<User> {
        let hashed_user = NewUser {
            password: hash_password(&new_user.password).unwrap(),
            email: new_user.email.clone(),
        };
        conn.run(move |c| {
            diesel::insert_into(users::table)
                .values(&hashed_user)
                .get_result(c)
        })
        .await
    }

    pub async fn update(conn: Db, user_id: i32, user: UpdateUser) -> QueryResult<User> {
        conn.run(move |c| {
            diesel::update(users::table.find(user_id))
                .set(&user)
                .get_result(c)
        })
        .await
    }

    pub async fn delete(conn: Db, user_id: i32) -> QueryResult<usize> {
        conn.run(move |c| diesel::delete(users::table.find(user_id)).execute(c))
            .await
    }
}
