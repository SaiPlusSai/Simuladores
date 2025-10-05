import { useState } from "react";

function tirarDado() {
  // entero en [1..6]
  return Math.floor(Math.random() * 6) + 1;
}

export default function JuegoDados({ goBack }) {
  const [apuesta, setApuesta] = useState(2);
  const [premio, setPremio] = useState(5);
  const [juegosTotales, setJuegosTotales] = useState(1500);

  const [gananciaNeta, setGananciaNeta] = useState(null);
  const [juegosGanadosCasa, setJuegosGanadosCasa] = useState(null);
  const [porcentajeCasa, setPorcentajeCasa] = useState(null);
  const [mostrarLog, setMostrarLog] = useState(false);
  const [log, setLog] = useState([]);

  const simular = () => {
    let gNeta = 0;
    let gCasa = 0;
    const eventos = [];

    for (let cj = 0; cj < juegosTotales; cj++) {
      gNeta += apuesta;

      const d1 = tirarDado();
      const d2 = tirarDado();
      const suma = d1 + d2;

      if (suma === 7) {
        // jugador gana (casa paga)
        gNeta -= premio;
        if (mostrarLog) eventos.push(`Juego ${cj + 1}: Jugador gana ( ${d1} + ${d2} = 7 )`);
      } else {
        gCasa++;
        if (mostrarLog) eventos.push(`Juego ${cj + 1}: Casa gana ( ${d1} + ${d2} = ${suma} )`);
      }
    }

    setGananciaNeta(gNeta);
    setJuegosGanadosCasa(gCasa);
    setPorcentajeCasa(((gCasa / juegosTotales) * 100));
    setLog(eventos);
  };

  return (
    <div style={{ padding: 20, background: "#111", color: "#eee", minHeight: "100vh" }}>
      <h2>Juego de Dados — Casa vs Jugador</h2>
      <p style={{ opacity: 0.85 }}>
        Reglas: cada juego la casa cobra <b>apuesta</b>. Si la suma de los dados es <b>7</b>, la casa paga <b>premio</b>.
        En otro caso, gana la casa.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 220px))", gap: 12, margin: "16px 0" }}>
        <label>
          Apuesta:&nbsp;
          <input
            type="number"
            value={apuesta}
            onChange={(e) => setApuesta(Number(e.target.value))}
            style={{ width: 100, padding: "6px" }}
          />
        </label>
        <label>
          Premio:&nbsp;
          <input
            type="number"
            value={premio}
            onChange={(e) => setPremio(Number(e.target.value))}
            style={{ width: 100, padding: "6px" }}
          />
        </label>
        <label>
          Juegos:&nbsp;
          <input
            type="number"
            value={juegosTotales}
            onChange={(e) => setJuegosTotales(Number(e.target.value))}
            style={{ width: 120, padding: "6px" }}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={simular} style={{ padding: "10px 15px" }}>Simular</button>
        <button onClick={goBack} style={{ padding: "10px 15px" }}>⬅ Volver al menú</button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={mostrarLog}
            onChange={(e) => setMostrarLog(e.target.checked)}
          />
          Mostrar log
        </label>
      </div>

      {gananciaNeta !== null && (
        <div style={{ marginTop: 16 }}>
          <h3>Resultados</h3>
          <p>Ganancia neta de la casa: <b>{gananciaNeta}</b></p>
          <p>Veces que ganó la casa: <b>{juegosGanadosCasa}</b> de {juegosTotales}</p>
          <p>Porcentaje de victorias de la casa: <b>{porcentajeCasa.toFixed(2)}%</b></p>
        </div>
      )}

      {mostrarLog && log.length > 0 && (
        <div style={{ marginTop: 16, maxHeight: 300, overflow: "auto", border: "1px solid #333", padding: 10 }}>
          {log.map((linea, i) => (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 13 }}>{linea}</div>
          ))}
        </div>
      )}
    </div>
  );
}
