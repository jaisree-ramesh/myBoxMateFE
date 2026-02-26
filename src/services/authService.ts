import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const login = async (email: string, password: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { withCredentials: true },
  );
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/me`, {
    withCredentials: true,
  });
  return res.data;
};
