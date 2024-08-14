import BookCategoryCard from "./bookCategoryCard";
import PropTypes from "prop-types";

const BooksCategoryDisplay = ({ data }) => {
  const categories = {};

  data.forEach((book) => {
    if (!categories[book.category.id]) {
      categories[book.category.id] = {
        ...book.category,
        books: [],
      };
    }
    categories[book.category.id].books.push(book);
  });

  const categoryArray = Object.values(categories).slice(0, 4);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categoryArray.map((category) => (
        <BookCategoryCard
          key={category.id}
          category={category}
          books={category.books}
        />
      ))}
    </div>
  );
};

// validate the props passed to the component
BooksCategoryDisplay.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      cover_image_url: PropTypes.string,
      category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default BooksCategoryDisplay;
