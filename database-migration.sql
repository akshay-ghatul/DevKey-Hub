-- Migration script to update existing api_keys table
-- Run this in your Supabase SQL editor if you have an existing table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



-- Add a temporary column for the new UUID
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS new_id UUID;

-- Generate UUIDs for existing records
UPDATE api_keys SET new_id = uuid_generate_v4() WHERE new_id IS NULL;

-- Drop the old primary key constraint
ALTER TABLE api_keys DROP CONSTRAINT IF EXISTS api_keys_pkey;

-- Drop the old id column
ALTER TABLE api_keys DROP COLUMN IF EXISTS id;

-- Rename new_id to id
ALTER TABLE api_keys RENAME COLUMN new_id TO id;

-- Add primary key constraint on the new UUID column
ALTER TABLE api_keys ADD PRIMARY KEY (id);

-- Remove the type column
ALTER TABLE api_keys DROP COLUMN IF EXISTS type;

-- Remove monthly limit columns
ALTER TABLE api_keys DROP COLUMN IF EXISTS limit_usage;
ALTER TABLE api_keys DROP COLUMN IF EXISTS monthly_limit;

-- Remove user_id column if it exists
ALTER TABLE api_keys DROP COLUMN IF EXISTS user_id;

-- Recreate indexes
DROP INDEX IF EXISTS idx_api_keys_key;
DROP INDEX IF EXISTS idx_api_keys_name;

CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
ORDER BY ordinal_position; 