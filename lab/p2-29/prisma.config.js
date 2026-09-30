// ~/instagram-api/lab/p2-29/prisma.config.js
// 실습용 bookstore. 스키마는 이 폴더에 있고, 접속 주소는 BOOKSTORE_URL이다.
import { defineConfig } from 'prisma/config';

process.loadEnvFile();

export default defineConfig({
  schema: 'schema.prisma',
  migrations: { path: 'migrations' },
  datasource: { url: process.env.BOOKSTORE_URL },
});
