import { useEffect, useState, useCallback, useRef } from "react";
import { MessageSquare, Send, X, Plus, ChevronDown, ChevronUp, Reply, Heart, Smile, MoreHorizontal, Flag, AlertTriangle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useForm } from "react-hook-form";
import type { Discussion, Comment, Identifier } from "@/types";
import { apiClient } from "@/services/api";
import { useAppSelector } from "@/redux/hooks";
import { formatRelativeTime } from "@/lib/utils";

interface DiscussionPanelProps {
  bookId: Identifier;
  onClose?: () => void;
  className?: string;
  initialDiscussionId?: Identifier;
  highlightCommentId?: Identifier;
}

const getTwoNames = (user: any) => {
  if (!user) return "Anonymous";
  const first = user.first_name || "";
  const last = user.last_name || "";
  return `${first} ${last}`.trim().split(/\s+/).slice(0, 2).join(" ");
};

const DiscussionPanel = ({ bookId, onClose, className = "", initialDiscussionId, highlightCommentId }: DiscussionPanelProps) => {

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

  const [reportItem, setReportItem] = useState<{ id: string | number; type: "Discussion" | "Comment" } | null>(null);

  const handleReport = async (reason: string) => {
    if (!reportItem) return;
    try {
      await apiClient.reportContent({
        reportable_id: reportItem.id,
        reportable_type: reportItem.type,
        reason,
      });
      // Optionally show success toast
      setReportItem(null);
    } catch (error) {
       console.error("Failed to report content", error);
       alert("Failed to allow report. You may have already reported this content.");
    }
  };

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

  // Handle deep link to discussion
  const [initialProcessed, setInitialProcessed] = useState(false);
  useEffect(() => {
      if (initialDiscussionId && discussions.length > 0 && !initialProcessed) {
          // Identify if we have the discussion
          const target = discussions.find(d => String(d.id) === String(initialDiscussionId));
          if (target) {
              setActiveDiscussion(target);
              setInitialProcessed(true);
          }
      }
  }, [discussions, initialDiscussionId, initialProcessed]);

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
      <div className="flex-1 min-h-0 flex flex-col bg-white relative">
        {showNewDiscussion ? (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <NewDiscussionForm
              bookId={bookId}
              onCancel={() => setShowNewDiscussion(false)}
              onSuccess={handleDiscussionCreated}
            />
          </div>
        ) : activeDiscussion ? (
          <DiscussionDetail
            discussion={activeDiscussion}
            onBack={() => setActiveDiscussion(null)}
            currentUser={user}
            highlightCommentId={highlightCommentId}
            onReport={(id) => setReportItem({ id, type: "Discussion" })}
            onReportComment={(id) => setReportItem({ id, type: "Comment" })}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
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
      <ReportModal 
        isOpen={!!reportItem} 
        onClose={() => setReportItem(null)} 
        onSubmit={handleReport} 
      />
    </div>
  );
};

const ReportModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (reason: string) => void }) => {
    const [reason, setReason] = useState("");
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
             <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-charcoal">Report Content</h3>
                </div>
                <p className="text-sm text-charcoal/60 mb-4">
                    Please help us keep this community safe. Why are you reporting this content?
                </p>
                
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide a reason (optional)..."
                    className="w-full p-3 bg-cream/20 border border-cream rounded-xl text-sm mb-4 focus:outline-none focus:border-red-400 min-h-[100px]"
                />
                
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-charcoal/60 hover:bg-cream/50 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSubmit(reason)}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm shadow-red-200"
                    >
                        Submit Report
                    </button>
                </div>
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
  const { register, handleSubmit, setValue, getValues, watch, formState: { errors, isSubmitting } } = useForm<{ title: string; body: string }>();
  const [showEmoji, setShowEmoji] = useState(false);
  
  const onEmojiClick = (emojiData: any) => {
      const current = getValues("body") || "";
      setValue("body", current + emojiData.emoji);
      setShowEmoji(false);
  };

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
        <div className="flex justify-end mt-2 relative">
             <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-gray-400 hover:text-downy transition-colors">
                <Smile className="w-5 h-5" />
             </button>
             {showEmoji && (
                 <div className="absolute right-0 bottom-full mb-2 z-50 shadow-xl rounded-xl">
                     <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                 </div>
             )}
        </div>
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
  highlightCommentId,
  onReport,
  onReportComment,
}: {
  discussion: Discussion;
  onBack: () => void;
  currentUser: any;
  highlightCommentId?: Identifier;
  onReport: (id: Identifier) => void;
  onReportComment: (id: Identifier) => void;
}) => {
  /* Data State */
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const isHidden = (discussion as any).status === "hidden" || (discussion as any).status === 2;

  const onEmojiClick = (emojiData: any) => {
    setCommentText(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const fetchComments = useCallback(async (pageNum: number, reset = false, isBackground = false) => {
    if (loading && !isBackground) return; 
    if (!isBackground) setLoading(true);
    try {
      const response = await apiClient.getDiscussionComments(String(discussion.id), pageNum);
      const data = response.data as Comment[];
      const total = response.meta.total_count;

      setComments((prev) => {
        if (reset) return data;
        return [...prev, ...data];
      });
      
      setHasMore((prevHasMore) => {
          if (reset) return data.length < total;
          return (pageNum * 10) < total; 
      });

    } catch (error) {
       console.error("Failed to fetch comments", error);
    } finally {
        if (!isBackground) setLoading(false);
    }
  }, [discussion.id, loading]);

  useEffect(() => {
    setPage(1);
    fetchComments(1, true);
  }, [fetchComments]);


  // Handle scroll to highlighted comment
  useEffect(() => {
      if (highlightCommentId && comments.length > 0) {
          setTimeout(() => {
              const element = document.getElementById(`comment-${highlightCommentId}`);
              if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('bg-downy/10');
                  setTimeout(() => element.classList.remove('bg-downy/10'), 2000);
              }
          }, 500);
      }
  }, [highlightCommentId, comments]);

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
      const payload: any = { body: commentText };
      const response = await apiClient.createComment(String(discussion.id), payload);
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
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="p-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-charcoal/50 hover:text-downy mb-4 w-fit transition-colors group"
            >
              <div className="p-1 rounded-full group-hover:bg-cream transition-colors">
                  <ChevronLeftIcon className="w-4 h-4" />
              </div>
              Back to list
            </button>

            {/* Discussion Header */}
            <div className="mb-4 bg-cream/10 p-3 rounded-2xl border border-cream">
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
                              {formatRelativeTime(discussion.created_at)}
                          </p>
                      </div>
                  </div>
                  {!isHidden && currentUser?.id !== discussion.user_id && <SimpleMoreMenu onReport={() => onReport(discussion.id)} />}
              </div>
            </div>

            <h1 className={`text-lg font-bold text-charcoal mb-2 leading-tight tracking-tight ${isHidden ? "italic text-charcoal/40" : ""}`}>
              {discussion.title}
            </h1>
            
            <div className="prose prose-sm max-w-none text-charcoal/80 leading-relaxed font-serif text-sm">
                <p className={`whitespace-pre-wrap ${isHidden ? "italic text-charcoal/40" : ""}`}>{discussion.body}</p>
            </div>

            <div className="flex items-center gap-2 mb-4 px-2 mt-6">
               <h4 className="text-sm font-semibold text-charcoal">Comments</h4>
               <span className="bg-cream px-2 py-0.5 rounded-full text-xs text-charcoal/60 font-medium">{comments.length}</span>
            </div>

            {/* List */}
            <div className="pr-2">
               {comments.length > 0 ? (
                  <div className="space-y-4">
                      {comments.map(c => (
                          <CommentItem 
                            key={c.id} 
                            comment={c} 
                            discussionId={discussion.id} 
                            currentUser={currentUser} 
                            onReport={onReportComment}
                          />
                      ))}
                  </div>
               ) : !loading && (
                   <div className="text-center text-sm text-charcoal/40 italic py-8">
                      No comments yet. Be the first to join the conversation!
                    </div>
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
         </div>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSendComment} className="mt-auto p-4 bg-white border-t border-cream">
        <div className="relative">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type a comment..."
            className="w-full pl-4 pr-24 py-3 bg-cream/20 border border-cream rounded-xl focus:outline-none focus:border-downy focus:ring-1 focus:ring-downy transition-all text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <div className="relative">
                <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-gray-400 hover:text-downy transition-colors">
                    <Smile className="w-5 h-5" />
                </button>
                {showEmoji && (
                    <div className="absolute right-0 bottom-full mb-2 z-50 shadow-xl rounded-xl">
                        <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                    </div>
                )}
             </div>
             <button
               type="submit"
               disabled={!commentText.trim() || submitting}
               className="p-2 bg-downy text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-downy-dark transition-colors flex items-center justify-center shadow-sm"
             >
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const CommentItem = ({ 
  comment, 
  discussionId, 
  currentUser, 
  onReport,
  depth = 0
}: { 
  comment: Comment, 
  discussionId: Identifier, 
  currentUser: any, 
  onReport: (id: Identifier) => void,
  depth?: number
}) => {
    const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
    const [liked, setLiked] = useState(comment.is_liked || false);
    const [likesCount, setLikesCount] = useState(comment.likes_count || 0);
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    // Update local replies if props change
    useEffect(() => {
        if(comment.replies) setReplies(comment.replies);
    }, [comment.replies]);

    const isHidden = (comment as any).status === "hidden" || (comment as any).status === 2;

    const onEmojiClick = (emojiData: any) => {
        setReplyText(prev => prev + emojiData.emoji);
        setShowEmoji(false);
    };

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const originalLiked = liked;
        const originalCount = likesCount;

        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);

        try {
            if (liked) {
                await apiClient.unlikeComment(comment.id);
            } else {
                await apiClient.likeComment(comment.id);
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
            setLiked(originalLiked);
            setLikesCount(originalCount);
        }
    };

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
                 user: { 
                    first_name: currentUser?.first_name || 'Me',
                    last_name: currentUser?.last_name || '',
                    avatar_url: currentUser?.avatar_url,
                    ...currentUser
                },
                replies: []
             };
             
             setReplies([...replies, replyWithUser]);
             setIsReplying(false);
             setReplyText("");
             setShowReplies(true); // Auto-expand to show new reply
        } catch(error) {
             console.error("Failed to reply", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div id={`comment-${comment.id}`} className={`flex flex-col gap-2 transition-colors duration-200 rounded-lg p-2 hover:bg-cream/10`}>
            <div className="flex gap-3">
                <div className={`flex-shrink-0 rounded-full bg-cream flex items-center justify-center text-charcoal/60 font-bold overflow-hidden border border-cream w-8 h-8 text-xs`}>
                    {comment.user?.avatar_url ? (
                        <img src={comment.user.avatar_url} alt={comment.user.first_name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{comment.user?.first_name?.[0] || "?"}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                             <span className="font-semibold text-charcoal text-xs">
                                {comment.user?.first_name || "User"}
                            </span>
                            <span className="text-[10px] text-charcoal/40">
                                {formatRelativeTime(comment.created_at)}
                            </span>
                        </div>
                        {!isHidden && currentUser?.id !== comment.user_id && (
                            <div onClick={e => e.stopPropagation()}>
                                <SimpleMoreMenu onReport={() => onReport(comment.id)} />
                            </div>
                        )}
                    </div>
                    
                    <p className={`text-charcoal/80 leading-relaxed text-sm ${isHidden ? "italic text-charcoal/40" : ""}`}>
                        {comment.body}
                    </p>
                    
                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-6">
                         {/* Toggle Replies (if any) */}
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (replies.length > 0) setShowReplies(!showReplies);
                                else setIsReplying(!isReplying);
                            }}
                            className={`text-xs flex items-center gap-1 transition-colors group ${showReplies ? 'text-downy' : 'text-charcoal/40 hover:text-downy'}`}
                            title="Replies"
                        >
                            <MessageSquare className="w-3 h-3 group-hover:scale-110 transition-transform" /> 
                            {replies.length > 0 ? `${replies.length} replies` : "Reply"}
                         </button>

                         {/* Explicit Reply Button only if we have replies shown, otherwise the main button does it */}
                         {replies.length > 0 && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsReplying(!isReplying);
                                }}
                                className="text-xs text-charcoal/40 hover:text-downy flex items-center gap-1 transition-colors group"
                            >
                                <Reply className="w-3 h-3" /> Reply
                            </button>
                         )}

                         <button 
                            onClick={toggleLike}
                            className={`text-xs flex items-center gap-1 transition-colors group ${liked ? 'text-red-500' : 'text-charcoal/40 hover:text-red-400'}`}
                            title="Like"
                         >
                            <Heart className={`w-3 h-3 transition-all ${liked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} /> 
                            {likesCount > 0 && <span>{likesCount}</span>}
                         </button>
                    </div>
                </div>
            </div>

            {/* Inline Reply Form */}
            {isReplying && (
                <form onSubmit={handleSendReply} className="ml-11 flex gap-2 animate-in slide-in-from-top-2 duration-200 mt-2">
                    <input 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-1.5 text-sm bg-white border border-cream rounded-lg focus:outline-none focus:border-downy"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                    />
                    <div className="relative">
                         <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-1.5 text-gray-400 hover:text-downy">
                             <Smile className="w-4 h-4" />
                         </button>
                         {showEmoji && (
                             <div className="absolute right-0 top-full mt-2 z-50 shadow-xl rounded-xl">
                                 <EmojiPicker onEmojiClick={onEmojiClick} width={280} height={350} />
                             </div>
                         )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={submitting || !replyText.trim()}
                        className="px-3 py-1.5 bg-charcoal text-white text-xs rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                    >
                        Reply
                    </button>
                </form>
            )}

            {/* Recursive Recursive Replies */}
            {showReplies && replies.length > 0 && (
                <div className="ml-8 mt-2 space-y-2 border-l border-cream pl-4">
                    {replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            discussionId={discussionId} 
                            currentUser={currentUser} 
                            onReport={onReport}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


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
  </svg>
);

const SimpleMoreMenu = ({ onReport }: { onReport: () => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="text-charcoal/40 hover:text-charcoal transition-colors p-1 rounded-full hover:bg-cream/50">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-cream z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <button 
                onClick={() => { onReport(); setOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
            >
                <Flag className="w-3 h-3" /> Report
            </button>
        </div>
      )}
    </div>
  )
}

export default DiscussionPanel;
