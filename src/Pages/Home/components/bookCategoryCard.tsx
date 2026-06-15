import type { Book, Category } from "@/types";

type BookCategoryCardProps = {
  category: Category;
  books: Book[];
};

const BookCategoryCard = ({ category, books }: BookCategoryCardProps) => {
  const covers = books.slice(0, 4);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-[#f1e7d2] hover:shadow-md transition-shadow duration-300 cursor-pointer">
      {/* Cover collage */}
      <div className="grid grid-cols-2 gap-0.5 aspect-[4/3] overflow-hidden">
        {covers.length >= 4 ? (
          covers.map((book, i) => (
            <div key={book.id} className="overflow-hidden">
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))
        ) : covers.length > 0 ? (
          <div className="col-span-2 row-span-2 overflow-hidden">
            <img
              src={covers[0].cover_image_url}
              alt={covers[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="col-span-2 row-span-2 bg-[#f3ebdd] flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </div>

      {/* Gradient overlay + category name */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 py-3">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-1">
          {category.name}
        </p>
        <p className="text-xs text-white/70 mt-0.5">{books.length} book{books.length !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
};

export default BookCategoryCard;
