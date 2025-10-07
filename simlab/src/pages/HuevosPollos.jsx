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

// Distribución de Poisson usando el generador LCG
function poissonRandom(lambda, rand) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rand();
  } while (p > L);
  return k - 1;
}

export default function HuevosPollos({ goBack }) {
  const [numeroMaximoDias, setNumeroMaximoDias] = useState(30);
  const [precioHuevo, setPrecioHuevo] = useState(1.5);
  const [precioPollo, setPrecioPollo] = useState(5.0);
  const [numSimulaciones, setNumSimulaciones] = useState(1);

  const [resultados, setResultados] = useState(null);

  function simular() {
    if (numeroMaximoDias <= 0 || precioHuevo < 0 || precioPollo < 0 || numSimulaciones <= 0) {
      alert("⚠️ Los valores deben ser no negativos y días/simulaciones mayores a 0.");
      return;
    }

    let sims = [];
    let accRotos = 0, accPerm = 0, accPollos = 0, accGanancia = 0;

    for (let s = 1; s <= numSimulaciones; s++) {
      let seed = Date.now() + s * 1000;
      let rand = lcg(seed);

      let totalRotos = 0, totalPerm = 0, totalPollos = 0, gananciaTotal = 0;
      let registros = [];

      for (let dia = 1; dia <= numeroMaximoDias; dia++) {
        let huevosDia = poissonRandom(1, rand);
        let huevosRotos = 0, huevosPerm = 0, pollosSobreviven = 0;

        for (let i = 0; i < huevosDia; i++) {
          const probRomper = rand();
          if (probRomper < 0.2) {
            huevosRotos++;
          } else {
            const probPollo = rand();
            if (probPollo < 0.3) {
              const probSobrevive = rand();
              if (probSobrevive < 0.8) {
                pollosSobreviven++;
              }
            } else {
              huevosPerm++;
            }
          }
        }

        const gananciaDia = huevosPerm * precioHuevo + pollosSobreviven * precioPollo;

        totalRotos += huevosRotos;
        totalPerm += huevosPerm;
        totalPollos += pollosSobreviven;
        gananciaTotal += gananciaDia;

        if (numSimulaciones === 1) {
          registros.push({
            dia,
            huevosGenerados: huevosDia,
            rotos: huevosRotos,
            permanecen: huevosPerm,
            pollos: pollosSobreviven,
            ganancia: gananciaDia.toFixed(2),
          });
        }
      }

      sims.push({
        sim: s,
        seed,
        rotos: totalRotos,
        permanecen: totalPerm,
        pollos: totalPollos,
        ganancia: gananciaTotal,
        promedio: gananciaTotal / numeroMaximoDias,
        registros
      });

      accRotos += totalRotos;
      accPerm += totalPerm;
      accPollos += totalPollos;
      accGanancia += gananciaTotal;
    }

    setResultados({
      sims,
      promedios: {
        rotos: accRotos / numSimulaciones,
        permanecen: accPerm / numSimulaciones,
        pollos: accPollos / numSimulaciones,
        ganancia: accGanancia / numSimulaciones
      }
    });
  }

  const inputStyle = { width: 120, padding: "6px" };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🥚🐔 Simulación Huevos y Pollos</h2>
      <p style={styles.description}>
        Probabilidades: romper=0.2, nacer=0.3, sobrevivir=0.8.  
        Huevos por día ~ Poisson(λ=1).
      </p>

      <div style={styles.form}>
        <label>
          Número de días:
          <input
            type="number"
            min={1}
            value={numeroMaximoDias}
            onChange={(e) => setNumeroMaximoDias(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Precio huevo (Bs):
          <input
            type="number"
            min={0}
            value={precioHuevo}
            onChange={(e) => setPrecioHuevo(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Precio pollo (Bs):
          <input
            type="number"
            min={0}
            value={precioPollo}
            onChange={(e) => setPrecioPollo(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Número de simulaciones:
          <input
            type="number"
            min={1}
            value={numSimulaciones}
            onChange={(e) => setNumSimulaciones(Number(e.target.value))}
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

      {resultados && (
        <>
          {numSimulaciones === 1 ? (
            <div>
              <h3 style={styles.subtitle}>📑 Detalle (Semilla: {resultados.sims[0].seed})</h3>
              <p><b>Huevos rotos:</b> {resultados.sims[0].rotos}</p>
              <p><b>Huevos permanecen:</b> {resultados.sims[0].permanecen}</p>
              <p><b>Pollos sobreviven:</b> {resultados.sims[0].pollos}</p>
              <p><b>Ganancia total:</b> {resultados.sims[0].ganancia.toFixed(2)} Bs</p>
              <p><b>Ingreso promedio diario:</b> {resultados.sims[0].promedio.toFixed(2)} Bs</p>

              <div style={styles.tableWrapper}>
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
                    {resultados.sims[0].registros.map((row, i) => (
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
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <h3 style={styles.subtitle}>📊 Resumen de simulaciones</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Sim</th>
                    <th>Semilla</th>
                    <th>Rotos</th>
                    <th>Permanecen</th>
                    <th>Pollos</th>
                    <th>Ganancia (Bs)</th>
                    <th>Promedio día (Bs)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.sims.map((s) => (
                    <tr key={s.sim}>
                      <td>{s.sim}</td>
                      <td>{s.seed}</td>
                      <td>{s.rotos}</td>
                      <td>{s.permanecen}</td>
                      <td>{s.pollos}</td>
                      <td>{s.ganancia.toFixed(2)}</td>
                      <td>{s.promedio.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.resultCard}>
            <h3 style={styles.subtitle}>📈 Promedios (NSIM = {numSimulaciones})</h3>
            <p><b>Huevos rotos promedio:</b> {resultados.promedios.rotos.toFixed(2)}</p>
            <p><b>Huevos permanecen promedio:</b> {resultados.promedios.permanecen.toFixed(2)}</p>
            <p><b>Pollos sobreviven promedio:</b> {resultados.promedios.pollos.toFixed(2)}</p>
            <p><b>Ganancia promedio total:</b> {resultados.promedios.ganancia.toFixed(2)} Bs</p>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px", background: "#111", color: "#eee", minHeight: "100vh", textAlign: "center" },
  title: { fontSize: "2.2rem", marginBottom: "15px" },
  description: { fontSize: "1.1rem", marginBottom: "25px", opacity: 0.9 },
  form: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  actions: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "20px" },
  btnPrimary: { padding: "12px 20px", fontSize: "1.1rem", border: "none", borderRadius: "10px", background: "#4caf50", color: "#fff", cursor: "pointer" },
  btnSecondary: { padding: "12px 20px", fontSize: "1.1rem", border: "none", borderRadius: "10px", background: "#f44336", color: "#fff", cursor: "pointer" },
  tableWrapper: { marginTop: "20px", overflowX: "auto" },
  table: { width: "100%", maxWidth: "900px", margin: "0 auto", borderCollapse: "collapse", background: "#1c1c1c" },
  resultCard: { marginTop: "20px", padding: "20px", background: "#222", borderRadius: "10px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" },
  subtitle: { fontSize: "1.4rem", marginBottom: "10px", color: "#87cefa" }
};
