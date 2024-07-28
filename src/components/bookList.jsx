import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookDetails } from "@/components";

const BooksList = ({ books, onTitleLength }) => {
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // only show the first 12 books
  const chosen = books.slice(0, 12);
  const navigate = useNavigate();

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  return (
    <section className="shadow-lg shadow-bunker-300 px-6 my-10 rounded-xl pb-6">
      <div className="flex justify-between items-baseline">
        <h2 className="pt-6 pb-3 font-semibold text-lg">Trending Now</h2>
        <p
          className="font-medium underline cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          See All
        </p>
      </div>
      <hr />
      <div className="grid pt-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center gap-4">
        {chosen.map((book) => (
          <div
            key={book.id}
            className="cursor-pointer"
            onClick={() => handleBookClick(book)}
          >
            <img
              src={book.cover_image_url}
              className="w-48 md:w-52 sm:max-h-45 md:max-h-72 object-cover rounded-xl"
              alt={book.title}
            />
            <div className="text-bunker-400">
              <p className="text-bunker-950 font-semibold">
                {onTitleLength(book.title)}
              </p>
              <p className="text-sm">by {book.author.name}</p>
            </div>
          </div>
        ))}
      </div>
      {showBookDetails && selectedBook && (
        <BookDetails book={selectedBook} onClose={setShowBookDetails} />
      )}
    </section>
  );
};

BooksList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      cover_image_url: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  onTitleLength: PropTypes.func.isRequired,
};

export default BooksList;
