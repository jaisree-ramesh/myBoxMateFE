import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ImageProps from "../props/ImageProps";
import { closeMenu, myBoxOpenedMenu } from "../data";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

interface ILoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Login({ isOpen, onClose }: ILoginProps) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, loading, error } = useAuth();

  if (!isOpen) return null;

  const handleAction = async (action: "login" | "register") => {
    try {
      if (action === "login") {
        await login(email, password);
      } else {
        const username = email.split("@")[0]; // auto-generate username
        await register({ username, email, password });
      }
      onClose();
      window.location.reload();
    } catch {
      // error handled in hook
    }
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (!response.credential) throw new Error("Login failed");
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username || data.name || "User",
          email: data.email,
        })
      );
      onClose();
      window.location.reload();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="login-modal">
      <div className="modal-content">
        <section className="opened-login">
          <section className="opened-menu-logo">
            <ImageProps data={myBoxOpenedMenu} />
          </section>
          <section className="close-menu" onClick={onClose}>
            <ImageProps data={closeMenu} />
          </section>
        </section>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>Invalid Password or Email</p>}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleAction("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleAction("register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </form>

        <div className="google-login-btn">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
}
