/*
  복습: 허용한 화면 주소만 받고, 올린 사진을 그 화면이 다시 띄우게 하기
  핵심: helmet의 사진 정책은 cross-origin이다. /uploads는 uploads 폴더를 열고, /api/uploads가 사진 주소를 만든다.
  이유: 기본 CORP는 same-origin이라 다른 포트 화면의 img가 사진을 못 띄운다. 사진 바이트는 JSON 본문이 아니다.
  실행: CORS_ORIGIN을 쉼표로 나눠 origin에 넣는다. credentials는 주석이라 꺼져 있다. 없는 주소는 404이고, HttpError는 status로 응답한다.
  활용: 화면이 사진을 먼저 올리고, 받은 /uploads 주소를 게시물 imageUrls에 넣는다.
*/

// ~/instagram-api/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import postsRouter from './routes/posts.js';
import authRouter from './routes/auth.js';
import uploadsRouter from './routes/uploads.js';
import { HttpError } from './errors.js';
import cookieParser from 'cookie-parser';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(',').map((one) =>
  one.trim(),
);

// 다른 포트 화면의 <img>가 /uploads 사진을 읽을 수 있게 사진 정책만 cross-origin으로 연다.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: allowedOrigins,
  // 쿠키를 요청에 싣는 설정. 켜면 출처를 전부 허용할 수 없어서, 아직 주석으로 둔다.
  // credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 올린 사진 파일을 주소로 내보낸다 — /uploads/파일 이름 은 uploads 폴더의 그 파일이다.
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/api/uploads', uploadsRouter);

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