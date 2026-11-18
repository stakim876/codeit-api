/*
  복습: 시드가 읽는 게시물 샘플
  핵심: 다섯 개의 글이 username, 사진 주소 배열, 본문, minutesAgo, 좋아요 수, 댓글 수를 가진다.
  이유: 데이터베이스에 직접 타이핑하지 않고 같은 샘플을 다시 넣을 수 있게 코드로 둔다.
  실행: 이 파일만 실행하면 테이블은 바뀌지 않는다. seed.js가 minutesAgo를 시각으로 바꾸고 images를 post_images 행으로 만든다. 첫 글의 사용자는 seungtae다.
  활용: 피드가 기대하는 이름과 사진 주소 모양을 샘플에서 확인할 때 쓴다.
*/

// ~/instagram-api/data/posts.js
export const posts = [
  {
    username: 'seungtae',
    profileImage: 'https://picsum.photos/seed/seungtae/40/40',
    images: [
      'https://picsum.photos/seed/post1/600/600',
      'https://picsum.photos/seed/post1b/600/600',
      'https://picsum.photos/seed/post1c/600/600',
    ],
    postAlt: '노을 진 한강',
    content: '퇴근길에 한강이 너무 예뻤어요',
    minutesAgo: 12,
    likeCount: 130,
    commentCount: 3,
  },
  {
    username: 'minji',
    profileImage: 'https://picsum.photos/seed/minji/40/40',
    images: [
      'https://picsum.photos/seed/post2/600/600',
      'https://picsum.photos/seed/post2b/600/600',
    ],
    postAlt: '갓 구운 크루아상',
    content: '오늘 아침에 구운 크루아상',
    minutesAgo: 45,
    likeCount: 512,
    commentCount: 4,
  },
  {
    username: 'seungwoo',
    profileImage: 'https://picsum.photos/seed/seungwoo/40/40',
    images: [
      'https://picsum.photos/seed/post3/600/600',
    ],
    postAlt: '농구 코트',
    content: '주말마다 여기 옵니다',
    minutesAgo: 180,
    likeCount: 76,
    commentCount: 2,
  },
  {
    username: 'minji',
    profileImage: 'https://picsum.photos/seed/minji/40/40',
    images: [
      'https://picsum.photos/seed/post6/600/600',
    ],
    postAlt: '새 렌즈',
    content: '새로 산 렌즈로 찍어봤어요',
    minutesAgo: 300,
    likeCount: 205,
    commentCount: 0,
  },
  {
    username: 'dahye',
    profileImage: 'https://picsum.photos/seed/dahye/40/40',
    images: [
      'https://picsum.photos/seed/post7/600/600',
    ],
    postAlt: '저녁 산책',
    content: '동네 한 바퀴',
    minutesAgo: 420,
    likeCount: 34,
    commentCount: 0,
  },
];
