import { useState } from "react";
import { Trash2 } from "lucide-react";

export const DeleteReasonModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isAdmin 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (reason?: string) => void; 
    isAdmin: boolean;
}) => {
    const [reason, setReason] = useState("");
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
             <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                    <Trash2 className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-charcoal">Delete Content</h3>
                </div>
                
                {isAdmin ? (
                    <>
                        <p className="text-sm text-charcoal/80 mb-4 font-medium">
                            <span className="font-bold text-red-500">Admin Action:</span> Please provide a reason for deletion. This will be recorded.
                        </p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for deletion (e.g., Violation of guidelines)..."
                            className="w-full p-3 bg-cream/20 border border-cream rounded-xl text-sm mb-4 focus:outline-none focus:border-red-400 min-h-[100px]"
                        />
                    </>
                ) : (
                    <p className="text-sm text-charcoal/60 mb-6">
                        Are you sure you want to delete this? This action cannot be undone.
                    </p>
                )}
                
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-charcoal/60 hover:bg-cream/50 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSubmit(isAdmin ? reason : "user deleted")}
                        disabled={isAdmin && !reason.trim()}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Delete
                    </button>
                </div>
             </div>
        </div>
    );
};
