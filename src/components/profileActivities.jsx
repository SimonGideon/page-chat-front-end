import { useState, useRef, useEffect } from "react";
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

const ProfileActivities = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Favorite");
  const { user } = useSelector((state) => state.auth);
  const { favBooks } = useSelector((state) => state.favBooks);
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFavoriteBooks(user && user.id));
  }, [dispatch, user]);

  //   scroll left button function
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  //   scroll right button function
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to get class names for tab items
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
    <>
      <div className="bg-white rounded-[10px] profile-activity shadow-lg w-full">
        {/* activity nav */}
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
