// ~/instagram-api/schemas/postSchema.js
// 생성은 필수 필드를 지키고, 수정은 보낸 필드만 검사한다. likeCount는 0 이상 정수다.
import { z } from 'zod';

const postFields = {
  username: z.string().min(1).max(50),
  profileImage: z.string().optional(),
  postImage: z.string().min(1),
  postAlt: z.string().optional(),
  content: z.string().optional(),
};

export const postCreateSchema = z.object(postFields);

export const postUpdateSchema = z
  .object({ ...postFields, likeCount: z.number().int().nonnegative() })
  .partial();