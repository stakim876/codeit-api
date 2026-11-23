/*
  복습: 다음으로 넘기기 전에 요청을 거르기
  핵심: 이름이 없으면 400을 보내고 return해서 next를 호출하지 않는다.
  이유: next를 부르면 뒤의 인사 핸들러도 실행되어 응답을 두 번 보내게 된다.
  실행: /api/hello는 400 «이름을 보내 주세요»다. /api/hello?name=승태는 인사 JSON이다. 포트는 4004다.
  활용: 로그인하지 않은 요청을 라우트 앞에서 막는 미들웨어와 같은 모양이다.
*/

// ~/instagram-api/lab/p3-27/hello.js
import express from 'express';

const app = express();

function checkName(req, res, next) {
  if (!req.query.name) {
    res.status(400).json({ message: '이름을 보내 주세요' });
    // 여기서 끝나면 아래 인사 핸들러는 실행되지 않는다.
    return;
  }

  next();
}

app.get('/api/hello', checkName, (req, res) => {
  res.json({ message: `안녕하세요,${req.query.name}님` });
});

app.listen(4004, () => {
  console.log('실습 서버가 4004번 포트에서 기다리고 있어요.');
});
