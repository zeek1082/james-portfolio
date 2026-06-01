import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable browser scroll restoration so SPA navigation always starts at top
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById("root")!).render(<App />);
