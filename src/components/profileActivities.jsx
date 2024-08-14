import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavoriteBooks } from "./../redux/features/favoriteSlice";
import {
  Favorite,
  Announcements,
  Reviews,
  Engagements,
  Settings,
} from "@/components";

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Favorite");
  const { user } = useSelector((state) => state.auth);
  const { favBooks } = useSelector((state) => state.favBooks);
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFavoriteBooks(user && user.id));
  }, [dispatch, user]);

  useEffect(() => {
    // Set the active tab based on the current URL
    const path = location.pathname.split("/").pop(); // Get the last part of the path
    if (path === "notifications") {
      setActiveTab("Notifications");
    } else if (path === "settings") {
      setActiveTab("Settings");
    } else {
      setActiveTab("Favorite");
    }
  }, [location.pathname]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassNames = (tab) => `
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
        return <Favorite />;
    }
  };

  return (
    <div className="bg-white rounded-[10px] profile-activity shadow-lg w-full">
      <div className="flex items-center justify-between mb-4 bg-downy-light rounded-t-[7px]">
        <div className="w-full overflow-x-auto" ref={scrollRef}>
          <ul className="flex gap-2 md:gap-5 whitespace-nowrap">
            {[
              "Favorite",
              "Notifications",
              "Reviews",
              "Engagements",
              "Settings",
            ].map((tab) => (
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
          >
            <ChevronLeft />
          </button>
          <button
            className="bg-downy text-white p-1 rounded-[5px]"
            onClick={scrollRight}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default Profile;
