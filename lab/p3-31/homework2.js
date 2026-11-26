/*
  복습: 게시물이 안 쓰는 올린 파일 청소하기
  핵심: 게시물이 가진 주소에서 파일 이름만 모으고, 30초가 지난 나머지 파일만 지운다.
  이유: 올리기만 하고 게시물을 안 만들면 파일이 남는다. 방금 올린 파일은 아직 게시물을 기다리는 중일 수 있다.
  실행: DELETE /api/uploads/orphans가 지운 이름을 removed로 돌려준다. 서버는 4012번이다.
  활용: 수업 백엔드는 게시물을 지울 때 그 글의 /uploads 파일만 바로 지운다.
*/

// ~/instagram-api/lab/p3-31/homework2.js
import { randomUUID } from 'node:crypto';
import { readdir, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import multer from 'multer';

const app = express();
app.use(express.json());

const UPLOAD_DIR = 'lab/p3-31/hw2-uploads';
const posts = [];
let nextId = 1;

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    cb(null, `${randomUUID()}.jpg`);
  },
});
const upload = multer({ storage });

app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/api/uploads', upload.array('images'), (req, res) => {
  res.status(201).json({ imageUrls: req.files.map((file) => `/uploads/${file.filename}`) });
});

app.post('/api/posts', (req, res) => {
  const post = { id: nextId, imageUrls: req.body.imageUrls };
  nextId += 1;
  posts.push(post);

  res.status(201).json(post);
});

// 올라온 지 이만큼이 안 된 파일은 아직 게시물을 기다리는 중일 수 있어 남긴다.
const WAIT_MS = 30 * 1000;

app.delete('/api/uploads/orphans', async (req, res) => {
  // 게시물이 쓰고 있는 파일 이름들
  const usedNames = posts.flatMap((post) => post.imageUrls.map((url) => path.basename(url)));
  const removed = [];

  for (const name of await readdir(UPLOAD_DIR)) {
    const filePath = path.join(UPLOAD_DIR, name);
    const { mtimeMs } = await stat(filePath);

    if (!usedNames.includes(name) && Date.now() - mtimeMs >= WAIT_MS) {
      await rm(filePath);
      removed.push(name);
    }
  }

  res.json({ removed });
});

app.listen(4012, () => {
  console.log('청소 서버가 4012번 포트에서 기다리고 있어요.');
});