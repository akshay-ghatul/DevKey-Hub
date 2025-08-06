# Supabase Setup Guide

This guide will help you connect your API key management dashboard to a PostgreSQL database hosted on Supabase.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

## 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database-setup.sql` from this project
3. Paste it into the SQL editor and run it
4. This will create the `api_keys` table with the proper schema

## 5. Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to `/dashboards`
3. Try creating, editing, and deleting API keys
4. Check the browser console for any errors

## 6. Database Schema

The `api_keys` table has the following structure:

- `id` - Primary key (UUID, auto-generated)
- `name` - API key name (required, TEXT)
- `value` - The actual API key (unique, auto-generated, TEXT)
- `usage` - Usage count (defaults to 0)
- `limit_usage` - Whether to limit monthly usage (boolean)
- `monthly_limit` - Monthly usage limit (integer)
- `created_at` - Creation timestamp

## 7. API Endpoints

The application provides the following API endpoints:

- `GET /api/keys` - Get all API keys
- `POST /api/keys` - Create a new API key
- `GET /api/keys/[id]` - Get a specific API key
- `PUT /api/keys/[id]` - Update an API key
- `DELETE /api/keys/[id]` - Delete an API key

## 8. Security Considerations

- The current setup uses Row Level Security (RLS) with a permissive policy
- In production, you should implement proper authentication and authorization
- Consider adding user-specific policies to restrict access to API keys
- The API keys are stored in plain text - consider encrypting sensitive data

## 9. Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Check that your environment variables are set correctly
2. **"Table does not exist" error**: Make sure you've run the database setup SQL
3. **CORS errors**: Supabase handles CORS automatically, but check your browser console
4. **Network errors**: Verify your Supabase project URL is correct

### Debug Steps:

1. Check the browser console for error messages
2. Verify your environment variables are loaded correctly
3. Test the Supabase connection in the browser console:
   ```javascript
   // In browser console
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
   ```

## 10. Production Deployment

When deploying to production:

1. Set up environment variables in your hosting platform
2. Consider using Supabase's service role key for server-side operations
3. Implement proper authentication and authorization
4. Set up database backups
5. Monitor API usage and performance 