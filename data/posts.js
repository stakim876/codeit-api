/*
  복습: 시드가 읽는 게시물 샘플 배열
  핵심: 다섯 개의 글이 username, 사진 주소 배열, 본문, minutesAgo, 좋아요 수, 댓글 수를 가진다.
  이유: DB에 바로 타이핑하지 않고, 같은 샘플을 다시 넣을 수 있게 코드로 둔다.
  실행: 이 파일만 실행하면 테이블이 바뀌지 않는다. seed.js가 minutesAgo를 시각으로 바꾸고, images 배열을 post_images 행으로 만든다. 프로필과 게시물 사진은 화면 public에 넣어 둔 파일 주소다.
  활용: 피드 화면이 기대하는 필드 이름을 샘플 데이터와 맞출 때 이 배열을 본다.
*/

// ~/instagram-api/data/posts.js
export const posts = [
  {
    username: 'seungtae',
    profileImage: '/profiles/seungtae.jpg',
    images: [
      '/images/post-1.jpg',
      '/images/slide-river-bridge.jpg',
      '/images/slide-river-park.jpg',
    ],
    postAlt: '노을 진 한강',
    content: '퇴근길에 한강이 너무 예뻤어요',
    minutesAgo: 12,
    likeCount: 130,
    commentCount: 3,
  },
  {
    username: 'minji',
    profileImage: '/profiles/minji.jpg',
    images: [
      '/images/post-2.jpg',
      '/images/slide-croissant-plate.jpg',
    ],
    postAlt: '갓 구운 크루아상',
    content: '오늘 아침에 구운 크루아상',
    minutesAgo: 45,
    likeCount: 512,
    commentCount: 4,
  },
  {
    username: 'seungwoo',
    profileImage: '/profiles/seungwoo.jpg',
    images: [
      '/images/post-3.jpg',
    ],
    postAlt: '농구 코트',
    content: '주말마다 여기 옵니다',
    minutesAgo: 180,
    likeCount: 76,
    commentCount: 2,
  },
  {
    username: 'minji',
    profileImage: '/profiles/minji.jpg',
    images: [
      '/images/post-1c.jpg',
    ],
    postAlt: '새 렌즈',
    content: '새로 산 렌즈로 찍어봤어요',
    minutesAgo: 300,
    likeCount: 205,
    commentCount: 0,
  },
  {
    username: 'dahye',
    profileImage: '/images/dahye.jpg',
    images: [
      '/images/slide-river-park.jpg',
    ],
    postAlt: '저녁 산책',
    content: '동네 한 바퀴',
    minutesAgo: 420,
    likeCount: 34,
    commentCount: 0,
  },
];
