import { useState } from "react";
import { useForm } from "react-hook-form";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { apiClient } from "@/services/api";
import { Discussion, Identifier } from "@/types";

export const NewDiscussionForm = ({
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
