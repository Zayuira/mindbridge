import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: string
    is_verified: boolean
  }

  interface Session {
    user: {
      id: string
      role: string
      is_verified: boolean
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    is_verified: boolean
  }
}
