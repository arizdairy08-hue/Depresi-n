document.addEventListener('DOMContentLoaded', function () {
  const userName = sessionStorage.getItem('userName') || '';

  const components = {
    navbar: `
      <nav class="navbar navbar-expand-lg navbar-dark bg-info shadow-sm">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="../proyectofinal/index.html">
            <i class="fas fa-leaf me-2"></i>
            <span class="fw-bold">Escuchar para Sanar</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
              <li class="nav-item"><a class="nav-link" href="../proyectofinal/principal.html">Principal</a></li>
              <li class="nav-item"><a class="nav-link" href="../proyectofinal/escuchate.html">Escúchate</a></li>
              <li class="nav-item"><a class="nav-link" href="../proyectofinal/audios.html">Audios</a></li>
            </ul>
            <div class="d-flex align-items-center ms-3">
              ${userName ? `
                <span class="me-3 text-muted">Hola, <strong>${userName}</strong></span>
                <button id="logoutBtn" class="btn btn-outline-light btn-sm">Cerrar sesión</button>
              ` : `
                <a class="btn btn-outline-light btn-sm me-2" href="../proyectofinal/login.html">Iniciar</a>
                <a class="btn btn-light btn-sm" href="../proyectofinal/login.html">Registro</a>
              `}
            </div>
          </div>
        </div>
      </nav>
    `,
    footer: `
      <footer class="bg-dark text-white mt-5">
        <div class="container py-4">
          <div class="row">
            <div class="col-md-6">
              <h6 class="fw-bold">Escuchar para Sanar</h6>
              <p class="small text-white-50">Recursos y acompañamiento en salud mental y bienestar emocional.</p>
            </div>
            <div class="col-md-3">
              <h6 class="fw-bold">Enlaces</h6>
              <ul class="list-unstyled small">
                <li><a href="../proyectofinal/escuchate.html" class="text-white-50">Escúchate</a></li>
                <li><a href="../proyectofinal/audios.html" class="text-white-50">Audios</a></li>
                <li><a href="../proyectofinal/principal.html" class="text-white-50">Principal</a></li>
              </ul>
            </div>
            <div class="col-md-3 text-md-end">
              <p class="small text-white-50 mb-1">© ${new Date().getFullYear()} Escuchar para Sanar</p>
              <p class="small text-white-50">Contacto: <a href="mailto:contacto@example.com" class="text-white-50">contacto@example.com</a></p>
            </div>
          </div>
        </div>
      </footer>
    `
  };

  document.querySelectorAll('[data-component]').forEach(function (el) {
    const name = el.getAttribute('data-component');
    if (components[name]) el.innerHTML = components[name];
  });

  // Logout handler (delegated)
  document.body.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'logoutBtn') {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userName');
      window.location.href = '../proyectofinal/login.html';
    }
  });
});
