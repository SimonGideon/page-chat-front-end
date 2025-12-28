import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Send, X, Plus, ChevronDown, ChevronUp, Reply } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Discussion, Comment, Identifier } from "@/types";
import { apiClient } from "@/services/api";
import { useAppSelector } from "@/redux/hooks";
import { formatRelativeTime } from "@/lib/utils";

interface DiscussionPanelProps {
  bookId: Identifier;
  onClose?: () => void;
  className?: string;
}

const getTwoNames = (user: any) => {
  if (!user) return "Anonymous";
  const first = user.first_name || "";
  const last = user.last_name || "";
  return `${first} ${last}`.trim().split(/\s+/).slice(0, 2).join(" ");
};

const DiscussionPanel = ({ bookId, onClose, className = "" }: DiscussionPanelProps) => {

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [totalDiscussions, setTotalDiscussions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [activeDiscussion, setActiveDiscussion] = useState<Discussion | null>(
    null
  );
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const fetchDiscussions = async (pageNum: number, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await apiClient.getBookDiscussions(String(bookId), pageNum);
      const data = response.data as Discussion[];
      const total = response.meta.total_count;

      if (reset) {
         setDiscussions(data);
         setTotalDiscussions(total);
         setHasMore(data.length < total);
      } else {
         setDiscussions((prev) => [...prev, ...data]);
         // Correct check: Do we have more items total than we have currently loaded (including new data)?
         // Note: discussions state is stale here (from closure). 
         setHasMore(discussions.length + data.length < total); 
      }
    } catch (error) {
      console.error("Failed to fetch discussions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchDiscussions(1, true);
  }, [bookId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDiscussions(nextPage);
    }
  };

  const handleDiscussionCreated = (newDiscussion: Discussion) => {
    setDiscussions([newDiscussion, ...discussions]);
    setShowNewDiscussion(false);
    setActiveDiscussion(newDiscussion);
  };

  return (
    <div className={`bg-white border-l border-cream flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-cream flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <h3 className="font-semibold text-charcoal flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-downy" />
          Discussions
          {totalDiscussions > 0 && (
            <span className="bg-downy/10 text-downy text-xs px-2 py-0.5 rounded-full font-bold ml-1">
              {totalDiscussions}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {!showNewDiscussion && !activeDiscussion && (
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="p-2 rounded-full hover:bg-cream text-charcoal/60 hover:text-downy transition-colors"
              title="Start new discussion"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream text-charcoal/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {showNewDiscussion ? (
          <NewDiscussionForm
            bookId={bookId}
            onCancel={() => setShowNewDiscussion(false)}
            onSuccess={handleDiscussionCreated}
          />
        ) : activeDiscussion ? (
          <DiscussionDetail
            discussion={activeDiscussion}
            onBack={() => setActiveDiscussion(null)}
            currentUser={user}
          />
        ) : (
          <div className="space-y-4">
            {discussions.length > 0 ? (
                discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    onClick={() => setActiveDiscussion(discussion)}
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
                             <span className="text-[10px] text-charcoal/40 flex-shrink-0 ml-2">
                                {formatRelativeTime(discussion.created_at)}
                             </span>
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
                  onClick={() => setShowNewDiscussion(true)}
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
        )}
      </div>
    </div>
  );
};

// ... NewDiscussionForm remains same ...
const NewDiscussionForm = ({
  bookId,
  onCancel,
  onSuccess,
}: {
  bookId: Identifier;
  onCancel: () => void;
  onSuccess: (discussion: Discussion) => void;
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ title: string; body: string }>();

  const onSubmit = async (data: { title: string; body: string }) => {
    try {
      const response = await apiClient.createDiscussion(String(bookId), data);
      const newDiscussion = (response as any).data || response;
       onSuccess(newDiscussion as Discussion);
    } catch (error) {
      console.error("Failed to create discussion", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-charcoal">New Discussion</h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-charcoal/50 hover:text-charcoal"
        >
          Cancel
        </button>
      </div>
      
      <div>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Discussion Title"
          className="w-full px-4 py-2 rounded-xl border border-cream focus:outline-none focus:border-downy focus:ring-1 focus:ring-downy transition-all placeholder:text-charcoal/30 bg-white"
        />
        {errors.title && <span className="text-xs text-red-500 mt-1">{errors.title.message}</span>}
      </div>

      <div>
        <textarea
          {...register("body", { required: "Content is required" })}
          placeholder="What would you like to discuss?"
          rows={5}
          className="w-full px-4 py-2 rounded-xl border border-cream focus:outline-none focus:border-downy focus:ring-1 focus:ring-downy transition-all placeholder:text-charcoal/30 bg-white resize-none"
        />
        {errors.body && <span className="text-xs text-red-500 mt-1">{errors.body.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-downy text-white rounded-xl font-medium hover:bg-downy-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Creating..." : "Start Discussion"}
      </button>
    </form>
  );
};


const DiscussionDetail = ({
  discussion,
  onBack,
  currentUser,
}: {
  discussion: Discussion;
  onBack: () => void;
  currentUser: any;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async (pageNum: number, reset = false) => {
    if (loading) return; 
    setLoading(true);
    try {
      const response = await apiClient.getDiscussionComments(String(discussion.id), pageNum);
      const data = response.data as Comment[];
      const total = response.meta.total_count;

      if (reset) {
        setComments(data);
      } else {
        setComments((prev) => [...prev, ...data]);
      }
      
      // Pagination logic
      if (reset) {
         setHasMore(data.length < total);
      } else {
         setHasMore(comments.length + data.length < total);
      }

    } catch (error) {
       console.error("Failed to fetch comments", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchComments(1, true);
  }, [discussion.id]);

  const loadMoreComments = () => {
     if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const response = await apiClient.createComment(String(discussion.id), {
        body: commentText,
      });
       const newComment = (response as any).data || response;
        const commentWithUser = {
            ...newComment,
            user: {
                first_name: currentUser?.first_name || 'Me',
                last_name: currentUser?.last_name || '',
                ...currentUser
            },
            replies: [] 
        };
      
      // Add to top of list as a new top-level comment
      setComments([commentWithUser, ...comments]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-charcoal/50 hover:text-downy mb-4 w-fit transition-colors group"
      >
        <div className="p-1 rounded-full group-hover:bg-cream transition-colors">
            <ChevronLeftIcon className="w-4 h-4" />
        </div>
        Back to list
      </button>

      {/* Discussion Header / Main Post */}
      <div className="mb-4 bg-cream/10 p-3 rounded-2xl border border-cream">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-cream overflow-hidden bg-white flex-shrink-0">
                    {discussion.user?.avatar_url ? (
                         <img src={discussion.user.avatar_url} alt={discussion.user.first_name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-downy/10 flex items-center justify-center text-downy font-bold text-xs">
                            {discussion.user?.first_name?.[0]?.toUpperCase() || "A"}
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-charcoal">
                        {discussion.user ? getTwoNames(discussion.user) : "Anonymous"}
                    </h4>
                    <p className="text-[10px] text-charcoal/50">
                    <p className="text-[10px] text-charcoal/50">
                        {formatRelativeTime(discussion.created_at)}
                    </p>
                    </p>
                </div>
            </div>
            {/* Optional: Add share/menu options here */}
        </div>

        <h1 className="text-lg font-bold text-charcoal mb-2 leading-tight tracking-tight">
          {discussion.title}
        </h1>
        
        <div className="prose prose-sm max-w-none text-charcoal/80 leading-relaxed font-serif text-sm">
            <p className="whitespace-pre-wrap">{discussion.body}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 px-2">
         <h4 className="text-sm font-semibold text-charcoal">Comments</h4>
         <span className="bg-cream px-2 py-0.5 rounded-full text-xs text-charcoal/60 font-medium">{comments.length}</span>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar pr-2">
         {comments.length > 0 ? (
            <div className="space-y-4">
                {comments.map(c => (
                    <CommentItem key={c.id} comment={c} discussionId={discussion.id} currentUser={currentUser} />
                ))}
            </div>
         ) : !loading && (
             <p className="text-center text-sm text-charcoal/40 italic py-8">
                No comments yet. Be the first to join the conversation!
              </p>
         )}
         
         {loading && <div className="text-center py-4 text-xs text-charcoal/40">Loading comments...</div>}
         
         {!loading && hasMore && comments.length > 0 && (
              <button 
                onClick={loadMoreComments}
                className="w-full py-2 text-xs text-downy hover:bg-cream/30 rounded-lg transition-colors mt-2"
              >
                Load more comments
              </button>
            )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSendComment} className="mt-auto pt-2 bg-white">
        <div className="relative">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type a comment..."
            className="w-full pl-4 pr-12 py-3 bg-cream/20 border border-cream rounded-xl focus:outline-none focus:border-downy focus:ring-1 focus:ring-downy transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || submitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-downy text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-downy-dark transition-colors flex items-center justify-center shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

const CommentItem = ({ comment, discussionId, currentUser, depth = 0 }: { comment: Comment, discussionId: Identifier, currentUser: any, depth?: number }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
    const [submitting, setSubmitting] = useState(false);
    
    // We update local replies state if initial props change (unlikely unless re-fetch)
    useEffect(() => {
        if(comment.replies) setReplies(comment.replies);
    }, [comment.replies]);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!replyText.trim()) return;
        
        setSubmitting(true);
        try {
             const response = await apiClient.createComment(String(discussionId), {
                body: replyText,
                parent_id: comment.id
            });
             const newReply = (response as any).data || response;
             const replyWithUser = {
                ...newReply,
                 user: { // Fallback user info
                    first_name: currentUser?.first_name || 'Me',
                    last_name: currentUser?.last_name || '',
                    ...currentUser
                },
                replies: []
             };
             
             setReplies([...replies, replyWithUser]);
             setIsReplying(false);
             setReplyText("");
        } catch(error) {
             console.error("Failed to reply", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={`flex flex-col gap-2 ${depth > 0 ? "ml-3 border-l md:ml-4 border-cream pl-2 md:pl-3" : ""}`}>
            <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cream flex items-center justify-center text-charcoal/60 text-xs font-bold overflow-hidden border border-cream">
                    {comment.user?.avatar_url ? (
                        <img src={comment.user.avatar_url} alt={comment.user.first_name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{comment.user?.first_name?.[0] || "?"}</span>
                    )}
                </div>
                <div className="flex-1 bg-cream/20 p-2.5 rounded-2xl rounded-tl-none">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-charcoal">
                            {comment.user?.first_name || "User"}
                        </span>
                         <span className="text-[10px] text-charcoal/40">
                            {formatRelativeTime(comment.created_at)}
                          </span>
                    </div>
                    <p className="text-sm text-charcoal/80 leading-relaxed">
                        {comment.body}
                    </p>
                    
                    {/* Reply Action */}
                    <div className="mt-2 flex items-center gap-2">
                         <button 
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs text-charcoal/40 hover:text-downy flex items-center gap-1 transition-colors"
                        >
                            <Reply className="w-3 h-3" /> Reply
                         </button>
                    </div>
                </div>
            </div>
            
            {isReplying && (
                <form onSubmit={handleSendReply} className="ml-11 flex gap-2 animate-in slide-in-from-top-2 duration-200">
                    <input 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-1.5 text-sm bg-white border border-cream rounded-lg focus:outline-none focus:border-downy"
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        disabled={submitting || !replyText.trim()}
                        className="px-3 py-1.5 bg-charcoal text-white text-xs rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                    >
                        Reply
                    </button>
                </form>
            )}

            {/* Nested Replies */}
            {replies.length > 0 && (
                <div className="mt-1 space-y-3">
                    {replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            discussionId={discussionId} 
                            currentUser={currentUser}
                            depth={depth + 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}


// Helper icon
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default DiscussionPanel;
