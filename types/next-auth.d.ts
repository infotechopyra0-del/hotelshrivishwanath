import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      isVerified: boolean
    } & DefaultSession['user']
  }

  interface User {
    role: string
    isVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    isVerified: boolean
  }
}