import { useState, useEffect } from "react";
import { type IRoom, type IItem } from "../types";
import { normalize } from "../utils/normalize";
import { API_BASE, authHeaders } from "../config/api";

interface BackendProduct {
  _id: string;
  name: string;
  desc?: string;
  box?: string;
  parentId?: string;
  image?: string;
  collaborators?: string[];
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendSpace {
  id: string;   // our routes return id (transformed from _id)
  alt: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useSpaces = (refreshTrigger: number = 0) => {
  const [spaces, setSpaces] = useState<IRoom[]>([]);
  const [products, setProducts] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProductData = (productsData: BackendProduct[]): IItem[] =>
    productsData.map((p) => ({
      ...p,
      // MongoDB returns _id as ObjectId string directly
      _id: p._id?.toString(),
      id: p._id?.toString(),
    }));

  const transformSpaceData = (spacesData: BackendSpace[]): IRoom[] =>
    spacesData.map((space) => ({
      ...space,
      _id: space.id,
    }));

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = authHeaders();

      const [spacesRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/spaces`, { headers }),
        fetch(`${API_BASE}/items`, { headers }),
      ]);

      if (!spacesRes.ok || !productsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const spacesData: BackendSpace[] = await spacesRes.json();
      const productsData: BackendProduct[] = await productsRes.json();

      const transformedProducts = transformProductData(productsData);
      const transformedSpaces = transformSpaceData(spacesData);

      // Deduplicate spaces by normalized id (safety net)
      const usedIds = new Set<string>();
      const normalizedSpaces = transformedSpaces
        .filter((space) => {
          const nid = normalize(space.id);
          if (usedIds.has(nid)) return false;
          usedIds.add(nid);
          return true;
        })
        .map((space) => ({
          ...space,
          id: normalize(space.id),
          dbId: space.id,
          alt: space.alt,
        }));

      setProducts(transformedProducts);
      setSpaces(normalizedSpaces);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const refresh = () => fetchData();

  return { spaces, products, loading, error, refresh };
};