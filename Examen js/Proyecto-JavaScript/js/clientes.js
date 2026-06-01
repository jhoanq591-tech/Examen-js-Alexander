// --- VARIABLES GLOBALES DEL CARRITO Y TIENDA ---
window.productosColeccion = [];
function obtenerProductos() {
  const productos = JSON.parse(localStorage.getItem("kryze_productos")) || [];

  if (productos.length === 0) {
    const inicial = [
      {
        codigo: "KZ-TECH",
        nombre: "Kryze Tech",
        categoria: "Ropa",
        precio: 350000,
        stock: 8,
        imagen: "/img/kz tech.png",
        descripcion: "Chándal técnico premium",
      },
      {
        codigo: "KZ-ONE",
        nombre: "Kryze One",
        categoria: "Ropa",
        precio: 280000,
        stock: 3,
        imagen: "/img/conjunto 2 kryze.png",
        descripcion: "Conjunto urbano de algodón",
      },
    ];
    localStorage.setItem("kryze_productos", JSON.stringify(inicial));
    return inicial;
  }
  return productos;
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("kryze_carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("kryze_carrito", JSON.stringify(carrito));
}

// --- COMPONENTE WEB PERSONALIZADO ---
class ProductCard extends HTMLElement {
  connectedCallback() {
    const code = this.dataset.code;
    const producto = window.productosColeccion.find(function (item) {
      return item.codigo === code;
    });

    if (!producto) return;

    this.innerHTML = `
            <div class="card" data-category="${producto.categoria.toLowerCase()}">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="info">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.descripcion}</p>
                    <h3>$${producto.precio.toLocaleString("es-CO")} COP</h3>
                    <div class="card-actions">
                        <button type="button" onclick="agregarAlCarrito('${producto.codigo}')">Añadir al carrito</button>
                        <a class="btn-1" href="./productos.html?code=${encodeURIComponent(producto.codigo)}">Ver detalle</a>
                    </div>
                </div>
            </div>
        `;
  }
}
customElements.define("product-card", ProductCard);

// --- PROCESAMIENTO DINÁMICO DEL CATÁLOGO ---
function renderizarProductos() {
  const container = document.getElementById("productos-container");
  if (!container) return;

  window.productosColeccion = obtenerProductos();

  const searchInput = document.getElementById("kryze-search");
  const textoBusqueda = searchInput ? searchInput.value.toLowerCase() : "";

  container.innerHTML = "";
  let productosDibujados = 0;

  window.productosColeccion.forEach(function (producto) {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(textoBusqueda);
    const coincideCategoria = producto.categoria
      .toLowerCase()
      .includes(textoBusqueda);

    if (coincideNombre || coincideCategoria) {
      const cardComponent = document.createElement("product-card");
      cardComponent.dataset.code = producto.codigo;
      container.appendChild(cardComponent);
      productosDibujados++;
    }
  });

  if (productosDibujados === 0) {
    container.innerHTML =
      '<p class="no-results">No se encontraron artículos tácticos bajo ese criterio.</p>';
  }
}

// --- OPERACIONES DEL CARRITO ---
function agregarAlCarrito(codigo) {
  const producto = window.productosColeccion.find(function (item) {
    return item.codigo === codigo;
  });

  if (!producto) return;

  if (producto.stock <= 0) {
    alert(
      "Lo sentimos, esta prenda se encuentra temporalmente agotada en nuestros almacenes.",
    );
    return;
  }

  let carrito = obtenerCarrito();
  const articuloExistente = carrito.find(function (item) {
    return item.codigo === codigo;
  });

  if (articuloExistente) {
    if (articuloExistente.cantidad + 1 > producto.stock) {
      alert(
        `Límite máximo alcanzado. Solo quedan ${producto.stock} unidades de este artículo.`,
      );
      return;
    }
    articuloExistente.cantidad = articuloExistente.cantidad + 1;
  }
  {
    if (!articuloExistente) {
      carrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        talla: "M",
        color: "Estándar",
        cantidad: 1,
      });
    }
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
  renderizarCarrito();
  toggleCartModal(true);
}

