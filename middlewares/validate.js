/*
  복습: 요청 본문을 Zod로 검사하는 미들웨어
  핵심: safeParse가 성공하면 req.body를 정리된 값으로 바꾸고, 실패하면 BadRequestError를 next로 넘긴다.
  이유: 라우터마다 검사 코드를 반복하지 않고, 실패 응답은 앱의 에러 처리기가 만든다.
  실행: 실패 메시지는 «보낸 내용이 규칙에 안 맞아요»이고 details에 어떤 필드가 틀렸는지 들어간다.
  활용: 게시물 생성과 수정 라우트가 postCreateSchema, postUpdateSchema와 함께 쓴다.
*/

// ~/instagram-api/middlewares/validate.js
import { z } from 'zod';
import { BadRequestError } from '../errors.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new BadRequestError('보낸 내용이 규칙에 안 맞아요', z.treeifyError(result.error)));
      return;
    }

    req.body = result.data;
    next();
  };
}
