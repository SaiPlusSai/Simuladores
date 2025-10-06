export default function MainMenu({ setPage }) {
  return (
    <main style={styles.main}>
      <h1 style={styles.title}>SimLab — Menú Principal</h1>
      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => setPage("montecarlo")}>
          Optimización Máxima (Ej. 1)
        </button>
        <button style={styles.btn} onClick={() => setPage("dados")}>
          Juego de Dados (Ej. 2)
        </button>
        <button style={styles.btn} onClick={() => setPage("ventas")}>
          Sim. Ventas por Día (Ej. 3)
        </button>
        <button style={styles.btn} onClick={() => setPage("huevos")}>
  Sim. Huevos y Pollos (Ej. 4)
</button>
        <button style={styles.btn} onClick={() => setPage("azucar")}>
  Inventario de Azúcar (Ej. 5)
</button>
        
        <button style={styles.btn} onClick={() => setPage("plazo")}>
  Plazo Fijo (Ej. 6)
</button>

      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#111",
    color: "#eee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: "40px",
    fontSize: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  buttons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  btn: {
    padding: "15px 25px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    background: "#333",
    color: "#eee",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
