/*
  복습: 세션 ID와 사람 번호를 서버 메모리에 두기
  핵심: Map이 세션 ID를 userId로 연결한다. createSession은 UUID를 만들고, getUserId는 없으면 undefined를 주고, deleteSession은 그 키를 지운다.
  이유: 로그인 상태를 브라우저가 아니라 서버가 기억해야 로그아웃이 복사된 ID에도 적용된다.
  실행: 서버를 다시 띄우면 Map이 비어서 예전에 받은 쿠키는 더 이상 통하지 않는다.
  활용: auth 라우터가 로그인할 때 만들고, /me와 로그아웃에서 찾거나 지운다.
*/

// ~/instagram-api/services/sessionService.js
import { randomUUID } from 'node:crypto';

// 세션 ID → 사람의 번호. 서버의 메모리에만 있어서 서버가 다시 뜨면 비어 있다.
const sessions = new Map();

export function createSession(userId) {
  const sessionId = randomUUID();
  sessions.set(sessionId, userId);
  return sessionId;
}

// 서버가 기억해 둔 세션이 없으면 undefined 가 나온다.
export function getUserId(sessionId) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
