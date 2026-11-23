/*
  복습: 본문 형식을 JSON으로 제한하기
  핵심: requireJson이 express.json보다 먼저 있다. POST의 Content-Type이 application/json이 아니면 415를 보낸다.
  이유: JSON 파서는 다른 형식을 빈 객체로 넘겨 버린다. 거르지 않으면 text/plain도 메모가 만들어진다.
  실행: application/json은 201이다. text/plain은 415 «JSON 형식으로 보내 주세요»다. GET /api/notes는 지금까지 만든 메모 배열이다. 포트는 4002다.
  활용: practice2.http의 두 번째 요청이 415인지 볼 때 쓴다.
*/

// ~/instagram-api/lab/p3-27/practice2.js
import express from 'express';
import { logger } from '../../middlewares/logger.js';

const app = express();

const notes = [];

function requireJson(message) {
  return (req, res, next) => {
    const type = req.headers['content-type'] ?? '';

    if (req.method === 'POST' && !type.startsWith('application/json')) {
      res.status(415).json({ message });
      return;
    }

    next();
  };
}

app.use(logger);
// JSON 파서보다 먼저 둔다. 파서가 먼저면 text/plain도 빈 객체로 통과한다.
app.use(requireJson('JSON 형식으로 보내 주세요'));
app.use(express.json());

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const note = { id: notes.length + 1, text: req.body.text };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(4002, () => {
  console.log('실습 서버가 4002번 포트에서 기다리고 있어요.');
});
