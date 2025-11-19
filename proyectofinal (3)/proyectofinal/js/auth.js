document.addEventListener('DOMContentLoaded', function () {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  // Si la página exige autenticación (body[data-protect="true"]) y no hay sesión, redirige
  const needsAuth = document.body.getAttribute('data-protect') === 'true';
  if (needsAuth && !isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }

  // Si estás en login y ya estás autenticado, llevar a principal
  if (location.pathname.includes('login.html') && isLoggedIn) {
    window.location.href = 'principal.html';
    return;
  }
});
