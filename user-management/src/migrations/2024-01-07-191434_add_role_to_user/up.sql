-- Your SQL goes here
-- Add foreign key constraint to roles
ALTER TABLE users
ADD CONSTRAINT fk_user_role
FOREIGN KEY (role_id) REFERENCES roles(id);

-- Set the default value for existing rows
UPDATE users SET role_id = 1 WHERE role_id IS NULL;
