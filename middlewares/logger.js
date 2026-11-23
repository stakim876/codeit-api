/*
  복습: 응답이 끝난 뒤에 메서드, 주소, 상태 코드를 찍기
  핵심: finish 이벤트 안에서 statusCode를 읽고, next는 바로 호출한다.
  이유: 미들웨어가 시작할 때는 상태 코드가 아직 기본값이다. 응답을 다 보낸 뒤에야 실제 코드가 있다.
  실행: 이 파일만 실행하면 서버가 뜨지 않는다. practice1과 practice2가 app.use(logger)로 모든 요청 앞에 붙인다.
  활용: 요청이 다음으로 넘어가는지, 끝난 뒤 몇 번으로 응답했는지 터미널에서 볼 때 쓴다.
*/

// ~/instagram-api/middlewares/logger.js
export function logger(req, res, next) {
  // 응답을 다 보낸 뒤에 한 줄. 상태 코드는 그때 정해져 있다.
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  // next를 finish 안에서 부르면 응답이 끝나기 전에 요청이 멈춘다.
  next();
}
