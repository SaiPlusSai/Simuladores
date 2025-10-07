import { useState } from "react";

function tirarDado() {
  return Math.floor(Math.random() * 6) + 1; // entero en [1..6]
}

export default function JuegoDados({ goBack }) {
  const [apuesta, setApuesta] = useState(2);
  const [premio, setPremio] = useState(5);
  const [juegosTotales, setJuegosTotales] = useState(100);

  const [gananciaNeta, setGananciaNeta] = useState(null);
  const [juegosGanadosCasa, setJuegosGanadosCasa] = useState(null);
  const [porcentajeCasa, setPorcentajeCasa] = useState(null);
  const [tabla, setTabla] = useState([]);

  const simular = () => {
    let gNeta = 0;
    let gCasa = 0;
    const registros = [];

    for (let cj = 0; cj < juegosTotales; cj++) {
      gNeta += apuesta;

      const d1 = tirarDado();
      const d2 = tirarDado();
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

    setGananciaNeta(gNeta);
    setJuegosGanadosCasa(gCasa);
    setPorcentajeCasa((gCasa / juegosTotales) * 100);
    setTabla(registros);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎲 Juego de Dados — Casa vs Jugador</h2>
      <p style={styles.description}>
        Reglas: cada juego la <b>casa cobra {apuesta} Bs</b>.  
        Si la suma de los dados es <b>7</b>, la casa paga <b>{premio} Bs</b>.  
        En otro caso, gana la casa.
      </p>

      <div style={styles.form}>
        <label>
          Apuesta (Bs):
          <input
            type="number"
            value={apuesta}
            onChange={(e) => setApuesta(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Premio (Bs):
          <input
            type="number"
            value={premio}
            onChange={(e) => setPremio(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          N° de juegos:
          <input
            type="number"
            value={juegosTotales}
            onChange={(e) => setJuegosTotales(Number(e.target.value))}
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

      {gananciaNeta !== null && (
        <div style={styles.resultCard}>
          <h3 style={styles.subtitle}>📊 Resultados Globales</h3>
          <p>Ganancia neta de la casa: <b>{gananciaNeta} Bs</b></p>
          <p>Veces que ganó la casa: <b>{juegosGanadosCasa}</b> de {juegosTotales}</p>
          <p>Porcentaje de victorias de la casa: <b>{porcentajeCasa.toFixed(2)}%</b></p>
        </div>
      )}

      {tabla.length > 0 && (
        <div style={styles.tableWrapper}>
          <h3 style={styles.subtitle}>📑 Iteraciones</h3>
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
              {tabla.map((row, i) => (
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
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  subtitle: {
    fontSize: "1.4rem",
    marginBottom: "10px",
    color: "#87cefa",
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
};
