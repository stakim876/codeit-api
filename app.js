// ~/instagram-api/app.js
// 게시물 CRUD는 라우터와 서비스로 나눠 Prisma가 Postgres를 다루게 한다.
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());

// 모든 요청 초입에 작동해서 클라이언트가 보낸 json을 재조립
app.use(express.json());

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

// /api/posts 아래 요청은 게시물 라우터가 받는다.
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 존재하지 않습니다.',
  });
});

app.use((err, req, res, next) => {
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
