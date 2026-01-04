import { useState, useEffect } from "react";
import { MessageSquare, Reply, Heart, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import type { Comment, Identifier } from "@/types";
import { apiClient } from "@/services/api";
import { formatRelativeTime } from "@/lib/utils";
import { SimpleMoreMenu } from "./SimpleMoreMenu";
import { MentionPicker } from "./MentionPicker";
import { renderContentWithMentions } from "./mentionRenderer";
import type { User } from "@/types";

export const CommentItem = ({ 
  comment, 
  discussionId, 
  currentUser, 
  onReport,
  onDeleteClick,
  depth = 0
}: { 
  comment: Comment, 
  discussionId: Identifier, 
  currentUser: any, 
  onReport: (id: Identifier) => void,
  onDeleteClick: (id: Identifier) => void,
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

    // Mention State for Reply
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setReplyText(val);

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
        
        const regex = new RegExp(`@${mentionQuery}$`);
        setReplyText(prev => prev.replace(regex, mentionTag));
        setMentionQuery(null);
    };

    // Update local replies if props change
    useEffect(() => {
        if(comment.replies) setReplies(comment.replies);
    }, [comment.replies]);

    const isHidden = (comment as any).status === "hidden" || (comment as any).status === 2;
    const isOwner = currentUser?.id === comment.user?.id;
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 1;

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
                        {!isHidden && (
                            <div onClick={e => e.stopPropagation()}>
                                <SimpleMoreMenu 
                                    onReport={() => onReport(comment.id)} 
                                    canDelete={isAdmin || isOwner}
                                    onDelete={() => onDeleteClick(comment.id)}
                                    currentUser={currentUser}
                                />
                            </div>
                        )}
                    </div>
                    
                    <p className={`text-charcoal/80 leading-relaxed text-sm`}>
                        {isHidden ? (
                            <span className="italic text-charcoal/40 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                This content has been hidden due to valid safety concerns.
                            </span>
                        ) : (
                            <>
                                {(comment as any).status === "flagged" && (
                                    <span className="inline-block text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded mr-2 align-middle border border-yellow-200">
                                        Flagged
                                    </span>
                                )}
                                {renderContentWithMentions(comment.body)}
                            </>
                        )}
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
                <form onSubmit={handleSendReply} className="ml-11 flex gap-2 animate-in slide-in-from-top-2 duration-200 mt-2 relative">
                    {mentionQuery && (
                        <MentionPicker 
                            query={mentionQuery} 
                            onSelect={handleMentionSelect} 
                            onClose={() => setMentionQuery(null)}
                            position={{ top: 0, left: 0 }}
                        />
                    )}
                    <input 
                        value={replyText}
                        onChange={handleInputChange}
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
                <div className="ml-3 mt-2 space-y-2 border-l-2 border-cream/50 pl-3">
                    {replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            discussionId={discussionId} 
                            currentUser={currentUser} 
                            onReport={onReport}
                            onDeleteClick={onDeleteClick}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
