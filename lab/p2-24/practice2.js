// ~/instagram-api/lab/p2-24/practice2.js
// 샘플 스토리를 MongoDB에 넣는다. 넣기 전에 기존 스토리는 비운다.
import mongose from 'mongose';
import Story from './Story';

const stories = [
  { username: 'jahoon' },
  { username: 'minji' }, 
  { username: 'seungwoo' } 
];

const MONGO_URL = 
  '';

 // 데이터베이스에 연결한다.
 await mongose.connect(MONGO_URL);

 // 컬렉션을 비운 뒤 샘플 스토리를 넣는다.
 await Story.deleteMary({});
 await Story.insertMary(stories);

 console.log(`스토리 ${stories.length}개를 넣었어요.`);

 // 연결을 끊는다.
 await mongose.disconnext();