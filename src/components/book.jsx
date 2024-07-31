import PropTypes from "prop-types";
import { useState } from "react";
import { BookDetails } from "@/components";

const Book = ({ book, onTitleLength, styleProps, index }) => {
  const [showBookDetails, setShowBookDetails] = useState(false);

  const handleClick = () => {
    setShowBookDetails(true);
  };

  return (
    <div>
      <div
        className={`cursor-pointer ${styleProps.containerClass}`}
        onClick={handleClick}
      >
        <img
          src={book.cover_image_url}
          className={`object-cover ${styleProps.imageClass}`}
          alt={book.title}
        />
        <p className={index === 0 ? "hidden" : "block"}>{index}</p>
        <div className={styleProps.textClass}>
          <p className={`font-semibold ${styleProps.textTitle}`}>
            {onTitleLength(book.title)}
          </p>
          <p className="text-sm">by {book.author.name}</p>
        </div>
      </div>
      {showBookDetails && (
        <BookDetails book={book} onClose={() => setShowBookDetails(false)} />
      )}
    </div>
  );
};

// Prop Types validations
Book.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cover_image_url: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onTitleLength: PropTypes.func.isRequired,
  styleProps: PropTypes.shape({
    containerClass: PropTypes.string,
    imageClass: PropTypes.string,
    textClass: PropTypes.string,
    textTitle: PropTypes.string,
    indexClass: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Book;
