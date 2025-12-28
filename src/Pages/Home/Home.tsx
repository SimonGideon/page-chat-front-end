import { useEffect, useState } from "react";

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
  const { books, loading, error } = useAppSelector((state) => state.featured);
  const [languages, setLanguages] = useState<DropdownOption[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

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
      fetchFeaturedBooks(selectedLanguage ? { language: selectedLanguage } : undefined)
    );
  }, [dispatch, selectedLanguage]);

  const handleTitleLength = (bookTitle: string) => {
    return bookTitle.length > 20 ? `${bookTitle.slice(0, 20)}...` : bookTitle;
  };

  const handleRetry = () => {
    dispatch(
      fetchFeaturedBooks(selectedLanguage ? { language: selectedLanguage } : undefined)
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
          <div className="flex justify-end">
            <div className="w-64">
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
