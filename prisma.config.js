// ~/instagram-api/prisma.config.js
// 스키마와 마이그레이션 위치, Postgres 접속 주소를 여기서 정한다.
import { defineConfig } from 'prisma/config';

process.loadEnvFile();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
