-- Your SQL goes here
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'user' role
-- this would be used to give users default permissions
INSERT INTO roles (name, description) VALUES ('user', 'Default role for users');
