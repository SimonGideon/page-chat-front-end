import PropTypes from "prop-types";
const BookCategoryCard = ({ category, books }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {category.name}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {books.slice(0, 4).map((book) => (
            <div key={book.id} className="relative">
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 text-center py-2">
        <p className="text-sm text-gray-600">{category.name}</p>
      </div>
    </div>
  );
};

// validate the props passed to the component
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
};

export default BookCategoryCard;
