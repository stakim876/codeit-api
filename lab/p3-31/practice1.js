/*
  복습: 폼으로 파일을 받아 디스크에 두고 주소로 다시 내려주기
  핵심: multer({ dest })가 file 칸 하나를 req.file로 바꾸고, express.static이 그 폴더를 /files로 연다.
  이유: JSON 파서는 파일 본문을 읽지 못한다. 저장한 파일을 주소로 열어야 올린 내용을 다시 받을 수 있다.
  실행: 파일이 없으면 400이다. 응답은 url, originalname, size다. 서버는 4001번이다.
  활용: 공지에 첨부 하나를 붙일 때 이 모양으로 시작한다.
*/

// ~/instagram-api/lab/p3-31/practice1.js
import express from 'express';
import multer from 'multer';

const app = express();

// 받은 첨부 파일은 lab/p3-31/files 폴더에 저장한다.
const upload = multer({ dest: 'lab/p3-31/files/' });

// 저장한 첨부 파일을 /files/파일 이름 주소로 내보낸다.
app.use('/files', express.static('lab/p3-31/files'));

app.post('/api/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: '올릴 파일을 골라 주세요' });
    return;
  }

  res.status(201).json({
    url: `/files/${req.file.filename}`,
    originalname: req.file.originalname,
    size: req.file.size,
  });
});

app.listen(4001, () => {
  console.log('첨부 파일 서버가 4001번 포트에서 기다리고 있어요.');
});