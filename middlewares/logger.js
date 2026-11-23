/*
  복습: 응답이 끝난 뒤에 메서드, 주소, 상태 코드, 걸린 시간을 찍기
  핵심: 시작할 때 performance.now()를 재고, finish 안에서 뺀 밀리초를 소수 한 자리로 붙인다. next는 바로 호출한다.
  이유: 미들웨어가 시작할 때는 상태 코드와 걸린 시간이 아직 없다. 응답을 다 보낸 뒤에야 둘 다 정해진다.
  실행: 이 파일만 실행하면 서버가 뜨지 않는다. 공지 실습이 app.use(logger)로 모든 요청 앞에 붙인다.
  활용: 터미널에 GET /api/notices/1 200 1.2ms 같은 한 줄이 나온다.
*/

// ~/instagram-api/middlewares/logger.js
export function logger(req, res, next) {
  const start = performance.now();

  // 응답을 다 보낸 뒤에 한 줄. 상태 코드와 걸린 시간은 그때 정해져 있다.
  res.on('finish', () => {
    const ms = performance.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`,
    );
  });

  // next를 finish 안에서 부르면 응답이 끝나기 전에 요청이 멈춘다.
  next();
}
