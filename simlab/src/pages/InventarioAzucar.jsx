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

// Demanda diaria ~ Exponencial(λ=0.01)
function demandaDia(rand) {
  const U = rand();
  return Math.round(-100 * Math.log(1 - U));
}

// Random entero [a, b]
function randint(a, b, rand) {
  return Math.floor(rand() * (b - a + 1)) + a;
}

export default function InventarioAzucar({ goBack }) {
  const [CBOD, setCBOD] = useState(700); // capacidad bodega
  const [CORD, setCORD] = useState(100); // costo orden
  const [CUI, setCUI] = useState(0.1);   // costo inventario
  const [CUA, setCUA] = useState(3.5);   // costo almacenamiento
  const [PVU, setPVU] = useState(5);     // precio venta
  const [NSIM, setNSIM] = useState(1);   // simulaciones
  const [NMD, setNMD] = useState(30);    // días

  const [resultados, setResultados] = useState(null);

  function simular() {
    if (CBOD < 0 || CORD < 0 || CUI < 0 || CUA < 0 || PVU < 0 || NMD <= 0 || NSIM <= 0) {
      alert("⚠️ Los parámetros deben ser no negativos y días/simulaciones mayores a 0.");
      return;
    }

    let sims = [];
    let accGNT = 0, accCT = 0, accDIT = 0, accIBR = 0;

    for (let sim = 1; sim <= NSIM; sim++) {
      let seed = Date.now() + sim * 1234;
      let rand = lcg(seed);

      let IAZU = CBOD, DIT = 0, CDI = 0, CTA = 0, CTO = 0, IBR = 0, TENT = 0;
      let registros = [];

      for (let dia = 1; dia <= NMD; dia++) {
        if (TENT > 0) {
          TENT--;
          if (TENT === 0) {
            const PAZU = Math.max(0, CBOD - IAZU);
            IAZU += PAZU;
            CTA += PAZU * CUA;
          }
        }

        if (dia % 7 === 0 && TENT === 0) {
          TENT = randint(1, 3, rand);
          CTO += CORD;
        }

        const DAZU = demandaDia(rand);
        if (DAZU > IAZU) {
          DIT += (DAZU - IAZU);
          IBR += IAZU * PVU;
          IAZU = 0;
        } else {
          IBR += DAZU * PVU;
          IAZU -= DAZU;
        }

        CDI += IAZU * CUI;

        if (NSIM === 1) {
          registros.push({
            dia,
            inventario: IAZU,
            demanda: DAZU,
            ingresos: IBR.toFixed(2),
            costoInv: CDI.toFixed(2),
            costoAlm: CTA.toFixed(2),
            costoOrd: CTO.toFixed(2),
          });
        }
      }

      const CT = CDI + CTA + CTO;
      const GNT = IBR - CT;

      sims.push({
        sim,
        seed,
        GNT,
        CT,
        DIT,
        IBR,
        registros
      });

      accGNT += GNT; accCT += CT; accDIT += DIT; accIBR += IBR;
    }

    setResultados({
      sims,
      promedios: {
        GNT: accGNT / NSIM,
        CT: accCT / NSIM,
        DIT: accDIT / NSIM,
        IBR: accIBR / NSIM,
      },
      totales: { GNT: accGNT, CT: accCT, DIT: accDIT, IBR: accIBR }
    });
  }

  const input = { width: 120, padding: "6px" };
  const row = { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 260px))", gap: 12 };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍬 Inventario de Azúcar</h2>
      <p style={styles.description}>Modelo con reabastecimiento semanal y demanda aleatoria.</p>

      <div style={{ ...row, margin: "12px 0" }}>
        <label>CBOD: <input type="number" min={0} value={CBOD} onChange={(e) => setCBOD(+e.target.value)} style={input} /></label>
        <label>CORD: <input type="number" min={0} value={CORD} onChange={(e) => setCORD(+e.target.value)} style={input} /></label>
        <label>CUI: <input type="number" step="0.01" min={0} value={CUI} onChange={(e) => setCUI(+e.target.value)} style={input} /></label>
        <label>CUA: <input type="number" step="0.01" min={0} value={CUA} onChange={(e) => setCUA(+e.target.value)} style={input} /></label>
        <label>PVU: <input type="number" min={0} value={PVU} onChange={(e) => setPVU(+e.target.value)} style={input} /></label>
        <label>NSIM: <input type="number" min={1} value={NSIM} onChange={(e) => setNSIM(+e.target.value)} style={input} /></label>
        <label>NMD: <input type="number" min={1} value={NMD} onChange={(e) => setNMD(+e.target.value)} style={input} /></label>
      </div>

      <div style={styles.actions}>
        <button onClick={simular} style={styles.btnPrimary}>▶ Simular</button>
        <button onClick={goBack} style={styles.btnSecondary}>⬅ Volver</button>
      </div>

      {resultados && (
        <>
          {NSIM === 1 ? (
            <div>
              <h3 style={styles.subtitle}>📑 Detalle (Semilla: {resultados.sims[0].seed})</h3>
              <p><b>Ganancia neta:</b> {resultados.sims[0].GNT.toFixed(2)} Bs</p>
              <p><b>Costo total:</b> {resultados.sims[0].CT.toFixed(2)} Bs</p>
              <p><b>Demanda insatisfecha:</b> {resultados.sims[0].DIT}</p>
              <p><b>Ingresos brutos:</b> {resultados.sims[0].IBR.toFixed(2)} Bs</p>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Inventario</th>
                      <th>Demanda</th>
                      <th>Ingresos</th>
                      <th>Cost.Inv</th>
                      <th>Cost.Alm</th>
                      <th>Cost.Ord</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.sims[0].registros.map((row, i) => (
                      <tr key={i}>
                        <td>{row.dia}</td>
                        <td>{row.inventario}</td>
                        <td>{row.demanda}</td>
                        <td>{row.ingresos}</td>
                        <td>{row.costoInv}</td>
                        <td>{row.costoAlm}</td>
                        <td>{row.costoOrd}</td>
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
                    <th>Costo Total</th>
                    <th>Demanda Insatisfecha</th>
                    <th>Ingresos Brutos</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.sims.map((s) => (
                    <tr key={s.sim}>
                      <td>{s.sim}</td>
                      <td>{s.seed}</td>
                      <td>{s.GNT.toFixed(2)}</td>
                      <td>{s.CT.toFixed(2)}</td>
                      <td>{s.DIT}</td>
                      <td>{s.IBR.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.resultCard}>
            <h3 style={styles.subtitle}>📈 Promedios (NSIM = {NSIM})</h3>
            <p>Ganancia neta promedio: <b>{resultados.promedios.GNT.toFixed(2)} Bs</b></p>
            <p>Costo total promedio: <b>{resultados.promedios.CT.toFixed(2)} Bs</b></p>
            <p>Demanda insatisfecha promedio: <b>{resultados.promedios.DIT.toFixed(2)}</b></p>
            <p>Ingresos brutos promedio: <b>{resultados.promedios.IBR.toFixed(2)} Bs</b></p>
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
  actions: { display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px", alignItems: "center" },
  btnPrimary: { padding: "12px 20px", fontSize: "1.1rem", border: "none", borderRadius: "10px", background: "#4caf50", color: "#fff", cursor: "pointer" },
  btnSecondary: { padding: "12px 20px", fontSize: "1.1rem", border: "none", borderRadius: "10px", background: "#f44336", color: "#fff", cursor: "pointer" },
  tableWrapper: { marginTop: "20px", overflowX: "auto" },
  table: { width: "100%", maxWidth: "950px", margin: "0 auto", borderCollapse: "collapse", background: "#1c1c1c" },
  resultCard: { marginTop: "20px", padding: "20px", background: "#222", borderRadius: "10px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" },
  subtitle: { fontSize: "1.4rem", marginBottom: "10px", color: "#87cefa" },
};
