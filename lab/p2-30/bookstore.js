// 실습용 bookstore 클라이언트. 생성 결과는 lab/generated에 있다.
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/index.js';

const adapter = new PrismaPg({ connectionString: process.env.BOOKSTORE_URL});

export const bookstore = new PrismaClient({ adapter });