import type { FavoriteBookEntry } from "@/types";

type FavoriteProps = {
  favoriteBooks?: FavoriteBookEntry[];
};

const Favorite = ({ favoriteBooks = [] }: FavoriteProps) => {
  const hasFavorites = favoriteBooks.length > 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Favorite Books</h1>
      {hasFavorites ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favoriteBooks.map((item) => {
            const details = item.book;
            return (
              <div
                key={item.id}
                className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
              >
                {details ? (
                  <div>
                    <img
                      src={`https://via.placeholder.com/150?text=${encodeURIComponent(
                        details.title
                      )}`}
                      alt={details.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <h2 className="text-lg font-semibold mt-2">
                      {details.title}
                    </h2>
                    <p className="text-gray-700 text-sm">
                      {details.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Published by: {details.publisher ?? "Unknown"}
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    No details available for this book.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">You have no favorite books yet.</p>
      )}
    </div>
  );
};

export default Favorite;
