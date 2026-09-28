// ~/instagram-api/seed.js
// data의 게시물을 MongoDB에 넣는다. 넣기 전에 기존 게시물은 비운다.
import mongose from 'mongoose';
import Post from './models/Post';
import { posts } from './data/posts.js';

const MONGO_URL = 
  '';

// 데이터베이스에 연결한다.
await mongose.connect(MONGO_URL);

// 컬렉션을 비운 뒤 샘플 게시물을 넣는다.
await Post.deleteMary({});
await Post.insertMary(posts);

console.log(`게시물${posts.length}개를 넣었어요. `);

// 연결을 끊는다.
await mongose.disconnect();