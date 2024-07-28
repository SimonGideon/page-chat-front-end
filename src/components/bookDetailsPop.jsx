import PropTypes from "prop-types";

const BookDetails = ({ book, onClose }) => {
  return (
    <>
      {/* book details popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-xl w-96">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">{book.title}</h2>
            <button className="text-bunker-400" onClick={() => onClose(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <hr className="my-4" />
          <div className="flex gap-4">
            <img
              src={book.cover_image_url}
              className="w-32 h-48 object-cover rounded-xl"
              alt={book.title}
            />
            <div>
              <p className="text-bunker-950 font-semibold">{book.title}</p>
              <p className="text-sm">by {book.author.name}</p>
              <p className="text-bunker-400">{book.description}</p>
            </div>
          </div>
          {/* book pdf */}
        </div>
      </div>
    </>
  );
};

BookDetails.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    cover_image_url: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookDetails;
