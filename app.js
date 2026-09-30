// ~/instagram-api/app.js
// 게시물 CRUD는 Prisma로 Postgres에 한다.
import express from 'express';
import cors from 'cors';
import { prisma } from './db.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());

// 모든 요청 초입에 작동해서 클라이언트가 보낸 json을 재조립
app.use(express.json());

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

// username 쿼리가 있으면 그 작성자의 글만 가져온다.
app.get('/api/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { username: req.query.username },
  });
  res.json(posts);
});

// 주소의 id는 숫자여야 한다.
app.get('/api/posts/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    res.status(404).json({
      message: '그런 게시물은 존재하지 않습니다.',
    });
    return;
  }

  res.json(post);
});

app.post('/api/posts', async (req, res) => {
  const { username, profileImage, postImage, postAlt, content } = req.body;

  if (!username || !postImage) {
    res.status(400).json({ message: 'username과 postImage는 꼭 있어야 해요' });
    return;
  }

  // 허용한 필드만 골라 넣는다.
  const newPost = await prisma.post.create({
    data: { username, profileImage, postImage, postAlt, content },
  });

  res.status(201).json(newPost);
});

app.patch('/api/posts/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  const { username, profileImage, postImage, postAlt, content, likeCount } = req.body;

  const post = await prisma.post.update({
    where: { id },
    data: { username, profileImage, postImage, postAlt, content, likeCount },
  });

  res.json(post);
});

app.delete('/api/posts/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  const deleted = await prisma.post.delete({
    where: { id },
  });

  res.json(deleted);
});

app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 존재하지 않습니다.',
  });
});

// 없는 글(P2025)은 404로 돌린다.
app.use((err, req, res, next) => {
  if (err.code === 'P2025') {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  if (err.status) {
    res.status(err.status).json({ message: '보낸 내용을 읽을 수 없어요' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: '서버에서 문제가 생겼어요' });
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 기다리고 있어요.`);
});
