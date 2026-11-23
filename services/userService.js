/*
  복습: 사용자 만들기와 이름 또는 번호로 찾기
  핵심: select는 id, username, profileImage만 고른다. createUser는 가입 정보를 넣고, isTaken은 email, phone, username 중복을 본다.
  이유: 응답에 탈퇴 시각처럼 화면에 안 줄 컬럼을 싣지 않는다. 이미 있는 이름이나 연락처는 409로 막는다.
  실행: 없는 이름이나 번호는 null이다. UNIQUE가 막으면 «이미 쓰고 있는 사용자 이름이나 연락처예요»다.
  활용: 로그인이 이름으로 찾고, /me가 세션에 들어 있던 번호로 다시 찾는다. 가입과 중복 확인이 createUser와 isTaken을 쓴다.
*/

// ~/instagram-api/services/userService.js
import { prisma } from '../db.js';
import { ConflictError } from '../errors.js';

// 응답에 실어 보낼 컬럼만 고른다.
const userFields = { id: true, username: true, profileImage: true };

export async function createUser(data) {
  try {
    return await prisma.user.create({ data, select: userFields });
  } catch (error) {
    // 사용자 이름·이메일·휴대폰 번호 가운데 하나라도 이미 있으면 UNIQUE 제약이 막는다.
    if (error.code === 'P2002') {
      throw new ConflictError('이미 쓰고 있는 사용자 이름이나 연락처예요');
    }
    throw error;
  }
}

export function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username }, select: userFields });
}

export function findUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: userFields });
}

// type 은 email·phone·username 가운데 하나다 — 셋 다 UNIQUE 라 findUnique 로 찾을 수 있다.
export async function isTaken(type, value) {
  const user = await prisma.user.findUnique({
    where: { [type]: value },
    select: { id: true },
  });

  return user !== null;
}
