import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "./../redux/features/booksSlice";

const BooksList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <div key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <img src={book.cover_image_url} alt={book.title} />
          </div>
        ))}
      </ul>
    </section>
  );
};

export default BooksList;
