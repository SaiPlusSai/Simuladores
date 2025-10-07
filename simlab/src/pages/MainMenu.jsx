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
    background: "linear-gradient(135deg, #111, #1c1c1c)",
    color: "#eee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  title: {
    marginBottom: "40px",
    fontSize: "2.5rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  },
  buttons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "900px",
    justifyItems: "center", // 👈 centra cada botón en su celda
  },
  btn: {
    padding: "18px 25px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #2d2d2d, #3a3a3a)",
    color: "#eee",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    width: "100%", // 👈 se estira dentro de su celda
    maxWidth: "260px", // 👈 límite para que no se vea gigante
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
};

// efecto hover con JS
Object.assign(styles.btn, {
  ":hover": {
    background: "linear-gradient(145deg, #444, #555)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
  },
});
