import { useState } from "react";
import { productos } from "./data/productos";

function App() {
  const [cantidades, setCantidades] = useState({});
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pago, setPago] = useState("");

  // ===== CANTIDADES =====
  const sumarChipa = (id) => {
    setCantidades((prev) => ({ ...prev, [id]: (prev[id] || 0) + 6 }));
  };

  const restarChipa = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 6, 0),
    }));
  };

  const sumarPostre = (id) => {
    setCantidades((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const restarPostre = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const chipas = productos.filter((p) => p.categoria === "Chipá congelado");
  const postres = productos.filter((p) => p.categoria === "Postres");

  const totalChipas = chipas.reduce(
    (acc, p) => acc + (cantidades[p.id] || 0),
    0
  );

  const totalPostres = postres.reduce(
    (acc, p) => acc + (cantidades[p.id] || 0),
    0
  );

  // ===== ENVÍO =====
  let envio = 0;
  if (totalChipas === 12 && totalPostres === 0) envio = 500;

  // ===== TOTAL =====
  const totalProductos = productos.reduce((acc, p) => {
    const cantidad = cantidades[p.id] || 0;
    if (p.categoria === "Chipá congelado") {
      return acc + (p.precio / 12) * cantidad;
    }
    return acc + cantidad * p.precio;
  }, 0);

  const total = totalProductos + envio;

  // ===== VALIDACIÓN =====
  const pedidoValido =
    (totalChipas === 0 && totalPostres >= 1) ||
    (totalChipas >= 12 && totalChipas % 6 === 0);

  const chipaIncompleto =
    totalChipas > 0 && (totalChipas < 12 || totalChipas % 6 !== 0);

  const faltanChipas =
    totalChipas > 0 && totalChipas < 12 ? 12 - totalChipas : 0;

  const enviarWhatsApp = () => {
    let mensaje = `Hola! 👋\nMi nombre es ${nombre}\n\nPedido:\n`;

    productos.forEach((p) => {
      if (cantidades[p.id] > 0) {
        mensaje += `- ${p.nombre}: ${cantidades[p.id]}\n`;
      }
    });

    mensaje += `\nTotal: $${total}\n`;
    mensaje += `Forma de pago: ${pago}\n`;
    mensaje += `\nDirección:\n${direccion}`;

    window.open(
      `https://wa.me/543775419332?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <div style={appBackground}>
      <div style={container}>

        {/* HEADER CON LOGO */}
        <div style={header}>
          <img
            src="/logo-catalana-v2.png"
            alt="Catalana"
            style={logo}
          />
        </div>

        {/* CHIPÁ */}
        <section>
          <h2 style={sectionTitle}>Chipá congelado</h2>

          {chipas.map((p) => (
            <div key={p.id} style={card}>
              <div>
                <strong>{p.nombre}</strong>
                <p style={price}>Docena: ${p.precio}</p>
              </div>

              <div>
                <button style={btn} onClick={() => restarChipa(p.id)}>−</button>
                <span style={qty}>{cantidades[p.id] || 0}</span>
                <button style={btn} onClick={() => sumarChipa(p.id)}>+</button>
              </div>
            </div>
          ))}

          {chipaIncompleto && (
            <p style={warning}>
              ⚠️ Te faltan {faltanChipas} chipás para completar la docena
            </p>
          )}
        </section>

        <hr style={divider} />

        {/* POSTRES */}
        <section>
          <h2 style={sectionTitle}>Postres</h2>

          {postres.map((p) => (
            <div key={p.id} style={card}>
              <div>
                <strong>{p.nombre}</strong>
                <p style={price}>${p.precio}</p>
              </div>

              <div>
                <button style={btn} onClick={() => restarPostre(p.id)}>−</button>
                <span style={qty}>{cantidades[p.id] || 0}</span>
                <button style={btn} onClick={() => sumarPostre(p.id)}>+</button>
              </div>
            </div>
          ))}
        </section>

        <hr style={divider} />

        {/* DATOS */}
        <section>
          <h2 style={sectionTitle}>Datos</h2>
          <input
            style={input}
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            style={input}
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </section>

        {/* PAGO */}
        <section>
          <h2 style={sectionTitle}>Forma de pago</h2>

          <label>
            <input
              type="radio"
              name="pago"
              value="Efectivo"
              onChange={(e) => setPago(e.target.value)}
            />{" "}
            Efectivo
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="pago"
              value="Transferencia"
              onChange={(e) => setPago(e.target.value)}
            />{" "}
            Transferencia
          </label>

          {pago === "Transferencia" && (
            <div style={infoBox}>
              <p><strong>Alias:</strong> catalana.mc</p>
              <p><strong>Titular:</strong> Luis Marcelo Benítez</p>
              <p style={small}>
                No te olvides de enviar el comprobante por WhatsApp
              </p>
            </div>
          )}
        </section>

        <hr style={divider} />

        {/* RESUMEN */}
        <section>
          <h2 style={sectionTitle}>Resumen</h2>

          <div style={summaryBox}>
            {productos.some((p) => cantidades[p.id] > 0) ? (
              <>
                {productos.map((p) =>
                  cantidades[p.id] > 0 ? (
                    <p key={p.id}>
                      {p.nombre}: {cantidades[p.id]}
                    </p>
                  ) : null
                )}

                <hr style={{ margin: "12px 0" }} />
                <p>Envío: ${envio}</p>
                <p style={totalStyle}>Total: ${total}</p>
              </>
            ) : (
              <p style={{ color: "#777" }}>
                Todavía no agregaste productos
              </p>
            )}
          </div>
        </section>

        <button
          style={btnWhats}
          disabled={!pedidoValido || !nombre || !direccion || !pago}
          onClick={enviarWhatsApp}
        >
          Confirmar pedido por WhatsApp
        </button>

      </div>
    </div>
  );
}

/* ===== ESTILOS ===== */

const appBackground = {
  minHeight: "100vh",
  backgroundColor: "#0097b2",
  paddingTop: "24px",
};

const header = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "32px",
};

const logo = {
  width: "160px",
  maxWidth: "80%",
};

const container = {
  maxWidth: "480px",
  margin: "auto",
  padding: "0 16px 110px",
  fontFamily: "system-ui, sans-serif",
  color: "#111",
};

const sectionTitle = {
  marginTop: "24px",
  marginBottom: "12px",
  fontSize: "18px",
  fontWeight: "600",
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
};

const price = { fontSize: "14px", color: "#555" };
const btn = { padding: "6px 14px", fontSize: "18px" };
const qty = { margin: "0 12px", fontSize: "20px", fontWeight: "600" };

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const warning = {
  color: "#ffffff",
  fontSize: "14px",
  marginTop: "8px",
  fontWeight: "500"
};

const infoBox = {
  backgroundColor: "#eef6f6",
  padding: "14px",
  borderRadius: "10px",
  marginTop: "10px",
};

const small = { fontSize: "13px", color: "#555" };

const summaryBox = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
};

const totalStyle = {
  marginTop: "12px",
  fontSize: "20px",
  fontWeight: "700",
};

const divider = {
  border: "none",
  height: "1px",
  backgroundColor: "#eee",
  margin: "28px 0",
};

const btnWhats = {
  position: "fixed",
  bottom: "16px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "calc(100% - 32px)",
  maxWidth: "480px",
  padding: "16px",
  backgroundColor: "#25D366",
  color: "white",
  border: "none",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: "600",
  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
};

export default App;




















