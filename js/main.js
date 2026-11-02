// Imaginary Scents — comportamiento del header y carga/render del catálogo

// Menú hamburguesa (mobile): abre/cierra la navegación principal
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Cierra el menú al elegir una opción (útil en mobile)
mainNav.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Catálogo de productos
const CATEGORIA_LABELS = {
  nicho: 'Nicho',
  'diseñador': 'Diseñador',
  arabe: 'Árabe',
};

const FAMILIA_LABELS = {
  citrica: 'Cítrica',
  floral: 'Floral',
  amaderada: 'Amaderada',
  oriental: 'Oriental',
  fougere: 'Fougère',
  gourmand: 'Gourmand',
};

const TEMPORADA_LABELS = {
  calor: 'Primavera y verano',
  frio: 'Otoño e invierno',
  todo: 'Todo el año',
};

let PRODUCTS = [];

function formatPrecio(precio) {
  return `S/ ${precio.toFixed(2)}`;
}

const DIAS_RECIEN_LLEGADO = 30;

function esRecienLlegado(product) {
  if (!product.fechaIngreso) return false;
  const dias = (Date.now() - new Date(product.fechaIngreso).getTime()) / 86400000;
  return dias >= 0 && dias <= DIAS_RECIEN_LLEGADO;
}


const ICONOS_ESTACION = { Primavera: '🌸', Verano: '☀️', Otoño: '🍂', Invierno: '❄️' };
const ICONOS_MOMENTO = { 'Día': '🌞', 'Noche': '🌙', 'Día y noche': '🌞🌙' };

// Línea de datos: [Concentración] · [íconos de temporada] [texto] · [ícono de momento] [texto]
function crearLineaDatos(product) {
  if (!product.concentracion) return '';
  const est = product.estaciones || '';
  const iconosEst = est === '4 estaciones'
    ? '🌸☀️🍂❄️'
    : est.split(' – ').map((e) => ICONOS_ESTACION[e] ?? '').join('');
  const mom = product.momento || '';
  // Si el texto es largo, el momento pasa a una segunda línea (sin separador colgando)
  const largo = (product.concentracion.length + est.length) > 36;
  return `<p class="product-card__datos${largo ? ' product-card__datos--2l' : ''}">
    <span class="dato-conc">${product.concentracion}</span>
    <span class="dato-sep dato-sep--conc">·</span>
    <span class="dato-resto">
      <span class="dato-txt">${iconosEst} ${est}</span>
      <span class="dato-momento"><span class="dato-sep">·</span> <span title="${mom}" aria-label="${mom}">${ICONOS_MOMENTO[mom] ?? mom}</span></span>
    </span>
  </p>`;
}

