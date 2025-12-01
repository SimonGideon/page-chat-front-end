import type { FavoriteBookEntry } from "@/types";

type FavoriteProps = {
  favoriteBooks?: FavoriteBookEntry[];
};

const Favorite = ({ favoriteBooks = [] }: FavoriteProps) => {
  const hasFavorites = favoriteBooks.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold text-charcoal">
        Favorite Books
      </h1>
      {hasFavorites ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {favoriteBooks.map((item) => {
            const details = item.book;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-[#efdcc2] bg-[#fef3df] p-4 shadow-sm transition hover:shadow-md"
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
                    <h2 className="mt-2 text-lg font-semibold text-charcoal">
                      {details.title}
                    </h2>
                    <p className="text-sm text-charcoal/80">
                      {details.description}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      Published by: {details.publisher ?? "Unknown"}
                    </p>
                  </div>
                ) : (
                  <div className="text-charcoal/60">
                    No details available for this book.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-charcoal/60">You have no favorite books yet.</p>
      )}
    </div>
  );
};

export default Favorite;
