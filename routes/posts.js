import express from 'express';
import * as postService from '../services/postService.js';
import { NotFoundError } from '../errors.js';
import { validateBody } from '../middlewares/validate.js';
import { postCreateSchema, postUpdateSchema } from '../schemas/postSchema.js';

const router = express.Router();

// 주소의 id는 정수여야 한다. 통과한 값은 다음 핸들러가 req.postId로 쓴다.
function parseId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    // 응답을 여기서 끝내지 않고, 전역 처리기가 404를 만들게 넘긴다.
    next(new NotFoundError('그런 게시물은 없어요'));
    return;
  }

  req.postId = id;
  next();
}

// username, limit 쿼리가 있으면 그 조건으로만 가져온다.
router.get('/', async (req, res) => {
  const posts = await postService.getPosts({
    username: req.query.username,
    limit: Number(req.query.limit) || undefined,
  });
  res.json(posts);
});

router.get('/:id', parseId, async (req, res) => {
  const post = await postService.getPost(req.postId);
  res.json(post);
});

// 스키마를 통과한 본문만 저장한다.
router.post('/', validateBody(postCreateSchema), async (req, res) => {
  const newPost = await postService.createPost(req.body);
  res.status(201).json(newPost);
});

// 수정은 보낸 필드만 스키마로 검사한다.
router.patch('/:id', parseId, validateBody(postUpdateSchema), async (req, res) => {
  const post = await postService.updatePost(req.postId, req.body);
  res.json(post);
});

router.delete('/:id', parseId, async (req, res) => {
  const deleted = await postService.removePost(req.postId);
  res.json(deleted);
});

export default router;
