import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";

import Announcements from "./announcement";
import EditProfile from "./editProfile";
import EngagementList from "./engaugementList"; // Corrected import
import Favorite from "./favorite";
import Reviews from "./reviews";
import Settings from "./settings";
import { fetchFavoriteBooks } from "@/redux/features/favoriteSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const tabs = [
  "Profile",
  "Favorite",
  "Notifications",
  "Reviews",
  "Engagements",
  "Settings",
] as const;

type Tab = (typeof tabs)[number];

const ProfileActivities = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const { user } = useAppSelector((state) => state.auth);
  const { favBooks } = useAppSelector((state) => state.favBooks);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user?.id !== undefined && user?.id !== null) {
      dispatch(fetchFavoriteBooks(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "notifications") {
      setActiveTab("Notifications");
    } else if (path === "settings") {
      setActiveTab("Settings");
    } else if (path === "reviews") {
      setActiveTab("Reviews");
    } else if (path === "engagements") {
      setActiveTab("Engagements");
    } else if (path === "favorites") {
      setActiveTab("Favorite");
    } else {
      setActiveTab("Profile");
    }
  }, [location.pathname]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Profile":
        navigate("/profile");
        break;
      case "Favorite":
        navigate("/profile/favorites");
        break;
      case "Notifications":
        navigate("/profile/notifications");
        break;
      case "Reviews":
        navigate("/profile/reviews");
        break;
      case "Engagements":
        navigate("/profile/engagements");
        break;
      case "Settings":
        navigate("/profile/settings");
        break;
    }
  };

  const getTabClassNames = (tab: Tab) => `
    flex-shrink-0 cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm
    ${
      activeTab === tab
        ? "text-primaryAccent font-semibold border-b-2 border-primaryAccent"
        : "text-charcoal/60 hover:text-charcoal/80"
    }
  `;

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <EditProfile />;
      case "Favorite":
        return <Favorite favoriteBooks={favBooks} />;
      case "Notifications":
        return <Announcements />;
      case "Reviews":
        return <Reviews />;
      case "Engagements":
        return <EngagementList />;
      case "Settings":
        return <Settings />;
      default:
        return <EditProfile />;
    }
  };

  return (
    <div className="profile-activity w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-xl sm:rounded-t-[14px] bg-gray-50 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex-1 overflow-x-auto scrollbar-hide" ref={scrollRef}>
          <ul className="flex gap-1 sm:gap-2 whitespace-nowrap md:gap-4">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={getTabClassNames(tab)}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden items-center gap-1 sm:gap-2 lg:flex ml-2">
          <button
            className="rounded-full bg-downy p-1 text-white shadow-sm hover:bg-downy-dark transition"
            onClick={scrollLeft}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="rounded-full bg-downy p-1 text-white shadow-sm hover:bg-downy-dark transition"
            onClick={scrollRight}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 md:p-6">{renderContent()}</div>
    </div>
  );
};

export default ProfileActivities;
