-- Create the api_keys table in Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    value TEXT UNIQUE NOT NULL,
    usage INTEGER DEFAULT 0,
    limit_usage BOOLEAN DEFAULT false,
    monthly_limit INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the value column for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_value ON api_keys(value);

-- Create an index on the name column for faster searches
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);





-- Enable Row Level Security (RLS) for better security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can customize this based on your needs)
CREATE POLICY "Allow all operations on api_keys" ON api_keys
    FOR ALL USING (true);

-- Insert some sample data (optional)
INSERT INTO api_keys (name, value, usage) VALUES
    ('default', 'tvly-dev-1234567890abcdef', 0),
    ('production', 'tvly-prod-abcdef1234567890', 150)
ON CONFLICT (value) DO NOTHING; 