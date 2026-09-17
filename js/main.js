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
      ${esRecienLlegado(product) ? '<span class="product-card__nuevo">Nuevo</span>' : ''}
      ${agotado ? '<span class="product-card__stock">Sin stock</span>' : ''}
      <h3 class="product-card__nombre">${product.nombre}</h3>
      <p class="product-card__marca">${product.marca}</p>
      ${ratingHtml}
      <button type="button" class="ver-notas" data-product-id="${product.id}">Ver notas</button>

      <label class="product-card__label" for="${selectId}">Tamaño</label>
      <select id="${selectId}" class="product-card__select" data-product-id="${product.id}" ${agotado ? 'disabled' : ''}>
        ${opciones}
      </select>

      <div class="product-card__footer">
        <span class="product-card__precio" data-precio-de="${product.id}">${formatPrecio(variantes[0].precio)}</span>
        <button type="button" class="btn-add-cart" data-product-id="${product.id}" ${agotado ? 'disabled' : ''}>Agregar</button>
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

function abrirNotas(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const etiquetas = [
    ...product.perfil.map((clave) => FAMILIA_LABELS[clave] ?? clave),
    TEMPORADA_LABELS[product.temporada] ?? product.temporada,
    CATEGORIA_LABELS[product.categoria] ?? product.categoria,
  ];

  document.getElementById('notas-body').innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre} — ${product.marca}" class="notas-img">
    <p class="notas-marca">${product.marca}</p>
    <h3 class="notas-nombre">${product.nombre}</h3>
    <div class="notas-etiquetas">
      ${etiquetas.map((t) => `<span class="etiqueta">${t}</span>`).join('')}
    </div>
    <p class="notas-descripcion">${product.descripcion}</p>
    ${product.frase ? `<p class="notas-frase">${product.frase}</p>` : ''}
  `;

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

  renderCatalogo(lista);
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

async function cargarCatalogo() {
  try {
    const res = await fetch('data/products.json');
    PRODUCTS = await res.json();
    aplicarFiltros();
    renderPacks();
    renderRecienLlegados();
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
      marcas.push({ marca, imagen: items[0].imagen, tamaños });
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
      return `
        <article class="pack-card">
          <img src="${m.imagen}" alt="${m.marca}" class="pack-card__img" loading="lazy">
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
  initNotas();
  initPacks();
});
