import { useState, useEffect } from "react";
import { type IRoom, type IItem, type ICategoryIcon } from "../types";
import { categoryIcons } from "../data";
import { normalize } from "../utils/normalize";

const initialCategoryIcons: ICategoryIcon[] = categoryIcons;

// Define the backend response types
interface BackendProduct {
  id: string;
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
  id: string;
  image: string;
  alt: string;
}

export const useSpaces = (refreshTrigger: number = 0) => {
  const [spaces, setSpaces] = useState<IRoom[]>([]);
  const [products, setProducts] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDefaultSpaces = async () => {
    try {
      const spacesRes = await fetch("http://localhost:3000/spaces");
      const existingSpaces: BackendSpace[] = await spacesRes.json();

      const existingIds = new Set(
        existingSpaces.map((s: BackendSpace) => normalize(s.id))
      );
      const spacesToAdd = initialCategoryIcons.filter(
        (icon) => !existingIds.has(normalize(icon.id))
      );

      if (spacesToAdd.length > 0) {
        await Promise.all(
          spacesToAdd.map((space) =>
            fetch("http://localhost:3000/spaces", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: normalize(space.id),
                image: space.image,
                alt: space.alt,
              }),
            })
          )
        );
      }
    } catch (err) {
      console.error("Error initializing default spaces:", err);
      setError("Failed to initialize spaces");
    }
  };

  // Function to transform backend product data to frontend format
  const transformProductData = (productsData: BackendProduct[]): IItem[] => {
    return productsData.map((product) => ({
      ...product,
      _id: product.id, // Map id to _id
    }));
  };

  // Function to transform backend space data to frontend format
  const transformSpaceData = (spacesData: BackendSpace[]): IRoom[] => {
    return spacesData.map((space) => ({
      ...space,
      _id: space.id,
    }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      await initializeDefaultSpaces();

      const [spacesRes, productsRes] = await Promise.all([
        fetch("http://localhost:3000/spaces"),
        fetch("http://localhost:3000/items"),
      ]);

      if (!spacesRes.ok || !productsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const spacesData: BackendSpace[] = await spacesRes.json();
      const productsData: BackendProduct[] = await productsRes.json();

      console.log("🔄 Raw products from API:", productsData);

      // Transform the data
      const transformedProducts = transformProductData(productsData);
      const transformedSpaces = transformSpaceData(spacesData);

      console.log("🔄 Transformed products:", transformedProducts);
      console.log(
        "📋 Products with _id:",
        transformedProducts.filter((p) => p._id).length
      );

      // Normalize spaces
      const usedIds = new Set<string>();
      const normalizedSpaces = transformedSpaces.map((space) => {
        const baseId = normalize(space.id);
        let finalId = baseId;
        let counter = 1;

        while (usedIds.has(finalId)) {
          finalId = `${baseId}-${counter}`;
          counter++;
        }
        usedIds.add(finalId);

        return {
          ...space,
          id: finalId,
          dbId: space.id,
          alt: space.alt,
        };
      });

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

  const refresh = () => {
    console.log("🔄 Manual refresh triggered");
    fetchData();
  };

  return {
    spaces,
    products,
    loading,
    error,
    refresh,
  };
};
