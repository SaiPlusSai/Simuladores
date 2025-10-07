import { useState } from "react";

// Generador congruencial lineal (LCG) con semilla
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

export default function JuegoDados({ goBack }) {
  const [apuesta, setApuesta] = useState(2);
  const [premio, setPremio] = useState(5);
  const [juegosTotales, setJuegosTotales] = useState(100);
  const [nsim, setNsim] = useState(1);

  const [resultados, setResultados] = useState(null);

  const simular = () => {
    if (apuesta < 0 || premio < 0 || juegosTotales <= 0 || nsim <= 0) {
      alert("⚠️ Los valores deben ser no negativos y los juegos/simulaciones mayores a 0.");
      return;
    }

    let sims = [];
    let accGanancia = 0;
    let accGanadasCasa = 0;

    for (let s = 1; s <= nsim; s++) {
      let seed = Date.now() + s * 1000;
      let rand = lcg(seed);

      let gNeta = 0;
      let gCasa = 0;
      let registros = [];

      for (let cj = 0; cj < juegosTotales; cj++) {
        gNeta += apuesta;

        const d1 = Math.floor(rand() * 6) + 1;
        const d2 = Math.floor(rand() * 6) + 1;
        const suma = d1 + d2;

        if (suma === 7) {
          gNeta -= premio; // jugador gana
          registros.push({
            juego: cj + 1,
            d1,
            d2,
            suma,
            ganador: "Jugador",
          });
        } else {
          gCasa++;
          registros.push({
            juego: cj + 1,
            d1,
            d2,
            suma,
            ganador: "Casa",
          });
        }
      }

      sims.push({
        sim: s,
        seed,
        gananciaNeta: gNeta,
        ganadasCasa: gCasa,
        porcentajeCasa: (gCasa / juegosTotales) * 100,
        registros,
      });

      accGanancia += gNeta;
      accGanadasCasa += gCasa;
    }

    setResultados({
      sims,
      promedios: {
        ganancia: accGanancia / nsim,
        ganadasCasa: accGanadasCasa / nsim,
        porcentajeCasa: (accGanadasCasa / (juegosTotales * nsim)) * 100,
      },
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎲 Juego de Dados — Casa vs Jugador</h2>
      <p style={styles.description}>
        Cada juego la <b>casa cobra {apuesta} Bs</b>.  
        Si la suma es <b>7</b>, paga <b>{premio} Bs</b>.  
        En otro caso, gana la casa.
      </p>

      <div style={styles.form}>
        <label>
          Apuesta (Bs):
          <input
            type="number"
            min="0"
            value={apuesta}
            onChange={(e) => setApuesta(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Premio (Bs):
          <input
            type="number"
            min="0"
            value={premio}
            onChange={(e) => setPremio(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          N° de juegos:
          <input
            type="number"
            min="1"
            value={juegosTotales}
            onChange={(e) => setJuegosTotales(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          N° simulaciones:
          <input
            type="number"
            min="1"
            value={nsim}
            onChange={(e) => setNsim(Number(e.target.value))}
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
          {nsim === 1 ? (
            <div>
              <h3 style={styles.subtitle}>
                📑 Detalle de la simulación (Semilla: {resultados.sims[0].seed})
              </h3>
              <p>Ganancia neta: <b>{resultados.sims[0].gananciaNeta} Bs</b></p>
              <p>Veces que ganó la casa: <b>{resultados.sims[0].ganadasCasa}</b></p>
              <p>% victorias casa: <b>{resultados.sims[0].porcentajeCasa.toFixed(2)}%</b></p>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Juego</th>
                      <th>Dado 1</th>
                      <th>Dado 2</th>
                      <th>Suma</th>
                      <th>Ganador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.sims[0].registros.map((row, i) => (
                      <tr key={i}>
                        <td>{row.juego}</td>
                        <td>{row.d1}</td>
                        <td>{row.d2}</td>
                        <td>{row.suma}</td>
                        <td>{row.ganador}</td>
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
                    <th>Ganancia Neta</th>
                    <th>Ganadas Casa</th>
                    <th>% Casa</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.sims.map((s) => (
                    <tr key={s.sim}>
                      <td>{s.sim}</td>
                      <td>{s.seed}</td>
                      <td>{s.gananciaNeta}</td>
                      <td>{s.ganadasCasa}</td>
                      <td>{s.porcentajeCasa.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.resultCard}>
            <h3 style={styles.subtitle}>📈 Promedios (NSIM = {nsim})</h3>
            <p><b>Ganancia neta promedio:</b> {resultados.promedios.ganancia.toFixed(2)} Bs</p>
            <p><b>Juegos ganados por la casa (prom):</b> {resultados.promedios.ganadasCasa.toFixed(2)}</p>
            <p><b>% victorias casa promedio:</b> {resultados.promedios.porcentajeCasa.toFixed(2)}%</p>
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
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    marginLeft: "8px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#222",
    color: "#eee",
    width: "120px",
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
  tableWrapper: { marginTop: "20px", overflowX: "auto" },
  table: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    borderCollapse: "collapse",
    background: "#1c1c1c",
  },
};
