-- Your SQL goes here
ALTER TABLE users
ADD COLUMN role_id INT NOT NULL DEFAULT 1;

-- Add foreign key constraint to roles
ALTER TABLE users
ADD CONSTRAINT fk_user_role
FOREIGN KEY (role_id) REFERENCES roles(id);
