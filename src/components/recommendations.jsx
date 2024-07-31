import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedBooks } from "./../redux/features/booksSlice";
import { Loader, Book } from "@/components";

const Recommendations = () => {
  const dispatch = useDispatch();
  const {
    books: recommendedBooks,
    loading,
    error,
  } = useSelector((state) => state.recommended);

  useEffect(() => {
    dispatch(fetchRecommendedBooks());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Display first 5 recommended books
  const recommended = recommendedBooks.slice(0, 5);

  return (
    <div>
      <aside className="shadow-lg shadow-bunker-300 px-6 my-10 rounded-xl md:min-w-64 text-left">
        <h2 className="py-6 font-semibold text-lg">Recommended</h2>
        <div className="flex flex-col justify-items-center text-left gap-4 pb-6">
          {recommendedBooks.length === 0 ? (
            <p className="text-bunker-400">No recommended books</p>
          ) : (
            recommended.map((book, index) => (
              <Book
                key={book.id}
                book={book}
                onTitleLength={(title) => title}
                onClick={() => {}}
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
    </div>
  );
};

export default Recommendations;
