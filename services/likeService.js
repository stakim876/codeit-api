// ~/instagram-api/services/likeService.js
import { prisma } from '../db.js';
import { NotFoundError } from '../errors.js';

// 여러 번 눌러도 한 번이다. 좋아요 행과 like_count는 함께 끝나야 한다.
export async function likePost(postId, userId) {
  try {
    return await prisma.$transaction(async (tx) => {
      const { count } = await tx.postLike.createMany({
        data: [{ postId, userId }],
        skipDuplicates: true,
      });

      return changeLikeCount(tx, postId, count, true);
    });
  } catch (error) {
    if (error.code === 'P2003')
      throw new NotFoundError('그런 게시물이나 사용자는 없어요');
    throw error;
  }
}

// 취소도 행 삭제와 숫자 변경이 한 묶음이다.
export async function unlikePost(postId, userId) {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.postLike.deleteMany({
      where: { postId, userId },
    });

    return changeLikeCount(tx, postId, -count, false);
  });
}

// like_count만 SQL로 고쳐서 updated_at은 그대로 둔다.
async function changeLikeCount(tx, postId, amount, liked) {
  await tx.$executeRaw`
    UPDATE posts SET like_count = like_count +${amount} WHERE id =${postId}`;

  const post = await tx.post.findUnique({ where: { id: postId } });
  if (!post) throw new NotFoundError('그런 게시물은 없어요');

  return { liked, likeCount: post.likeCount };
}

export async function getLikers(postId) {
  const likes = await prisma.postLike.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { id: 'asc' },
  });

  return likes.map((like) => like.user.username);
}
