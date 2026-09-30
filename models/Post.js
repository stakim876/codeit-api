// ~/instagram-api/models/Post.js
// 게시물이 MongoDB에 어떤 필드로 저장되는지 정하고, Post 모델로 꺼낸다.
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profileImage: String,
  postImage: { type: String, required: true },
  postAlt: String,
  content: String,
  minutesAgo: { type: Number, default: 0},
  likeCount: { type: Number, default: 0},
  commentCount: { type: Number, default: 0 },  
});

const Post = mongoose.model('Post', postSchema);

export default Post;