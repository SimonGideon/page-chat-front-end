import PropTypes from "prop-types";

const Favorite = ({ favoriteBooks }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Favorite Books</h1>
      {favoriteBooks && favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favoriteBooks.map((book) => (
            <div
              key={book.id}
              className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
            >
              {book.book ? (
                <div>
                  <img
                    src={`https://via.placeholder.com/150?text=${book.book.title}`}
                    alt={book.book.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <h2 className="text-lg font-semibold mt-2">
                    {book.book.title}
                  </h2>
                  <p className="text-gray-700 text-sm">
                    {book.book.description}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Published by: {book.book.publisher}
                  </p>
                </div>
              ) : (
                <div className="text-gray-500">
                  No details available for this book.
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no favorite books yet.</p>
      )}
    </div>
  );
};

// Validate the prop types
Favorite.propTypes = {
  favoriteBooks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      book: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        publisher: PropTypes.string,
      }),
    })
  ),
};

export default Favorite;
