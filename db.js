// Postgres 클라이언트는 여기서 한 번만 만들어 같이 쓴다.
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// 보낸 SQL을 로그로 남긴다.
export const prisma = new PrismaClient({ adapter, log: ['query'] });