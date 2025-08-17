-- Database Migration: Add user_id field to api_keys table
-- Run this in your Supabase SQL editor

-- Add user_id column to api_keys table
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS user_id UUID;

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Update existing api_keys to assign them to a default user
-- You may want to customize this based on your needs
-- For now, we'll assign them to the first user in the users table
UPDATE api_keys 
SET user_id = (SELECT id FROM users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL after updating existing records
ALTER TABLE api_keys ALTER COLUMN user_id SET NOT NULL;

-- Update the RLS policy to restrict access based on user_id
DROP POLICY IF EXISTS "Allow all operations on api_keys" ON api_keys;

-- Create a new policy that only allows users to access their own API keys
CREATE POLICY "Users can only access their own API keys" ON api_keys
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Add foreign key constraint to ensure referential integrity
ALTER TABLE api_keys 
ADD CONSTRAINT fk_api_keys_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE; 