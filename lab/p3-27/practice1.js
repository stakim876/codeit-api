/*
  복습: 공통 준비 미들웨어와 에러 미들웨어
  핵심: findNotice가 공지를 req.notice에 붙인다. 번호가 숫자가 아니면 next(에러)로 넘긴다. 에러 미들웨어는 인자가 네 개다.
  이유: 없는 공지는 이 함수가 404로 끝낸다. HttpError만 상태 코드를 갖고, 그 외 오류는 500이다.
  실행: /api/notices/1은 { notice }다. /api/notices/abc는 400 «공지 번호는 숫자로 보내주세요.»다. 없는 번호는 404다. 포트는 4001이다.
  활용: 글 조회 앞에 그 글이 있는지 확인하는 미들웨어를 둘 때 같은 흐름이다.
*/

// ~/instagram-api/lab/p3-27/practice1.js
import express from 'express';
import { logger } from '../../middlewares/logger.js';
import { HttpError, BadRequestError } from '../../errors.js';

const app = express();

const notices = [
  { id: 1, title: '서버 점검 안내' },
  { id: 2, title: '새 기능 소개' },
  { id: 3, title: '이용 약관 변경' },
];

function findNotice(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    // 에러를 next로 넘기면 아래 라우트는 건너뛰고 에러 미들웨어로 간다.
    next(new BadRequestError('공지 번호는 숫자로 보내주세요.'));
    return;
  }

  const notice = notices.find((one) => one.id === id);

  if (!notice) {
    res.status(404).json({ message: '그런 공지는 없어요' });
    return;
  }

  req.notice = notice;
  next();
}

app.use(logger);

app.get('/api/notices/:id', findNotice, (req, res) => {
  res.json({ notice: req.notice });
});

// 인자가 네 개여야 Express가 에러 미들웨어로 알아본다.
app.use((err, req, res, next) => {
  console.log('에러 미들웨어에 들어왔어요');

  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: '서버에서 문제가 생겼어요' });
});

app.listen(4001, () => {
  console.log('실습 서버가 4001번 포트에서 기다리고 있어요.');
});
