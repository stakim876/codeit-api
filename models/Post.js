/*
  복습: MongoDB에 저장하던 게시물 모양
  핵심: username, postImage, 본문, 좋아요 수, 댓글 수를 한 문서 스키마로 둔다.
  이유: 지금 서버의 글은 Postgres와 Prisma가 맡는다. 이 파일은 그때의 문서 모양을 남겨 둔 것이다.
  실행: app.js는 이 모델을 불러 쓰지 않는다. 서버를 켜도 이 스키마로 글이 저장되지 않는다.
  활용: 사진 한 장을 문서에 넣던 방식과, 지금 사진 표를 나눠 둔 방식을 비교할 때 쓴다.
*/

// ~/instagram-api/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profileImage: String,
  postImage: { type: String, required: true },
  postAlt: String,
  content: String,
  minutesAgo: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
