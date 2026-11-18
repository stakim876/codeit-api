/*
  복습: /api/posts 아래의 목록, 한 건, 생성, 수정, 삭제, 좋아요
  핵심: parseId와 parseUserId가 주소 조각을 정수로 바꾸고, 목록은 주소의 userId를 보는 사람으로 넘긴다.
  이유: 서비스가 정수가 아닌 값을 Prisma에 넘기기 전에 라우터에서 거른다. 에러를 next로 넘기면 전역 처리기가 응답한다.
  실행: 목록은 username, userId, limit, cursor를 서비스에 넘기고 { items, hasNext }를 JSON으로 보낸다. 생성은 201이다. 좋아요 PUT과 DELETE는 몇 번을 보내도 같은 결과다. 정수가 아닌 id는 404다.
  활용: 화면이 로그인 전에 누가 보는지 주소에 실어 목록을 받을 때 쓴다.
*/

// ~/instagram-api/routes/posts.js
import express from 'express';
import * as postService from '../services/postService.js';
import * as likeService from '../services/likeService.js';
import { validateBody } from '../middlewares/validate.js';
import { postCreateSchema, postUpdateSchema } from '../schemas/postSchema.js';
import { NotFoundError } from '../errors.js';

const router = express.Router();

function parseId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    next(new NotFoundError('그런 게시물은 없어요'));
    return;
  }

  req.postId = id;
  next();
}

function parseUserId(req, res, next) {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    next(new NotFoundError('그런 사용자는 없어요'));
    return;
  }

  req.userId = userId;
  next();
}

router.get('/', async (req, res) => {
  const page = await postService.getPosts({
    username: req.query.username,
    // 로그인을 배우기 전까지는 «누가 보는지» 를 주소에 실어 받는다.
    userId: Number(req.query.userId) || undefined,
    limit: Number(req.query.limit) || undefined,
    cursor: Number(req.query.cursor) || undefined,
  });

  res.json(page);
});

router.get('/:id', parseId, async (req, res) => {
  const post = await postService.getPost(req.postId);

  res.json(post);
});

router.post('/', validateBody(postCreateSchema), async (req, res) => {
  const newPost = await postService.createPost(req.body);

  res.status(201).json(newPost);
});

router.patch('/:id', parseId, validateBody(postUpdateSchema), async (req, res) => {
  const post = await postService.updatePost(req.postId, req.body);

  res.json(post);
});

router.delete('/:id', parseId, async (req, res) => {
  const deleted = await postService.removePost(req.postId);

  res.json(deleted);
});

router.get('/:id/likes', parseId, async (req, res) => {
  const usernames = await likeService.getLikers(req.postId);

  res.json(usernames);
});

// 「3번 게시물에 2번 사람이 누른 좋아요」 하나를 주소로 가리킨다.
// 있게 만들기(PUT)와 없게 만들기(DELETE) — 둘 다 몇 번을 보내도 결과가 같다.
router.put('/:id/likes/:userId', parseId, parseUserId, async (req, res) => {
  const status = await likeService.likePost(req.postId, req.userId);

  res.json(status);
});

router.delete('/:id/likes/:userId', parseId, parseUserId, async (req, res) => {
  const status = await likeService.unlikePost(req.postId, req.userId);

  res.json(status);
});

export default router;
