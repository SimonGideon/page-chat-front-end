import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Check, Bell, Loader2 } from "lucide-react";
import { apiClient } from "@/services/api";
import { Button } from "@/components/ui/button";

const Announcements = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async (pageNum: number, isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const response = await apiClient.getNotifications(pageNum);
            
            // If fetching page 1 (refresh or init), replace. Else append.
            if (pageNum === 1) {
                setNotifications(response.data);
            } else {
                setNotifications(prev => [...prev, ...response.data]);
            }
            setHasMore(response.data.length > 0 && pageNum < response.meta.total_pages);
        } catch (error) {
            console.error(error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    // Heartbeat: Poll every 10s if we are on the first page
    useEffect(() => {
        const interval = setInterval(() => {
            if (page === 1 && !loading) {
                fetchNotifications(1, true);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [page, loading, fetchNotifications]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNotifications(nextPage);
    };

    const handleMarkAllRead = async () => {
        try {
            await apiClient.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.read_at) {
            apiClient.markNotificationAsRead(notification.id).catch(console.error);
            setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, read_at: new Date().toISOString()} : n));
        }
        
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <Bell className="w-5 h-5 text-downy" />
                     Notifications
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">
                     Stay updated with activity on your discussions.
                   </p>
                </div>
                {notifications.some(n => !n.read_at) && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleMarkAllRead}
                        className="text-downy border-downy hover:bg-downy/10"
                    >
                        <Check className="w-4 h-4 mr-2" /> Mark all read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-900 font-medium">No new notifications</h3>
                        <p className="text-gray-500 text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                        {notifications.map((notif) => (
                             <div 
                                key={notif.id} 
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-4 sm:p-6 hover:bg-gray-50 transition cursor-pointer flex gap-4 ${!notif.read_at ? 'bg-blue-50/40' : ''}`}
                            >
                                <div className="flex-shrink-0">
                                     {notif.actor?.avatar_url ? (
                                        <img src={notif.actor.avatar_url} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-100" alt="" />
                                     ) : (
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-downy/10 text-downy flex items-center justify-center font-bold text-sm">
                                            {notif.actor?.name?.[0]}
                                        </div>
                                     )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="text-sm sm:text-base text-gray-900 font-medium leading-tight">
                                            {notif.actor?.name}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 sm:mt-0.5">
                                        {notif.action === 'liked_comment' && 'liked your comment'}
                                        {notif.action === 'replied_to_comment' && 'replied to your comment'}
                                        {notif.action === 'commented_on_discussion' && 'commented on your discussion'}
                                    </p>
                                </div>
                                {!notif.read_at && (
                                    <div className="self-center">
                                        <div className="w-2.5 h-2.5 bg-downy rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                {loading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 text-downy animate-spin" />
                    </div>
                )}

                {!loading && hasMore && (
                    <div className="flex justify-center">
                        <Button variant="ghost" onClick={loadMore} className="text-downy hover:bg-downy/10">
                            Load More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
