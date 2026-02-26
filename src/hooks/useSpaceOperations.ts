import { useState } from "react";
import { type IRoom, type IItem } from "../types";
import { API_BASE, authHeaders } from "../config/api";

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");

export const useSpaceOperations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSpace = async (name: string): Promise<IRoom | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/spaces`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ alt: name.trim(), image: "" }),
      });

      if (!res.ok) throw new Error("Failed to create space");

      const saved = await res.json();
      onSuccess?.();
      return {
        ...saved,
        id: normalize(saved.id),
        dbId: saved.id,
      };
    } catch (err) {
      console.error("Error creating space:", err);
      setError("Failed to create space");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSpace = async (space: IRoom): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const targetId = space.dbId ?? space.id;

      // Cascade delete is handled server-side
      const res = await fetch(`${API_BASE}/spaces/${targetId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to delete space");

      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Error deleting space:", err);
      setError("Failed to delete space");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSpaceImage = async (
    spaceId: string,
    image: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/spaces/${spaceId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ image }),
      });

      if (!res.ok) throw new Error("Failed to update image");

      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Error updating image:", err);
      setError("Failed to update image");
      return false;
    }
  };

  const createProduct = async (
    productData: Partial<IItem>,
  ): Promise<IItem | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const saved = await res.json();
      onSuccess?.();
      return { ...saved, _id: saved._id?.toString() };
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSpace,
    deleteSpace,
    updateSpaceImage,
    createProduct,
    loading,
    error,
  };
};
