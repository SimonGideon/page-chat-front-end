
// Create helper to render mentions
import { Link } from "react-router-dom";

export const renderContentWithMentions = (text: string) => {
  if (!text) return null;
  
  // Regex: @\[([^\]]+)\]\((\d+)\)
  const parts = text.split(/(@\[[^\]]+\]\(\d+\))/g);
  
  return parts.map((part, index) => {
    const match = part.match(/@\[([^\]]+)\]\((\d+)\)/);
    if (match) {
      const name = match[1];
      const id = match[2];
      return (
        <span key={index} className="text-downy font-medium bg-downy/10 px-1 rounded cursor-pointer hover:underline">
           @{name}
        </span>
      );
    }
    return part;
  });
};
