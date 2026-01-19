import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ImageProps from "../props/ImageProps";
import { closeMenu, myBoxOpenedMenu } from "../data";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

interface ILoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Login({ isOpen, onClose }: ILoginProps) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, register, googleLogin, loading, error } = useAuth();

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

  return (
    <div className="login-modal">
      <div className="modal-content">
        <section className="opened-login">
          <section className="opened-menu-logo">
            <ImageProps data={myBoxOpenedMenu} />
          </section>
          <h2>{t("loginTitle")}</h2>
          <section className="close-menu" onClick={onClose}>
            <ImageProps data={closeMenu} />
          </section>
        </section>

        <br />
        <br />

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("password")}
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
                  {t("login.0.buttonText")}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleAction("register")}
                >
                  {t("loginButtonText")}
                </button>
              </>
            )}
          </div>
        </form>

        <div className="google-login-btn">
          <GoogleLogin
            onSuccess={async (response) => {
              if (googleLogin) {
                await googleLogin(response);
                onClose();
                window.location.reload();
              }
            }}
            onError={() => console.log(t("googleError"))}
          />
        </div>
      </div>
    </div>
  );
}
