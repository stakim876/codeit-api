/*
  복습: 요청 본문과 쿼리를 Zod로 검사하는 미들웨어
  핵심: validateBody는 성공하면 req.body를 정리된 값으로 바꾼다. validateQuery는 정리된 값을 res.locals.query에 담는다. 실패하면 BadRequestError를 next로 넘긴다.
  이유: req.query는 읽을 때마다 주소에서 새로 만들어져서, 공백을 자른 값을 그 속성에 다시 넣을 수 없다.
  실행: 실패 메시지는 «보낸 내용이 규칙에 안 맞아요»이고 details에 어떤 필드가 틀렸는지 들어간다. 앞뒤 공백이 있는 value는 trim된 값이 locals에 남는다.
  활용: 게시물 본문은 validateBody, 중복 확인 쿼리는 validateQuery가 검사한다.
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

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(
        new BadRequestError(
          '보낸 내용이 규칙에 안 맞아요',
          z.treeifyError(result.error),
        ),
      );
      return;
    }

    // req.query는 읽을 때마다 주소에서 새로 만드는 값이라, 검사한 값은 res.locals에 담아 넘긴다.
    res.locals.query = result.data;
    next();
  };
}
