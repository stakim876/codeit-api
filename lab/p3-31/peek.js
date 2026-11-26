/*
  복습: multipart 본문이 글자로 어떻게 생겼는지 보기
  핵심: express.text가 어떤 Content-Type이든 본문을 글자 그대로 찍는다. /photo는 다른 출처에서 수업 서버 사진을 가리킨다.
  이유: JSON으로 오면 파일 바이트가 없다. 브라우저 폼은 boundary로 칸을 나눈다.
  실행: GET /가 폼을 보낸다. POST /peek는 Content-Type과 본문을 로그에 찍고 '받았어요'를 돌려준다. 서버는 4009번이다.
  활용: 사진 응답의 Cross-Origin-Resource-Policy가 same-origin이면 이 화면의 img가 막힌다.
*/

// ~/instagram-api/lab/p3-31/peek.js
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <form action="/peek" method="post" enctype="multipart/form-data">
      <input name="content" value="제주 바다">
      <input type="file" name="images">
      <button>보내기</button>
    </form>
  `);
});

// 어떤 형식으로 오든 본문을 글자 그대로 읽는다 — 무엇이 왔는지 들여다보려는 서버다.
app.post('/peek', express.text({ type: '*/*' }), (req, res) => {
  console.log(req.get('Content-Type'));
  console.log(req.body);
  res.send('받았어요');
});

// 다른 출처(4009)의 화면이 수업 백엔드(3000)의 사진을 <img>로 띄운다.
app.get('/photo', (req, res) => {
  res.send('<img src="http://localhost:3000/uploads/올린-파일-이름.jpg" width="300">');
});

app.listen(4009, () => {
  console.log('들여다보기 서버가 4009번 포트에서 기다리고 있어요.');
});