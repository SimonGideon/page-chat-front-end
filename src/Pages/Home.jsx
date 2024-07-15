import { NavBar, BooksList, HeroSection, Recommendations } from "@/components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "./../redux/features/booksSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (books) {
      const recommended = books.filter((book) => book.featured === true);
      setRecommendedBooks(recommended);
    }
  }, [books]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="layout-container flex h-full flex-col">
          <HeroSection />
          <div className="z-0 flex flex-col-reverse md:flex-row gap-1 md:gap-6">
            <BooksList books={books} />
            <Recommendations recommendedBooks={recommendedBooks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
