import { useEffect, useRef, useState } from "react";
import { BookOpen, Bell, ChevronDown, LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/services/api";
import { formatDistanceToNow } from "date-fns";

import { toast } from "@/components/ui";
import { getCurrentUser, logout } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifPopupVisible, setIsNotifPopupVisible] = useState(false);
  const notifPopupRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch current user if we have a token but no user
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
        const fetchNotifs = () => {
             apiClient.getNotifications().then(res => {
                setNotifications(res.data);
                setUnreadCount(res.meta.unread_count);
             }).catch(console.error);
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000); 
        return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        event.target instanceof Node &&
        !popupRef.current.contains(event.target)
      ) {
        setIsPopupVisible(false);
      }
      
      if (
        notifPopupRef.current &&
        event.target instanceof Node &&
        !notifPopupRef.current.contains(event.target)
      ) {
        setIsNotifPopupVisible(false);
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

  const toggleNotifPopup = () => setIsNotifPopupVisible((prev) => !prev);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read_at) {
        apiClient.markNotificationAsRead(notification.id).catch(console.error);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, read_at: new Date().toISOString()} : n));
    }
    
    setIsNotifPopupVisible(false);

    if (notification.redirect_info?.book_id) {
         navigate(`/read/${notification.redirect_info.book_id}`, { 
              state: { 
                  book: { id: notification.redirect_info.book_id }, 
                  discussionId: notification.redirect_info.discussion_id,
                  highlightCommentId: notification.redirect_info.comment_id
              }
          });
    }
  };

  const handleMarkAllRead = async () => {
      await apiClient.markAllNotificationsAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between whitespace-nowrap border-b border-[#e5d8bf] bg-[#faf3e1e6] px-6 backdrop-blur-md">
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
          <div className="relative">
            <button 
                onClick={toggleNotifPopup}
                className="relative p-2 text-charcoal/70 transition-colors hover:text-primaryAccent"
                aria-label="Notifications"
            >
                <Bell />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {isNotifPopupVisible && (
                <div
                    ref={notifPopupRef}
                    className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-[100] overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-charcoal">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-xs text-downy hover:underline font-medium">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <li className="p-8 text-center text-gray-400 text-sm">
                                No notifications yet.
                            </li>
                        ) : (
                            notifications.map((notif) => (
                                <li 
                                    key={notif.id} 
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!notif.read_at ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                         {notif.actor?.avatar_url ? (
                                            <img src={notif.actor.avatar_url} className="w-8 h-8 rounded-full object-cover border border-gray-100" alt="" />
                                         ) : (
                                            <div className="w-8 h-8 rounded-full bg-downy/10 text-downy flex items-center justify-center text-xs font-bold">
                                                {notif.actor?.name?.[0]}
                                            </div>
                                         )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-charcoal leading-snug">
                                            <span className="font-semibold">{notif.actor?.name}</span>
                                            {" "}
                                            {notif.action === 'liked_comment' && 'liked your comment'}
                                            {notif.action === 'replied_to_comment' && 'replied to you'}
                                            {notif.action === 'commented_on_discussion' && 'commented on your discussion'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notif.read_at && (
                                        <div className="self-center">
                                            <div className="w-2 h-2 bg-downy rounded-full"></div>
                                        </div>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
          </div>
          {user ? (
            <div className="relative z-[100]">
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
                    className="absolute right-0 mt-8 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg z-[100]"
                  >
                    <ul className="divide-y divide-gray-100">
                      <li className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-lg transition">
                        <a className="flex" href="/profile">
                          Profile
                        </a>
                      </li>
                      <li className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        <a className="flex" href="/profile/settings">
                          Settings
                        </a>
                      </li>
                      <li
                        className="px-4 py-3 flex items-center gap-2 text-red-500 hover:bg-gray-50 rounded-b-lg transition cursor-pointer"
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
