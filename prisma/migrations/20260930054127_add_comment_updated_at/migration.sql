-- 댓글에 수정 시각 컬럼을 추가한다.
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;