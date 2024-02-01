// @generated automatically by Diesel CLI.

diesel::table! {
    roles (id) {
        id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        description -> Nullable<Varchar>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        email -> Varchar,
        password -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        role_id -> Int4,
    }
}

diesel::joinable!(users -> roles (role_id));

diesel::allow_tables_to_appear_in_same_query!(
    roles,
    users,
);
