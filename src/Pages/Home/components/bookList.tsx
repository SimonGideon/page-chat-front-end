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
    <section className="relative my-10 overflow-hidden rounded-3xl border border-[#f1e7d2] bg-white px-6 pb-6 shadow-[0_25px_120px_rgba(34,34,34,0.04)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-downy via-downy-light to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-4 pt-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-downy-lightest px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-downy-dark">
            Trending Now
          </div>
          <h2 className="pt-3 text-2xl font-semibold text-charcoal">
            Personalized picks for today
          </h2>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-full border border-downy/30 px-5 py-2 text-sm font-semibold text-downy-dark transition hover:border-downy hover:text-downy"
          onClick={() => navigate("/signin")}
        >
          See All
        </button>
      </div>
      <div>
        <p className="pt-3 text-charcoal/70">Featured Categories</p>
        <BooksCategoryDisplay data={books} />
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-4 pt-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
