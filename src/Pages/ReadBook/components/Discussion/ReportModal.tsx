import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export const ReportModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (reason: string) => void }) => {
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
