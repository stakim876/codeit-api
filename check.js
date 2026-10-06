// ~/instagram-api/check.js
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 쿼리 개수를 센다. 하나씩 읽기와 함께 읽기를 비교한다.
const prisma = new PrismaClient({
  adapter,
  log: [{ emit: 'event', level: 'query' }],
});

let sent = 0;
prisma.$on('query', () => {
  sent += 1;
});

// 게시물마다 작성자와 사진을 따로 묻는다.
sent = 0;
const posts = await prisma.post.findMany();

for (const post of posts) {
  await prisma.user.findUnique({ where: { id: post.authorId } });
  await prisma.postImage.findMany({ where: { postId: post.id } });
}

console.log(`하나씩 읽기 — 게시물${posts.length}개에 쿼리${sent}번`);

// 작성자와 사진을 한 번에 읽는다.
sent = 0;
await prisma.post.findMany({ include: { author: true, images: true } });

console.log(`함께 읽기 — 게시물${posts.length}개에 쿼리${sent}번`);

await prisma.$disconnect();
