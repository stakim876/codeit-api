/*
  복습: Express 서버 입구에서 게시물 주소를 연결하기
  핵심: CORS_ORIGIN에 적힌 주소만 허용하고, /api/posts는 게시물 라우터로 넘긴다.
  이유: 화면과 서버 포트가 달라서 허용 출처를 환경 변수로 둔다. 없는 주소와 에러 응답은 라우터마다 반복하지 않는다.
  실행: PORT가 없으면 3000이다. 없는 주소는 404와 «그런 주소는 없어요»다. HttpError는 status와 details로 응답하고, status만 있는 오류는 보낸 내용을 읽을 수 없어요가 나간다. 그 외는 500이다.
  활용: 화면이 localhost:3001에서 이 서버의 게시물을 부를 때 CORS_ORIGIN에 그 주소를 넣는다.
*/

// ~/instagram-api/app.js
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import { HttpError } from './errors.js';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(',').map((one) => one.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({ message: '그런 주소는 없어요' });
});

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    const body = { message: err.message };
    if (err.details) body.details = err.details;
    res.status(err.status).json(body);
    return;
  }

  if (err.status) {
    res.status(err.status).json({ message: '보낸 내용을 읽을 수 없어요' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: '서버에서 문제가 생겼어요' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 기다리고 있어요.`);
});
