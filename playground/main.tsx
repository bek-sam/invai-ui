import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initI18n } from "../src/i18n";
import { App } from "./App";
import "./styles.css";

initI18n("en");

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
