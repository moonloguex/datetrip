// Prisma Client 싱글톤 패턴
//
// Next.js의 dev 환경에서는 hot reload가 일어날 때마다 모듈이 재실행됩니다.
// 매번 new PrismaClient()를 만들면 DB 연결이 계속 새로 생기면서 connection pool이 고갈됩니다.
// 이를 방지하기 위해 globalThis에 인스턴스를 캐시합니다.
//
// production에서는 모듈이 한 번만 로드되므로 이 패턴이 불필요하지만,
// 개발/배포 코드를 통일하기 위해 동일한 패턴을 사용합니다.

import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
