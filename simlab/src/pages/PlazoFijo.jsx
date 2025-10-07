import { useState } from "react";

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

export default function PlazoFijo({ goBack }) {
  const [capitalInicial, setCapitalInicial] = useState(0);
  const [numAnios, setNumAnios] = useState(10);
  const [numSimulaciones, setNumSimulaciones] = useState(1);
  const [resultados, setResultados] = useState(null);

  function simular() {
    if (capitalInicial < 0 || numAnios <= 0 || numSimulaciones <= 0) {
      alert("⚠️ Capital ≥ 0, años > 0 y simulaciones > 0.");
      return;
    }

    let sims = [];
    let accFinal = 0;

    for (let s = 1; s <= numSimulaciones; s++) {
      let k = capitalInicial;
      let seed = Date.now() + s * 500;
      let rand = lcg(seed);
      const detalle = [];

      for (let c = 1; c <= numAnios; c++) {
        let tasa;
        if (k <= 10000) {
          tasa = 0.30 + rand() * 0.10; // 30%–40%
        } else if (k <= 50000) {
          tasa = 0.35 + rand() * 0.05; // 35%–40%
        } else {
          tasa = 0.38 + rand() * 0.07; // 38%–45%
        }

        const interes = k * tasa;
        k += interes;

        if (numSimulaciones === 1) {
          detalle.push({
            anio: c,
            interes,
            capital: k,
            tasa: tasa * 100,
          });
        }
      }

      sims.push({
        sim: s,
        seed,
        capitalFinal: k,
        detalle,
      });

      accFinal += k;
    }

    setResultados({
      sims,
      promedioFinal: accFinal / numSimulaciones,
    });
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💵 Simulación de Plazo Fijo</h2>
      <p style={styles.description}>
        Interés compuesto anual según el monto invertido.
      </p>

      <div
        style={{
          marginBottom: 15,
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <label>
          Capital inicial ($):{" "}
          <input
            type="number"
            min={0}
            value={capitalInicial}
            onChange={(e) => setCapitalInicial(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Número de años:{" "}
          <input
            type="number"
            min={1}
            value={numAnios}
            onChange={(e) => setNumAnios(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Simulaciones:{" "}
          <input
            type="number"
            min={1}
            value={numSimulaciones}
            onChange={(e) => setNumSimulaciones(Number(e.target.value))}
            style={styles.input}
          />
        </label>
      </div>

      <div style={styles.actions}>
        <button onClick={simular} style={styles.btnPrimary}>
          ▶ Simular
        </button>
        <button onClick={goBack} style={styles.btnSecondary}>
          ⬅ Volver
        </button>
      </div>

      {resultados && (
        <div style={{ marginTop: 25 }}>
          {numSimulaciones === 1 ? (
            <>
              <div style={styles.resultCard}>
                <h3 style={styles.subtitle}>
                  📊 Resumen (Semilla: {resultados.sims[0].seed})
                </h3>
                <p>
                  <b>Capital inicial:</b> ${capitalInicial.toFixed(2)}
                </p>
                <p>
                  <b>Plazo:</b> {numAnios} años
                </p>
                <p>
                  <b>Capital final acumulado:</b> $
                  {resultados.sims[0].capitalFinal.toFixed(2)}
                </p>
              </div>

              <div style={styles.tableWrapper}>
                <h3 style={styles.subtitle}>📑 Detalle anual</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Interés ganado</th>
                      <th>Capital acumulado</th>
                      <th>Tasa aplicada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.sims[0].detalle.map((row) => (
                      <tr key={row.anio}>
                        <td>{row.anio}</td>
                        <td>${row.interes.toFixed(2)}</td>
                        <td>${row.capital.toFixed(2)}</td>
                        <td>{row.tasa.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div style={styles.resultCard}>
                <h3 style={styles.subtitle}>📊 Resumen de {numSimulaciones} simulaciones</h3>
                <p>
                  <b>Capital inicial:</b> ${capitalInicial.toFixed(2)}
                </p>
                <p>
                  <b>Plazo:</b> {numAnios} años
                </p>
                <p>
                  <b>Capital final promedio:</b> ${resultados.promedioFinal.toFixed(2)}
                </p>
              </div>

              <div style={styles.tableWrapper}>
                <h3 style={styles.subtitle}>📑 Resultados por simulación</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Sim</th>
                      <th>Semilla</th>
                      <th>Capital final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.sims.map((s) => (
                      <tr key={s.sim}>
                        <td>{s.sim}</td>
                        <td>{s.seed}</td>
                        <td>${s.capitalFinal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
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
  title: { fontSize: "2rem", marginBottom: "10px" },
  description: { fontSize: "1rem", opacity: 0.85, marginBottom: "20px" },
  input: {
    padding: "6px",
    width: 140,
    fontSize: "1rem",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  btnPrimary: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
  btnSecondary: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#f44336",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
  resultCard: {
    background: "#222",
    borderRadius: "10px",
    padding: "15px",
    maxWidth: "600px",
    margin: "0 auto 25px auto",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#87cefa",
    marginBottom: "10px",
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    maxWidth: "750px",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#1c1c1c",
  },
};
