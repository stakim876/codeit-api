// ~/instagram-api/check.js
// 글을 하나씩 따라 읽는 쿼리 수와, 작성자·사진을 함께 읽는 쿼리 수를 비교한다.
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
  log: [{ emit: 'event', level: 'query' }],
});

let sent = 0;
prisma.$on('query', () => {
  sent += 1;
});

sent = 0;
const posts = await prisma.post.findMany();

for (const post of posts) {
  await prisma.user.findUnique({ where: { id: post.authorId } });
  await prisma.postImage.findMany({ where: { postId: post.id } });
}

console.log(`하나씩 읽기 — 게시물 ${posts.length}개에 쿼리 ${sent}번`);

sent = 0;
await prisma.post.findMany({ include: { author: true, images: true } });

console.log(`함께 읽기 — 게시물 ${posts.length}개에 쿼리 ${sent}번`);

await prisma.$disconnect();
