import { useState, useEffect } from "react";
import { API_BASE, authHeaders } from "../config/api";

interface Item {
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

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/items`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
      const data: Item[] = await res.json();
      setItems(data.map((item) => ({ ...item, _id: item._id?.toString() })));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<Item, "_id">): Promise<Item> => {
    const res = await fetch(`${API_BASE}/items`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error(`Failed to create item: ${res.status}`);
    const newItem: Item = await res.json();
    setItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateItem = async (
    id: string,
    itemData: Partial<Item>,
  ): Promise<Item> => {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error(`Failed to update item: ${res.status}`);
    const updatedItem: Item = await res.json();
    setItems((prev) =>
      prev.map((item) => (item._id === id ? updatedItem : item)),
    );
    return updatedItem;
  };

  const deleteItem = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete item: ${res.status}`);
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
  };
};
