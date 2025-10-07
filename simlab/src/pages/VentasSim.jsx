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

function obtenerArticulosVendidos(rand) {
  const p = rand(); // [0,1)
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

  const [resultados, setResultados] = useState(null);

  const simular = () => {
    if (costoFijoDiario < 0 || costoUnitario < 0 || precioVenta < 0 || numHoras <= 0 || numSimulaciones <= 0) {
      alert("⚠️ Todos los parámetros deben ser no negativos y horas/simulaciones mayores a 0.");
      return;
    }

    let sims = [];
    let accArticulos = 0;
    let accGanancia = 0;

    for (let s = 1; s <= numSimulaciones; s++) {
      let seed = Date.now() + s * 500;
      let rand = lcg(seed);

      let totalClientesDia = 0;
      let totalArticulosDia = 0;
      let registros = [];

      for (let h = 0; h < numHoras; h++) {
        const clientesPorHora = Math.floor(rand() * 5); // 0..4
        totalClientesDia += clientesPorHora;

        for (let c = 0; c < clientesPorHora; c++) {
          const articulos = obtenerArticulosVendidos(rand);
          totalArticulosDia += articulos;

          if (numSimulaciones === 1) {
            const ingreso = articulos * precioVenta;
            const costo = articulos * costoUnitario;
            const gananciaCliente = ingreso - costo;

            registros.push({
              hora: h + 1,
              cliente: c + 1,
              articulos,
              ingreso,
              costo,
              gananciaCliente,
              estado: articulos === 0 ? "Sin compra" : "Compra"
            });
          }
        }
      }

      const gananciaNeta =
        totalArticulosDia * (precioVenta - costoUnitario) - costoFijoDiario;

      sims.push({
        sim: s,
        seed,
        clientes: totalClientesDia,
        articulos: totalArticulosDia,
        ganancia: gananciaNeta,
        registros
      });

      accArticulos += totalArticulosDia;
      accGanancia += gananciaNeta;
    }

    setResultados({
      sims,
      promedios: {
        articulos: accArticulos / numSimulaciones,
        ganancia: accGanancia / numSimulaciones
      }
    });
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
            min={0}
            value={costoFijoDiario}
            onChange={(e) => setCostoFijoDiario(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Costo unitario artículo (Bs):
          <input
            type="number"
            min={0}
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Precio venta unitario (Bs):
          <input
            type="number"
            min={0}
            value={precioVenta}
            onChange={(e) => setPrecioVenta(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Número de horas:
          <input
            type="number"
            min={1}
            value={numHoras}
            onChange={(e) => setNumHoras(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Número de simulaciones:
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
        <>
          {numSimulaciones === 1 ? (
            <div>
              <h3 style={styles.subtitle}>
                📑 Detalle (Semilla: {resultados.sims[0].seed})
              </h3>
              <p><b>Clientes totales:</b> {resultados.sims[0].clientes}</p>
              <p><b>Artículos vendidos:</b> {resultados.sims[0].articulos}</p>
              <p><b>Ganancia neta:</b> {resultados.sims[0].ganancia.toFixed(2)} Bs</p>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Cliente</th>
                      <th>Artículos</th>
                      <th>Ingreso (Bs)</th>
                      <th>Costo (Bs)</th>
                      <th>Ganancia Cliente (Bs)</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.sims[0].registros.map((row, i) => (
                      <tr key={i}>
                        <td>{row.hora}</td>
                        <td>{row.cliente}</td>
                        <td>{row.articulos}</td>
                        <td>{row.ingreso.toFixed(2)}</td>
                        <td>{row.costo.toFixed(2)}</td>
                        <td>{row.gananciaCliente.toFixed(2)}</td>
                        <td style={{
                          color: row.estado === "Compra" ? "#4caf50" : "#f44336",
                          fontWeight: "bold"
                        }}>{row.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <h3 style={styles.subtitle}>📊 Resumen de simulaciones</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Sim</th>
                    <th>Semilla</th>
                    <th>Clientes</th>
                    <th>Artículos</th>
                    <th>Ganancia (Bs)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.sims.map((s) => (
                    <tr key={s.sim}>
                      <td>{s.sim}</td>
                      <td>{s.seed}</td>
                      <td>{s.clientes}</td>
                      <td>{s.articulos}</td>
                      <td>{s.ganancia.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.resultCard}>
            <h3 style={styles.subtitle}>📈 Promedios (NSIM = {numSimulaciones})</h3>
            <p>
              Promedio de artículos vendidos por día:{" "}
              <b>{resultados.promedios.articulos.toFixed(2)}</b>
            </p>
            <p>
              Promedio de ganancia neta por día:{" "}
              <b>{resultados.promedios.ganancia.toFixed(2)} Bs</b>
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
  title: { fontSize: "2.2rem", marginBottom: "15px" },
  description: { fontSize: "1.1rem", marginBottom: "25px", opacity: 0.9 },
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
  tableWrapper: { marginTop: "20px", overflowX: "auto" },
  table: {
    width: "100%",
    maxWidth: "900px",
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
  subtitle: { fontSize: "1.4rem", marginBottom: "10px", color: "#87cefa" },
};
