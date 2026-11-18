/*
  복습: 게시물 생성과 수정의 본문 규칙
  핵심: 생성은 authorId와 사진 주소 한 장 이상이 필수다. 수정은 그 필드와 likeCount를 일부만 보낼 수 있다.
  이유: 사진 없는 글을 만들기 전에, 그리고 표에 없는 필드를 넣기 전에 요청을 거른다.
  실행: imageUrls가 빈 배열이면 생성은 실패한다. 수정 스키마는 partial이라 빈 객체도 통과한다. 수정에서는 imageUrls를 받지 않는다.
  활용: 라우터의 validateBody가 이 스키마로 req.body를 바꾼 뒤 서비스를 부른다.
*/

// ~/instagram-api/schemas/postSchema.js
import { z } from 'zod';

const postFields = {
  authorId: z.number().int().positive(),
  postAlt: z.string().optional(),
  content: z.string().optional(),
};

// 사진은 이제 한 장이 아니라 목록이라, 「글자 하나」가 아니라 「글자의 배열」로 받는다.
// 한 장도 없는 게시물은 만들 수 없으니 최소 한 장을 요구한다.
export const postCreateSchema = z.object({
  ...postFields,
  imageUrls: z.array(z.string().min(1)).min(1),
});

// 사진을 바꿔 끼우는 것은 줄을 지우고 넣는 일이라 고치기와 결이 다르다 — 여기서는 안 받는다.
export const postUpdateSchema = z
  .object({ ...postFields, likeCount: z.number().int().nonnegative() })
  .partial();
