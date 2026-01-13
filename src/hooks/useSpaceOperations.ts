import { useState } from "react";
import { type IRoom, type IItem } from "../types";

const API_BASE = "http://localhost:3000";

const normalize = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "-");

export const useSpaceOperations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSpace = async (name: string): Promise<IRoom | null> => {
    try {
      setLoading(true);
      setError(null);

      const newRoom: Omit<IRoom, "dbId"> = {
        id: normalize(name),
        alt: name.trim(),
        image: "",
      };

      const res = await fetch(`${API_BASE}/spaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!res.ok) throw new Error("Failed to create space");

      const savedRoom = await res.json();
      onSuccess?.();
      return { ...savedRoom, id: normalize(savedRoom.id), dbId: savedRoom.id };
    } catch (err) {
      console.error("Error creating space:", err);
      setError("Failed to create space");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSpaceImage = async (
    spaceId: string,
    image: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/spaces/${spaceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
    productData: Partial<IItem>
  ): Promise<IItem | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const savedProduct = await res.json();
      onSuccess?.();
      return savedProduct;
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
    updateSpaceImage,
    createProduct,
    loading,
    error,
  };
};
