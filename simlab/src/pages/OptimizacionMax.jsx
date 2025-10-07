import { useState } from "react";

export default function OptimizacionMax({ goBack }) {
  const [nmax, setNmax] = useState(10);
  const [resultado, setResultado] = useState(null);
  const [tabla, setTabla] = useState([]);

  const simular = () => {
    let bestZ = -Infinity;
    let bestX1 = 0,
      bestX2 = 0,
      bestX3 = 0;
    let usadas = 0,
      descartadas = 0;

    let registros = [];

    for (let i = 0; i < nmax; i++) {
      const r1 = Math.random();
      const r2 = Math.random();
      const r3 = Math.random();

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

    setResultado({ bestZ, bestX1, bestX2, bestX3, usadas, descartadas });
    setTabla(registros);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Optimización Aleatoria</h2>

      <div style={styles.form}>
        <label>
          Iteraciones (Nmax):{" "}
          <input
            type="number"
            value={nmax}
            onChange={(e) => setNmax(Number(e.target.value))}
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

      {tabla.length > 0 && (
        <div style={styles.tableWrapper}>
          <h3 style={styles.subtitle}>Resultados de Iteraciones</h3>
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
              {tabla.map((row, i) => (
                <tr key={i}>
                  <td>{row.iter}</td>
                  <td>{row.x1}</td>
                  <td>{row.x2}</td>
                  <td>{row.x3}</td>
                  <td>{row.z}</td>
                  <td
                    style={{
                      color: row.estado === "Usada" ? "#4caf50" : "#f44336",
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
      )}

      {resultado && (
        <div style={styles.result}>
          <h3 style={styles.subtitle}>Resultado Óptimo</h3>
          <p>
            <strong>Z:</strong>{" "}
            {resultado.bestZ === -Infinity ? "—" : resultado.bestZ.toFixed(2)}
          </p>
          {resultado.bestZ !== -Infinity && (
            <>
              <p>
                <strong>X1:</strong> {resultado.bestX1.toFixed(2)}
              </p>
              <p>
                <strong>X2:</strong> {resultado.bestX2}
              </p>
              <p>
                <strong>X3:</strong> {resultado.bestX3.toFixed(2)}
              </p>
            </>
          )}
          <p>
            Iteraciones usadas: <b>{resultado.usadas}</b> · descartadas:{" "}
            <b>{resultado.descartadas}</b>
          </p>
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
    transition: "all 0.3s ease",
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
    transition: "all 0.3s ease",
  },
  tableWrapper: {
    marginTop: "30px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#1c1c1c",
    borderRadius: "8px",
    overflow: "hidden",
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
