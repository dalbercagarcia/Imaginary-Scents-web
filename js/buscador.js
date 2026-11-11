// Imaginary Scents — Buscador: botón "borrar todo" + sugerencias al escribir.
// Sugiere nombres de perfumes y marcas cuyo inicio (o el de alguna palabra) coincide.

const SUG_MAX = 6;
let sugActivo = -1;

function sugNorm(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function sugEmpieza(texto, q) {
  const n = sugNorm(texto);
  return n.startsWith(q) || n.split(/[\s\-'’]+/).some((w) => w.startsWith(q));
}

function sugCalcular(textoCrudo) {
  const q = sugNorm(textoCrudo.trim());
  if (!q) return [];
  const marcas = [...new Set(PRODUCTS.map((p) => p.marca))]
    .filter((m) => sugEmpieza(m, q))
    .sort((a, b) => Number(sugNorm(b).startsWith(q)) - Number(sugNorm(a).startsWith(q)) || a.localeCompare(b, 'es'))
    .slice(0, 2)
    .map((m) => ({ tipo: 'marca', texto: m, extra: 'Marca' }));
  const perfumes = PRODUCTS
    .filter((p) => sugEmpieza(p.nombre, q))
    .sort((a, b) => Number(sugNorm(b.nombre).startsWith(q)) - Number(sugNorm(a.nombre).startsWith(q)) || a.nombre.localeCompare(b.nombre, 'es'))
    .map((p) => ({ tipo: 'perfume', texto: p.nombre, extra: p.marca }));
  return [...marcas, ...perfumes].slice(0, SUG_MAX);
}

function sugResaltar(texto, q) {
  const n = sugNorm(texto);
  const qn = sugNorm(q.trim());
  // índice de inicio de palabra que coincide (el texto normalizado conserva la longitud)
  const m = [...n.matchAll(/[^\s\-'’]+/g)].find((x) => x[0].startsWith(qn));
  if (!m) return texto;
  const i = m.index;
  const f = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  return f(texto.slice(0, i)) + '<mark>' + f(texto.slice(i, i + qn.length)) + '</mark>' + f(texto.slice(i + qn.length));
}

function initBuscadorExtra() {
  const input = document.getElementById('buscador');
  const wrap = input && input.closest('.site-header__search-wrap');
  if (!input || !wrap) return;

  // Botón de borrar todo (también en celular)
  const limpiar = document.createElement('button');
  limpiar.type = 'button';
  limpiar.className = 'buscador-limpiar';
  limpiar.setAttribute('aria-label', 'Borrar búsqueda');
  limpiar.innerHTML = '&times;';
  limpiar.hidden = true;
  wrap.appendChild(limpiar);

  // Lista de sugerencias
  const lista = document.createElement('ul');
  lista.className = 'buscador-sugerencias';
  lista.id = 'buscador-sugerencias';
  lista.setAttribute('role', 'listbox');
  lista.hidden = true;
  wrap.appendChild(lista);
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-controls', 'buscador-sugerencias');

  function cerrar() { lista.hidden = true; sugActivo = -1; }

  function pintar() {
    const items = sugCalcular(input.value);
    if (!items.length) return cerrar();
    lista.innerHTML = items.map((s, i) => `
      <li role="option" class="buscador-sug ${s.tipo === 'marca' ? 'buscador-sug--marca' : ''}" data-texto="${s.texto.replace(/"/g, '&quot;')}" data-i="${i}">
        <span class="buscador-sug__texto">${sugResaltar(s.texto, input.value)}</span>
        <span class="buscador-sug__extra">${s.extra}</span>
      </li>`).join('');
    sugActivo = -1;
    lista.hidden = false;
  }

  function aplicar(texto) {
    input.value = texto;
    busquedaActual = texto;
    aplicarFiltros();
    cerrar();
    limpiar.hidden = false;
    input.blur();
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }

  function resaltarActivo() {
    [...lista.children].forEach((li, i) => li.classList.toggle('is-active', i === sugActivo));
  }

  input.addEventListener('input', () => { limpiar.hidden = input.value === ''; pintar(); });
  input.addEventListener('focus', () => { if (input.value.trim()) pintar(); });
  input.addEventListener('keydown', (e) => {
    if (lista.hidden) return;
    const n = lista.children.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); sugActivo = (sugActivo + 1) % n; resaltarActivo(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sugActivo = (sugActivo - 1 + n) % n; resaltarActivo(); }
    else if (e.key === 'Enter' && sugActivo >= 0) { e.preventDefault(); aplicar(lista.children[sugActivo].dataset.texto); }
    else if (e.key === 'Escape') cerrar();
  });

  // pointerdown evita que el input pierda el foco antes del clic
  lista.addEventListener('pointerdown', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    e.preventDefault();
    aplicar(li.dataset.texto);
  });

  limpiar.addEventListener('click', () => {
    input.value = '';
    busquedaActual = '';
    aplicarFiltros();
    limpiar.hidden = true;
    cerrar();
    input.focus();
  });

  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) cerrar(); });

  // Si el texto se cambia desde fuera (menú Marcas, "limpiar filtros"), sincroniza el botón
  setInterval(() => { limpiar.hidden = input.value === ''; }, 400);
}

document.addEventListener('DOMContentLoaded', initBuscadorExtra);
