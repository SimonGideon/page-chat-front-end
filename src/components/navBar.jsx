import { User, BookOpen, Bell, ChevronDown, LogOut } from "react-feather";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "@/redux/features/authSlice";
import { toast } from "@/components/ui";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user details when component mounts
    dispatch(getCurrentUser());
  }, [dispatch]);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  const handleLogout = () => {
    dispatch(logout());
    setIsPopupVisible(false);
    toast({
      title: "Logout Successful",
      variant: "success",
      description: "You have successfully logged out.",
    });
    // Redirect to login page or perform additional logout actions
    navigate("/signin");
  };

  return (
    <header className="flex bg-white items-center sticky z-10 top-0 justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3 h-16">
      <div className="flex items-center gap-4 text-banker-950">
        <div className="size-6">
          <BookOpen />
        </div>
        <h2 className="text-bunker-950 text-lg font-bold leading-tight tracking-[-0.015em]">
          FaithReads
        </h2>
      </div>
      <div className="flex justify-between items-center gap-8">
        <div className="flex gap-5 justify-center items-center">
          <Bell />
          {user ? (
            <div className="relative">
              <div className="flex gap-1 justify-end items-baseline">
                <div
                  className="bg-downy rounded-full p-1 cursor-pointer"
                  onClick={togglePopup}
                >
                  <User className="text-white" />
                </div>
                <ChevronDown
                  className={`cursor-pointer transform transition-transform ${
                    isPopupVisible ? "rotate-180" : "rotate-0"
                  }`}
                  onClick={togglePopup}
                />
                {isPopupVisible && (
                  <div
                    ref={popupRef}
                    className="absolute pt-0 right-0 mt-8 w-48 bg-white rounded-md shadow-lg z-10"
                  >
                    <ul className="py-1">
                      <li className="px-4 py-2 hover:bg-downy hover:text-white cursor-pointer">
                        <a className="flex" href="/profile">
                          Profile
                        </a>
                      </li>
                      <li className="px-4 py-2 hover:bg-downy hover:text-white cursor-pointer">
                        <a className="flex" href="/settings">
                          Settings
                        </a>
                      </li>
                      <hr />
                      <li
                        className="px-4 py-2 gap-1 flex hover:bg-downy text-cyan-500 hover:text-white cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut style={{ fontSize: "0.2rem" }} /> LOGOUT
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              className="bg-downy hover:bg-[#4da0ff93] text-white px-2.5 py-1.5 rounded"
              onClick={() => navigate("/signin")}
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
