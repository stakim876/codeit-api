// ~/instagram-api/services/postService.js
import { prisma } from '../db.js';
import { BadRequestError, NotFoundError } from '../errors.js';

// 쓸 필드만 가져온다. 사진은 캐러셀 순서인 imgOrder대로 읽는다.
const postFields = {
  id: true,
  authorId: true,
  postAlt: true,
  content: true,
  likeCount: true,
  commentCount: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { username: true, profileImage: true } },
  images: { select: { imageUrl: true }, orderBy: { imgOrder: 'asc' } },
};

// 테이블은 작성자 번호와 사진 행을 갖고, 화면에는 이름과 사진 주소 목록을 준다.
function flatten({ author, images, ...post }) {
  return {
    ...post,
    username: author.username,
    profileImage: author.profileImage,
    imageUrls: images.map((image) => image.imageUrl),
  };
}

const withRelations = {
  author: true,
  images: { orderBy: { imgOrder: 'asc' } },
};

// 작성자 이름이 있으면 그 사람 글만 가져온다.
export async function getPosts({ username, limit }) {
  const posts = await prisma.post.findMany({
    where: username ? { author: { username } } : undefined,
    select: postFields,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return posts.map(flatten);
}

export async function getPost(id) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: withRelations,
  });

  if (!post) throw new NotFoundError('그런 게시물은 없어요');

  return flatten(post);
}

// 글과 사진을 한 번에 만든다. 사진 차례는 목록 순서다.
export async function createPost({ imageUrls, ...data }) {
  try {
    const post = await prisma.post.create({
      data: {
        ...data,
        images: {
          create: imageUrls.map((imageUrl, order) => ({
            imageUrl,
            imgOrder: order + 1,
          })),
        },
      },
      include: withRelations,
    });

    return flatten(post);
  } catch (error) {
    if (error.code === 'P2003')
      throw new BadRequestError('그런 사용자는 없어요');
    throw error;
  }
}

export async function updatePost(id, data) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: withRelations,
    });

    return flatten(post);
  } catch (error) {
    if (error.code === 'P2025') throw new NotFoundError('그런 게시물은 없어요');
    if (error.code === 'P2003')
      throw new BadRequestError('그런 사용자는 없어요');
    throw error;
  }
}

export async function removePost(id) {
  try {
    const post = await prisma.post.delete({
      where: { id },
      include: withRelations,
    });

    return flatten(post);
  } catch (error) {
    if (error.code === 'P2025') throw new NotFoundError('그런 게시물은 없어요');
    throw error;
  }
}
