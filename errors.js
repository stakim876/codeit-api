// ~/instagram-api/errors.js
// 상태 코드와 검증 상세를 에러에 실어, 전역 처리기가 그 응답을 만들게 한다.
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


// class Human {
//   constructor(username, age) {
//     this.username = username;
//     this.age = age;
//    }
//  }

// new Humen('kim', 30); // { username: 'kim', age: 30 }
// new Humen('park', 40); // { username: 'park', age: 40 }


