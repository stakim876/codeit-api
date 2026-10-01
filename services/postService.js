import { prisma } from '../db.js';

// username이 있으면 그 작성자만, limit이 있으면 그 개수만 최신순으로 가져온다.
export function getPosts({ username, limit }) {
  return prisma.post.findMany({
    where: { username },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export function getPost(id) {
  return prisma.post.findUnique({ where: { id } });
}

export function createPost(data) {
  return prisma.post.create({ data });
}

// 없는 글(P2025)은 null을 돌려 라우터가 404로 응답하게 한다.
export async function updatePost(id, data) {
  try {
    return await prisma.post.update({ where: { id }, data });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function removePost(id) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
