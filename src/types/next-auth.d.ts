import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      image?: string | null
      nickname?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nickname?: string | null
  }
}
