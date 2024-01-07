-- This file should undo anything in `up.sql`
-- Remove the role_id column
ALTER TABLE users DROP COLUMN role_id;
