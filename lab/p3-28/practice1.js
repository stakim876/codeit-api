/*
  복습: 공통 미들웨어 뒤에 수정 요청만 제목 검사를 더하기
  핵심: noticeTarget으로 공지를 찾은 뒤, PATCH만 checkTitle을 통과한다. 제목이 빈 문자열이거나 문자열이 아니면 400이다.
  이유: 조회와 삭제는 제목이 필요 없다. 없는 공지는 제목을 보기 전에 404로 끝난다.
  실행: 빈 제목 PATCH /api/notices/1은 400 «제목을 적어 주세요»다. 없는 9번은 404다. 번호가 abc여도 404다. 포트는 4001이다.
  활용: practice1.http로 제목 변경, 빈 제목, 없는 번호, 글자 번호를 순서대로 보낸다.
*/

// ~/instagram-api/lab/p3-28/practice1.js
import express from 'express';
import { logger } from '../../middlewares/logger.js';

const app = express();

app.use(logger);
app.use(express.json());

const notices = [
  { id: 1, title: '서버 점검 안내' },
  { id: 2, title: '새 기능 소개' },
  { id: 3, title: '이용 약관 변경' },
];

function parseNoticeId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 공지는 없어요' });
    return;
  }

  req.noticeId = id;
  next();
}

function findNotice(req, res, next) {
  const notice = notices.find((one) => one.id === req.noticeId);

  if (!notice) {
    res.status(404).json({ message: '그런 공지는 없어요' });
    return;
  }

  req.notice = notice;
  next();
}

const noticeTarget = [parseNoticeId, findNotice];

function checkTitle(req, res, next) {
  const title = req.body?.title;

  if (typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ message: '제목을 적어 주세요' });
    return;
  }

  next();
}

app.get('/api/notices/:id', noticeTarget, (req, res) => {
  res.json(req.notice);
});

app.patch('/api/notices/:id', noticeTarget, checkTitle, (req, res) => {
  req.notice.title = req.body.title;
  res.json(req.notice);
});

app.delete('/api/notices/:id', noticeTarget, (req, res) => {
  notices.splice(notices.indexOf(req.notice), 1);
  res.json(req.notice);
});

app.listen(4001, () => {
  console.log('실습 서버가 4001번 포트에서 기다리고 있어요.');
});