// prefix: distingue ids cuando el mismo producto se repite en más de una
// grilla a la vez (ej. catálogo completo + Recién llegados), para que no
// haya ids duplicados en el DOM.
function crearTarjetaProducto(product, prefix = 'cat') {
  const variantes = product.variantes;
  const opciones = variantes
    .map((v) => `<option value="${v.ml}">${v.ml}ml — ${formatPrecio(v.precio)}</option>`)
    .join('');

  const ratingHtml = product.rating
    ? `<p class="product-card__rating">★ ${product.rating.toFixed(1)}</p>`
    : '';

  const agotado = product.disponible === false;
  const selectId = `size-${prefix}-${product.id}`;

  const article = document.createElement('article');
  article.className = agotado ? 'product-card product-card--agotado' : 'product-card';
  article.dataset.categoria = product.categoria;

  article.innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre} — ${product.marca}" class="product-card__img" loading="lazy">
    <div class="product-card__body">
      <span class="product-card__badge">${CATEGORIA_LABELS[product.categoria] ?? product.categoria}</span>
      ${product.masVendido ? '<span class="product-card__vendido">Más vendido</span>' : ''}
      ${esRecienLlegado(product) ? '<span class="product-card__nuevo">Nuevo</span>' : ''}
      ${agotado ? '<span class="product-card__stock">Sin stock</span>' : ''}
      <h3 class="product-card__nombre">${product.nombre}</h3>
      <p class="product-card__marca">${product.marca}</p>
      ${product.subtitulo ? `<p class="product-card__subtitulo">${product.subtitulo}</p>` : ''}
      ${crearLineaDatos(product)}
      ${ratingHtml}
      <button type="button" class="ver-notas" data-product-id="${product.id}">Ver notas</button>

      <label class="product-card__label" for="${selectId}">Tamaño</label>
      <select id="${selectId}" class="product-card__select" data-product-id="${product.id}" ${agotado ? 'disabled' : ''}>
        ${opciones}
      </select>

      <div class="product-card__footer">
        <span class="product-card__precio" data-precio-de="${product.id}">${formatPrecio(variantes[0].precio)}</span>
        ${agotado
          ? `<a class="btn-avisame" href="${waAvisaLink(product)}" target="_blank" rel="noopener" title="Te avisamos por WhatsApp cuando vuelva a estar disponible">Avísame</a>`
          : `<button type="button" class="btn-add-cart" data-product-id="${product.id}">Agregar</button>`}
      </div>
    </div>
  `;

  return article;
}

function renderCatalogo(lista) {
  const grid = document.getElementById('catalogo-grid');
  const vacio = document.getElementById('catalogo-vacio');

  grid.innerHTML = '';

  if (lista.length === 0) {
    vacio.hidden = false;
    return;
  }

  vacio.hidden = true;
  lista.forEach((product) => grid.appendChild(crearTarjetaProducto(product)));
}

function renderRecienLlegados() {
  const section = document.getElementById('recien-llegados');
  const grid = document.getElementById('recien-llegados-grid');
  const lista = PRODUCTS.filter(esRecienLlegado);

  if (lista.length === 0) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  grid.innerHTML = '';
  lista.forEach((product) => grid.appendChild(crearTarjetaProducto(product, 'nuevo')));
}

function renderMasVendidos() {
  const grid = document.getElementById('mas-vendidos-grid');
  const lista = PRODUCTS.filter((p) => p.masVendido);

  grid.innerHTML = '';
  lista.forEach((product) => grid.appendChild(crearTarjetaProducto(product, 'vendido')));
}

function abrirNotas(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const etiquetas = [
    ...product.perfil.map((clave) => FAMILIA_LABELS[clave] ?? clave),
    CATEGORIA_LABELS[product.categoria] ?? product.categoria,
  ];

  document.getElementById('notas-body').innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre} — ${product.marca}" class="notas-img">
    <p class="notas-marca">${product.marca}</p>
    <h3 class="notas-nombre">${product.nombre}</h3>
    ${product.subtitulo ? `<p class="product-card__subtitulo">${product.subtitulo}</p>` : ''}
    ${crearLineaDatos(product)}
    <div class="notas-etiquetas">
      ${etiquetas.map((t) => `<span class="etiqueta">${t}</span>`).join('')}
    </div>
    <p class="notas-descripcion">${product.descripcion}</p>
    ${product.frase ? `<p class="notas-frase">${product.frase}</p>` : ''}
    ${product.disponible === false ? `<a class="btn-avisame btn-avisame--full" href="${waAvisaLink(product)}" target="_blank" rel="noopener">🔔 Avísame cuando llegue</a>` : ''}
    ${renderSugerenciasHtml(sugerenciasPara([product]), 'notas')}
  `;
  document.getElementById('notas-modal').scrollTop = 0;

  document.getElementById('notas-modal').hidden = false;
  document.getElementById('notas-backdrop').hidden = false;
}

function cerrarNotas() {
  document.getElementById('notas-modal').hidden = true;
  document.getElementById('notas-backdrop').hidden = true;
}

function initNotas() {
  document.getElementById('notas-close').addEventListener('click', cerrarNotas);
  document.getElementById('notas-backdrop').addEventListener('click', cerrarNotas);
}

let categoriaActual = 'todos';
let busquedaActual = '';

function coincideBusqueda(product, query) {
  const familias = product.perfil.map((clave) => (FAMILIA_LABELS[clave] ?? clave).toLowerCase());
  return (
    product.nombre.toLowerCase().includes(query) ||
    product.marca.toLowerCase().includes(query) ||
    familias.some((f) => f.includes(query))
  );
}

