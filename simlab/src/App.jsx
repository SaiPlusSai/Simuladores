import { useState } from "react";
import MainMenu from "./pages/MainMenu";
import LcgAdd from "./pages/LcgAdd";
import LcgMult from "./pages/LcgMult";
import Colas from "./pages/Colas";
import InversaTransformada from "./pages/InversaTransformada";
import MonteCarlo from "./pages/MonteCarlo";
import ABTesting from "./pages/ABTesting";

export default function App() {
  const [page, setPage] = useState("menu");

  function renderPage() {
    switch (page) {
      case "lcg-add": return <LcgAdd goBack={() => setPage("menu")} />;
      case "lcg-mult": return <LcgMult goBack={() => setPage("menu")} />;
      case "colas": return <Colas goBack={() => setPage("menu")} />;
      case "inversa": return <InversaTransformada goBack={() => setPage("menu")} />;
      case "montecarlo": return <MonteCarlo goBack={() => setPage("menu")} />;
      case "ab": return <ABTesting goBack={() => setPage("menu")} />;
      default: return <MainMenu setPage={setPage} />;
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  );
}
