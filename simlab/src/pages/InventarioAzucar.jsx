import { useState } from "react";

export default function InventarioAzucar({ goBack }) {
  const [CBOD, setCBOD] = useState(700); // capacidad bodega
  const [CORD, setCORD] = useState(100); // costo orden
  const [CUI, setCUI] = useState(0.1);   // costo inventario
  const [CUA, setCUA] = useState(3.5);   // costo almacenamiento
  const [PVU, setPVU] = useState(5);     // precio venta
  const [NSIM, setNSIM] = useState(1);   // simulaciones
  const [NMD, setNMD] = useState(30);    // días

  const [mostrarLog, setMostrarLog] = useState(false);
  const [tabla, setTabla] = useState([]);
  const [out, setOut] = useState(null);

  function demandaDia() {
    const U = Math.random();
    return Math.round(-100 * Math.log(1 - U));
  }

  function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function simular() {
    let registros = [];
    let accGNT = 0, accCT = 0, accDIT = 0, accIBR = 0;

    for (let sim = 1; sim <= NSIM; sim++) {
      let CD = 0, IAZU = CBOD, DIT = 0, CDI = 0, CTA = 0, CTO = 0, IBR = 0, TENT = 0;

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
          TENT = randint(1, 3);
          CTO += CORD;
        }

        const DAZU = demandaDia();
        if (DAZU > IAZU) {
          DIT += (DAZU - IAZU);
          IBR += IAZU * PVU;
          IAZU = 0;
        } else {
          IBR += DAZU * PVU;
          IAZU -= DAZU;
        }

        CDI += IAZU * CUI;

        registros.push({
          sim,
          dia,
          inventario: IAZU,
          demanda: DAZU,
          ingresos: IBR.toFixed(2),
          costoInv: CDI.toFixed(2),
          costoAlm: CTA.toFixed(2),
          costoOrd: CTO.toFixed(2),
        });
      }

      const CT = CDI + CTA + CTO;
      const GNT = IBR - CT;

      accGNT += GNT; accCT += CT; accDIT += DIT; accIBR += IBR;
    }

    setTabla(registros);
    setOut({
      totales: { GNT: accGNT, CT: accCT, DIT: accDIT, IBR: accIBR },
      promedios: {
        GNT: accGNT / NSIM,
        CT: accCT / NSIM,
        DIT: accDIT / NSIM,
        IBR: accIBR / NSIM,
      },
    });
  }

  const input = { width: 120, padding: "6px" };
  const row = { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 260px))", gap: 12 };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍬 Inventario de Azúcar</h2>
      <p style={styles.description}>Modelo con reabastecimiento semanal y demanda aleatoria.</p>

      <div style={{ ...row, margin: "12px 0" }}>
        <label>CBOD: <input type="number" value={CBOD} onChange={(e) => setCBOD(+e.target.value)} style={input} /></label>
        <label>CORD: <input type="number" value={CORD} onChange={(e) => setCORD(+e.target.value)} style={input} /></label>
        <label>CUI: <input type="number" step="0.01" value={CUI} onChange={(e) => setCUI(+e.target.value)} style={input} /></label>
        <label>CUA: <input type="number" step="0.01" value={CUA} onChange={(e) => setCUA(+e.target.value)} style={input} /></label>
        <label>PVU: <input type="number" value={PVU} onChange={(e) => setPVU(+e.target.value)} style={input} /></label>
        <label>NSIM: <input type="number" min={1} value={NSIM} onChange={(e) => setNSIM(+e.target.value)} style={input} /></label>
        <label>NMD: <input type="number" min={1} value={NMD} onChange={(e) => setNMD(+e.target.value)} style={input} /></label>
      </div>

      <div style={styles.actions}>
        <button onClick={simular} style={styles.btnPrimary}>▶ Simular</button>
        <button onClick={goBack} style={styles.btnSecondary}>⬅ Volver</button>
        <label style={styles.checkbox}>
          <input type="checkbox" checked={mostrarLog} onChange={(e) => setMostrarLog(e.target.checked)} />
          Mostrar log
        </label>
      </div>

      {/* Resumen primero */}
      {out && (
        <div style={styles.resultCard}>
          <h3 style={styles.subtitle}>📊 Resumen</h3>
          <p><b>Ganancia neta:</b> {out.totales.GNT.toFixed(2)} Bs</p>
          <p><b>Costo total:</b> {out.totales.CT.toFixed(2)} Bs</p>
          <p><b>Demanda insatisfecha:</b> {out.totales.DIT}</p>
          <p><b>Ingresos brutos:</b> {out.totales.IBR.toFixed(2)} Bs</p>
          {NSIM > 1 && (
            <div style={{ marginTop: 10 }}>
              <h4>Promedios</h4>
              <p>GNT: {out.promedios.GNT.toFixed(2)} · CT: {out.promedios.CT.toFixed(2)} · DIT: {out.promedios.DIT.toFixed(2)} · IBR: {out.promedios.IBR.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      {/* Tabla de iteraciones */}
      {tabla.length > 0 && (
        <div style={styles.tableWrapper}>
          <h3 style={styles.subtitle}>📑 Detalle diario</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Sim</th>
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
              {tabla.map((row, i) => (
                <tr key={i}>
                  <td>{row.sim}</td>
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
  checkbox: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem" },
  resultCard: { marginTop: "20px", padding: "20px", background: "#222", borderRadius: "10px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" },
  subtitle: { fontSize: "1.4rem", marginBottom: "10px", color: "#87cefa" },
  tableWrapper: { marginTop: "20px", overflowX: "auto" },
  table: { width: "100%", maxWidth: "950px", margin: "0 auto", borderCollapse: "collapse", background: "#1c1c1c" },
};
