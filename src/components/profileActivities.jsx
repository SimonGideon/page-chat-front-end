import React from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

const ProfileActivities = () => {
  const scrollRef = React.useRef(null);

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
  return (
    <>
      <div className="bg-white rounded-[10px] shadow-lg w-full ">
        {/* activity nav */}
        <div className="flex items-center justify-between mb-4 bg-downy-light rounded-t-[7px]">
          <div className="w-full overflow-x-auto p-6" ref={scrollRef}>
            <ul className="flex gap-2 md:gap-5 whitespace-nowrap">
              <li className="flex-shrink-0 text-action">Favorite</li>
              <li className="flex-shrink-0">Notifications</li>
              <li className="flex-shrink-0">Reviews</li>
              <li className="flex-shrink-0">Engagements</li>
              <li className="flex-shrink-0">Settings</li>
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

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Favorites</h3>
          <p className="text-gray-600">
            User favorites will be displayed here.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfileActivities;
