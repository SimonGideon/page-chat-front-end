import { useState, useMemo } from "react";
import type { FavoriteBookEntry } from "@/types";
import { BookCard } from "@/components";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowDownUp } from "lucide-react";

type FavoriteProps = {
  favoriteBooks?: FavoriteBookEntry[];
};

const Favorite = ({ favoriteBooks = [] }: FavoriteProps) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"recent" | "title" | "author">("recent");
  const hasFavorites = favoriteBooks.length > 0;

  const sortedBooks = useMemo(() => {
    return [...favoriteBooks].sort((a, b) => {
      const bookA = a.book;
      const bookB = b.book;
      if (!bookA || !bookB) return 0;

      switch (sortBy) {
        case "title":
          return bookA.title.localeCompare(bookB.title);
        case "author":
          return bookA.author.name.localeCompare(bookB.author.name);
        case "recent":
        default:
          // Assuming higher ID means newer, or use created_at if available.
          // Favorite ID (a.id) works best if created_at is unavailable.
          return Number(b.id) - Number(a.id);
      }
    });
  }, [favoriteBooks, sortBy]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-charcoal">
          Favorite Books
        </h1>
        
        <div className="relative group w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-colors cursor-pointer group-hover:border-downy/50 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-charcoal/60" />
              <span className="text-sm font-medium text-charcoal">
                Sort by: <span className="text-downy capitalize">{sortBy === 'recent' ? 'Recently Added' : sortBy}</span>
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-charcoal/40" />
          </div>

          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 transform origin-top-right">
             {[
               { label: "Recently Added", value: "recent" },
               { label: "Title (A-Z)", value: "title" },
               { label: "Author (A-Z)", value: "author" },
             ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === option.value ? "text-downy font-medium bg-downy/5" : "text-charcoal/80"
                  }`}
                >
                  {option.label}
                </button>
             ))}
          </div>
        </div>
      </div>
      {hasFavorites ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-in fade-in duration-500">
          {sortedBooks.map((item) => {
            const book = item.book;
            if (!book) return null;
            return (
              <BookCard
                key={item.id}
                book={book}
                onClick={() => navigate(`/read/${book.id}`, { state: { book } })}
              />
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
