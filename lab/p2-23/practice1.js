import express, { text } from 'express';

const comments  = [
  {
    id: 1,
    postsId: 1,
    username: 'pikachu',
    text: '피카피카츄~~',
  },
  {
    id: 2,
    postId: 1,
    uaername: 'heartping',
    text: '티니티니짱~~',
  },
  {
    id: 3,
    postId: 2,
    username: 'pikachu',
    text: '삐까뀨뀨뀨뀨뀨~~',
  },  
];

let nexId = 4;

const app = express();

app.use(express.json());

app.get('/api/comments', (req, res) => {
  res.json(comments);  
});

app.post('/api/comments', (req, res) => {

    const newComment = {
      ...req.body,
      id: nexId  
    };

    nextId++;

    comments.push(newComment);

    res.status(201).json(newComment);
});


app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 없어요.',
  });
});

app.listen(4000, () => {
  console.log('실습 서버가 실행중입니다.');  
});