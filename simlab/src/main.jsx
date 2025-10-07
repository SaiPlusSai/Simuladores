import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./app.css";
import App from "./App.jsx";

function Layout() {
  return (
    <>
      <header style={{ padding: "1rem", textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>📊 SimLab</h1>
      </header>
      <App />
      <footer style={{ marginTop: "2rem", padding: "1rem", fontSize: "0.9rem", color: "#aaa", textAlign: "center" }}>
        © {new Date().getFullYear()} SimLab — Todos los derechos reservados
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Layout />
  </StrictMode>
);
