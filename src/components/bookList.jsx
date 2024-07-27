import PropTypes from "prop-types";

const BooksList = ({ books }) => {
  const chosen = books.slice(0, 12);
  return (
    <section className="shadow-lg shadow-bunker-300 px-6 my-10 rounded-xl ">
      <div className="flex justify-between items-baseline">
        <h2 className="pt-6 pb-3 font-semibold text-lg">Trending Now</h2>
        <p className="font-medium underline cursor-pointer">See All</p>
      </div>
      <hr />
      <div className="grid pt-5 grid-cols-2 md:grid-cols-4 lg:grid-col-5 xl:grid-col-6 justify-items-center gap-4">
        {chosen &&
          chosen.map((book) => (
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
