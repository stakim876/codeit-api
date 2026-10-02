import { prisma } from '../db.js';
import { NotFoundError, BadRequestError } from '../errors.js';

// 작성자 이름이 있으면 그 사람 글만 가져오고, 사람 정보도 같이 붙인다.
export function getPosts({ username, limit }) {
  return prisma.post.findMany({
    where: username ? { author: { username } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { author: true },
  });
}

// 단일 게시물 조회
export async function getPost(id) {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new NotFoundError('그런 게시물은 없습니다.');
  }

  return post;
}

// 게시물 생성
export async function createPost(data) {
  try {
    return await prisma.post.create({ data });
  } catch (error) {
    // 없는 작성자(P2003)는 400으로 돌린다.
    if (error.code === 'P2003')
      throw new BadRequestError('그런 사용자는 없어요');
    throw error;
  }
}

export async function updatePost(id, data) {
  try {
    return await prisma.post.update({ where: { id }, data });
  } catch (error) {
    if (error.code === 'P2025') throw new NotFoundError('그런 게시물은 없어요');
    if (error.code === 'P2003')
      throw new BadRequestError('그런 사용자는 없어요');
    throw error;
  }
}

export async function removePost(id) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') throw new NotFoundError('그런 게시물은 없어요');
    throw error;
  }
}