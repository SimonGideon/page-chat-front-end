import BookCategoryCard from "./bookCategoryCard";

import type { Book, Category } from "@/types";

type CategoryWithBooks = Category & { books: Book[] };

type BooksCategoryDisplayProps = {
  data: Book[];
};

const BooksCategoryDisplay = ({ data }: BooksCategoryDisplayProps) => {
  const categories: Record<string, CategoryWithBooks> = {};
  const categoryColors = ["bg1_category", "bg2_category", "bg3_category"];

  data.forEach((book) => {
    const categoryId = String(book.category.id);
    if (!categories[categoryId]) {
      categories[categoryId] = {
        ...book.category,
        books: [],
      };
    }
    categories[categoryId].books.push(book);
  });

  const categoryArray = Object.values(categories).slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categoryArray.map((category, index) => (
        <BookCategoryCard
          key={category.id}
          category={category}
          books={category.books}
          bg={categoryColors[index] || "bg-default"}
        />
      ))}
    </div>
  );
};

export default BooksCategoryDisplay;
