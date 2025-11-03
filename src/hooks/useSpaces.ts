import { useState, useEffect } from "react";
import { type IRoom, type IItem, type ICategoryIcon } from "../types";
import { categoryIcons } from "../data";
import { normalize } from "../utils/normalize";

const initialCategoryIcons: ICategoryIcon[] = categoryIcons;

export const useSpaces = (refreshTrigger: number = 0) => {
  const [spaces, setSpaces] = useState<IRoom[]>([]);
  const [products, setProducts] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDefaultSpaces = async () => {
    try {
      const spacesRes = await fetch("http://localhost:3000/spaces");
      const existingSpaces = await spacesRes.json();

      const existingIds = new Set(
        existingSpaces.map((s: IRoom) => normalize(s.id))
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

      const spacesData: IRoom[] = await spacesRes.json();
      const productsData: IItem[] = await productsRes.json();

      // Normalize spaces
      const usedIds = new Set<string>();
      const normalizedSpaces = spacesData.map((space) => {
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

      setProducts(productsData);
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

  return {
    spaces,
    products,
    loading,
    error,
    refresh,
  };
};
