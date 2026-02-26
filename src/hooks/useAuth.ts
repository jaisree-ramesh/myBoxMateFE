import { useState } from "react";
import { type CredentialResponse } from "@react-oauth/google";
import { API_BASE } from "../config/api";

interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
  name?: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await res.json();
      if (!res.ok)
        throw new Error(
          (data as unknown as { message: string }).message || "Login failed",
        );

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, email: data.email }),
      );

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data: AuthResponse = await res.json();
      if (!res.ok)
        throw new Error(
          (data as unknown as { message: string }).message ||
            "Registration failed",
        );

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, email: data.email }),
      );

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (
    response: CredentialResponse,
  ): Promise<AuthResponse | undefined> => {
    if (!response.credential) {
      setError("Google login failed");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data: AuthResponse = await res.json();
      if (!res.ok)
        throw new Error(
          (data as unknown as { message: string }).message ||
            "Google login failed",
        );

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username || data.name || "User",
          email: data.email,
        }),
      );

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, googleLogin, loading, error };
}
