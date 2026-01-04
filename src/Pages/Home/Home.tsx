import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { NavBar } from "@/components";
import { BooksList, HeroSection, Recommendations } from "./components";
import { fetchFeaturedBooks } from "@/redux/features/booksSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-xl bg-[#f3ebdd] ${className}`} />
);

const BooksSectionSkeleton = () => (
  <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <SkeletonBlock key={index} className="h-48" />
    ))}
  </div>
);

const RecommendationsSkeleton = () => (
  <div className="min-w-[240px] space-y-4 rounded-xl border border-[#f1e7d2] bg-white p-4 shadow-sm">
    <SkeletonBlock className="h-6 w-2/3" />
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3">
        <SkeletonBlock className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const HomeSkeleton = () => (
  <div>
    <NavBar />
    <div className="container space-y-6 pt-6">
      <SkeletonBlock className="h-[360px] w-full" />
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-4 rounded-2xl border border-[#f1e7d2] bg-white p-4 shadow-sm">
          <SkeletonBlock className="h-6 w-40" />
          <BooksSectionSkeleton />
        </div>
        <RecommendationsSkeleton />
      </div>
    </div>
  </div>
);

const EmptyBooksState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-downy/30 bg-white p-10 text-center shadow-[0_15px_60px_rgba(34,34,34,0.06)]">
    <h3 className="text-xl font-semibold text-charcoal">
      No books available yet
    </h3>
    <p className="mt-2 max-w-md text-sm text-charcoal/70">
      Check back soon as our librarians curate fresh recommendations, or try
      refreshing to fetch the latest titles.
    </p>
    <button
      onClick={onRetry}
      className="mt-6 rounded-full bg-downy px-6 py-2 text-white shadow-sm transition hover:bg-downy-dark"
      type="button"
    >
      Refresh Recommendations
    </button>
  </div>
);

import { apiClient } from "@/services/api";
import GlobalDropdown, {
  DropdownOption,
} from "@/components/ui/GlobalDropdown";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading, error } = useAppSelector((state) => state.featured);
  const [languages, setLanguages] = useState<DropdownOption[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await apiClient.getLanguages();
        setLanguages(response.data);
      } catch (error) {
        console.error("Failed to fetch languages", error);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    dispatch(
      fetchFeaturedBooks({
        language: selectedLanguage || undefined,
        q: debouncedQuery || undefined,
      })
    );
  }, [dispatch, selectedLanguage, debouncedQuery]);

  const handleTitleLength = (bookTitle: string) => {
    return bookTitle.length > 20 ? `${bookTitle.slice(0, 20)}...` : bookTitle;
  };

  const handleRetry = () => {
    dispatch(
      fetchFeaturedBooks({
        language: selectedLanguage || undefined,
        q: debouncedQuery || undefined,
      })
    );
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container space-y-6 pt-6">
        <div className="layout-container flex h-full flex-col gap-6">
          <HeroSection />
          <div className="flex flex-col md:flex-row justify-end gap-4">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-charcoal/50">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                className="block w-full rounded-xl border border-[#f1e7d2] bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal focus:border-downy focus:outline-none focus:ring-1 focus:ring-downy placeholder:text-charcoal/40"
                placeholder="Search title, author, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {debouncedQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-xl border border-[#f1e7d2] bg-white shadow-xl z-50">
                   {loading ? (
                       <div className="p-4 text-center text-sm text-charcoal/50">Searching...</div>
                   ) : books.length > 0 ? (
                       <ul className="divide-y divide-[#f1e7d2]/50">
                           {books.slice(0, 10).map((book) => (
                               <li 
                                   key={book.id} 
                                   onClick={() => navigate(`/read/${book.id}`)}
                                   className="flex items-center gap-3 p-3 hover:bg-downy-lightest cursor-pointer transition-colors"
                               >
                                   <img src={book.cover_image_url} alt={book.title} className="h-12 w-8 object-cover rounded shadow-sm" />
                                   <div>
                                       <h4 className="text-sm font-semibold text-charcoal line-clamp-1">{book.title}</h4>
                                       <p className="text-xs text-charcoal/60">by {book.author.name}</p>
                                   </div>
                               </li>
                           ))}
                       </ul>
                   ) : (
                       <div className="p-4 text-center text-sm text-charcoal/50">No results found for "{debouncedQuery}"</div>
                   )}
                </div>
              )}
            </div>
            <div className="w-full md:w-64">
              <GlobalDropdown
                options={languages}
                name="language"
                placeholder="Filter by Language"
                onChange={(value) => setSelectedLanguage(value as string)}
                value={selectedLanguage}
                searchable
              />
            </div>
          </div>
          <div className="z-0 flex flex-col-reverse gap-6 md:flex-row">
            {books.length ? (
              <BooksList books={books} onTitleLength={handleTitleLength} />
            ) : (
              <EmptyBooksState onRetry={handleRetry} />
            )}
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
