/*
  복습: 올린 사진의 주소를 게시물에 넣을 수 있게 돌려주기
  핵심: POST /api/uploads는 사진이 한 장 이상일 때만 201로 { imageUrls }를 준다. 주소는 /uploads/파일 이름이다.
  이유: 게시물 JSON에는 파일 바이트 대신 이 주소만 싣는다. 서버 주소(호스트)를 붙이면 나중에 도메인이 바뀌었을 때 주소가 깨진다.
  실행: uploadImages 다음에 req.files가 비어 있으면 400이다. 사진이 아닌 요청도 같은 400이다.
  활용: 화면이 이 주소를 imageUrls에 넣어 POST /api/posts로 글을 만든다.
*/

// ~/instagram-api/routes/uploads.js
import express from 'express';
import { uploadImages } from '../middlewares/upload.js';
import { BadRequestError } from '../errors.js';

const router = express.Router();

router.post('/', uploadImages, (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new BadRequestError('올릴 사진을 골라 주세요');
  }

  // 서버 주소는 빼고 «/uploads/파일 이름» 만 돌려준다 — 게시물의 imageUrls 에 이대로 싣는다.
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  res.status(201).json({ imageUrls });
});

export default router;
