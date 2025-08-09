# Google SSO Setup Guide

This guide walks you through setting up Google Single Sign-On (SSO) for your Next.js application using NextAuth.js.

## Prerequisites

Before starting, make sure you have:
- A Google account
- Access to Google Cloud Console
- Node.js and npm/yarn installed

## Step 1: Install Dependencies

First, install the required dependencies:

```bash
npm install next-auth
# or
yarn add next-auth
```

## Step 2: Google Cloud Console Setup

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "your-app-auth")
5. Click "Create"

### 2.2 Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on "Google+ API" and click "Enable"

### 2.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace account)
3. Fill in the required fields:
   - **App name**: Your application name
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click "Save and Continue"
5. Skip "Scopes" for now (click "Save and Continue")
6. Add test users if needed (during development)
7. Click "Save and Continue"

### 2.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Enter a name (e.g., "Next.js App")
5. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
6. Click "Create"
7. **Important**: Copy the Client ID and Client Secret - you'll need these!

## Step 3: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

## Step 4: Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain
2. Add your production domain to Google OAuth authorized redirect URIs
3. Make sure all environment variables are set in your hosting platform

### Common Hosting Platforms:

#### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env.local`

#### Netlify
1. Go to "Site settings" > "Environment variables"
2. Add all the variables

#### Railway/Render
1. Go to your app settings
2. Add environment variables in the "Variables" section

## Step 5: Testing the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click the "Sign in with Google" button

4. You should be redirected to Google's OAuth consent screen

5. After authorizing, you should be redirected back to your app as a signed-in user

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Make sure your redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
   - Check for trailing slashes or http vs https

2. **"invalid_client" error**
   - Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Make sure there are no extra spaces or quotes

3. **NextAuth configuration errors**
   - Ensure your `NEXTAUTH_SECRET` is set
   - Check that `NEXTAUTH_URL` matches your current domain

4. **Session not persisting**
   - Make sure your layout includes the SessionProvider
   - Check browser console for any JavaScript errors

### Debug Mode

To enable debug mode for NextAuth, add this to your `.env.local`:

```env
NEXTAUTH_DEBUG=true
```

## Security Considerations

1. **Keep your secrets secure**: Never commit `.env.local` to version control
2. **Use different credentials for different environments**
3. **Regularly rotate your secrets**
4. **Implement proper session management**
5. **Consider implementing role-based access control**

## Next Steps

After setting up basic Google SSO, you might want to:

1. Add user role management
2. Store additional user data in your database
3. Implement protected routes
4. Add other OAuth providers (GitHub, Discord, etc.)
5. Customize the sign-in UI

## File Structure

Your authentication setup includes these files:

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.js
│   ├── auth/
│   │   ├── signin/page.js
│   │   └── error/page.js
│   ├── layout.js (updated)
│   └── page.js (updated)
├── components/auth/
│   ├── SessionProvider.js
│   └── LoginButton.js
└── lib/
    └── auth.js
```

## Support

If you encounter issues:

1. Check the NextAuth.js documentation: https://next-auth.js.org/
2. Review Google OAuth 2.0 documentation
3. Check the browser console and server logs for detailed error messages

Happy coding! 🚀