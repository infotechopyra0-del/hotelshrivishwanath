import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect'
import Customer from '@/models/Customer'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          await dbConnect()
          
          // Find user by email (case insensitive)
          const user = await Customer.findOne({ 
            email: credentials.email.toLowerCase() 
          })
          
          if (!user) {
            // More helpful error message for missing users
            throw new Error('Invalid email or password. Please check your credentials or sign up if you don\'t have an account.')
          }

          // Check if user account is active
          if (user.status === 'Inactive' || user.status === 'Blacklisted') {
            throw new Error('Your account has been deactivated. Please contact support.')
          }

          // Check password
          const isPasswordValid = await user.comparePassword(credentials.password)
          
          if (!isPasswordValid) {
            throw new Error('Invalid email or password. Please check your credentials.')
          }

          // Update last visit
          await Customer.findByIdAndUpdate(user._id, { 
            lastVisit: new Date() 
          })

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error(error instanceof Error ? error.message : 'Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signOut({ session, token }) {
      // Log the signout event
      console.log('User signed out:', session?.user?.email || token?.email)
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect()
          let existingUser = await Customer.findOne({ email: user.email })
          
          if (!existingUser) {
            existingUser = new Customer({
              name: user.name || profile?.name,
              email: user.email,
              role: 'user',
              isVerified: true,
              password: 'google-auth-user',
            })
            await existingUser.save()
          }
          
          // Update user info in the session
          user.id = existingUser._id.toString()
          user.role = existingUser.role
          user.isVerified = existingUser.isVerified
          
          return true
        } catch (error) {
          console.error('Google sign-in error:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.isVerified = user.isVerified
      }
      
      // For Google OAuth, ensure we have the role from database
      if (account?.provider === 'google' && token.email) {
        try {
          await dbConnect()
          const dbUser = await Customer.findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role
            token.isVerified = dbUser.isVerified
          }
        } catch (error) {
          console.error('JWT callback error:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle signout redirect
      if (url.includes('/api/auth/signout') || url.includes('/signout')) {
        return baseUrl + '/'
      }
      
      // Check if user is trying to access admin routes
      if (url.startsWith('/admin')) {
        return `${baseUrl}/admin/dashboard`
      }
      
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      if (new URL(url).origin === baseUrl) {
        return url
      }
      
      return baseUrl + '/'
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}