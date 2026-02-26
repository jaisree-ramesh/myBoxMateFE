import { api } from "../config/api";
import type { IBox } from "../types";

export const createItem = async (data: Omit<IBox, "_id">): Promise<IBox> => {
  const res = await api.post("/items", data);
  return res.data;
};

export const getItems = async (): Promise<IBox[]> => {
  const res = await api.get("/items");
  return res.data;
};

export const deleteItem = async (id: string) => {
  await api.delete(`/items/${id}`);
};
