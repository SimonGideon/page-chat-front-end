import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";
import { User } from "@/types";

interface MentionPickerProps {
  query: string;
  onSelect: (user: User) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

export const MentionPicker = ({ query, onSelect, onClose, position }: MentionPickerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      apiClient.getUsers(query)
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    }, 300); // Debounce

    return () => clearTimeout(timeout);
  }, [query]);

  if (!query) return null;

  return (
    <div 
      className="absolute z-50 bg-white rounded-xl shadow-xl border border-cream w-64 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      style={{ bottom: "100%", left: 0, marginBottom: "8px" }} // Simple positioning relative to parent
    >
      {loading ? (
        <div className="p-3 text-xs text-charcoal/50 text-center">Searching...</div>
      ) : users.length > 0 ? (
        <ul className="py-1">
          {users.map((user) => (
            <li 
              key={user.id}
              onClick={() => onSelect(user)}
              className="px-4 py-2 hover:bg-cream/50 cursor-pointer flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-downy/10 flex items-center justify-center text-downy text-xs font-bold overflow-hidden">
                 {user.avatar_url ? (
                   <img src={user.avatar_url} alt={user.first_name} className="w-full h-full object-cover" />
                 ) : (
                    user.first_name?.[0]
                 )}
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-[10px] text-charcoal/50 truncate">
                    {user.email}
                  </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-3 text-xs text-charcoal/50 text-center">No users found</div>
      )}
    </div>
  );
};
