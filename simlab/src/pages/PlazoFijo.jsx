import { useState } from "react";

export default function PlazoFijo({ goBack }) {
  const [capitalInicial, setCapitalInicial] = useState(0);
  const [numAnios, setNumAnios] = useState(10); // ahora editable
  const [resultados, setResultados] = useState(null);

  function simular() {
    let k = capitalInicial;
    const detalle = [];

    for (let c = 1; c <= numAnios; c++) {
  let tasa;
  if (k <= 10000) {
    // entre 30% y 40%
    tasa = 0.30 + Math.random() * 0.10;
  } else if (k <= 50000) {
    // entre 35% y 40%
    tasa = 0.35 + Math.random() * 0.05;
  } else {
    // entre 38% y 45%
    tasa = 0.38 + Math.random() * 0.07;
  }

  const interes = k * tasa;
  k += interes;

  detalle.push({
    anio: c,
    interes,
    capital: k,
    tasa: tasa * 100,
  });
}
    setResultados({
      capitalInicial,
      numAnios,
      detalle,
      capitalFinal: k,
    });
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💵 Simulación de Plazo Fijo</h2>
      <p style={styles.description}>
        Interés compuesto anual según el monto invertido.
      </p>

      <div style={{ marginBottom: 15, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
        <label>
          Capital inicial ($):{" "}
          <input
            type="number"
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
      </div>

      <div style={styles.actions}>
        <button onClick={simular} style={styles.btnPrimary}>▶ Simular</button>
        <button onClick={goBack} style={styles.btnSecondary}>⬅ Volver</button>
      </div>

      {resultados && (
        <div style={{ marginTop: 25 }}>
          <div style={styles.resultCard}>
            <h3 style={styles.subtitle}>📊 Resumen</h3>
            <p><b>Capital inicial:</b> ${resultados.capitalInicial.toFixed(2)}</p>
            <p><b>Plazo:</b> {resultados.numAnios} años</p>
            <p><b>Capital final acumulado:</b> ${resultados.capitalFinal.toFixed(2)}</p>
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
                {resultados.detalle.map((row) => (
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
    fontSize: "2rem",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1rem",
    opacity: 0.85,
    marginBottom: "20px",
  },
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
    maxWidth: "500px",
    margin: "0 auto 25px auto",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#87cefa",
    marginBottom: "10px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#1c1c1c",
  },
};
