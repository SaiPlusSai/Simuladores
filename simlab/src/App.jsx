import { useState } from "react";
import MainMenu from "./pages/MainMenu";
import OptimizacionMax from "./pages/OptimizacionMax"; // Ej.1
import JuegoDados from "./pages/JuegoDados";          // Ej.2
import VentasSim from "./pages/VentasSim";
import HuevosPollos from "./pages/HuevosPollos";            // Ej.3 NUEVO
import InventarioAzucar from "./pages/InventarioAzucar";
import PlazoFijo from "./pages/PlazoFijo";
export default function App() {
  const [page, setPage] = useState("menu");

  function renderPage() {
    switch (page) {
      case "montecarlo":  return <OptimizacionMax goBack={() => setPage("menu")} />;
      case "dados":       return <JuegoDados goBack={() => setPage("menu")} />;
      case "ventas":      return <VentasSim goBack={() => setPage("menu")} />;
      case "huevos": return <HuevosPollos goBack={() => setPage("menu")} />;
      case "azucar": return <InventarioAzucar goBack={() => setPage("menu")} />;
      case "plazo": return <PlazoFijo goBack={() => setPage("menu")} />;
      default:            return <MainMenu setPage={setPage} />;
    }
  }

  return <div>{renderPage()}</div>;
}
