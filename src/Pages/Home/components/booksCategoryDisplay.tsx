import BookCategoryCard from "./bookCategoryCard";

import type { Book, Category } from "@/types";

type CategoryWithBooks = Category & { books: Book[] };

type BooksCategoryDisplayProps = {
  data: Book[];
};

const BooksCategoryDisplay = ({ data }: BooksCategoryDisplayProps) => {
  const categories: Record<string, CategoryWithBooks> = {};

  data.forEach((book) => {
    const categoryId = String(book.category.id);
    if (!categories[categoryId]) {
      categories[categoryId] = { ...book.category, books: [] };
    }
    categories[categoryId].books.push(book);
  });

  const categoryArray = Object.values(categories).slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
      {categoryArray.map((category) => (
        <BookCategoryCard
          key={category.id}
          category={category}
          books={category.books}
        />
      ))}
    </div>
  );
};

export default BooksCategoryDisplay;
