/**
 * EVENTO PRINCIPAL: Se ejecuta automáticamente cuando el navegador termina
 * de cargar toda la estructura HTML de la página del carrito.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Guardamos la dirección (URL) de la página de la que viene el usuario
  const referrer = document.referrer;

  // Evaluamos si el usuario venía específicamente de la página de producto 2
  if (referrer.includes("producto2.html")) {
    // Guardamos en la memoria de la sesión que la última página fue producto2.html
    sessionStorage.setItem("lastProductPage", "producto2.html");
  }
  // Si no venía de la 2, evaluamos si venía de la página de producto 1
  else if (referrer.includes("producto.html")) {
    // Guardamos en la memoria de la sesión que la última página fue producto.html
    sessionStorage.setItem("lastProductPage", "producto.html");
  }

  // Recuperamos la página que guardamos arriba. Si no hay ninguna guardada,
  // usamos 'producto.html' como la página de regreso por defecto.
  const lastPage = sessionStorage.getItem("lastProductPage") || "producto.html";

  // Buscamos los elementos visuales de redirección (enlaces/botones) en el HTML usando sus IDs
  const topBackLink = document.getElementById("navBackLink");
  const panelBackButton = document.getElementById("btnBackDynamic");

  // Si el enlace superior existe en la página, le asignamos la URL de regreso
  if (topBackLink) {
    topBackLink.setAttribute("href", lastPage);
  }

  // Si el botón del panel existe en la página, también le asignamos la URL de regreso
  if (panelBackButton) {
    panelBackButton.setAttribute("href", lastPage);
  }
});
