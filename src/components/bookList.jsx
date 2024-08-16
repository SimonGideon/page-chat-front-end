import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Book, BooksCategoryDisplay } from "@/components";

const BooksList = ({ books, onTitleLength }) => {
  const chosen = books.slice(0, 12);
  const navigate = useNavigate();

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
      <div>
        <p className="text-bunker-400 pt-3">Featured Cartegories</p>
        <BooksCategoryDisplay data={books} />
      </div>
      <div className="grid pt-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center gap-4">
        {chosen.map((book) => (
          <Book
            key={book.id}
            book={book}
            onTitleLength={onTitleLength}
            index={0}
            styleProps={{
              imageClass:
                "w-48 md:w-52 sm:max-h-45 md:max-h-72 object-cover rounded-xl",
              textClass: "text-bunker-400",
              containerClass: "cursor-pointer",
              textContainer: "text-bunker-400",
              textTitle: "text-bunker-950 font-semibold",
              textAuthor: "text-sm",
            }}
          />
        ))}
      </div>
    </section>
  );
};

BooksList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
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
