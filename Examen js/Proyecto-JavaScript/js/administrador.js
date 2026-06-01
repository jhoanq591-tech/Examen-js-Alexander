document.addEventListener('DOMContentLoaded', function() {
    
    // --- DATOS POR DEFECTO (Para no iniciar vacío) ---
    if (!localStorage.getItem('kryze_categorias')) {
        const catDefecto = [
            { id: 1, nombre: "Calzado Urbano", descripcion: "Zapatillas de diseño exclusivo" },
            { id: 2, nombre: "Ropa", descripcion: "Prendas urbanas de alto rendimiento" }
        ];
        localStorage.setItem('kryze_categorias', JSON.stringify(catDefecto));
    }

    if (!localStorage.getItem('kryze_productos')) {
        const prodDefecto = [
            { codigo: "KZ-TECH", nombre: "Kryze Tech", categoria: "Ropa", precio: 350000, stock: 8, imagen: "/img/kz tech.png", descripcion: "Chándal técnico premium" },
            { codigo: "KZ-ONE", nombre: "Kryze One", categoria: "Ropa", precio: 280000, stock: 3, imagen: "/img/conjunto 2 kryze.png", descripcion: "Conjunto urbano de algodón" }
        ];
        localStorage.setItem('kryze_productos', JSON.stringify(prodDefecto));
    }

    // --- NAV LATERAL ---
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-link').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.sub-screen').forEach(screen => screen.classList.remove('active'));
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- FUNCIONES INTERFAZ MODALES ---
    window.abrirModal = function(id) {
        document.getElementById(id).style.display = 'flex';
        if(id === 'modal-producto') actualizarSelectCategorias();
    };
    window.cerrarModal = function(id) {
        document.getElementById(id).style.display = 'none';
    };

    function actualizarSelectCategorias() {
        const categorias = JSON.parse(localStorage.getItem('kryze_categorias')) || [];
        const select = document.getElementById('prod-categoria');
        if(select) {
            select.innerHTML = categorias.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        }
    }

    // --- CRUD: CATEGORÍAS ---
    function renderCategorias() {
        const categorias = JSON.parse(localStorage.getItem('kryze_categorias')) || [];
        const tabla = document.getElementById('tabla-categorias');
        if (!tabla) return;
        tabla.innerHTML = categorias.map((c, index) => `
            <tr>
                <td>#${c.id}</td>
                <td><strong>${c.nombre}</strong></td>
                <td>${c.descripcion}</td>
                <td>
                    <button class="btn-danger" onclick="eliminarCategoria(${index})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    document.getElementById('form-categoria').addEventListener('submit', function(e) {
        e.preventDefault();
        const categorias = JSON.parse(localStorage.getItem('kryze_categorias')) || [];
        const nueva = {
            id: categorias.length + 1,
            nombre: document.getElementById('cat-nombre').value,
            descripcion: document.getElementById('cat-descripcion').value
        };
        categorias.push(nueva);
        localStorage.setItem('kryze_categorias', JSON.stringify(categorias));
        this.reset();
        cerrarModal('modal-categoria');
        renderCategorias();
    });

    window.eliminarCategoria = function(index) {
        let categorias = JSON.parse(localStorage.getItem('kryze_categorias'));
        categorias.splice(index, 1);
        localStorage.setItem('kryze_categorias', JSON.stringify(categorias));
        renderCategorias();
    };

    // --- CRUD: PRODUCTOS ---
    function renderProductos() {
        const productos = JSON.parse(localStorage.getItem('kryze_productos')) || [];
        const tabla = document.getElementById('tabla-productos');
        if (!tabla) return;
        tabla.innerHTML = productos.map((p, index) => `
            <tr>
                <td>${p.codigo}</td>
                <td><img src="${p.imagen}" style="width:40px; height:40px; object-fit:contain; background:#000; border-radius:4px;"></td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria}</td>
                <td>$${p.precio.toLocaleString('es-CO')}</td>
                <td style="color: ${p.stock === 0 ? '#ff1e27' : '#fff'}; font-weight:bold;">${p.stock} uds</td>
                <td>
                    <button class="btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    document.getElementById('form-producto').addEventListener('submit', function(e) {
        e.preventDefault();
        let productos = JSON.parse(localStorage.getItem('kryze_productos')) || [];
        
        const nuevo = {
            codigo: document.getElementById('prod-codigo').value.toUpperCase(),
            nombre: document.getElementById('prod-nombre').value,
            categoria: document.getElementById('prod-categoria').value,
            precio: parseInt(document.getElementById('prod-precio').value),
            stock: parseInt(document.getElementById('prod-stock').value),
            imagen: document.getElementById('prod-imagen').value,
            descripcion: document.getElementById('prod-descripcion').value
        };

        // Si el código ya existe, sobreescribe (Actualiza), si no, lo agrega
        const indexExistente = productos.findIndex(p => p.codigo === nuevo.codigo);
        if(indexExistente > -1) {
            productos[indexExistente] = nuevo;
        } else {
            productos.push(nuevo);
        }

        localStorage.setItem('kryze_productos', JSON.stringify(productos));
        this.reset();
        cerrarModal('modal-producto');
        renderProductos();
    });

    window.eliminarProducto = function(index) {
        let productos = JSON.parse(localStorage.getItem('kryze_productos'));
        productos.splice(index, 1);
        localStorage.setItem('kryze_productos', JSON.stringify(productos));
        renderProductos();
    };

    // --- CONTROL DE PEDIDOS ---
    function renderPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('kryze_pedidos_admin')) || [];
        const contenedor = document.getElementById('mod-productos');
        if (!contenedor) return;

        contenedor.innerHTML = `<h2>Pedidos Recibidos</h2>`;
        if (pedidos.length === 0) {
            contenedor.innerHTML += `<p style="color:#555; padding:20px;">No hay pedidos registrados.</p>`;
            return;
        }

        pedidos.forEach((p, index) => {
            let articulosHTML = p.articulos.map(art => `
                <div style="background:#1a1a1a; padding:10px; margin:5px 0; font-size:13px; display:flex; justify-content:space-between;">
                    <span><strong>${art.nombre}</strong> (Talla: ${art.talla} / Col: ${art.color})</span>
                    <span>x${art.cantidad} — $${(art.precio * art.cantidad).toLocaleString('es-CO')}</span>
                </div>
            `).join('');

            contenedor.innerHTML += `
                <div class="order-detail-card" style="border: 1px solid #333; margin-top:15px; padding:15px;">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #222; padding-bottom:8px;">
                        <span><strong>Orden: ${p.id}</strong> - ${p.fecha}</span>
                        <span style="color:#e50914; font-weight:bold;">Total: $${p.total.toLocaleString('es-CO')}</span>
                    </div>
                    <div style="margin:10px 0;">${articulosHTML}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Estado: <strong style="color:#ffcc00">${p.estado}</strong></span>
                        <div>
                            ${p.estado === 'Pendiente' ? `<button class="btn-primary" style="padding:4px 10px; font-size:12px;" onclick="despacharPedido(${index})">Despachar</button>` : ''}
                            <button class="btn-secondary" style="padding:4px 10px; font-size:12px; margin-left:10px;" onclick="eliminarPedido(${index})">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    window.despacharPedido = function(index) {
        let pedidos = JSON.parse(localStorage.getItem('kryze_pedidos_admin'));
        pedidos[index].estado = "Despachado";
        localStorage.setItem('kryze_pedidos_admin', JSON.stringify(pedidos));
        renderPedidos();
    };

    window.eliminarPedido = function(index) {
        let pedidos = JSON.parse(localStorage.getItem('kryze_pedidos_admin'));
        pedidos.splice(index, 1);
        localStorage.setItem('kryze_pedidos_admin', JSON.stringify(pedidos));
        renderPedidos();
    };

    // --- CARGA INICIAL ---
    renderCategorias();
    renderProductos();
    renderPedidos();
});