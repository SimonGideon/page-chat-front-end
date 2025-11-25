import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useLocation } from "react-router-dom";

import Announcements from "./announcement";
import Engagements from "./engagements";
import Favorite from "./favorite";
import Reviews from "./reviews";
import Settings from "./settings";
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
    flex-shrink-0 cursor-pointer px-2
    ${
      activeTab === tab
        ? "text-primaryAccent font-semibold border-b-2 border-primaryAccent"
        : "text-charcoal/60"
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
    <div className="profile-activity w-full rounded-2xl border border-[#e4d5bb] bg-[#fef9f0] shadow-sm">
      <div className="mb-4 flex items-center justify-between rounded-t-[14px] bg-[#ffeeda] px-4 py-3">
        <div className="w-full overflow-x-auto" ref={scrollRef}>
          <ul className="flex gap-2 whitespace-nowrap md:gap-5">
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
        <div className="hidden items-center gap-2 md:flex">
          <button
            className="rounded-full bg-downy p-1 text-white shadow-sm"
            onClick={scrollLeft}
            type="button"
          >
            <ChevronLeft />
          </button>
          <button
            className="rounded-full bg-downy p-1 text-white shadow-sm"
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
