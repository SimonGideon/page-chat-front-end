import { useEffect, useState } from "react";
import { MessageSquare, Plus, X } from "lucide-react";
import type { Discussion, Identifier } from "@/types";
import { apiClient } from "@/services/api";
import { useAppSelector } from "@/redux/hooks";

import { DiscussionList } from "./Discussion/DiscussionList";
import { DiscussionView } from "./Discussion/DiscussionView";
import { NewDiscussionForm } from "./Discussion/NewDiscussionForm";
import { ReportModal } from "./Discussion/ReportModal";

interface DiscussionPanelProps {
  bookId: Identifier;
  onClose?: () => void;
  className?: string;
  initialDiscussionId?: Identifier;
  highlightCommentId?: Identifier;
}

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
          <DiscussionView
            discussion={activeDiscussion}
            onBack={() => setActiveDiscussion(null)}
            currentUser={user}
            highlightCommentId={highlightCommentId}
            onReport={(id) => setReportItem({ id, type: "Discussion" })}
            onReportComment={(id) => setReportItem({ id, type: "Comment" })}
            onClose={onClose}
          />
        ) : (
          <DiscussionList 
            discussions={discussions}
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
            onSelectDiscussion={setActiveDiscussion}
            onStartNew={() => setShowNewDiscussion(true)}
          />
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

export default DiscussionPanel;
