import PropTypes from "prop-types";

const BookCategoryCard = ({ category, books, bg }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {category.name}
        </h3>
        <div className={`grid grid-cols-3 gap-1 bg-${bg} p-2`}>
          {books.slice(0, 6).map((book) => (
            <div
              key={book.id}
              className=" cartegory-pic relative h-fit border-4 border-slate-100"
            >
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-2/3 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

BookCategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      cover_image_url: PropTypes.string,
    })
  ).isRequired,
  bg: PropTypes.string,
};

export default BookCategoryCard;
