/*
  복습: 로그인, 나는 누구, 로그아웃, 회원가입, 중복 확인
  핵심: 이름이 있으면 세션 ID를 만들어 httpOnly 쿠키에 담는다. /me와 /logout은 Authorization Bearer가 있으면 그 값을, 없으면 sessionId 쿠키를 본다. 가입은 이메일이나 휴대폰 중 하나를 저장한다. 중복 확인은 validateQuery가 쿼리를 검사하고 res.locals.query로 넘긴다.
  이유: 쿠키에 사람 번호를 넣으면 브라우저가 번호를 바꿔 보낼 수 있다. 서버만 기억하는 세션 ID는 로그아웃하면 복사본도 통하지 않는다. 비밀번호 확인과 저장은 아직 없다.
  실행: 없는 이름은 401 «그런 사용자는 없어요»다. 세션이 없거나 그 번호의 사람이 없으면 401 «로그인이 필요해요»다. 쿠키 maxAge는 7일이다. 로그아웃은 세션을 지우고 쿠키를 지운 뒤 «로그아웃했어요»다. 가입 성공은 201 «가입했어요»다. 이미 있으면 409다. 중복 확인은 available과 문장을 돌려준다.
  활용: requests/auth.http로 seungtae 로그인 후 /api/auth/me를 보내면 그 사용자가 돌아온다. 가입 예시는 sora와 전화번호 pikachu다.
*/

// ~/instagram-api/routes/auth.js
import express from 'express';
import * as userService from '../services/userService.js';
import * as sessionService from '../services/sessionService.js';
import { validateBody, validateQuery } from '../middlewares/validate.js';
import { loginSchema, signupSchema, checkDuplicateSchema, PHONE } from '../schemas/authSchema.js';
import { UnauthorizedError } from '../errors.js';

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

const router = express.Router();

// 이미 쓰고 있을 때 보여 줄 문장 — 무엇을 찾았는지에 따라 다르다.
const TAKEN = {
  email: '이미 가입한 이메일이에요',
  phone: '이미 가입한 휴대폰 번호예요',
  username: '이미 쓰고 있는 사용자 이름이에요',
};

router.get('/check-duplicate', validateQuery(checkDuplicateSchema), async (req, res) => {
  const { type, value } = res.locals.query;
  const taken = await userService.isTaken(type, type === 'phone' ? value.replaceAll('-', '') : value);

  res.json({ available: !taken, message: taken ? TAKEN[type] : '쓸 수 있어요' });
});

router.post('/signup', validateBody(signupSchema), async (req, res) => {
  const { emailOrPhone, name, username } = req.body;

  // 휴대폰 번호는 하이픈을 빼고 숫자만 저장한다 — 010-1234-5678 과 01012345678 은 같은 번호다.
  const contact = PHONE.test(emailOrPhone)
    ? { phone: emailOrPhone.replaceAll('-', '') }
    : { email: emailOrPhone };

  // 비밀번호는 아직 저장하지 않는다 — 안전하게 저장하는 법은 서버에서 인증을 구현하는 구간에서 배운다.
  const user = await userService.createUser({ username, name, ...contact });

  res.status(201).json({ message: '가입했어요', username: user.username });
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  const user = await userService.findUserByUsername(req.body.username);

  if (!user) throw new UnauthorizedError('그런 사용자는 없어요');

  // 비밀번호 확인은 아직 없다 — 이름만 맞으면 세션을 만들고, 쿠키에는 그 세션 ID만 담아 준다.
  const sessionId = sessionService.createSession(user.id);

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SEVEN_DAYS,
  });

  res.json(user);
});

// 요청에 실려 온 세션 ID — 헤더에 적어 보냈으면 그것을, 아니면 쿠키를 본다.
function readSessionId(req) {
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    return header.slice('Bearer '.length);
  }

  return req.cookies.sessionId;
}

router.get('/me', async (req, res) => {
  // 서버가 기억해 둔 세션에서 사람의 번호를 찾는다 — 모르는 세션 ID면 undefined.
  const userId = sessionService.getUserId(readSessionId(req));

  if (!userId) throw new UnauthorizedError('로그인이 필요해요');

  const user = await userService.findUserById(userId);

  if (!user) throw new UnauthorizedError('로그인이 필요해요');

  res.json(user);
});

router.post('/logout', (req, res) => {
  // 서버가 세션을 지운다 — 누가 이 세션 ID를 복사해 뒀어도 이제는 통하지 않는다.
  sessionService.deleteSession(readSessionId(req));

  res.clearCookie('sessionId');
  res.json({ message: '로그아웃했어요' });
});

export default router;
