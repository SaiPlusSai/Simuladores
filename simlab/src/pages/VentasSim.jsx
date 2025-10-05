import { useState } from "react";

function obtenerArticulosVendidos() {
  const p = Math.random(); // [0,1)
  if (p < 0.2) return 0;
  else if (p < 0.5) return 1;   // 0.2..0.5  -> 30%
  else if (p < 0.9) return 2;   // 0.5..0.9  -> 40%
  else return 3;                // 0.9..1.0  -> 10%
}

export default function VentasSim({ goBack }) {
  const [costoFijoDiario, setCostoFijoDiario] = useState(300);
  const [costoUnitario, setCostoUnitario] = useState(50);
  const [precioVenta, setPrecioVenta] = useState(75);
  const [numHoras, setNumHoras] = useState(10);
  const [numSimulaciones, setNumSimulaciones] = useState(1);

  const [totalArticulosVendidos, setTotalArticulosVendidos] = useState(null);
  const [totalGananciaNeta, setTotalGananciaNeta] = useState(null);

  const simular = () => {
    let acumuladoArticulos = 0;
    let acumuladoGanancia = 0;

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
    }

    setTotalArticulosVendidos(acumuladoArticulos);
    setTotalGananciaNeta(acumuladoGanancia);
  };

  const inputStyle = { width: 140, padding: "6px" };
  const labelStyle = { display: "flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ padding: 20, background: "#111", color: "#eee", minHeight: "100vh" }}>
      <h2>Simulación de Ventas por Día</h2>
      <p style={{ opacity: 0.85, marginBottom: 12 }}>
  Clientes por hora ~ U(0,1,2,3,4). Artículos por cliente con p(0)=0.2, p(1)=0.3, p(2)=0.4, p(3)=0.1.
</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 320px))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <label style={labelStyle}>
          Costo fijo diario (Bs):
          <input
            type="number"
            value={costoFijoDiario}
            onChange={(e) => setCostoFijoDiario(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Costo unitario artículo (Bs):
          <input
            type="number"
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Precio venta unitario (Bs):
          <input
            type="number"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Número de horas:
          <input
            type="number"
            value={numHoras}
            onChange={(e) => setNumHoras(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Número de simulaciones:
          <input
            type="number"
            value={numSimulaciones}
            min={1}
            onChange={(e) => setNumSimulaciones(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={simular} style={{ padding: "10px 15px" }}>
          Simular
        </button>
        <button onClick={goBack} style={{ padding: "10px 15px" }}>
          ⬅ Volver al menú
        </button>
      </div>

      {totalGananciaNeta !== null && (
        <div style={{ marginTop: 16 }}>
          <h3>Resultados</h3>
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
