import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@/styles/style.sass";
import "../i18n.ts";
import QRCode from "react-qr-code";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <QRCode value="hey" />
  </StrictMode>
);
