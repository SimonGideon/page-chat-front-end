import { useState, useCallback, useRef, useEffect } from "react";
import { MessageSquare, Send, Smile, Plus, ChevronDown, ChevronUp } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { createConsumer } from "@rails/actioncable";

import { actionCableUrl } from "@/lib/config";

import type { Discussion, Comment, Identifier } from "@/types";
import { apiClient } from "@/services/api";
import { useAppSelector } from "@/redux/hooks";
import { formatRelativeTime } from "@/lib/utils";

import { CommentItem } from "./CommentItem";
import { DeleteReasonModal } from "./DeleteReasonModal";
import { SimpleMoreMenu } from "./SimpleMoreMenu";
import { ChevronLeftIcon } from "./Icons";
import { MentionPicker } from "./MentionPicker";
import { renderContentWithMentions } from "./mentionRenderer";
import type { User } from "@/types";

const getTwoNames = (user: any) => {
  if (!user) return "Anonymous";
  const first = user.first_name || "";
  const last = user.last_name || "";
  return `${first} ${last}`.trim().split(/\s+/).slice(0, 2).join(" ");
};

export const DiscussionView = ({
  discussion,
  onBack,
  currentUser,
  highlightCommentId,
  onReport,
  onReportComment,
  onClose,
}: {
  discussion: Discussion;
  onBack: () => void;
  currentUser: any;
  highlightCommentId?: Identifier;
  onReport: (id: Identifier) => void;
  onReportComment: (id: Identifier) => void;
  onClose?: () => void;
}) => {
  /* Data State */
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoadingState] = useState(false);
  const loadingRef = useRef(false); // Ref to track loading without causing re-renders of callback

  const setLoading = (val: boolean) => {
      loadingRef.current = val;
      setLoadingState(val);
  }

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'discussion' | 'comment', id: string | number } | null>(null);

  // Mention State
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 }); // Placeholder for now, simplistic positioning


  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 1;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isHidden = (discussion as any).status === "hidden" || (discussion as any).status === 2;

  const onEmojiClick = (emojiData: any) => {
    setCommentText(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const fetchComments = useCallback(async (pageNum: number, reset = false, isBackground = false) => {
    if (loadingRef.current && !isBackground) return; 
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
  }, [discussion.id]); 

  useEffect(() => {
    setPage(1);
    fetchComments(1, true);
  }, [fetchComments]);

  // Real-time Updates via ActionCable
  const token = useAppSelector((state) => state.auth.token);
  
  useEffect(() => {
    if (!token) return;

    const cable = createConsumer(actionCableUrl(token)); 
    
    // Only subscribe to the specific discussion channel
    const subscription = cable.subscriptions.create(
      { channel: "DiscussionChannel", discussion_id: discussion.id },
      {
        received: (data: Comment) => {
          setComments((prev) => {
            if (prev.some(c => c.id === data.id)) return prev;
            return [data, ...prev]; 
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      cable.disconnect();
    };
  }, [discussion.id]);


  // Handle scroll to highlighted comment
  useEffect(() => {
      if (highlightCommentId && comments.length > 0) {
          setTimeout(() => {
              const element = document.getElementById(`comment-${highlightCommentId}`);
              const container = scrollContainerRef.current;
              
              if (element && container) {
                   // Calculate relative position to scroll within the container
                   const elementTop = element.offsetTop;
                   const containerHeight = container.clientHeight;
                   const elementHeight = element.clientHeight;
                   
                   // Center the element
                   const scrollTo = elementTop - (containerHeight / 2) + (elementHeight / 2);
                   
                   container.scrollTo({
                       top: scrollTo,
                       behavior: 'smooth'
                   });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCommentText(val);

    // Simple mention trigger detection (last word starts with @)
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPos);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@") && lastWord.length > 1) {
       setMentionQuery(lastWord.slice(1));
    } else {
       setMentionQuery(null);
    }
  };

  const handleMentionSelect = (user: User) => {
      if (!mentionQuery) return;
      const mentionTag = `@[${user.first_name} ${user.last_name}](${user.id}) `;
      
      // Replace last occurrence of @query
      const regex = new RegExp(`@${mentionQuery}$`);
      setCommentText(prev => prev.replace(regex, mentionTag));
      setMentionQuery(null);
      
      // Focus back (hacky)
      // document.getElementById('comment-input')?.focus();
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

  const handleDelete = async (reason?: string) => {
    if (!itemToDelete) return;

    try {
        if (itemToDelete.type === 'discussion') {
            await apiClient.deleteDiscussion(itemToDelete.id, reason);
            if (onClose) onClose();
            onBack(); // Go back to list
        } else {
            await apiClient.deleteComment(itemToDelete.id, reason);
            setComments(prev => prev.map(c => {
                if (c.id === itemToDelete.id) {
                    return { ...c, deleted: true, body: "This comment was deleted" }; 
                }
                return c;
            }));
            fetchComments(page, true); 
        }
        setDeleteModalOpen(false);
        setItemToDelete(null);
    } catch (error) {
        console.error("Failed to delete", error);
    }
  };

  const openDeleteModal = (type: 'discussion' | 'comment', id: string | number) => {
      setItemToDelete({ type, id });
      setDeleteModalOpen(true);
  }

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <DeleteReasonModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onSubmit={handleDelete}
        isAdmin={isAdmin}
      />
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
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
                  <SimpleMoreMenu 
                    onReport={() => onReport(discussion.id)} 
                    currentUser={currentUser}
                    canDelete={isAdmin || (currentUser?.id === discussion.user_id)}
                    onDelete={() => openDeleteModal('discussion', discussion.id)}
                  />
              </div>
            </div>

            <h1 className={`text-lg font-bold text-charcoal mb-2 leading-tight tracking-tight ${isHidden ? "italic text-charcoal/40" : ""}`}>
              {discussion.title}
            </h1>
            
            <div className="prose prose-sm max-w-none text-charcoal/80 leading-relaxed font-serif text-sm">
                <p className={`whitespace-pre-wrap ${isHidden ? "italic text-charcoal/40" : ""}`}>
                  {renderContentWithMentions(discussion.body)}
                </p>
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
                            onDeleteClick={(id) => openDeleteModal('comment', id)}
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
          {mentionQuery && (
              <MentionPicker 
                query={mentionQuery} 
                onSelect={handleMentionSelect} 
                onClose={() => setMentionQuery(null)}
                position={{ top: 0, left: 0 }}
              />
          )}
          <input
            value={commentText}
            onChange={handleInputChange}
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
