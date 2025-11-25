import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type { Book as BookType } from "@/types";

import Book from "./book";
import BooksCategoryDisplay from "./booksCategoryDisplay";

type BooksListProps = {
  books: BookType[];
  onTitleLength: (title: string) => string;
};

const BooksList = ({ books, onTitleLength }: BooksListProps) => {
  const navigate = useNavigate();
  const chosen = useMemo(() => books.slice(0, 12), [books]);

  return (
    <section className="shadow-lg shadow-bunker-300 px-6 my-10 rounded-xl pb-6">
      <div className="flex justify-between items-baseline">
        <h2 className="pt-6 pb-3 font-semibold text-lg">Trending Now</h2>
        <button
          type="button"
          className="font-medium underline cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          See All
        </button>
      </div>
      <hr />
      <div>
        <p className="text-bunker-400 pt-3">Featured Categories</p>
        <BooksCategoryDisplay data={books} />
      </div>
      <div className="grid pt-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center gap-4">
        {chosen.map((book) => (
          <Book
            key={book.id}
            book={book}
            onTitleLength={onTitleLength}
            index={0}
            styleProps={{
              imageClass:
                "w-48 md:w-52 sm:max-h-45 md:max-h-72 object-cover rounded-xl",
              textClass: "text-bunker-400",
              containerClass: "cursor-pointer",
              textTitle: "text-bunker-950 font-semibold",
              textAuthor: "text-sm",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default BooksList;