function modificarCantidad(index, cambio) {
  let carrito = obtenerCarrito();
  const articulo = carrito[index];
  if (!articulo) return;

  const productoMaster = obtenerProductos().find(function (p) {
    return p.codigo === articulo.codigo;
  });

  const nuevaCantidad = articulo.cantidad + cambio;

  if (nuevaCantidad <= 0) {
    carrito.splice(index, 1);
  } else if (productoMaster && nuevaCantidad > productoMaster.stock) {
    alert(
      `Operación denegada. Solo hay ${productoMaster.stock} unidades disponibles en el inventario.`,
    );
    return;
  } else {
    articulo.cantidad = nuevaCantidad;
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
  renderizarCarrito();
}

function eliminarCarrito(index) {
  let carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  renderizarCarrito();
}

// --- ANIMACIÓN Y VISIBILIDAD ---
function toggleCartModal(mostrar) {
  const modal = document.getElementById("cartModal");
  if (!modal) return;

  if (mostrar) {
    modal.classList.add("active");
  } else {
    modal.classList.remove("active");
    toggleCheckoutForm(false);
  }
}

function toggleCheckoutForm(mostrar) {
  const formPanel = document.getElementById("checkoutFormSection");
  if (!formPanel) return;

  if (mostrar) {
    formPanel.classList.add("active");
    document.getElementById("cliente-nombre")?.focus();
  } else {
    formPanel.classList.remove("active");
  }
}

// --- PROCESAMIENTO GENERAL DE LA COMPRA ---
function actualizarContadorCarrito() {
  const contador = document.getElementById("cartCount");
  if (!contador) return;

  const carrito = obtenerCarrito();
  let totalUnidades = 0;
  carrito.forEach(function (item) {
    totalUnidades = totalUnidades + item.cantidad;
  });
  contador.textContent = totalUnidades;
}

function renderizarCarrito() {
  const contenedorCuerpo = document.getElementById("cartItemsBody");
  const contenedorTotal = document.getElementById("cartTotalValue");
  if (!contenedorCuerpo || !contenedorTotal) return;

  const carrito = obtenerCarrito();
  contenedorCuerpo.innerHTML = "";
  let sumaTotalDinero = 0;

  carrito.forEach(function (item, index) {
    const subtotalArticulo = item.precio * item.cantidad;
    sumaTotalDinero = sumaTotalDinero + subtotalArticulo;

    const elementoItem = document.createElement("div");
    elementoItem.className = "cart-item";
    elementoItem.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-item-details">
                <h4>${item.nombre}</h4>
                <p>Talla: ${item.talla} | Color: ${item.color}</p>
                <div class="cart-item-row">
                    <div class="cart-qty-controls">
                        <button type="button" onclick="modificarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button type="button" onclick="modificarCantidad(${index}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">$${subtotalArticulo.toLocaleString("es-CO")}</span>
                </div>
            </div>
        `;
    contenedorCuerpo.appendChild(elementoItem);
  });

  contenedorTotal.textContent = `$${sumaTotalDinero.toLocaleString("es-CO")} COP`;
}

function manejarCheckout(event) {
  event.preventDefault();
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;

  let productosInventario = obtenerProductos();

  for (let i = 0; i < carrito.length; i++) {
    const itemCarrito = carrito[i];
    const prodMaestro = productosInventario.find(function (p) {
      return p.codigo === itemCarrito.codigo;
    });

    if (!prodMaestro || prodMaestro.stock < itemCarrito.cantidad) {
      alert(
        `Conflicto de reservas: El artículo "${itemCarrito.nombre}" ya no cuenta con el stock solicitado.`,
      );
      return;
    }
  }

  let total = 0;
  carrito.forEach(function (item) {
    const prodMaestro = productosInventario.find(function (p) {
      return p.codigo === item.codigo;
    });
    if (prodMaestro) {
      prodMaestro.stock = prodMaestro.stock - item.cantidad;
    }
    total = total + item.precio * item.cantidad;
  });

  localStorage.setItem("kryze_productos", JSON.stringify(productosInventario));

  let pedidos = JSON.parse(localStorage.getItem("kryze_pedidos_admin")) || [];
  const cliente = {
    nombre: document.getElementById("cliente-nombre").value,
    email: document.getElementById("cliente-email").value,
    telefono: document.getElementById("cliente-telefono").value,
    direccion: document.getElementById("cliente-direccion").value,
    ciudad: document.getElementById("cliente-ciudad").value,
    estado: document.getElementById("cliente-estado").value,
  };

  pedidos.push({
    codigoPedido: "OR-" + Date.now().toString().slice(-6),
    fechaISO: new Date().toISOString(),
    fechaTexto: new Date().toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    }),
    total: total,
    cliente: cliente,
    articulos: carrito,
    estado: "Pendiente",
  });

  localStorage.setItem("kryze_pedidos_admin", JSON.stringify(pedidos));
  guardarCarrito([]);
  actualizarContadorCarrito();
  renderizarCarrito();
  toggleCheckoutForm(false);
  toggleCartModal(false);
  renderizarProductos();
  alert(
    "¡Pedido recibido con éxito! El sistema K-99 ha registrado tu orden. Muchas gracias por tu compra.",
  );
}

function inicializarUI() {
  renderizarProductos();
  actualizarContadorCarrito();
  renderizarCarrito();

  document
    .getElementById("kryze-search")
    ?.addEventListener("input", renderizarProductos);
  document
    .getElementById("openCartBtn")
    ?.addEventListener("click", function () {
      toggleCartModal(true);
    });
  document
    .getElementById("checkoutFormElement")
    ?.addEventListener("submit", manejarCheckout);
  document
    .querySelector("#cartModal .modal-close")
    ?.addEventListener("click", function () {
      toggleCartModal(false);
    });

  window.addEventListener("click", function (event) {
    const modal = document.getElementById("cartModal");
    if (event.target === modal) {
      toggleCartModal(false);
    }
  });
}

window.agregarAlCarrito = agregarAlCarrito;
window.modificarCantidad = modificarCantidad;
window.eliminarCarrito = eliminarCarrito;
window.toggleCartModal = toggleCartModal;
window.toggleCheckoutForm = toggleCheckoutForm;

document.addEventListener("DOMContentLoaded", inicializarUI);