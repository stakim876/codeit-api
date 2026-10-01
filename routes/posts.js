import express from 'express';
import * as postService from '../services/postService.js';

const router = express.Router();

// 주소의 id는 정수여야 한다. 통과한 값은 다음 핸들러가 req.postId로 쓴다.
function parseId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
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

  if (!post) {
    res.status(404).json({
      message: '그런 게시물은 존재하지 않습니다.',
    });
    return;
  }

  res.json(post);
});

router.post('/', async (req, res) => {
  const { username, profileImage, postImage, postAlt, content } = req.body;

  if (!username || !postImage) {
    res.status(400).json({ message: 'username과 postImage는 꼭 있어야 해요' });
    return;
  }

  // 허용한 필드만 골라 넣는다.
  const newPost = await postService.createPost({
    username, profileImage, postImage, postAlt, content,
  });

  res.status(201).json(newPost);
});

router.patch('/:id', parseId, async (req, res) => {
  const { username, profileImage, postImage, postAlt, content, likeCount } = req.body;

  const post = await postService.updatePost(req.postId, {
    username,
    profileImage,
    postImage,
    postAlt,
    content,
    likeCount,
  });

  if (!post) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  res.json(post);
});

router.delete('/:id', parseId, async (req, res) => {
  const deleted = await postService.removePost(req.postId);

  if (!deleted) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  res.json(deleted);
});

export default router;
