import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import {
  Favorite,
  Announcements,
  Reviews,
  Engagements,
  Settings,
} from "@/components";

const ProfileActivities = () => {
  const [activeTab, setActiveTab] = useState("Favorite");
  const scrollRef = useRef(null);

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

  const renderContent = () => {
    switch (activeTab) {
      case "Favorite":
        return <Favorite />;
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
    <>
      <div className="bg-white rounded-[10px] shadow-lg w-full ">
        {/* activity nav */}
        <div className="flex items-center justify-between mb-4 bg-downy-light rounded-t-[7px]">
          <div className="w-full overflow-x-auto p-6" ref={scrollRef}>
            <ul className="flex gap-2 md:gap-5 whitespace-nowrap">
              <li
                className={`flex-shrink-0 cursor-pointer ${
                  activeTab === "Favorite" ? "text-action" : ""
                }`}
                onClick={() => setActiveTab("Favorite")}
              >
                Favorite
              </li>
              <li
                className={`flex-shrink-0 cursor-pointer ${
                  activeTab === "Notifications" ? "text-action" : ""
                }`}
                onClick={() => setActiveTab("Notifications")}
              >
                Notifications
              </li>
              <li
                className={`flex-shrink-0 cursor-pointer ${
                  activeTab === "Reviews" ? "text-action" : ""
                }`}
                onClick={() => setActiveTab("Reviews")}
              >
                Reviews
              </li>
              <li
                className={`flex-shrink-0 cursor-pointer ${
                  activeTab === "Engagements" ? "text-action" : ""
                }`}
                onClick={() => setActiveTab("Engagements")}
              >
                Engagements
              </li>
              <li
                className={`flex-shrink-0 cursor-pointer ${
                  activeTab === "Settings" ? "text-action" : ""
                }`}
                onClick={() => setActiveTab("Settings")}
              >
                Settings
              </li>
            </ul>
          </div>
          {/* Mobile horizontal scroll buttons */}
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
    </>
  );
};

export default ProfileActivities;
