import { useState } from "react";

function obtenerArticulosVendidos() {
  const p = Math.random(); // [0,1)
  if (p < 0.2) return 0;
  else if (p < 0.5) return 1;   // 30%
  else if (p < 0.9) return 2;   // 40%
  else return 3;                // 10%
}

export default function VentasSim({ goBack }) {
  const [costoFijoDiario, setCostoFijoDiario] = useState(300);
  const [costoUnitario, setCostoUnitario] = useState(50);
  const [precioVenta, setPrecioVenta] = useState(75);
  const [numHoras, setNumHoras] = useState(10);
  const [numSimulaciones, setNumSimulaciones] = useState(1);

  const [tabla, setTabla] = useState([]);
  const [totalArticulosVendidos, setTotalArticulosVendidos] = useState(null);
  const [totalGananciaNeta, setTotalGananciaNeta] = useState(null);

  const simular = () => {
    let acumuladoArticulos = 0;
    let acumuladoGanancia = 0;
    const registros = [];

    for (let sim = 0; sim < numSimulaciones; sim++) {
      let totalClientesDia = 0;
      let totalArticulosDia = 0;

      for (let h = 0; h < numHoras; h++) {
        const clientesPorHora = Math.floor(Math.random() * 5); // 0..4
        totalClientesDia += clientesPorHora;

        for (let c = 0; c < clientesPorHora; c++) {
          const articulos = obtenerArticulosVendidos();
          totalArticulosDia += articulos;
        }
      }

      const gananciaNeta =
        totalArticulosDia * (precioVenta - costoUnitario) - costoFijoDiario;

      acumuladoArticulos += totalArticulosDia;
      acumuladoGanancia += gananciaNeta;

      registros.push({
        sim: sim + 1,
        clientes: totalClientesDia,
        articulos: totalArticulosDia,
        ganancia: gananciaNeta.toFixed(2),
      });
    }

    setTabla(registros);
    setTotalArticulosVendidos(acumuladoArticulos);
    setTotalGananciaNeta(acumuladoGanancia);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛒 Simulación de Ventas por Día</h2>
      <p style={styles.description}>
        Clientes por hora ~ U(0,1,2,3,4).  
        Artículos por cliente con p(0)=0.2, p(1)=0.3, p(2)=0.4, p(3)=0.1.
      </p>

      <div style={styles.form}>
        <label>
          Costo fijo diario (Bs):
          <input
            type="number"
            value={costoFijoDiario}
            onChange={(e) => setCostoFijoDiario(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Costo unitario artículo (Bs):
          <input
            type="number"
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Precio venta unitario (Bs):
          <input
            type="number"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Número de horas:
          <input
            type="number"
            value={numHoras}
            onChange={(e) => setNumHoras(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Número de simulaciones:
          <input
            type="number"
            value={numSimulaciones}
            min={1}
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

      {tabla.length > 0 && (
        <div style={styles.tableWrapper}>
          <h3 style={styles.subtitle}>📑 Resultados por Simulación</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Día</th>
                <th>Clientes</th>
                <th>Artículos vendidos</th>
                <th>Ganancia neta (Bs)</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((row, i) => (
                <tr key={i}>
                  <td>{row.sim}</td>
                  <td>{row.clientes}</td>
                  <td>{row.articulos}</td>
                  <td>{row.ganancia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalGananciaNeta !== null && (
        <div style={styles.resultCard}>
          <h3 style={styles.subtitle}>📊 Resumen</h3>
          <p>
            Artículos vendidos (acumulado en {numSimulaciones} simulación/es):{" "}
            <b>{totalArticulosVendidos}</b>
          </p>
          <p>
            Ganancia neta (acumulada): <b>{totalGananciaNeta.toFixed(2)} Bs</b>
          </p>
          {numSimulaciones > 1 && (
            <>
              <p>
                Promedio de artículos por día:{" "}
                <b>{(totalArticulosVendidos / numSimulaciones).toFixed(2)}</b>
              </p>
              <p>
                Promedio de ganancia neta por día:{" "}
                <b>{(totalGananciaNeta / numSimulaciones).toFixed(2)} Bs</b>
              </p>
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
  title: {
    fontSize: "2.2rem",
    marginBottom: "15px",
  },
  description: {
    fontSize: "1.1rem",
    marginBottom: "25px",
    opacity: 0.9,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  input: {
    marginLeft: "8px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#222",
    color: "#eee",
    width: "140px",
    fontSize: "1rem",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  btnPrimary: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "10px",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "10px",
    background: "#f44336",
    color: "#fff",
    cursor: "pointer",
  },
  tableWrapper: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#1c1c1c",
  },
  resultCard: {
    marginTop: "20px",
    padding: "20px",
    background: "#222",
    borderRadius: "10px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  subtitle: {
    fontSize: "1.4rem",
    marginBottom: "10px",
    color: "#87cefa",
  },
};
