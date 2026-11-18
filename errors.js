/*
  복습: 상태 코드가 있는 에러 클래스
  핵심: HttpError가 status를 갖고, NotFoundError는 404, BadRequestError는 400과 details다.
  이유: 서비스가 상태 코드를 응답에 직접 쓰지 않고, 앱의 에러 처리기가 이 클래스를 보고 응답한다.
  실행: NotFoundError를 던지면 404 JSON이다. BadRequestError의 details는 검사 실패 내용이다.
  활용: 없는 글, 없는 사용자, 본문 규칙 실패를 라우트 밖으로 넘길 때 쓴다.
*/

// ~/instagram-api/errors.js
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message, details) {
    super(400, message);
    this.details = details;
  }
}
