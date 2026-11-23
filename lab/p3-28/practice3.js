/*
  복습: 기준보다 오래 걸린 요청만 로그로 남기기
  핵심: slowLogger(500)가 시작 시각을 재고, finish에서 500ms를 넘긴 요청만 출력한다.
  이유: 모든 요청의 시간을 찍으면 느린 요청이 묻힌다. 기준을 넘는 것만 보면 된다.
  실행: /api/fast는 바로 응답해서 로그가 없다. /api/slow는 0.8초 뒤에 응답하고 «느린 요청» 한 줄이 나온다. 포트는 4003이다.
  활용: logger가 모든 요청의 시간을 찍는다면, 이건 느린 것만 골라 찍는 같은 위치의 미들웨어다.
*/

// ~/instagram-api/lab/p3-28/practice3.js
import express from 'express';

const app = express();

function slowLogger(limitMs) {
  return (req, res, next) => {
    const start = performance.now();

    res.on('finish', () => {
      const ms = performance.now() - start;

      if (ms > limitMs) {
        console.log(
          `느린 요청 — ${req.method} ${req.originalUrl} ${ms.toFixed(1)}ms`,
        );
      }
    });

    next();
  };
}

app.use(slowLogger(500));

app.get('/api/fast', (req, res) => {
  res.json({ message: '바로 답해요' });
});

app.get('/api/slow', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  res.json({ message: '0.8초 뒤에 답해요' });
});

app.listen(4003, () => {
  console.log('실습 서버가 4003번 포트에서 기다리고 있어요.');
});
