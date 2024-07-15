import PropTypes from "prop-types";

const Recommendations = ({ recommendedBooks }) => {
  // Display first 5 recommended books
  const recommended = recommendedBooks.slice(0, 5);

  return (
    <div>
      <aside className="shadow-lg shadow-bunker-300 px-6 my-10 rounded-xl md:min-w-64">
        <h2 className="py-6 font-semibold text-base">Recommended Reads</h2>
        <div className="flex flex-col justify-items-center gap-4">
          {recommended.length === 0 ? (
            <p className="text-bunker-400">No recommended books</p>
          ) : (
            recommended.map((book) => (
              <div key={book.id} className="">
                <img
                  src={book.cover_image_url}
                  className="w-48 md:w-52 max-h-48  md:max-h-72 object-cover rounded-xl"
                  alt={book.title}
                />
                <div className="text-bunker-400">
                  <p className="">{book.title}</p>
                  <p className="text-sm">by {book.author.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

// Prop Types
Recommendations.propTypes = {
  recommendedBooks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      cover_image_url: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Recommendations;
