import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getOrCreateUser } from '../../../../../lib/userService.js'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile'
        }
      },
      profile(profile) {
        console.log('Google Profile received:', profile)
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, user, trigger }) {
      // Debug logging
      console.log('JWT Callback - Trigger:', trigger)
      console.log('JWT Callback - Account:', account ? 'Present' : 'Not present')
      console.log('JWT Callback - Profile:', profile)
      console.log('JWT Callback - User:', user)
      console.log('JWT Callback - Current token:', token)
      
      // On initial sign in, store the profile data
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.sub
        token.picture = profile.picture || user.image
        token.name = profile.name
        token.email = profile.email
        
        // Store database user information
        token.dbId = user.dbId
        token.isNewUser = user.isNewUser
        
        console.log('JWT Callback - Initial login, setting token.picture to:', token.picture)
        console.log('JWT Callback - Database user ID:', token.dbId)
        console.log('JWT Callback - Is new user:', token.isNewUser)
      }
      
      // On subsequent calls, preserve the picture if it exists
      if (!token.picture && user?.image) {
        token.picture = user.image
        console.log('JWT Callback - Using user.image as fallback:', token.picture)
      }
      
      console.log('JWT Callback - Final token:', token)
      return token
    },
    async session({ session, token }) {
      console.log('Session Callback - Input token:', token)
      console.log('Session Callback - Input session:', session)
      
      // Ensure user object exists
      if (!session.user) {
        session.user = {}
      }
      
      // Map token data to session
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      session.user.image = token.picture
      
      // Add database user information
      session.user.dbId = token.dbId
      session.user.isNewUser = token.isNewUser
      
      console.log('Session Callback - Final session:', session)
      console.log('Session Callback - Final session.user.image:', session.user.image)
      
      return session
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback - User:', user)
      console.log('SignIn Callback - Account:', account)
      console.log('SignIn Callback - Profile:', profile)
      
      // Only process for Google OAuth sign-ins
      if (account?.provider === 'google' && profile) {
        try {
          console.log('SignIn: Processing Google OAuth sign-in')
          
          const userData = {
            googleId: profile.sub,
            email: profile.email,
            name: profile.name,
            imageUrl: profile.picture
          }
          
          console.log('SignIn: Creating/updating user with data:', userData)
          
          const result = await getOrCreateUser(userData)
          
          if (result.success) {
            console.log('SignIn: User processed successfully:', {
              userId: result.user.id,
              isNewUser: result.isNewUser
            })
            
            // Add database user info to the user object for the JWT callback
            user.dbId = result.user.id
            user.isNewUser = result.isNewUser
            user.image = result.user.image_url || profile.picture
            
            if (result.isNewUser) {
              console.log('🎉 SignIn: Welcome new user!', result.user.name || result.user.email)
            } else {
              console.log('👋 SignIn: Welcome back!', result.user.name || result.user.email)
            }
          } else {
            console.error('SignIn: Failed to process user:', result.error)
            // Still allow sign-in even if database operation fails
          }
        } catch (error) {
          console.error('SignIn: Error processing user registration:', error)
          // Still allow sign-in even if database operation fails
        }
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }