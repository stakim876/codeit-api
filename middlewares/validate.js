// ~/instagram-api/middlewares/validate.js
// 본문이 스키마를 통과하면 그 값만 req.body에 남긴다. 실패하면 400으로 넘긴다.
import { z } from 'zod';
import { BadRequestError } from '../errors.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new BadRequestError(
          '보낸 내용이 규칙에 안 맞아요',
          z.treeifyError(result.error),
        ),
      );
      return;
    }

    req.body = result.data;
    next();
  };
}