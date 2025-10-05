import { useState } from "react";

export default function OptimizacionMax({ goBack }) {
  const [nmax, setNmax] = useState(10);
  const [resultado, setResultado] = useState(null);

  const simular = () => {
    let bestZ = -Infinity;
    let bestX1 = 0, bestX2 = 0, bestX3 = 0;
    let usadas = 0, descartadas = 0;

    for (let i = 0; i < nmax; i++) {
      const r1 = Math.random();
      const r2 = Math.random();
      const r3 = Math.random();

      const x1c = 0 + (10 - 0) * r1;           // U[0,10]
      const x2c = Math.round(0 + (100 - 0) * r2); // U[0,100] entero

      // restricción: suma ≥ 2
      if ((x1c + x2c) >= 2) {
        usadas++;
        const x3c = 1 + (2 - 1) * r3;          // U[1,2]
        const zc  = (2 * x1c) + (3 * x2c) - x3c;

        if (zc > bestZ) {
          bestZ = zc;
          bestX1 = x1c; bestX2 = x2c; bestX3 = x3c;
        }
      } else {
        descartadas++;
      }
    }

    setResultado({ bestZ, bestX1, bestX2, bestX3, usadas, descartadas });
  };

  return (
    <div style={{ padding: 20, background: "#111", color: "#eee", minHeight: "100vh" }}>
      <h2>Optimización Aleatoria — Máximo Z (x1+x2 ≥ 2)</h2>

      <label>
        Nmax:{" "}
        <input
          type="number"
          value={nmax}
          onChange={(e) => setNmax(Number(e.target.value))}
          style={{ margin: "10px" }}
        />
      </label>

      <button onClick={simular} style={{ padding: "10px 15px" }}>
        Ejecutar
      </button>
      <button onClick={goBack} style={{ marginLeft: 10, padding: "10px 15px" }}>
        ⬅ Volver al menú
      </button>

      {resultado && (
        <div style={{ marginTop: 20 }}>
          <h3>Resultado Óptimo</h3>
          <p>Z = {resultado.bestZ === -Infinity ? "—" : resultado.bestZ.toFixed(2)}</p>
          {resultado.bestZ !== -Infinity && (
            <>
              <p>X1 = {resultado.bestX1.toFixed(2)}</p>
              <p>X2 = {resultado.bestX2}</p>
              <p>X3 = {resultado.bestX3.toFixed(2)}</p>
            </>
          )}
          <p style={{ marginTop: 10 }}>
            Iteraciones usadas: {resultado.usadas} · descartadas: {resultado.descartadas}
          </p>
        </div>
      )}
    </div>
  );
}
