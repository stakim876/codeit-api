/*
  복습: Prisma로 Postgres에 연결하기
  핵심: DATABASE_URL로 PrismaPg 어댑터를 만들고, 그 클라이언트를 prisma로 내보낸다.
  이유: 쿼리를 파일마다 새로 열지 않고 한 클라이언트를 같이 쓴다.
  실행: 이 파일을 직접 실행하면 서버가 뜨지 않는다. seed.js와 서비스가 이 prisma로 테이블을 읽는다.
  활용: 게시물 서비스가 findMany와 create를 이 클라이언트로 호출할 때 쓴다.
*/

// ~/instagram-api/db.js
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
