import express from 'express';

const profiles = [
  {
    username: 'jaehoon',
    name: '재훈이',
    followerCount: 66,
  },
  {
    username: 'minji',
    name: '민지',
    followerCount: 400,
  },
  {
    username: 'seungwoo',
    name: '승우',
    followerCount: 900,
  },  
];

const app = express();

app.get('/api/profiles', (res, res) => {
  res.json(profiles);  
});

app.get('/api/profiles/:username', (req, res) => {
  const username = req.params.username;
  const founUser = profiles.find(user => user.username === username);
  res.json(founUser);  
});

app.listen(4000, () => {
  console.log('실습 서버가 실행중입니다.');  
});