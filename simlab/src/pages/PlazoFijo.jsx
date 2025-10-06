import { useState } from "react";

export default function PlazoFijo({ goBack }) {
  const [capitalInicial, setCapitalInicial] = useState(0);
  const [resultados, setResultados] = useState(null);
  const T = 10; // plazo fijo en años

  function simular() {
    let k = capitalInicial;
    const detalle = [];

    for (let c = 1; c <= T; c++) {
      let tasa;
      if (k <= 10000) {
        tasa = 0.35;
      } else if (k <= 50000) {
        tasa = 0.37;
      } else {
        tasa = 0.04;
      }

      const interes = k * tasa;
      k += interes;

      detalle.push({
        anio: c,
        interes: interes,
        capital: k,
        tasa: tasa * 100,
      });
    }

    setResultados({
      capitalInicial,
      detalle,
      capitalFinal: k,
    });
  }

  return (
    <div style={{ padding: 20, background: "#111", color: "#eee", minHeight: "100vh" }}>
      <h2>Simulación de Plazo Fijo</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          Capital inicial ($):{" "}
          <input
            type="number"
            value={capitalInicial}
            onChange={(e) => setCapitalInicial(Number(e.target.value))}
            style={{ padding: "6px", width: 120 }}
          />
        </label>
      </div>

      <button onClick={simular} style={{ padding: "10px 15px", marginRight: 8 }}>
        Simular
      </button>
      <button onClick={goBack} style={{ padding: "10px 15px" }}>
        ⬅ Volver al menú
      </button>

      {resultados && (
        <div style={{ marginTop: 20 }}>
          <h3>Resultados</h3>
          <p>Capital inicial: ${resultados.capitalInicial.toFixed(2)}</p>
          <p>Plazo: {T} años</p>
          <p>Capital final acumulado: ${resultados.capitalFinal.toFixed(2)}</p>

          <table style={{ marginTop: 12, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #444", padding: "6px" }}>Año</th>
                <th style={{ border: "1px solid #444", padding: "6px" }}>Interés ganado</th>
                <th style={{ border: "1px solid #444", padding: "6px" }}>Capital acumulado</th>
                <th style={{ border: "1px solid #444", padding: "6px" }}>Tasa aplicada</th>
              </tr>
            </thead>
            <tbody>
              {resultados.detalle.map((row) => (
                <tr key={row.anio}>
                  <td style={{ border: "1px solid #444", padding: "6px" }}>{row.anio}</td>
                  <td style={{ border: "1px solid #444", padding: "6px" }}>
                    ${row.interes.toFixed(2)}
                  </td>
                  <td style={{ border: "1px solid #444", padding: "6px" }}>
                    ${row.capital.toFixed(2)}
                  </td>
                  <td style={{ border: "1px solid #444", padding: "6px" }}>
                    {row.tasa.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
