import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const githubPagesFallback = window.location.search.startsWith("?/")
  ? decodeURIComponent(window.location.search.slice(2))
  : "";
if (githubPagesFallback) {
  const nextPath = `/${githubPagesFallback}`.replace(/\/+/g, "/");
  window.history.replaceState(null, "", nextPath);
}

createRoot(document.getElementById("root")!).render(<App />);
