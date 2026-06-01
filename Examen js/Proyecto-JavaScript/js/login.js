function handleLogin() {
  // Capturamos los campos del HTML
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;

  // Validación de credenciales
  if (user === "admin@mail.com" && pass === "123456") {
    // 1. Guardamos la llave mágica en la sesión para que el administrador sepa que pasamos
    sessionStorage.setItem("kryze_admin_logged", "true");

    // 2. Redirigimos al panel de administración con ruta relativa correcta
    window.location.href = "./administrador.html";
  } else {
    alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
  }
}
