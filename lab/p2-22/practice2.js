// 프로필 목록을 메모리에 두고, username으로 하나를 찾아 JSON으로 응답한다.
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

// GET /api/profiles 이면 프로필 배열 전체를 JSON으로 보낸다.
app.get('/api/profiles', (req, res) => {
  res.json(profiles);  
});

// URL의 username과 같은 프로필 하나만 찾아 보낸다.
app.get('api/profiles/:username', (req, res) => {
  const username = req.params.username;
  const foundUser = profiles.find(user => user.username === username);
  res.json(foundUser);  
});

// 4000번 포트에서 요청을 기다린다.
app.listen(4000, () => {
  console.log('실습 서버가 실행중입니다.');  
});