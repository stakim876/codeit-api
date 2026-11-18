/*
  복습: Prisma가 읽을 스키마와 데이터베이스 주소
  핵심: schema.prisma와 migrations 폴더, DATABASE_URL을 이 설정에 적는다.
  이유: 배포 환경에는 .env 파일이 없을 수 있어서, 주소가 이미 있으면 파일을 다시 읽지 않는다.
  실행: DATABASE_URL이 비어 있을 때만 .env를 읽는다. 마이그레이션 경로는 prisma/migrations다.
  활용: prisma migrate와 seed가 어느 데이터베이스로 가는지 이 파일에서 정한다.
*/

// ~/instagram-api/prisma.config.js
import { defineConfig } from 'prisma/config';

// 배포한 곳에는 `.env` 파일이 없어요. 값이 이미 환경에 있으면 파일을 안 찾아요.
if (process.env.DATABASE_URL === undefined) process.loadEnvFile();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
