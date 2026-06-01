# Proyecto Kryze Mode

## Descripción breve

Tienda web simple con panel de administración local, carrito de compras y login de administrador. El proyecto usa HTML, CSS y JavaScript, y guarda datos en el navegador con `localStorage` y `sessionStorage`.

---

## Estructura principal

- `administrador.html` - panel de administración
- `clientes.html` - tienda de clientes
- `carrito.html` - página de carrito / checkout
- `login.html` - acceso de administrador
- `css/` - estilos por página
- `js/` - scripts de la aplicación
- `img/` - imágenes de productos

---

## Cómo ejecutar

1. Abrir el archivo `clientes.html` en el navegador para ver la tienda.
2. Abrir `login.html` para iniciar sesión como administrador.
3. Desde `administrador.html`, crear y administrar categorías, productos y pedidos.
4. Si quieres ver el carrito con comportamiento dinámico, agrega en `carrito.html` la línea:
   ```html
   <script src="/js/carrito.js"></script>
   ```

---

## Qué hace cada archivo

### `js/clientes.js`

- Crea productos predeterminados si no existen en `localStorage`
- Dibuja tarjetas de producto en `clientes.html`
- Filtra productos por búsqueda
- Administra el carrito en `localStorage`
- Actualiza el contador y muestra el modal de carrito
- Permite cambiar cantidad o eliminar artículos

### `js/login.js`

- Valida credenciales fijas:
  - usuario: `admin@mail.com`
  - contraseña: `123456`
- Guarda `kryze_admin_logged` en `sessionStorage`
- Redirige a `administrador.html` si el login es correcto

### `js/administrador.js`

- Crea datos iniciales de categorías y productos
- Cambia las pestañas del panel lateral
- Administra modales para agregar categorías y productos
- Renderiza tablas de categorías y productos
- Crea, actualiza y elimina productos y categorías
- Muestra pedidos guardados en `kryze_pedidos_admin`
- Despacha y elimina pedidos

### `js/carrito.js`

- Maneja productos desde `kryze_productos`
- Guarda la última página de producto en `sessionStorage`
- Define un componente `product-card`
- Renderiza productos y controla el carrito
- No se ejecuta automáticamente en `carrito.html` hasta agregar el script

---

## Claves usadas en `localStorage` / `sessionStorage`

- `kryze_categorias`
- `kryze_productos`
- `kryze_carrito`
- `kryze_pedidos_admin`
- `kryze_admin_logged`
- `lastProductPage`

---

## Notas importantes

- No hay backend; toda la lógica es del lado del cliente.
- Los cambios en administración permanecen solo en el navegador donde se ejecuta.
- `carrito.html` muestra la maqueta del carrito, pero necesita cargar `js/carrito.js` para funcionar.
- `js/carrito.js` hace referencia a `producto.html` y `producto2.html`, archivos que actualmente no están en esta carpeta.
