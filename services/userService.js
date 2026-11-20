/*
  복습: 사용자 한 명을 이름 또는 번호로 찾기
  핵심: select는 id, username, profileImage만 고른다.
  이유: 응답에 탈퇴 시각처럼 화면에 안 줄 컬럼을 싣지 않는다.
  실행: 없는 이름이나 번호는 null이다.
  활용: 로그인이 이름으로 찾고, /me가 세션에 들어 있던 번호로 다시 찾는다.
*/

// ~/instagram-api/services/userService.js
import { prisma } from '../db.js';

// 응답에 실어 보낼 컬럼만 고른다.
const userFields = { id: true, username: true, profileImage: true };

export function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username }, select: userFields });
}

export function findUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: userFields });
}
