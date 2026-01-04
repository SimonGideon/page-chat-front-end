import { useEffect, useState } from "react";
import { apiClient } from "@/services/api";
import { Loader } from "@/components";
import type { Discussion } from "@/types";
import Engagements from "./engagements";

const EngagementList = () => {
  const [engagements, setEngagements] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngagements = async () => {
      try {
        const response = await apiClient.getEngagements();
        if (response?.data) {
          setEngagements(response.data);
        }
      } catch (error) {
        console.error("Failed to load engagements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEngagements();
  }, []);

  if (loading) {
    return <div className="p-4 flex justify-center"><Loader /></div>;
  }

  if (engagements.length === 0) {
    return (
      <div className="text-center py-10 text-charcoal/60 bg-gray-50 rounded-xl border border-gray-100">
        <p>You haven't participated in any discussions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {engagements.map((discussion) => (
        <Engagements
          key={discussion.id}
          discussion={discussion}
        />
      ))}
    </div>
  );
};

export default EngagementList;
