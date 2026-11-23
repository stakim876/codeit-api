/*
  복습: 허용한 화면 주소만 받고, 쿠키를 같이 보내는 설정은 아직 끄기
  핵심: CORS_ORIGIN을 쉼표로 나눠 공백을 뺀 목록만 origin에 넣는다. credentials는 주석이라 꺼져 있다.
  이유: 화면과 API의 포트가 달라서 허용 출처를 적어야 브라우저가 응답을 쓴다. 쿠키 허용은 이 수업에서 아직 켜지 않는다.
  실행: cors가 JSON과 쿠키 파서보다 먼저 적용된다. 없는 주소는 404이고, HttpError는 status로 응답한다.
  활용: Next 화면 localhost:3001이 이 서버를 부를 때 CORS_ORIGIN에 그 주소를 넣는다.
*/

// ~/instagram-api/app.js
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import authRouter from './routes/auth.js';
import { HttpError } from './errors.js';
import cookieParser from 'cookie-parser';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(',').map((one) =>
  one.trim(),
);

app.use(cors({
  origin: allowedOrigins,
  // 쿠키를 요청에 싣는 설정. 켜면 출처를 전부 허용할 수 없어서, 아직 주석으로 둔다.
  // credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

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