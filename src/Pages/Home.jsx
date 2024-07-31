import {
  NavBar,
  BooksList,
  HeroSection,
  Recommendations,
  Loader,
} from "@/components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedBooks } from "./../redux/features/booksSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.featured);

  useEffect(() => {
    dispatch(fetchFeaturedBooks());
  }, [dispatch]);

  const handleTitleLength = (bookTitle) => {
    if (bookTitle.length > 20) {
      return bookTitle.slice(0, 20) + "...";
    } else {
      return bookTitle;
    }
  };

  if (loading || loading) {
    return <Loader />;
  }

  if (error || loading) {
    return <div>Error: {error || loading}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container pt-6">
        <div className="layout-container flex h-full flex-col">
          <HeroSection />
          <div className="z-0 flex flex-col-reverse md:flex-row gap-1 md:gap-6">
            <BooksList books={books} onTitleLength={handleTitleLength} />
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
