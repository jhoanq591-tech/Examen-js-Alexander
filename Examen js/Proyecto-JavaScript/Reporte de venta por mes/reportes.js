
function renderPedidos() {
  const pedidos = JSON.parse(localStorage.getItem("kryze_pedidos_admin")) || [];
  const contenedor = document.getElementById("mod-reportes");
  if (!contenedor) return;

  contenedor.innerHTML = `<h2>Reportes</h2>`;
  if (pedidos.length === 0) {
    contenedor.innerHTML += `<p style="color:#555; padding:20px;">No hay reportes registrados.</p>`;
    return;
  }

  pedidos.forEach((p, index) => {
    let articulosHTML = p.articulos
      .map(
        (art) => `
                <div style="background:#1a1a1a; padding:10px; margin:5px 0; font-size:13px; display:flex; justify-content:space-between;">
                    <span><strong>${art.nombre}</strong> (Talla: ${
          art.talla
        } / Col: ${art.color})</span>
                    <span>x${art.cantidad} — $${(
          art.precio * art.cantidad
        ).toLocaleString("es-CO")}</span>
                </div>
            `
      )
      .join("");

    contenedor.innerHTML += `
                <div class="order-detail-card" style="border: 1px solid #333; margin-top:15px; padding:15px;">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #222; padding-bottom:8px;">
                        <span><strong>Orden: ${p.id}</strong> - ${
      p.fecha
    }</span>
                        <span style="color:#e50914; font-weight:bold;">Total: $${p.total.toLocaleString(
                          "es-CO"
                        )}</span>
                    </div>
                    <div style="margin:10px 0;">${articulosHTML}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Estado: <strong style="color:#ffcc00">${
                          p.estado
                        }</strong></span>
                        <div>
                            ${
                              p.estado === "Pendiente"
                                ? `<button class="btn-primary" style="padding:4px 10px; font-size:12px;" onclick="despacharPedido(${index})">Despachar</button>`
                                : ""
                            }
                            <button class="btn-secondary" style="padding:4px 10px; font-size:12px; margin-left:10px;" onclick="eliminarPedido(${index})">Eliminar recibo</button>
                        </div>
                    </div>
                </div>
            `;
  });
}