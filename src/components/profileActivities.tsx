import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useLocation } from "react-router-dom";

import {
  Announcements,
  Engagements,
  Favorite,
  Reviews,
  Settings,
} from "@/components";
import { fetchFavoriteBooks } from "@/redux/features/favoriteSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const tabs = [
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
  const [activeTab, setActiveTab] = useState<Tab>("Favorite");
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
    } else {
      setActiveTab("Favorite");
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
  };

  const getTabClassNames = (tab: Tab) => `
    flex-shrink-0 cursor-pointer
    ${
      activeTab === tab
        ? "text-action font-medium border-b-2 border-action"
        : "text-gray-500"
    }
  `;

  const renderContent = () => {
    switch (activeTab) {
      case "Favorite":
        return <Favorite favoriteBooks={favBooks} />;
      case "Notifications":
        return <Announcements />;
      case "Reviews":
        return <Reviews />;
      case "Engagements":
        return <Engagements />;
      case "Settings":
        return <Settings />;
      default:
        return <Favorite favoriteBooks={favBooks} />;
    }
  };

  return (
    <div className="bg-white rounded-[10px] profile-activity shadow-lg w-full">
      <div className="flex items-center justify-between mb-4 bg-downy-light rounded-t-[7px]">
        <div className="w-full overflow-x-auto" ref={scrollRef}>
          <ul className="flex gap-2 md:gap-5 whitespace-nowrap">
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
        <div className="flex items-center gap-2 ml-4 md:hidden">
          <button
            className="bg-downy text-white p-1 rounded-[5px]"
            onClick={scrollLeft}
            type="button"
          >
            <ChevronLeft />
          </button>
          <button
            className="bg-downy text-white p-1 rounded-[5px]"
            onClick={scrollRight}
            type="button"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default ProfileActivities;
