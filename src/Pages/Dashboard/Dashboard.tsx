import { useEffect, useState } from "react";
import {
  BookOpen,
  Heart,
  Clock,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { BookCard, Breadcrumb, Loader, NavBar } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFavoriteBooks } from "@/redux/features/favoriteSlice";
import { fetchRecommendedBooks } from "@/redux/features/booksSlice";
import HappyBirthday from "./components/happyBirthDay";

const PageChat = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { favBooks } = useAppSelector((state) => state.favBooks);
  const { books: recommendedBooks, loading: booksLoading } = useAppSelector(
    (state) => state.recommended
  );
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (user?.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(user.date_of_birth);
      setIsBirthday(
        today.getMonth() === birthDate.getMonth() &&
          today.getDate() === birthDate.getDate()
      );
    }
  }, [user?.date_of_birth]);

  useEffect(() => {
    if (user?.id) {
      // Fetch favorites locally to ensure correct structure
      setLoadingFavorites(true);
      import("@/services/api").then(({ apiClient }) => {
          apiClient.getFavorites()
            .then(res => setFavoriteBooks(res.data || []))
            .catch(err => console.error("Failed to fetch favorites", err))
            .finally(() => setLoadingFavorites(false));
      });
    }
    dispatch(fetchRecommendedBooks());
  }, [dispatch, user?.id]);

  // Only show loading if we're loading AND don't have a user yet
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const stats = [
    {
      label: "Favorites",
      value: favoriteBooks.length || favBooks?.length || 0,
      icon: Heart,
      color: "bg-gradient-to-br from-rose-400 to-rose-500",
      href: "/profile",
    },
    {
      label: "Books Read",
      value: 12,
      icon: BookOpen,
      color: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      href: "/profile",
    },
    {
      label: "Reading Time",
      value: "24h",
      icon: Clock,
      color: "bg-gradient-to-br from-amber-400 to-amber-500",
      href: "/profile",
    },
    {
      label: "Streak",
      value: "7 days",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-violet-400 to-violet-500",
      href: "/profile",
    },
  ];

  const quickActions = [
    { label: "Browse Books", href: "/", icon: BookOpen },
    { label: "My Favorites", href: "/profile", icon: Heart },
    { label: "Settings", href: "/profile/settings", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-white">
      {isBirthday && user && (
        <HappyBirthday
          onClose={() => setIsBirthday(false)}
          firstName={user.first_name}
        />
      )}
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Dashboard" }]} />

        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-downy to-downy-dark rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 z-0" />
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1">
                {greeting}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-white/70 max-w-lg">
                Welcome back to Page Chat! Ready to discover your next favorite
                read?
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-charcoal mb-4">
            Your Stats
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <button
                key={stat.label}
                onClick={() => navigate(stat.href)}
                className="group bg-white rounded-2xl p-5 shadow-sm border border-cream hover:shadow-md hover:border-downy/30 transition-all duration-200 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`${stat.color} p-2.5 rounded-xl text-white shadow-lg`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-downy group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                <p className="text-sm text-charcoal/60">{stat.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-charcoal mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.href)}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-cream hover:border-downy hover:bg-downy hover:text-white transition-all duration-200 text-charcoal font-medium shadow-sm"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Books */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-charcoal">
              Recommended for You
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-downy hover:text-downy-dark font-medium flex items-center gap-1 transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {booksLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : recommendedBooks && recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendedBooks.slice(0, 5).map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() =>
                    navigate(`/read/${book.id}`, { state: { book } })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-cream">
              <BookOpen className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-charcoal mb-2">
                No recommendations yet
              </h3>
              <p className="text-charcoal/60 mb-4">
                Start exploring books to get personalized recommendations
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-downy text-white rounded-full font-medium hover:bg-downy-dark transition-colors"
              >
                Browse Books
              </button>
            </div>
          )}
        </section>

        {/* Favorites Preview */}
        {favoriteBooks.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-charcoal">
                Your Favorites
              </h2>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-downy hover:text-downy-dark font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favoriteBooks.slice(0, 5).map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() =>
                    navigate(`/read/${book.id}`, { state: { book } })
                  }
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default PageChat;
