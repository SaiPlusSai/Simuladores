import { useState } from "react";

export default function HuevosPollos({ goBack }) {
  const [numeroMaximoDias, setNumeroMaximoDias] = useState(30);
  const [precioHuevo, setPrecioHuevo] = useState(1.5);
  const [precioPollo, setPrecioPollo] = useState(5.0);

  const [resultados, setResultados] = useState(null);

  function simular() {
    let totalHuevosRotos = 0;
    let totalHuevosPermanecen = 0;
    let totalPollosSobreviven = 0;
    let gananciaTotal = 0;

    for (let dia = 1; dia <= numeroMaximoDias; dia++) {
      // Poisson con lambda=1 → aprox usando Math.random (no hay distribuciones directas nativas)
      // estrategia: conteo de eventos con media 1 (aprox)
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

      totalHuevosRotos += huevosRotos;
      totalHuevosPermanecen += huevosPerm;
      totalPollosSobreviven += pollosSobreviven;

      gananciaTotal += huevosPerm * precioHuevo + pollosSobreviven * precioPollo;
    }

    const ingresoPromedio = gananciaTotal / numeroMaximoDias;

    setResultados({
      totalHuevosRotos,
      totalHuevosPermanecen,
      totalPollosSobreviven,
      gananciaTotal,
      ingresoPromedio,
    });
  }

  // Generador Poisson(lambda) simple con Knuth
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
    <div style={{ padding: 20, background: "#111", color: "#eee", minHeight: "100vh" }}>
      <h2>Simulación Huevos y Pollos</h2>
      <p style={{ opacity: 0.85 }}>Prob. romper huevo=0.2, nacer pollo=0.3, sobrevivir=0.8.</p>

      <div style={{ display: "grid", gap: 10, marginBottom: 15 }}>
        <label>
          Número de días:&nbsp;
          <input
            type="number"
            value={numeroMaximoDias}
            onChange={(e) => setNumeroMaximoDias(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Precio huevo (Bs):&nbsp;
          <input
            type="number"
            value={precioHuevo}
            onChange={(e) => setPrecioHuevo(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Precio pollo (Bs):&nbsp;
          <input
            type="number"
            value={precioPollo}
            onChange={(e) => setPrecioPollo(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={simular} style={{ padding: "10px 15px" }}>Simular</button>
        <button onClick={goBack} style={{ padding: "10px 15px" }}>⬅ Volver al menú</button>
      </div>

      {resultados && (
        <div style={{ marginTop: 16 }}>
          <h3>Resultados</h3>
          <p>Total huevos rotos: <b>{resultados.totalHuevosRotos}</b></p>
          <p>Total huevos permanecen: <b>{resultados.totalHuevosPermanecen}</b></p>
          <p>Total pollos que sobreviven: <b>{resultados.totalPollosSobreviven}</b></p>
          <p>Ganancia total: <b>{resultados.gananciaTotal.toFixed(2)} Bs</b></p>
          <p>Ingreso promedio diario: <b>{resultados.ingresoPromedio.toFixed(2)} Bs</b></p>
        </div>
      )}
    </div>
  );
}
