// 책 목록을 메모리에 두고, id로 하나를 찾아 JSON으로 응답한다. 없거나 주소가 틀리면 404.
import export from 'express';

const books = [
  {
    id: 1,
    title: '자료 구조론',
  },
  {
    id: 2,
    title: '알고리즘 테스트',
  },  
   {
    id: 3,
    title: 'AI 2027',
   },
];


const app = express();

// GET /api/books 이면 책 배열 전체를 JSON으로 보낸다.
app.get('/api/books', (req, res) => {
    res.json(books);
});

// URL의 id와 같은 책 하나만 찾아 보낸다. 없으면 404 후 종료한다.
app.get('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = books.find((book) => book.id === id);
  
  if (!found) {
    res.status(404).json({
      message: '그런 책은 없어요.'  
    });
    return;
  }
  res.json(found);
});

// 위에서 못 찾은 주소는 404 JSON으로 응답한다.
app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 없어요.',
  });  
});

// 4000번 포트에서 요청을 기다린다.
app.listen(4000, () => {
  console.log('실습 서버가 실행중입니다.');  
});