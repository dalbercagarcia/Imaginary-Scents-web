// Imaginary Scents — modo claro/oscuro
const THEME_STORAGE_KEY = 'imaginary-scents-theme';

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem(THEME_STORAGE_KEY, tema);

  const toggle = document.getElementById('theme-toggle');
  toggle.setAttribute('aria-label', tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

function cerrarSelectorTema() {
  document.getElementById('theme-modal').hidden = true;
  document.getElementById('theme-backdrop').hidden = true;
}

function initTheme() {
  const guardado = localStorage.getItem(THEME_STORAGE_KEY);

  if (guardado === 'dark' || guardado === 'light') {
    aplicarTema(guardado);
  } else {
    // Primera visita: no hay preferencia guardada, se pregunta.
    document.getElementById('theme-modal').hidden = false;
    document.getElementById('theme-backdrop').hidden = false;
  }

  document.querySelectorAll('.theme-opcion').forEach((btn) => {
    btn.addEventListener('click', () => {
      aplicarTema(btn.dataset.theme);
      cerrarSelectorTema();
    });
  });

  // Si cierran sin elegir, se queda en modo claro por defecto.
  document.getElementById('theme-backdrop').addEventListener('click', () => {
    if (!document.documentElement.getAttribute('data-theme')) {
      aplicarTema('light');
    }
    cerrarSelectorTema();
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  });
}

document.addEventListener('DOMContentLoaded', initTheme);
