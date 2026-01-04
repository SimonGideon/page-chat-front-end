import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Flag, Trash2 } from "lucide-react";

export const SimpleMoreMenu = ({ 
    onReport, 
    onDelete, 
    canDelete,
    currentUser
}: { 
    onReport: () => void;
    onDelete?: () => void;
    canDelete?: boolean;
    currentUser?: any;
}) => {
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
                className="w-full text-left px-4 py-2 text-xs text-charcoal hover:bg-cream/50 flex items-center gap-2"
            >
                <Flag className="w-3 h-3" /> Report
            </button>
            {canDelete && onDelete && (
                 <button 
                    onClick={() => { onDelete(); setOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-cream/50"
                >
                    <Trash2 className="w-3 h-3" /> Delete
                </button>
            )}
        </div>
      )}
    </div>
  )
}
