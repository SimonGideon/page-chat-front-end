import { useEffect, useRef, useState } from "react";
import { BookOpen, Bell, ChevronDown, LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui";
import { getCurrentUser, logout } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        event.target instanceof Node &&
        !popupRef.current.contains(event.target)
      ) {
        setIsPopupVisible(false);
      }
    };

    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  const togglePopup = () => setIsPopupVisible((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    setIsPopupVisible(false);
    toast({
      title: "Logout Successful",
      variant: "success",
      description: "You have successfully logged out.",
    });
    navigate("/signin");
  };

  return (
    <header className="flex h-16 items-center justify-between whitespace-nowrap border-b border-[#e5d8bf] bg-[#faf3e1e6] px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 text-charcoal">
        <a href="/" className="flex items-center gap-2">
          <div className="size-6 text-primaryAccent">
            <BookOpen />
          </div>
          <h2 className="text-charcoal text-lg font-semibold leading-tight tracking-[-0.015em]">
            Page Chat
          </h2>
        </a>
      </div>
      <div className="flex justify-between items-center gap-8">
        <div className="flex gap-5 justify-center items-center">
          <a href="/profile/notifications" aria-label="Notifications">
            <Bell className="text-charcoal/70 transition-colors hover:text-primaryAccent" />
          </a>
          {user ? (
            <div className="relative">
              <div className="flex gap-1 justify-end items-baseline">
                <button
                  type="button"
                  className="bg-downy rounded-full p-1 text-center text-white shadow-sm transition hover:bg-downy-dark"
                  onClick={togglePopup}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="User Avatar"
                      className="rounded-full h-8 w-8 object-cover"
                    />
                  ) : (
                    <span className="text-white h-8 w-8 font-semibold">
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </span>
                  )}
                </button>
                <ChevronDown
                  className={`cursor-pointer transform transition-transform ${
                    isPopupVisible ? "rotate-180" : "rotate-0"
                  }`}
                  onClick={togglePopup}
                />
                {isPopupVisible && (
                  <div
                    ref={popupRef}
                    className="absolute right-0 mt-8 w-52 rounded-xl border border-[#efdcc2] bg-[#fef8ef] p-1 shadow-lg z-10"
                  >
                    <ul className="divide-y divide-[#efdcc2]">
                      <li className="px-4 py-3 text-sm font-medium text-charcoal hover:bg-downy hover:text-white rounded-t-lg transition">
                        <a className="flex" href="/profile">
                          Profile
                        </a>
                      </li>
                      <li className="px-4 py-3 text-sm font-medium text-charcoal hover:bg-downy hover:text-white transition">
                        <a className="flex" href="/profile/settings">
                          Settings
                        </a>
                      </li>
                      <li
                        className="px-4 py-3 flex items-center gap-2 text-primaryAccent hover:bg-downy-dark hover:text-white rounded-b-lg transition cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="text-sm" />
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              className="rounded-full bg-downy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-downy-dark"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
