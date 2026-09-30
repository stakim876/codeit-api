-- 책에 품절 여부 컬럼을 추가한다.
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "is_sold_out" BOOLEAN NOT NULL DEFAULT false;
