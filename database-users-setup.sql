-- Create the users table in Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy for users (you can customize this based on your needs)
-- For now, allowing all operations, but you might want to restrict this
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key relationship between api_keys and users
-- First, add user_id column to api_keys table
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Update the RLS policy for api_keys to be user-specific (optional)
-- DROP POLICY IF EXISTS "Allow all operations on api_keys" ON api_keys;
-- CREATE POLICY "Users can manage their own api_keys" ON api_keys
--     FOR ALL USING (auth.uid()::text = user_id::text);

-- Function to get or create user
CREATE OR REPLACE FUNCTION get_or_create_user(
    p_google_id TEXT,
    p_email TEXT,
    p_name TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    google_id TEXT,
    email TEXT,
    name TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN,
    is_new_user BOOLEAN
) AS $$
DECLARE
    user_record RECORD;
    is_new BOOLEAN := FALSE;
BEGIN
    -- Try to find existing user
    SELECT * INTO user_record 
    FROM users u 
    WHERE u.google_id = p_google_id OR u.email = p_email;
    
    IF NOT FOUND THEN
        -- Create new user
        INSERT INTO users (google_id, email, name, image_url, last_login)
        VALUES (p_google_id, p_email, p_name, p_image_url, NOW())
        RETURNING * INTO user_record;
        is_new := TRUE;
    ELSE
        -- Update existing user info and last_login
        UPDATE users 
        SET 
            name = COALESCE(p_name, users.name),
            image_url = COALESCE(p_image_url, users.image_url),
            last_login = NOW(),
            is_active = true
        WHERE users.google_id = p_google_id OR users.email = p_email
        RETURNING * INTO user_record;
    END IF;
    
    -- Return user data with is_new_user flag
    RETURN QUERY SELECT 
        user_record.id,
        user_record.google_id,
        user_record.email,
        user_record.name,
        user_record.image_url,
        user_record.created_at,
        user_record.updated_at,
        user_record.last_login,
        user_record.is_active,
        is_new;
END;
$$ LANGUAGE plpgsql;