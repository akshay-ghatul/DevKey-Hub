import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile'
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
        token.picture = profile.picture
        token.name = profile.name
        token.email = profile.email
        
        console.log('JWT Callback - Initial login, setting token.picture to:', token.picture)
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
      
      console.log('Session Callback - Final session:', session)
      console.log('Session Callback - Final session.user.image:', session.user.image)
      
      return session
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback - User:', user)
      console.log('SignIn Callback - Account:', account)
      console.log('SignIn Callback - Profile:', profile)
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