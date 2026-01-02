import { MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { Discussion } from "@/types";

interface DiscussionListProps {
  discussions: Discussion[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onSelectDiscussion: (discussion: Discussion) => void;
  onStartNew: () => void;
}

export const DiscussionList = ({
  discussions,
  loading,
  hasMore,
  loadMore,
  onSelectDiscussion,
  onStartNew,
}: DiscussionListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
      {discussions.length > 0 ? (
          discussions.map((discussion) => (
            <div
              key={discussion.id}
              onClick={() => onSelectDiscussion(discussion)}
              className="p-4 rounded-xl border border-cream hover:border-downy/50 cursor-pointer transition-all hover:shadow-sm bg-white group flex gap-3"
            >
              {/* User Avatar */}
              <div className="flex-shrink-0">
                 <div className="w-10 h-10 rounded-full bg-cream overflow-hidden border border-downy/10">
                    {discussion.user?.avatar_url ? (
                       <img src={discussion.user.avatar_url} alt={discussion.user.first_name} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-charcoal/40 text-xs font-bold bg-white">
                          {discussion.user?.first_name?.[0] || "?"}
                       </div>
                    )}
                 </div>
              </div>
              
              <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                       <h4 className="font-medium text-charcoal text-sm group-hover:text-downy transition-colors truncate">
                          {discussion.title}
                       </h4>
                       <span className="text-[10px] text-charcoal/40 flex-shrink-0 ml-2">
                          {formatRelativeTime(discussion.created_at)}
                       </span>
                  </div>
                  
                  <p className="text-xs text-charcoal/60 line-clamp-2 mb-2 leading-relaxed">
                    {discussion.body}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-charcoal/40">
                       <span className="truncate max-w-[100px]">{discussion.user?.first_name || "Anonymous"}</span>
                       
                       <div className="flex items-center gap-2">
                          {/* Commenters Facepile */}
                          {discussion.recent_commenters && discussion.recent_commenters.length > 0 && (
                            <div className="flex items-center -space-x-2 mr-1">
                              {discussion.recent_commenters.slice(0, 5).map((commenter, i) => (
                                <div key={commenter.id || i} className="w-5 h-5 rounded-full border border-white bg-cream overflow-hidden">
                                  {commenter.avatar_url ? (
                                    <img src={commenter.avatar_url} alt={commenter.first_name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-downy/10 text-[8px] font-bold text-downy">
                                      {commenter.first_name?.[0] || "?"}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-1 bg-cream/30 px-2 py-0.5 rounded-full">
                              <MessageSquare className="w-3 h-3 text-downy" />
                              <span className="font-medium text-charcoal/60">{discussion.comments_count || 0}</span>
                          </div>
                       </div>
                  </div>
              </div>
            </div>
          ))
      ) : !loading && (
        <div className="text-center py-12">
           <div className="bg-cream/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-charcoal/20" />
          </div>
          <p className="text-charcoal/60 mb-4">No discussions yet</p>
          <button
            onClick={onStartNew}
            className="px-4 py-2 bg-downy text-white rounded-full text-sm font-medium hover:bg-downy-dark transition-colors"
          >
            Start specific discussion
          </button>
        </div>
      )}
      
      {loading && <div className="text-center py-4 text-charcoal/50 text-sm">Loading...</div>}
      
      {!loading && hasMore && discussions.length > 0 && (
        <button 
          onClick={loadMore}
          className="w-full py-2 text-sm text-downy hover:bg-cream/30 rounded-lg transition-colors"
        >
          Load more discussions
        </button>
      )}
    </div>
  );
};
