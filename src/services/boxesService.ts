import { api } from "../config/api";
import type { IBox } from "../types";

export const createBox = async (data: Omit<IBox, "_id">): Promise<IBox> => {
  const res = await api.post("/boxes", data);
  return res.data;
};
