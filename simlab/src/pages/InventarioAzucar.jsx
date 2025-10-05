import { useState } from "react";

export default function InventarioAzucar({ goBack }) {
  // Parámetros ingresados por el usuario
  const [CBOD, setCBOD] = useState(700);     // capacidad de bodega
  const [CORD, setCORD] = useState(100);     // costo de orden
  const [CUI, setCUI] = useState(0.1);       // costo unitario inventario (por unidad por día)
  const [CUA, setCUA] = useState(3.5);       // costo unitario almacenamiento (por unidad recibida)
  const [PVU, setPVU] = useState(5);         // precio de venta unitario
  const [NSIM, setNSIM] = useState(1);       // número de simulaciones
  const [NMD, setNMD] = useState(30);        // días por simulación

  const [mostrarLog, setMostrarLog] = useState(false);

  // Resultados
  const [out, setOut] = useState(null); // { totales, promedios, sims: [...] }

  function demandaDia() {
    // D = round(-100 * ln(1-U)), U~U(0,1)
    const U = Math.random();
    const D = Math.round(-100 * Math.log(1 - U));
    return D;
  }

  function randint(a, b) {
    // entero uniforme [a, b]
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function simular() {
    const sims = [];
    let accGNT = 0;
    let accCT = 0;
    let accDIT = 0;
    let accIBR = 0;

    for (let sim = 1; sim <= NSIM; sim++) {
      // Iniciales por simulación
      let CD = 0;
      let IAZU = CBOD;    // inventario inicial (igual que tu Python: 700)
      let DIT = 0;        // demanda insatisfecha acumulada
      let CDI = 0;        // costo de inventario (acum)
      let CTA = 0;        // costo de almacenamiento (acum)
      let CTO = 0;        // costo de ordenar (acum)
      let IBR = 0;        // ingreso bruto
      let TENT = 0;       // tiempo de entrega pendiente (días)
      let log = [];

      // costo inicial de almacenamiento del ejemplo era 2450, pero eso venía del caso
      // de Python por un pedido previo; aquí lo dejamos en 0 y solo sumamos cuando llegue un pedido
      // (si querés replicar exactamente ese 2450 inicial, setea CTA = 2450)

      while (CD < NMD) {
        CD += 1;
        if (mostrarLog) log.push(`--- Día ${CD} ---`);

        // Llega pedido si estaba en tránsito y se cumple TENT
        if (TENT > 0) {
          TENT -= 1;
          if (TENT === 0) {
            const PAZU = Math.max(0, CBOD - IAZU); // unidades para llenar bodega
            IAZU += PAZU;
            CTA += PAZU * CUA;
            if (mostrarLog) log.push(`Llega pedido: +${PAZU} (CTA += ${PAZU} * ${CUA})`);
          }
        }

        // Orden cada 7 días si no hay pedido en tránsito
        if (CD % 7 === 0 && TENT === 0) {
          TENT = randint(1, 3); // llegará en 1..3 días
          CTO += CORD;
          if (mostrarLog) log.push(`Se hace pedido (CTO += ${CORD}), llega en ${TENT} día(s)`);
        }

        // Demanda diaria
        const DAZU = demandaDia();
        if (mostrarLog) log.push(`Demanda del día: ${DAZU}`);

        if (DAZU > IAZU) {
          // se vende lo que hay y el resto insatisfecho
          DIT += (DAZU - IAZU);
          IBR += IAZU * PVU;
          if (mostrarLog) log.push(`Venta: ${IAZU}, insatisfecha: ${DAZU - IAZU}`);
          IAZU = 0;
        } else {
          // venta normal
          IBR += DAZU * PVU;
          IAZU -= DAZU;
          if (mostrarLog) log.push(`Venta: ${DAZU}, inventario queda: ${IAZU}`);
        }

        // Costo de inventario al final del día (por unidad almacenada)
        CDI += IAZU * CUI;
        if (mostrarLog) log.push(`CDI += ${IAZU} * ${CUI} (acum: ${CDI.toFixed(2)})`);
      }

      const CT = CDI + CTA + CTO;
      const GNT = IBR - CT;

      sims.push({
        sim,
        GNT,
        CT,
        DIT,
        IBR,
        CDI,
        CTA,
        CTO,
        log: mostrarLog ? log : null,
        TENTFinal: TENT,
      });

      accGNT += GNT;
      accCT += CT;
      accDIT += DIT;
      accIBR += IBR;
    }

    const proms = {
      GNT: accGNT / NSIM,
      CT: accCT / NSIM,
      DIT: accDIT / NSIM,
      IBR: accIBR / NSIM,
    };

    setOut({
      totales: { GNT: accGNT, CT: accCT, DIT: accDIT, IBR: accIBR },
      promedios: proms,
      sims,
      params: { CBOD, CORD, CUI, CUA, PVU, NSIM, NMD },
    });
  }

  const input = { width: 120, padding: "6px" };
  const row = { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 260px))", gap: 12 };

  return (
    <div style={{ padding: 20, background: "#111", color: "#eee", minHeight: "100vh" }}>
      <h2>Simulación de Azúcar — Inventario</h2>

      <div style={{ ...row, margin: "12px 0" }}>
        <label>CBOD (cap. bodega):
          <input type="number" value={CBOD} onChange={(e) => setCBOD(Number(e.target.value))} style={input} />
        </label>
        <label>CORD (costo orden):
          <input type="number" value={CORD} onChange={(e) => setCORD(Number(e.target.value))} style={input} />
        </label>
        <label>CUI (costo inventario):
          <input type="number" step="0.01" value={CUI} onChange={(e) => setCUI(Number(e.target.value))} style={input} />
        </label>
        <label>CUA (costo almacenamiento):
          <input type="number" step="0.01" value={CUA} onChange={(e) => setCUA(Number(e.target.value))} style={input} />
        </label>
        <label>PVU (precio venta):
          <input type="number" step="0.01" value={PVU} onChange={(e) => setPVU(Number(e.target.value))} style={input} />
        </label>
        <label>NSIM (# simulaciones):
          <input type="number" min={1} value={NSIM} onChange={(e) => setNSIM(Number(e.target.value))} style={input} />
        </label>
        <label>NMD (# días por sim):
          <input type="number" min={1} value={NMD} onChange={(e) => setNMD(Number(e.target.value))} style={input} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <button onClick={simular} style={{ padding: "10px 15px" }}>Simular</button>
        <button onClick={goBack} style={{ padding: "10px 15px" }}>⬅ Volver al menú</button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={mostrarLog} onChange={(e) => setMostrarLog(e.target.checked)} />
          Mostrar log (lento)
        </label>
      </div>

      {out && (
        <div style={{ marginTop: 16 }}>
          <h3>Resultados (NSIM = {NSIM}, NMD = {NMD})</h3>
          <p><b>Totales</b> — GNT: {out.totales.GNT.toFixed(2)} Bs · CT: {out.totales.CT.toFixed(2)} Bs · DIT: {out.totales.DIT} · IBR: {out.totales.IBR.toFixed(2)} Bs</p>
          {NSIM > 1 && (
            <p><b>Promedios</b> — GNT: {out.promedios.GNT.toFixed(2)} Bs/día-sim · CT: {out.promedios.CT.toFixed(2)} · DIT: {out.promedios.DIT.toFixed(2)} · IBR: {out.promedios.IBR.toFixed(2)}</p>
          )}

          {mostrarLog && out.sims.map(s => (
            <details key={s.sim} style={{ marginTop: 10 }}>
              <summary>Simulación {s.sim} — GNT: {s.GNT.toFixed(2)} · CT: {s.CT.toFixed(2)} · DIT: {s.DIT}</summary>
              <div style={{ maxHeight: 240, overflow: "auto", border: "1px solid #333", padding: 10, marginTop: 6 }}>
                {s.log?.map((line, i) => (
                  <div key={i} style={{ fontFamily: "monospace", fontSize: 13 }}>{line}</div>
                ))}
                {s.TENTFinal > 0 && <div style={{ marginTop: 8, color: "#bbb" }}>
                  Ojo: quedó un pedido en tránsito al final (faltaban {s.TENTFinal} día/s).
                </div>}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
