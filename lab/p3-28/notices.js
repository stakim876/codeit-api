/*
  복습: 번호 해석과 공지 찾기를 미들웨어 배열로 묶기
  핵심: parseNoticeId가 숫자 번호를 req.noticeId에 넣고, findNotice가 그 번호의 공지를 req.notice에 넣는다. noticeTarget이 두 함수를 이어서 GET, PATCH, DELETE 앞에 붙인다.
  이유: 세 주소가 같은 준비를 하므로 라우트마다 번호 검사와 찾기를 반복하지 않는다.
  실행: /api/notices/1은 그 공지다. 숫자가 아니거나 없는 번호는 404 «그런 공지는 없어요»다. PATCH는 제목을 바꾸고, DELETE는 배열에서 뺀 뒤 그 공지를 돌려준다. 포트는 4005다.
  활용: 글 조회, 수정, 삭제가 같은 «그 글 찾기»를 앞에 둘 때 같은 배열을 쓴다.
*/

// ~/instagram-api/lab/p3-28/notices.js
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

app.get('/api/notices/:id', noticeTarget, (req, res) => {
  res.json(req.notice);
});

app.patch('/api/notices/:id', noticeTarget, (req, res) => {
  req.notice.title = req.body.title;
  res.json(req.notice);
});

app.delete('/api/notices/:id', noticeTarget, (req, res) => {
  notices.splice(notices.indexOf(req.notice), 1);
  res.json(req.notice);
});

app.listen(4005, () => {
  console.log('실습 서버가 4005번 포트에서 기다리고 있어요.');
});