function aplicarFiltros() {
  let lista = categoriaActual === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.categoria === categoriaActual);

  const query = busquedaActual.trim().toLowerCase();
  if (query) {
    lista = lista.filter((p) => coincideBusqueda(p, query));
  }

  lista = lista.filter(pasaFiltrosAvanzados);
  lista = ordenarLista(lista);

  renderCatalogo(lista);
  actualizarBarraFiltros(lista.length);
}

function initFiltros() {
  const contenedor = document.getElementById('filtros-categoria');

  contenedor.addEventListener('click', (event) => {
    const btn = event.target.closest('.filtro-btn');
    if (!btn) return;

    contenedor.querySelectorAll('.filtro-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    categoriaActual = btn.dataset.categoria;
    aplicarFiltros();
  });
}

function initBuscador() {
  const input = document.getElementById('buscador');

  input.addEventListener('input', () => {
    const eraVacia = busquedaActual.trim() === '';
    busquedaActual = input.value;
    aplicarFiltros();

    // Al empezar una búsqueda desde arriba de la página, lleva al catálogo
    // para que el resultado se vea sin tener que bajar manualmente.
    if (eraVacia && busquedaActual.trim() !== '') {
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Menú "Marcas": lista todas las marcas del catálogo; al elegir una,
// reutiliza el buscador global (ya sabe filtrar por marca) para no duplicar
// lógica de filtrado.
function renderMarcas() {
  const contenedor = document.getElementById('marcas-dropdown');
  const marcas = [...new Set(PRODUCTS.map((p) => p.marca))].sort((a, b) => a.localeCompare(b, 'es'));

  contenedor.innerHTML = marcas
    .map((marca) => `<button type="button" class="marcas-dropdown__item" data-marca="${marca}">${marca}</button>`)
    .join('');
}

function cerrarMarcas() {
  document.getElementById('marcas-dropdown').hidden = true;
  document.getElementById('marcas-toggle').setAttribute('aria-expanded', 'false');
}

function initMarcas() {
  const toggle = document.getElementById('marcas-toggle');
  const dropdown = document.getElementById('marcas-dropdown');

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const abierto = !dropdown.hidden;
    if (abierto) {
      cerrarMarcas();
    } else {
      dropdown.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  dropdown.addEventListener('click', (event) => {
    const btn = event.target.closest('.marcas-dropdown__item');
    if (!btn) return;

    const input = document.getElementById('buscador');
    const eraVacia = busquedaActual.trim() === '';
    input.value = btn.dataset.marca;
    busquedaActual = input.value;
    aplicarFiltros();
    cerrarMarcas();
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');

    if (eraVacia) {
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Cierra al hacer clic afuera
  document.addEventListener('click', (event) => {
    if (!dropdown.hidden && !event.target.closest('.nav-marcas')) {
      cerrarMarcas();
    }
  });
}

// Se usa para el catálogo completo y para Recién llegados: ambas grillas
// pueden mostrar el mismo producto a la vez, así que todo se resuelve
// relativo a la tarjeta clickeada (nunca por id global).
function initGridEventos(grid) {
  // Cambiar el tamaño seleccionado actualiza el precio mostrado
  grid.addEventListener('change', (event) => {
    const select = event.target.closest('.product-card__select');
    if (!select) return;

    const productId = select.dataset.productId;
    const product = PRODUCTS.find((p) => p.id === productId);
    const variante = product.variantes.find((v) => String(v.ml) === select.value);
    const precioEl = select.closest('.product-card').querySelector(`[data-precio-de="${productId}"]`);
    precioEl.textContent = formatPrecio(variante.precio);
  });

  // Agregar al carrito con la variante (ml) seleccionada en ese momento
  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn-add-cart');
    if (!btn) return;

    const productId = btn.dataset.productId;
    const product = PRODUCTS.find((p) => p.id === productId);
    const select = btn.closest('.product-card').querySelector('.product-card__select');
    const variante = product.variantes.find((v) => String(v.ml) === select.value);

    addToCart(product, variante);
    openCart();
  });

  // Ver notas: abre el panel de detalle del perfume
  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('.ver-notas');
    if (!btn) return;
    abrirNotas(btn.dataset.productId);
  });
}


// ---------------------------------------------------------------
// Filtros avanzados, orden, "Avísame" y sugerencias
// ---------------------------------------------------------------
const ESTACIONES = ['Primavera', 'Verano', 'Otoño', 'Invierno'];
const MOMENTOS = ['Día', 'Noche'];
const CONC_GRUPOS = {
  'EDT / Cologne': ['EDT', 'EDT Intense', 'Cologne'],
  'EDP': ['EDP'],
  'Parfum / Extrait': ['Parfum', 'Extrait de Parfum', 'Elixir', 'Absolu'],
};

const filtros = {
  perfil: new Set(),
  estacion: new Set(),
  momento: new Set(),
  conc: new Set(),
  soloStock: false,
};
let ordenActual = 'alfa';

function estacionesDe(p) {
  if (p.estaciones === '4 estaciones') return [...ESTACIONES];
  return (p.estaciones || '').split(' – ').filter(Boolean);
}

function momentosDe(p) {
  if (p.momento === 'Día y noche') return [...MOMENTOS];
  return p.momento ? [p.momento] : [];
}

function pasaFiltrosAvanzados(p) {
  if (filtros.soloStock && p.disponible === false) return false;
  if (filtros.perfil.size && !p.perfil.some((x) => filtros.perfil.has(x))) return false;
  if (filtros.estacion.size && !estacionesDe(p).some((x) => filtros.estacion.has(x))) return false;
  if (filtros.momento.size && !momentosDe(p).some((x) => filtros.momento.has(x))) return false;
  if (filtros.conc.size) {
    const ok = [...filtros.conc].some((g) => (CONC_GRUPOS[g] || []).includes(p.concentracion));
    if (!ok) return false;
  }
  return true;
}

// Precio de referencia para ordenar: la variante de 5ml (o la más cercana)
function precioRef(p) {
  const v = p.variantes.find((x) => x.ml === 5) || p.variantes.find((x) => x.ml === 3) ||
            p.variantes.find((x) => x.ml === 10) || p.variantes[0];
  return v.precio;
}

function ordenarLista(lista) {
  const copia = [...lista];
  if (ordenActual === 'precio-asc') copia.sort((a, b) => precioRef(a) - precioRef(b) || a.nombre.localeCompare(b.nombre, 'es'));
  if (ordenActual === 'precio-desc') copia.sort((a, b) => precioRef(b) - precioRef(a) || a.nombre.localeCompare(b.nombre, 'es'));
  if (ordenActual === 'nuevos') {
    copia.sort((a, b) => (b.fechaIngreso || '').localeCompare(a.fechaIngreso || '') || a.marca.localeCompare(b.marca, 'es'));
  }
  return copia;
}

function totalFiltrosActivos() {
  return filtros.perfil.size + filtros.estacion.size + filtros.momento.size + filtros.conc.size + (filtros.soloStock ? 1 : 0);
}

function chipFiltro(grupo, valor, etiqueta) {
  const activo = grupo === 'soloStock' ? filtros.soloStock : filtros[grupo].has(valor);
  return `<button type="button" class="filtro-btn filtro-chip ${activo ? 'is-active' : ''}" data-grupo="${grupo}" data-valor="${valor}" aria-pressed="${activo}">${etiqueta}</button>`;
}

function renderPanelFiltros() {
  const panel = document.getElementById('filtros-panel');
  const grupo = (titulo, chips) => `<div class="filtros-grupo"><p class="filtros-grupo__titulo">${titulo}</p><div class="filtros-grupo__chips">${chips}</div></div>`;

  panel.innerHTML = `
    ${grupo('Perfil olfativo', Object.entries(FAMILIA_LABELS).map(([k, l]) => chipFiltro('perfil', k, l)).join(''))}
    ${grupo('Temporada', ESTACIONES.map((e) => chipFiltro('estacion', e, `${ICONOS_ESTACION[e]} ${e}`)).join(''))}
    ${grupo('Momento', MOMENTOS.map((m) => chipFiltro('momento', m, `${ICONOS_MOMENTO[m]} ${m}`)).join(''))}
    ${grupo('Concentración', Object.keys(CONC_GRUPOS).map((g) => chipFiltro('conc', g, g)).join(''))}
    ${grupo('Disponibilidad', chipFiltro('soloStock', 'si', 'Solo con stock'))}
    <div class="filtros-acciones">
      <button type="button" class="filtros-limpiar" id="filtros-limpiar">Limpiar filtros</button>
      <button type="button" class="btn-primary filtros-ver" id="filtros-ver">Ver resultados</button>
    </div>
  `;
}

function actualizarBarraFiltros(total) {
  const n = totalFiltrosActivos();
  const badge = document.getElementById('filtros-count');
  badge.textContent = n;
  badge.hidden = n === 0;
  document.getElementById('catalogo-resultados').textContent = `${total} fragancia${total === 1 ? '' : 's'}`;
  const ver = document.getElementById('filtros-ver');
  if (ver) ver.textContent = `Ver ${total} resultado${total === 1 ? '' : 's'}`;

  // Chips activos (se pueden quitar de a uno)
  const activos = [];
  filtros.perfil.forEach((v) => activos.push(['perfil', v, FAMILIA_LABELS[v]]));
  filtros.estacion.forEach((v) => activos.push(['estacion', v, v]));
  filtros.momento.forEach((v) => activos.push(['momento', v, v]));
  filtros.conc.forEach((v) => activos.push(['conc', v, v]));
  if (filtros.soloStock) activos.push(['soloStock', 'si', 'Solo con stock']);
  document.getElementById('filtros-activos').innerHTML = activos
    .map(([g, v, l]) => `<button type="button" class="filtro-activo" data-grupo="${g}" data-valor="${v}" aria-label="Quitar filtro ${l}">${l} <span aria-hidden="true">&times;</span></button>`)
    .join('');

  // Refleja el estado en los chips del panel
  document.querySelectorAll('#filtros-panel .filtro-chip').forEach((b) => {
    const g = b.dataset.grupo;
    const on = g === 'soloStock' ? filtros.soloStock : filtros[g].has(b.dataset.valor);
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function alternarFiltro(grupo, valor) {
  if (grupo === 'soloStock') filtros.soloStock = !filtros.soloStock;
  else if (filtros[grupo].has(valor)) filtros[grupo].delete(valor);
  else filtros[grupo].add(valor);
  aplicarFiltros();
}

function limpiarFiltros() {
  Object.values(filtros).forEach((v) => v instanceof Set && v.clear());
  filtros.soloStock = false;
  aplicarFiltros();
}

function initFiltrosAvanzados() {
  const toggle = document.getElementById('filtros-toggle');
  const panel = document.getElementById('filtros-panel');
  renderPanelFiltros();

  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
  });

  panel.addEventListener('click', (event) => {
    const chip = event.target.closest('.filtro-chip');
    if (chip) return alternarFiltro(chip.dataset.grupo, chip.dataset.valor);
    if (event.target.closest('#filtros-limpiar')) return limpiarFiltros();
    if (event.target.closest('#filtros-ver')) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.getElementById('catalogo-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  document.getElementById('filtros-activos').addEventListener('click', (event) => {
    const b = event.target.closest('.filtro-activo');
    if (b) alternarFiltro(b.dataset.grupo, b.dataset.valor);
  });

  document.getElementById('orden-select').addEventListener('change', (event) => {
    ordenActual = event.target.value;
    aplicarFiltros();
  });

  document.getElementById('catalogo-vacio-limpiar').addEventListener('click', () => {
    limpiarFiltros();
    document.getElementById('buscador').value = '';
    busquedaActual = '';
    aplicarFiltros();
  });
}

// "Avísame cuando llegue": abre WhatsApp con el mensaje armado
function waAvisaLink(product) {
  const msg = `Hola! Me interesa ${product.nombre} (${product.marca}) y vi que no tiene stock. ¿Me avisan cuando vuelva a estar disponible?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// Sugerencias: "También te podría interesar"
function puntuarSimilitud(base, cand) {
  let s = 0;
  if (cand.categoria === base.categoria) s += 1;
  if (cand.perfil[0] === base.perfil[0]) s += 3;
  s += cand.perfil.filter((x) => base.perfil.includes(x)).length * 2;
  const estC = estacionesDe(cand);
  if (estacionesDe(base).filter((x) => estC.includes(x)).length >= 2) s += 1;
  const momC = momentosDe(cand);
  if (momentosDe(base).some((x) => momC.includes(x))) s += 1;
  const ratio = precioRef(cand) / precioRef(base);
  if (ratio >= 0.6 && ratio <= 1.6) s += 1;
  return s;
}

function razonSimilitud(bases, cand) {
  const compartidas = new Set();
  bases.forEach((b) => cand.perfil.filter((x) => b.perfil.includes(x)).forEach((x) => compartidas.add(x)));
  if (compartidas.size) return [...compartidas].map((x) => FAMILIA_LABELS[x] ?? x).slice(0, 2).join(' · ');
  return CATEGORIA_LABELS[cand.categoria] ?? '';
}

// bases: perfumes que el cliente está viendo o tiene en el carrito
function sugerenciasPara(bases, n = 3) {
  const excluir = new Set(bases.map((b) => b.id));
  const candidatos = PRODUCTS
    .filter((p) => !excluir.has(p.id) && p.disponible !== false)
    .map((p) => ({ p, s: bases.reduce((t, b) => t + puntuarSimilitud(b, p), 0) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (b.p.masVendido ? 1 : 0) - (a.p.masVendido ? 1 : 0) || a.p.nombre.localeCompare(b.p.nombre, 'es'));

  const elegidos = [];
  const marcas = new Set();
  candidatos.forEach((c) => { if (elegidos.length < n && !marcas.has(c.p.marca)) { elegidos.push(c.p); marcas.add(c.p.marca); } });
  candidatos.forEach((c) => { if (elegidos.length < n && !elegidos.includes(c.p)) elegidos.push(c.p); });
  return elegidos.map((p) => ({ product: p, razon: razonSimilitud(bases, p) }));
}

function variantePorDefecto(product, mlPreferido) {
  // Tamaño pedido; si no existe, el más cercano a ese (o a 5ml)
  const objetivo = mlPreferido || 5;
  return [...product.variantes].sort((a, b) => Math.abs(a.ml - objetivo) - Math.abs(b.ml - objetivo) || b.ml - a.ml)[0];
}

function renderSugerenciasHtml(lista, contexto, mlPreferido) {
  if (!lista.length) return '';
  const tarjetas = lista.map(({ product, razon }) => {
    const v = variantePorDefecto(product, mlPreferido);
    return `
      <article class="sugerencia">
        <img src="${product.imagen}" alt="${product.nombre} — ${product.marca}" class="sugerencia__img" loading="lazy">
        <div class="sugerencia__info">
          <p class="sugerencia__marca">${product.marca}</p>
          <p class="sugerencia__nombre">${product.nombre}</p>
          ${razon ? `<p class="sugerencia__razon">Similar: ${razon}</p>` : ''}
          <p class="sugerencia__precio">${v.ml}ml — ${formatPrecio(v.precio)}</p>
          <div class="sugerencia__acciones">
            <button type="button" class="sugerencia__btn" data-sug="ver" data-product-id="${product.id}">Ver</button>
            <button type="button" class="sugerencia__btn sugerencia__btn--add" data-sug="add" data-product-id="${product.id}" data-ml="${v.ml}">+ Agregar</button>
          </div>
        </div>
      </article>`;
  }).join('');
  return `<section class="sugerencias sugerencias--${contexto}">
    <h4 class="sugerencias__titulo">También te podría interesar</h4>
    <div class="sugerencias__lista">${tarjetas}</div>
  </section>`;
}

// Carrito: sugerencias según lo que el cliente va a comprar
function renderSugerenciasCarrito(cart) {
  const cont = document.getElementById('cart-sugerencias');
  if (!cont) return;
  if (!PRODUCTS.length || !cart.length) { cont.innerHTML = ''; return; }

  const ids = new Set();
  let ml;
  cart.forEach((l) => {
    if (l.tipo === 'pack') l.items.forEach((i) => ids.add(i.id));
    else ids.add(l.productId);
    if (!ml) ml = l.ml;
  });
  const bases = PRODUCTS.filter((p) => ids.has(p.id));
  if (!bases.length) { cont.innerHTML = ''; return; }
  cont.innerHTML = renderSugerenciasHtml(sugerenciasPara(bases), 'carrito', ml);
}

function initSugerencias() {
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-sug]');
    if (!btn) return;
    const product = PRODUCTS.find((p) => p.id === btn.dataset.productId);
    if (!product) return;
    if (btn.dataset.sug === 'ver') {
      abrirNotas(product.id);
    } else {
      const v = product.variantes.find((x) => String(x.ml) === btn.dataset.ml) || product.variantes[0];
      addToCart(product, v);
      cerrarNotas();
      openCart();
    }
  });
}

async function cargarCatalogo() {
  try {
    const res = await fetch('data/products.json');
    PRODUCTS = await res.json();
    PRODUCTS.sort((a, b) => a.marca.localeCompare(b.marca, 'es') || a.nombre.localeCompare(b.nombre, 'es'));
    aplicarFiltros();
    renderPacks();
    renderRecienLlegados();
    renderMasVendidos();
    renderMarcas();
    renderSugerenciasCarrito(getCart());
  } catch (err) {
    console.error('No se pudo cargar el catálogo:', err);
    document.getElementById('catalogo-grid').innerHTML =
      '<p class="catalogo-vacio">No se pudo cargar el catálogo. Intenta recargar la página.</p>';
  }
}

// Packs: combos por marca, mínimo 3 fragancias del mismo tamaño
const PACK_DESCUENTOS = { 3: 0.05, 5: 0.07, 10: 0.10 };

// Devuelve, por marca, solo los tamaños donde hay 3 o más fragancias EN STOCK
// disponibles en ese tamaño puntual (una marca puede calificar en 3ml pero no en 10ml).
function getMarcasPack() {
  const disponibles = PRODUCTS.filter((p) => p.disponible !== false);
  const porMarca = {};
  disponibles.forEach((p) => {
    porMarca[p.marca] = porMarca[p.marca] || [];
    porMarca[p.marca].push(p);
  });

  // No es parte de la colección Blu Mediterraneo (frasco distinto):
  // se excluye del colage visual de packs para que las fotos combinen entre sí.
  const EXCLUIR_DEL_COLAGE = new Set(['acqua-il-profumo']);

  const marcas = [];

  Object.entries(porMarca).forEach(([marca, items]) => {
    const porMl = {};
    items.forEach((p) => {
      p.variantes.forEach((v) => {
        // Solo 3/5/10ml tienen descuento de pack definido.
        if (!(v.ml in PACK_DESCUENTOS)) return;
        porMl[v.ml] = porMl[v.ml] || [];
        porMl[v.ml].push({ id: p.id, nombre: p.nombre, precio: v.precio });
      });
    });

    const tamaños = Object.entries(porMl)
      .filter(([, lista]) => lista.length >= 3)
      .map(([ml, lista]) => ({ ml: Number(ml), items: lista }))
      .sort((a, b) => a.ml - b.ml);

    if (tamaños.length > 0) {
      const imagenes = [...new Set(items.filter((p) => !EXCLUIR_DEL_COLAGE.has(p.id)).map((p) => p.imagen))].slice(0, 3);
      marcas.push({ marca, imagenes, tamaños });
    }
  });

  return marcas.sort((a, b) => a.marca.localeCompare(b.marca));
}

function renderPacks() {
  const grid = document.getElementById('packs-grid');
  const marcas = getMarcasPack();

  grid.innerHTML = marcas
    .map((m) => {
      const descuentoMax = Math.round(Math.max(...m.tamaños.map((t) => PACK_DESCUENTOS[t.ml])) * 100);
      const tallas = m.tamaños.map((t) => `${t.ml}ml`).join(' · ');
      const collageHtml = m.imagenes
        .map((src) => `<img src="${src}" alt="" class="pack-card__collage-img" loading="lazy">`)
        .join('');
      return `
        <article class="pack-card">
          <div class="pack-card__collage"><div class="pack-card__collage-stage">${collageHtml}</div></div>
          <div class="pack-card__body">
            <h3 class="pack-card__marca">${m.marca}</h3>
            <p class="pack-card__tallas">Disponible en: ${tallas}</p>
            <p class="pack-card__desc">Elige 3 o más fragancias del mismo tamaño y ahorra hasta ${descuentoMax}%.</p>
            <button type="button" class="btn-primary pack-card__btn" data-marca="${m.marca}">Armar pack</button>
          </div>
        </article>
      `;
    })
    .join('');
}

let packState = null;

function abrirPackModal(marca) {
  const info = getMarcasPack().find((m) => m.marca === marca);
  if (!info) return;

  packState = { marca, ml: info.tamaños[0].ml, seleccionados: new Set(), tamaños: info.tamaños };
  renderPackModal();

  document.getElementById('pack-modal').hidden = false;
  document.getElementById('pack-backdrop').hidden = false;
}

function cerrarPackModal() {
  document.getElementById('pack-modal').hidden = true;
  document.getElementById('pack-backdrop').hidden = true;
}

function renderPackModal() {
  const { marca, ml, seleccionados, tamaños } = packState;
  const tamañoActivo = tamaños.find((t) => t.ml === ml);
  const descuentoPct = PACK_DESCUENTOS[ml];

  const tabsHtml = tamaños
    .map((t) => `<button type="button" class="pack-tab ${t.ml === ml ? 'is-active' : ''}" data-ml="${t.ml}">${t.ml}ml</button>`)
    .join('');

  const itemsHtml = tamañoActivo.items
    .map(
      (item) => `
        <label class="pack-item">
          <input type="checkbox" data-item-id="${item.id}" ${seleccionados.has(item.id) ? 'checked' : ''}>
          <span class="pack-item__nombre">${item.nombre}</span>
          <span class="pack-item__precio">${formatPrecio(item.precio)}</span>
        </label>
      `
    )
    .join('');

  const seleccionadosItems = tamañoActivo.items.filter((i) => seleccionados.has(i.id));
  const subtotal = seleccionadosItems.reduce((s, i) => s + i.precio, 0);
  const descuento = subtotal * descuentoPct;
  const total = subtotal - descuento;
  const faltan = Math.max(0, 3 - seleccionadosItems.length);

  document.getElementById('pack-body').innerHTML = `
    <h3 class="pack-titulo">Pack ${marca}</h3>
    <p class="pack-subtitulo">Elige 3 o más fragancias del mismo tamaño</p>

    <div class="pack-tabs">${tabsHtml}</div>
    <div class="pack-lista">${itemsHtml}</div>

    ${faltan > 0 ? `<p class="pack-aviso">Te falta${faltan === 1 ? '' : 'n'} ${faltan} fragancia${faltan === 1 ? '' : 's'} para armar el pack.</p>` : ''}

    <div class="pack-resumen">
      <div class="pack-resumen__fila"><span>Subtotal</span><span>${formatPrecio(subtotal)}</span></div>
      <div class="pack-resumen__fila pack-resumen__descuento"><span>Descuento (${Math.round(descuentoPct * 100)}%)</span><span>-${formatPrecio(descuento)}</span></div>
      <div class="pack-resumen__fila pack-resumen__total"><span>Total</span><span>${formatPrecio(total)}</span></div>
    </div>

    <button type="button" id="pack-agregar" class="btn-whatsapp pack-agregar" ${seleccionadosItems.length < 3 ? 'disabled' : ''}>Agregar pack al carrito</button>
  `;

  document.querySelectorAll('.pack-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      packState.ml = Number(btn.dataset.ml);
      packState.seleccionados = new Set();
      renderPackModal();
    });
  });

  document.querySelectorAll('.pack-lista input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.checked) packState.seleccionados.add(cb.dataset.itemId);
      else packState.seleccionados.delete(cb.dataset.itemId);
      renderPackModal();
    });
  });

  const btnAgregar = document.getElementById('pack-agregar');
  if (!btnAgregar.disabled) {
    btnAgregar.addEventListener('click', () => {
      addPackToCart(marca, ml, seleccionadosItems, descuentoPct);
      cerrarPackModal();
      openCart();
    });
  }
}

function initPacks() {
  document.getElementById('packs-grid').addEventListener('click', (event) => {
    const btn = event.target.closest('.pack-card__btn');
    if (!btn) return;
    abrirPackModal(btn.dataset.marca);
  });

  document.getElementById('pack-close').addEventListener('click', cerrarPackModal);
  document.getElementById('pack-backdrop').addEventListener('click', cerrarPackModal);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCatalogo();
  initFiltros();
  initBuscador();
  initGridEventos(document.getElementById('catalogo-grid'));
  initGridEventos(document.getElementById('recien-llegados-grid'));
  initGridEventos(document.getElementById('mas-vendidos-grid'));
  initNotas();
  initPacks();
  initMarcas();
  initFiltrosAvanzados();
  initSugerencias();
});
