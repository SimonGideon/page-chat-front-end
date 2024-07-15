import PropTypes from "prop-types";

const BooksList = ({ books }) => {
  return (
    <section className="shadow-lg shadow-bunker-300 px-6 my-10 rounded-xl ">
      <h2 className="py-6 font-semibold text-lg">Trending Now</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-col-5 xl:grid-col-6 justify-items-center gap-4">
        {books &&
          books.map((book) => (
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
          ))}
      </div>
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
    })
  ).isRequired,
};

export default BooksList;
