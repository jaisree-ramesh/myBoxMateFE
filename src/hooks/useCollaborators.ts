import { useEffect, useState } from "react";

export interface Collaborator {
  _id: string;
  email: string;
}

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  //  Fetch collaborators
  const fetchCollaborators = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/collaboration`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch collaborators");

      const data = await res.json();
      setCollaborators(data);
    } catch (err: any) {
      console.error("Error fetching collaborators:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add collaborator (send invite)
  const addCollaborator = async (email: string) => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/collaboration/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collaboratorEmail: email, itemId: "GLOBAL" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send invite");

      await fetchCollaborators();
    } catch (err: any) {
      console.error("Error adding collaborator:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove collaborator
  const removeCollaborator = async (email: string) => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/collaboration/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collaboratorEmail: email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to remove collaborator");

      await fetchCollaborators();
    } catch (err: any) {
      console.error("Error removing collaborator:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  return { collaborators, loading, error, addCollaborator, removeCollaborator };
}
