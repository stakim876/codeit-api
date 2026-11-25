// ~/instagram-api/lab/p3-30/homework2/routes/notices.js
import express from 'express';
import { notices } from '../data/notices.js';

const router = express.Router();

// 숨긴 공지는 목록에서 빠진다. 숨기는 일은 관리자 라우터가 한다.
router.get('/notices', (req, res) => {
  res.json(notices.filter((notice) => !notice.hidden));
});

export default router;
