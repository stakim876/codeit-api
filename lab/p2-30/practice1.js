// 책 목록을 id 순으로 읽는다.
import { bookstore } from "./bookstore.js";

const books = await bookstore.book.findMany({
  orderBy: { id: 'asc' },  
});

console.log(books);

await bookstore.$disconnect();