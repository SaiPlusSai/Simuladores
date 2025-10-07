import { useState } from "react";

export default function OptimizacionMax({ goBack }) {
  const [nmax, setNmax] = useState(10);
  const [nsim, setNsim] = useState(1); // número de simulaciones
  const [resultados, setResultados] = useState(null);

  // Generador congruencial lineal (LCG)
  function lcg(seed) {
    let m = 2 ** 31 - 1;
    let a = 48271;
    let c = 0;
    let state = seed;

    return () => {
      state = (a * state + c) % m;
      return state / m;
    };
  }

  const simular = () => {
    if (nmax <= 0 || nsim <= 0) {
      alert("⚠️ Nmax y NSIM deben ser números positivos.");
      return;
    }

    let sims = [];
    let accBestZ = 0;
    let accUsadas = 0;
    let accDescartadas = 0;

    for (let s = 1; s <= nsim; s++) {
      let seed = Date.now() + s * 1000; // semilla diferente cada simulación
      let rand = lcg(seed);

      let bestZ = -Infinity;
      let bestX1 = 0, bestX2 = 0, bestX3 = 0;
      let usadas = 0, descartadas = 0;
      let registros = [];

      for (let i = 0; i < nmax; i++) {
        const r1 = rand();
        const r2 = rand();
        const r3 = rand();

        const x1c = 0 + (10 - 0) * r1; // U[0,10]
        const x2c = Math.round(0 + (100 - 0) * r2); // U[0,100] entero

        if (x1c + x2c >= 2) {
          usadas++;
          const x3c = 1 + (2 - 1) * r3; // U[1,2]
          const zc = 2 * x1c + 3 * x2c - x3c;

          if (zc > bestZ) {
            bestZ = zc;
            bestX1 = x1c;
            bestX2 = x2c;
            bestX3 = x3c;
          }

          registros.push({
            iter: i + 1,
            x1: x1c.toFixed(2),
            x2: x2c,
            x3: x3c.toFixed(2),
            z: zc.toFixed(2),
            estado: "Usada",
          });
        } else {
          descartadas++;
          registros.push({
            iter: i + 1,
            x1: x1c.toFixed(2),
            x2: x2c,
            x3: "—",
            z: "—",
            estado: "Descartada",
          });
        }
      }

      sims.push({
        sim: s,
        seed,
        bestZ,
        bestX1,
        bestX2,
        bestX3,
        usadas,
        descartadas,
        registros,
      });

      accBestZ += bestZ === -Infinity ? 0 : bestZ;
      accUsadas += usadas;
      accDescartadas += descartadas;
    }

    setResultados({
      sims,
      promedios: {
        bestZ: accBestZ / nsim,
        usadas: accUsadas / nsim,
        descartadas: accDescartadas / nsim,
      },
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Optimización Aleatoria</h2>

      <div style={styles.form}>
        <label>
          Iteraciones (Nmax):{" "}
          <input
            type="number"
            min="1"
            value={nmax}
            onChange={(e) => setNmax(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          N° de simulaciones:{" "}
          <input
            type="number"
            min="1"
            value={nsim}
            onChange={(e) => setNsim(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <div>
          <button onClick={simular} style={styles.btnPrimary}>
            ▶ Ejecutar
          </button>
          <button onClick={goBack} style={styles.btnSecondary}>
            ⬅ Volver
          </button>
        </div>
      </div>

      {resultados && (
        <>
          {nsim === 1 ? (
            <div style={{ marginBottom: "40px" }}>
              <h3 style={styles.subtitle}>
                Detalle de la simulación (Semilla: {resultados.sims[0].seed})
              </h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Iter</th>
                      <th>X1</th>
                      <th>X2</th>
                      <th>X3</th>
                      <th>Z</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.sims[0].registros.map((row, i) => (
                      <tr key={i}>
                        <td>{row.iter}</td>
                        <td>{row.x1}</td>
                        <td>{row.x2}</td>
                        <td>{row.x3}</td>
                        <td>{row.z}</td>
                        <td
                          style={{
                            color:
                              row.estado === "Usada" ? "#4caf50" : "#f44336",
                            fontWeight: "bold",
                          }}
                        >
                          {row.estado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <h3 style={styles.subtitle}>Resumen de simulaciones</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Sim</th>
                    <th>Semilla</th>
                    <th>BestZ</th>
                    <th>X1</th>
                    <th>X2</th>
                    <th>X3</th>
                    <th>Usadas</th>
                    <th>Descartadas</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.sims.map((s) => (
                    <tr key={s.sim}>
                      <td>{s.sim}</td>
                      <td>{s.seed}</td>
                      <td>
                        {s.bestZ === -Infinity ? "—" : s.bestZ.toFixed(2)}
                      </td>
                      <td>{s.bestX1.toFixed(2)}</td>
                      <td>{s.bestX2}</td>
                      <td>{s.bestX3.toFixed(2)}</td>
                      <td>{s.usadas}</td>
                      <td>{s.descartadas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.result}>
            <h3 style={styles.subtitle}>📊 Promedios (NSIM = {nsim})</h3>
            <p>
              <b>BestZ promedio:</b> {resultados.promedios.bestZ.toFixed(2)}
            </p>
            <p>
              <b>Iteraciones usadas promedio:</b>{" "}
              {resultados.promedios.usadas.toFixed(2)}
            </p>
            <p>
              <b>Iteraciones descartadas promedio:</b>{" "}
              {resultados.promedios.descartadas.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#111",
    color: "#eee",
    minHeight: "100vh",
    textAlign: "center",
  },
  title: {
    fontSize: "2.2rem",
    marginBottom: "25px",
  },
  subtitle: {
    fontSize: "1.4rem",
    marginBottom: "15px",
    color: "#87cefa",
  },
  form: {
    marginBottom: "30px",
    fontSize: "1.1rem",
  },
  input: {
    margin: "0 10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#222",
    color: "#eee",
    width: "120px",
    fontSize: "1rem",
    textAlign: "center",
  },
  btnPrimary: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "10px",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    margin: "10px 5px",
  },
  btnSecondary: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "10px",
    background: "#f44336",
    color: "#fff",
    cursor: "pointer",
    margin: "10px 5px",
  },
  tableWrapper: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#1c1c1c",
  },
  result: {
    marginTop: "30px",
    padding: "20px",
    background: "#222",
    borderRadius: "10px",
    fontSize: "1.1rem",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
};
