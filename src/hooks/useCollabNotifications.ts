import { useEffect, useState } from "react";
import { API_BASE } from "../config/api";

export interface CollabRequest {
  _id: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  type: "incoming" | "outgoing";
}

interface RawCollabRequest {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  sender?: { _id: string; email: string };
  receiver?: { _id: string; email: string };
}

interface StoredUser {
  _id?: string;
  username?: string;
  email?: string;
}

export function useCollabNotifications() {
  const [requests, setRequests] = useState<CollabRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const user: StoredUser | null = JSON.parse(
    localStorage.getItem("user") || "null",
  );

  const fetchRequests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/collaboration/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: RawCollabRequest[] = await res.json();

      const mapped: CollabRequest[] = data.map((r) => ({
        _id: r._id,
        email: r.sender?.email ?? r.receiver?.email ?? "unknown",
        status: r.status,
        type: r.receiver?._id === user?._id ? "incoming" : "outgoing",
      }));

      setRequests(mapped);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch requests";
      console.error("Error fetching requests:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const respondToRequest = async (id: string, action: "accept" | "reject") => {
    try {
      await fetch(`${API_BASE}/collaboration/${id}/respond`, {
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

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`${API_BASE}/collaboration/notifications/delete`, {
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
