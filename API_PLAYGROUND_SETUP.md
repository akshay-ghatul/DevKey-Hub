# DevKey Hub - API Playground Setup Guide

## Issue: 500 Internal Server Error

The API playground is showing a 500 error because Supabase environment variables are not configured. Here's how to fix it:

## Step 1: Set Up Supabase Environment Variables

1. **Create a `.env.local` file** in your project root (dandi folder):
   ```bash
   touch .env.local
   ```

2. **Add your Supabase credentials** to the `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Get your Supabase credentials**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use existing one
   - Go to Settings → API
   - Copy the Project URL and anon public key

## Step 2: Set Up the Database

1. **Run the database setup** in your Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of database-setup.sql
   CREATE TABLE IF NOT EXISTS api_keys (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       value TEXT UNIQUE NOT NULL,
       usage INTEGER DEFAULT 0,
       limit_usage BOOLEAN DEFAULT false,
       monthly_limit INTEGER DEFAULT 1000,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Insert sample data** (optional):
   ```sql
   INSERT INTO api_keys (name, value, usage) VALUES
       ('test-key', 'tvly-dev-1234567890abcdef', 0)
   ON CONFLICT (value) DO NOTHING;
   ```

## Step 3: Test the Connection

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test the Supabase connection**:
   - Visit: `http://localhost:3000/api/test-supabase`
   - You should see: `{"message":"Supabase connection successful"}`

3. **Test the API playground**:
   - Go to: `http://localhost:3000/playground`
   - Enter the test API key: `tvly-dev-1234567890abcdef`
   - Should show: "Valid API key! You can now use the playground"

## Step 4: Create Your Own API Keys

1. **Go to the dashboard**: `http://localhost:3000/dashboards`
2. **Create a new API key** with any name
3. **Copy the generated API key**
4. **Test it in the playground**

## Troubleshooting

### If you still get 500 errors:

1. **Check environment variables**:
   ```bash
   # In your terminal, check if .env.local exists
   ls -la .env.local
   ```

2. **Verify Supabase credentials**:
   - Make sure the URL starts with `https://`
   - Make sure the anon key starts with `eyJ`

3. **Check database table**:
   - Go to Supabase Dashboard → Table Editor
   - Verify `api_keys` table exists

4. **Test with curl**:
   ```bash
   curl -X POST http://localhost:3000/api/validate-key \
     -H "Content-Type: application/json" \
     -d '{"apiKey":"tvly-dev-1234567890abcdef"}'
   ```

### Common Issues:

- **"Table does not exist"**: Run the database setup SQL
- **"Invalid API key"**: Make sure you're using a key from the database
- **"Server configuration error"**: Check your `.env.local` file

## API Endpoints Available

- `POST /api/validate-key` - Validate API keys
- `GET /api/test` - Test GET endpoint
- `POST /api/test` - Test POST endpoint  
- `GET /api/status` - Get API status
- `GET /api/test-supabase` - Test Supabase connection

## Security Notes

- API keys are stored in plain text (consider encryption for production)
- The playground uses sessionStorage for temporary key storage
- Always use HTTPS in production
- Consider implementing rate limiting 