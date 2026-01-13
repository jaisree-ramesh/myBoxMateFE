import { useEffect, useState } from "react";

export interface CollabRequest {
  _id: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  type: "incoming" | "outgoing";
}

export function useCollabNotifications() {
  const [requests, setRequests] = useState<CollabRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); //  every 10s
    return () => clearInterval(interval);
  }, []);


  // Fetch requests
  const fetchRequests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/collaboration/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Normalize backend data
      const mapped = data.map((r: any) => ({
        _id: r._id,
        email: r.sender?.email || r.receiver?.email || "unknown",
        status: r.status,
        type: r.receiver?._id === user?._id ? "incoming" : "outgoing",
      }));

      setRequests(mapped);
    } catch (err: any) {
      console.error("Error fetching requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Accept / reject request
  const respondToRequest = async (id: string, action: "accept" | "reject") => {
    try {
      await fetch(`${API_URL}/api/collaboration/${id}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      fetchRequests();
    } catch (err) {
      console.error("Error responding to request:", err);
    }
  };

  //  Delete notification (clear message)
  const deleteNotification = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/collaboration/notifications/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const hasNew = requests.some((r) => r.status === "pending");

  return {
    requests,
    hasNew,
    loading,
    error,
    respondToRequest,
    deleteNotification,
  };
}
