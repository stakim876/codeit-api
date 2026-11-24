/*
  복습: 폼으로 보낸 제목을 읽어 공지에 넣고, 목록 주소로 다시 보내기
  핵심: express.urlencoded()가 폼 본문을 req.body로 바꾼다. 제목이 있으면 배열에 넣고 303으로 GET /api/notices를 연다.
  이유: 폼은 JSON이 아니다. 파서가 없으면 req.body.title이 없다. 등록 직후 새로고침이 같은 POST를 다시 보내지 않게 목록으로 보낸다.
  실행: /는 입력 폼이다. 빈 제목은 400이다. 성공하면 /api/notices가 저장된 배열을 JSON으로 돌려준다. 포트는 4003이다.
  활용: 입력 폼으로 글을 올리고 목록으로 돌릴 때 쓴다.
*/

// ~/instagram-api/lab/practice3.js
import express from 'express';
import { logger } from '../../middlewares/logger.js';

const app = express();

app.use(logger);
app.use(express.urlencoded());

const notices = [{ id: 1, title: '서버 점검 안내' }];

app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/api/notices">
      <input name="title" placeholder="공지 제목">
      <button>올리기</button>
    </form>
  `);
});

app.get('/api/notices', (req, res) => {
  res.json(notices);
});

app.post('/api/notices', (req, res) => {
  const title = req.body.title.trim();

  if (title === '') {
    res.status(400).json({ message: '제목을 적어 주세요' });
    return;
  }

  notices.push({ id: notices.length + 1, title });
  res.redirect(303, '/api/notices');
});

app.listen(4003, () => {
  console.log('실습 서버가 4003번 포트에서 기다리고 있어요.');
});