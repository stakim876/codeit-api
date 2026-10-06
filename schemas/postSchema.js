// ~/instagram-api/schemas/postSchema.js
// 생성은 작성자 번호, postImage, 사진 목록이 필수다. 수정은 보낸 필드만 검사한다.
import { z } from 'zod';

const postFields = {
  authorId: z.number().int().positive(),
  postImage: z.string().min(1),
  postAlt: z.string().optional(),
  content: z.string().optional(),
};

export const postCreateSchema = z.object({
  ...postFields,
  imageUrls: z.array(z.string().min(1)).min(1),
});

export const postUpdateSchema = z
  .object({ ...postFields, likeCount: z.number().int().nonnegative() })
  .partial();
