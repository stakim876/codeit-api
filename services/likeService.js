// ~/instagram-api/services/likeService.js
import { prisma } from '../db.js';
import { NotFoundError } from '../errors.js';

// 몇 번을 불러도 결과는 눌린 상태 하나다. 이미 있으면 행이 안 늘고 숫자도 안 오른다.
export async function likePost(postId, userId) {
  try {
    // 좋아요 행과 like_count 변경은 함께 끝나야 한다. 하나라도 실패하면 둘 다 없던 일이 된다.
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

// 몇 번을 불러도 결과는 안 눌린 상태 하나다.
export async function unlikePost(postId, userId) {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.postLike.deleteMany({
      where: { postId, userId },
    });

    return changeLikeCount(tx, postId, -count, false);
  });
}

// 화면 숫자는 따로 적어 둔 컬럼이다. SQL로 그 숫자만 고쳐서 updated_at은 그대로 둔다.
async function changeLikeCount(tx, postId, amount, liked) {
  await tx.$executeRaw`
    UPDATE posts SET like_count = like_count + ${amount} WHERE id = ${postId}`;

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
