import express from 'express';
import * as postService from '../services/postService.js';
import * as likeService from '../services/likeService.js';
import { NotFoundError } from '../errors.js';
import {
  validateBody
} from '../middlewares/validate.js';
import { postCreateSchema, postUpdateSchema } from '../schemas/postSchema.js';

const router = express.Router();

function parseUserId(req, res, next) {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    next(new NotFoundError('그런 사용자는 없어요'));
    return;
  }

  req.userId = userId;
  next();
}

// 주소의 id는 정수여야 한다. 아니면 전역 처리기가 404를 만든다.
function parseId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    next(new NotFoundError('그런 게시물은 없어요.'));
    return;
  }
  req.postId = id;
  next();
}

router.get('/', async (req, res) => {
  const posts = await postService.getPosts({
    username: req.query.username,
    limit: Number(req.query.limit) || undefined,
  });
  res.json(posts);
});

router.get('/:id', parseId, async (req, res) => {

  const post = await postService.getPost(req.postId);

  res.status(200).json(post);
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

// 좋아요 하나는 게시물 번호와 사용자 번호다. PUT과 DELETE는 몇 번을 보내도 결과가 같다.
router.put('/:id/likes/:userId', parseId, parseUserId, async (req, res) => {
  const status = await likeService.likePost(req.postId, req.userId);

  res.json(status);
});

router.delete('/:id/likes/:userId', parseId, parseUserId, async (req, res) => {
  const status = await likeService.unlikePost(req.postId, req.userId);

  res.json(status);
});


export default router;