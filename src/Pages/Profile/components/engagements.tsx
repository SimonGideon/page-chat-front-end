import { formatDate } from "@/lib";
import type { Discussion } from "@/types";
import { MessageSquare } from "lucide-react";

type EngagementsProps = {
  discussion: Discussion;
};

const Engagements = ({ discussion }: EngagementsProps) => {
  const { title, body, created_at, book, comments_count } = discussion;
  
  // Truncate body for preview
  const truncatedBody = body.length > 100 ? `${body.substring(0, 100)}...` : body;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 border border-gray-100 hover:border-downy/30 transition-colors">
      <div className="flex-shrink-0">
        {book?.cover_image_url ? (
          <img 
            src={book.cover_image_url} 
            alt={book.title} 
            className="w-12 h-16 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 text-center">
            No Cover
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-charcoal leading-tight mb-1">
              {title}
            </h3>
            <p className="text-xs text-downy font-medium mb-1">
              on {book?.title || "Unknown Book"}
            </p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatDate(created_at)}
          </span>
        </div>
        
        <p className="text-sm text-charcoal/80 mb-3 break-words">
          {truncatedBody}
        </p>
        
        <div className="flex items-center text-charcoal/60 text-xs gap-3">
          <div className="flex items-center gap-1">
             <MessageSquare size={14} />
             <span>{comments_count || 0} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Engagements;
