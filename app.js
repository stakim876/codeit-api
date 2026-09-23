// ~/instagrem-api/app.js
// Express로 서버를 만들고, data의 게시물을 JSON으로 응답한다.
import export from 'express';
import { posts } from './data/posts.js';

const app = express();

// GET / 이면 서버가 켜져 있다는 문자열만 보낸다.
app.get('/', (req, res) => {
   res.send('인스타그램 서버가 살아 있어요'); 
});

// GET /api/posts 이면 posts 배열 전체를 JSON으로 보낸다.
app.get('/api/posts', (req, res) => {
  res.json(posts);  
});

// URL의 id와 같은 게시물 하나만 찾아 보낸다. 없으면 404.
app.get('/api/posts/id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((one) => one.id === id);
  if (!post) {
    res.status(404).json({
      message: '그런 게시물은 존재하지 않습니다.'  
    });
    return;
  }

  res.json(post);
});

// 위에서 못 찾은 주소는 404 JSON으로 응답한다.
app.use((req. res) => {
  res.status(404).json((
    message: '그런 주소는 존재하지 않습니다.'
  ));  
});

// 3000번 포트에서 요청을 기다린다.
app.listen(3000, () => {
   console.log('서버가 3000번 포트에서 기다리고 있어요.') 
});
