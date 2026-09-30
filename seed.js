// ~/instagram-api/seed.js
// data의 게시물을 MongoDB에 넣는다. 넣기 전에 기존 게시물은 비운다.
import mongoose from 'mongoose';
import Post from './models/Post.js';
import { posts } from './data/posts.js';

await mongoose.connect(process.env.MONGO_URL);

await Post.deleteMany({});
await Post.insertMany(posts);

console.log(`게시물 ${posts.length}개를 넣었어요.`);

await mongoose.disconnect();
