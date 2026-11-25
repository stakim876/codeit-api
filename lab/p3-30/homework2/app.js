// ~/instagram-api/lab/p3-30/homework2/app.js
import express from 'express';
import { logger } from '../../../middlewares/logger.js';
import noticeRouter from './routes/notices.js';
import adminRouter from './routes/admin.js';

const app = express();

app.use(logger);
app.use(express.json());

// 목록과 관리자 라우터가 같은 notices 배열을 쓴다. 쓰기는 /api/admin 에서만 열린다.
app.use('/api', noticeRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => {
  res.status(404).json({ message: '그런 주소는 없어요' });
});

app.listen(4012, () => {
  console.log('실습 서버가 4012번 포트에서 기다리고 있어요.');
});
