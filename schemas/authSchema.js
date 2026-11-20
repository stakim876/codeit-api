/*
  복습: 로그인 본문 규칙
  핵심: username 문자열 하나이고, 최소 한 글자다.
  이유: 비밀번호 확인은 아직 없어서 이름만 검사한다.
  실행: 이름이 없거나 빈 문자열이면 validateBody가 400을 만든다.
  활용: POST /api/auth/login이 이 스키마를 쓴다.
*/

// ~/instagram-api/schemas/authSchema.js
import { z } from 'zod';

// 아직 비밀번호가 없다 — 이름 하나만 받는다.
export const loginSchema = z.object({
  username: z.string().min(1),
});
