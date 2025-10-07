import { useState } from "react";

export default function HuevosPollos({ goBack }) {
  const [numeroMaximoDias, setNumeroMaximoDias] = useState(30);
  const [precioHuevo, setPrecioHuevo] = useState(1.5);
  const [precioPollo, setPrecioPollo] = useState(5.0);

  const [tabla, setTabla] = useState([]);
  const [resultados, setResultados] = useState(null);

  function simular() {
    let totalHuevosRotos = 0;
    let totalHuevosPermanecen = 0;
    let totalPollosSobreviven = 0;
    let gananciaTotal = 0;
    let registros = [];

    for (let dia = 1; dia <= numeroMaximoDias; dia++) {
      let huevosDia = poissonRandom(1);
      let huevosRotos = 0;
      let huevosPerm = 0;
      let pollosSobreviven = 0;

      for (let i = 0; i < huevosDia; i++) {
        const probRomper = Math.random();
        if (probRomper < 0.2) {
          huevosRotos++;
        } else {
          const probPollo = Math.random();
          if (probPollo < 0.3) {
            const probSobrevive = Math.random();
            if (probSobrevive < 0.8) {
              pollosSobreviven++;
            }
          } else {
            huevosPerm++;
          }
        }
      }

      const gananciaDia = huevosPerm * precioHuevo + pollosSobreviven * precioPollo;

      totalHuevosRotos += huevosRotos;
      totalHuevosPermanecen += huevosPerm;
      totalPollosSobreviven += pollosSobreviven;
      gananciaTotal += gananciaDia;

      registros.push({
        dia,
        huevosGenerados: huevosDia,
        rotos: huevosRotos,
        permanecen: huevosPerm,
        pollos: pollosSobreviven,
        ganancia: gananciaDia.toFixed(2),
      });
    }

    const ingresoPromedio = gananciaTotal / numeroMaximoDias;

    setTabla(registros);
    setResultados({
      totalHuevosRotos,
      totalHuevosPermanecen,
      totalPollosSobreviven,
      gananciaTotal,
      ingresoPromedio,
    });
  }

  function poissonRandom(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  }

  const inputStyle = { width: 100, padding: "6px" };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🥚🐔 Simulación Huevos y Pollos</h2>
      <p style={styles.description}>
        Probabilidades: romper huevo=0.2, nacer pollo=0.3, sobrevivir=0.8.
      </p>

      <div style={styles.form}>
        <label>
          Número de días:
          <input
            type="number"
            value={numeroMaximoDias}
            onChange={(e) => setNumeroMaximoDias(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Precio huevo (Bs):
          <input
            type="number"
            value={precioHuevo}
            onChange={(e) => setPrecioHuevo(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Precio pollo (Bs):
          <input
            type="number"
            value={precioPollo}
            onChange={(e) => setPrecioPollo(Number(e.target.value))}
            style={inputStyle}
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

      {/* 🔹 Resumen primero */}
      {resultados && (
        <div style={styles.resultCard}>
          <h3 style={styles.subtitle}>📊 Resumen</h3>
          <p>Total huevos rotos: <b>{resultados.totalHuevosRotos}</b></p>
          <p>Total huevos permanecen: <b>{resultados.totalHuevosPermanecen}</b></p>
          <p>Total pollos que sobreviven: <b>{resultados.totalPollosSobreviven}</b></p>
          <p>Ganancia total: <b>{resultados.gananciaTotal.toFixed(2)} Bs</b></p>
          <p>Ingreso promedio diario: <b>{resultados.ingresoPromedio.toFixed(2)} Bs</b></p>
        </div>
      )}

      {/* 🔹 Detalle después */}
      {tabla.length > 0 && (
        <div style={styles.tableWrapper}>
          <h3 style={styles.subtitle}>📑 Detalle por Día</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Día</th>
                <th>Huevos generados</th>
                <th>Huevos rotos</th>
                <th>Huevos permanecen</th>
                <th>Pollos sobreviven</th>
                <th>Ganancia Día (Bs)</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((row, i) => (
                <tr key={i}>
                  <td>{row.dia}</td>
                  <td>{row.huevosGenerados}</td>
                  <td>{row.rotos}</td>
                  <td>{row.permanecen}</td>
                  <td>{row.pollos}</td>
                  <td>{row.ganancia}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
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
    maxWidth: "850px",
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
