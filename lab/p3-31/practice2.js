/*
  복습: 프로필 사진의 이름, 종류, 크기를 서버가 정하기
  핵심: UUID와 확장자 표로 이름을 짓고, JPG와 PNG, 1MB만 받는다. MulterError는 400으로 바꾼다.
  이유: 보낸 이름을 그대로 쓰면 한글이 깨지고 같은 이름이 덮인다. multer 에러에는 상태 코드가 없다.
  실행: avatar 한 장만 받는다. 다른 종류, 큰 파일, 다른 칸 이름은 400이다. 서버는 4002번이다.
  활용: 수업 백엔드 middlewares/upload.js가 같은 방식으로 게시물 사진을 받는다.
*/

// ~/instagram-api/lab/p3-31/practice2.js
import { randomUUID } from 'node:crypto';
import express from 'express';
import multer from 'multer';
import { BadRequestError } from '../../errors.js';

const app = express();

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
};

const storage = multer.diskStorage({
  destination: 'lab/p3-31/avatars/',
  filename: (req, file, cb) => {
    cb(null, randomUUID() + EXTENSIONS[file.mimetype]);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!EXTENSIONS[file.mimetype]) {
      cb(new BadRequestError('프로필 사진은 JPG나 PNG만 올릴 수 있어요'));
      return;
    }
    cb(null, true);
  },
});

const receiveAvatar = upload.single('avatar');

const messages = {
  LIMIT_FILE_SIZE: '프로필 사진은 1MB까지 올릴 수 있어요',
  LIMIT_UNEXPECTED_FILE: '프로필 사진은 avatar 이름으로 한 장만 보낼 수 있어요',
};

function uploadAvatar(req, res, next) {
  receiveAvatar(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new BadRequestError(messages[err.code] ?? '프로필 사진을 받지 못했어요'));
      return;
    }
    next(err);
  });
}

app.use('/avatars', express.static('lab/p3-31/avatars'));

app.post('/api/avatar', uploadAvatar, (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: '프로필 사진을 골라 주세요' });
    return;
  }

  res.status(201).json({ url: `/avatars/${req.file.filename}` });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: '서버에서 문제가 생겼어요' });
});

app.listen(4002, () => {
  console.log('프로필 사진 서버가 4002번 포트에서 기다리고 있어요.');
});