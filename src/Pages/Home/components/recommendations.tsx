import { useEffect, useMemo } from "react";

import Loader from "@/components/loader";
import { fetchRecommendedBooks } from "@/redux/features/booksSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Book from "./book";

const Recommendations = () => {
  const dispatch = useAppDispatch();
  const {
    books: recommendedBooks,
    loading,
    error,
  } = useAppSelector((state) => state.recommended);

  useEffect(() => {
    dispatch(fetchRecommendedBooks());
  }, [dispatch]);

  const recommended = useMemo(
    () => recommendedBooks.slice(0, 5),
    [recommendedBooks]
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <aside className="relative my-10 rounded-3xl border border-[#f1e7d2] bg-white px-6 text-left shadow-[0_25px_120px_rgba(34,34,34,0.04)] md:min-w-64">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-downy to-transparent" />
      <div className="flex flex-col gap-2 py-6">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-downy-dark">
          Recommended
        </span>
        <h2 className="text-xl font-semibold text-charcoal">
          Shelf just for you
        </h2>
        <p className="text-sm text-charcoal/70">
          Curated with your recent reading patterns.
        </p>
      </div>
      <div className="flex flex-col justify-items-center gap-4 pb-6 text-left">
        {recommendedBooks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-downy/30 bg-downy-lightest/60 p-4 text-sm text-charcoal/70">
            No recommended books
          </p>
        ) : (
          recommended.map((book, index) => (
            <Book
              key={book.id}
              book={book}
              onTitleLength={(title) => title}
              index={index + 1}
              styleProps={{
                containerClass: "flex items-center gap-5",
                imageClass: "w-12 md:w-16 max-h-15 md:max-h-20",
                textClass: "text-bunker-400",
                textTitle: "text-bunker-950 font-semibold",
                indexClass: "font-bold",
              }}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default Recommendations;
