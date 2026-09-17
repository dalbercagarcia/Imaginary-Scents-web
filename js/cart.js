// Imaginary Scents — lógica del carrito (persistencia en localStorage)
//
// Cada línea del carrito representa un producto en UN tamaño puntual, porque
// el mismo perfume puede estar en el carrito en varios ml a la vez
// (ej. Grand Soir 2ml y Grand Soir 10ml son dos líneas distintas).
// Clave de línea: `${productId}-${ml}` (ej. "p001-5").

const CART_STORAGE_KEY = 'imaginary-scents-cart';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('No se pudo leer el carrito de localStorage:', err);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderCart();
}

function lineKey(productId, ml) {
  return `${productId}-${ml}`;
}

// product: objeto de products.json | variante: { ml, precio }
function addToCart(product, variante, qty = 1) {
  const cart = getCart();
  const key = lineKey(product.id, variante.ml);
  const existente = cart.find((linea) => linea.key === key);

  if (existente) {
    existente.qty += qty;
  } else {
    cart.push({
      key,
      productId: product.id,
      nombre: product.nombre,
      marca: product.marca,
      imagen: product.imagen,
      ml: variante.ml,
      precio: variante.precio,
      qty,
    });
  }

  saveCart(cart);
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// items: [{ id, nombre, precio }] — todos del mismo ml, misma marca, mínimo 3
function addPackToCart(marca, ml, items, descuentoPct, qty = 1) {
  const cart = getCart();
  const key = `pack-${slugify(marca)}-${ml}-${items.map((i) => i.id).sort().join('_')}`;
  const existente = cart.find((linea) => linea.key === key);

  const subtotal = items.reduce((total, item) => total + item.precio, 0);
  const precioConDescuento = subtotal * (1 - descuentoPct);

  if (existente) {
    existente.qty += qty;
  } else {
    cart.push({
      key,
      tipo: 'pack',
      marca,
      ml,
      items,
      descuentoPct,
      precioOriginal: subtotal,
      precio: precioConDescuento,
      qty,
    });
  }

  saveCart(cart);
}

function removeFromCart(key) {
  const cart = getCart().filter((linea) => linea.key !== key);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function updateQty(key, qty) {
  if (qty <= 0) {
    removeFromCart(key);
    return;
  }
  const cart = getCart();
  const linea = cart.find((item) => item.key === key);
  if (linea) {
    linea.qty = qty;
    saveCart(cart);
  }
}

function getCartTotal(cart) {
  return cart.reduce((total, linea) => total + linea.precio * linea.qty, 0);
}

function getCartCount(cart) {
  return cart.reduce((count, linea) => count + linea.qty, 0);
}

function renderCart() {
  const cart = getCart();
  const itemsList = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('cart-empty');
  const clearBtn = document.getElementById('cart-clear');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  itemsList.innerHTML = '';
  clearBtn.hidden = cart.length === 0;

  if (cart.length === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
    cart.forEach((linea) => {
      const li = document.createElement('li');
      li.className = 'cart-item';

      const nombreHtml =
        linea.tipo === 'pack'
          ? `Pack ${linea.marca} <span>(${linea.ml}ml)</span>`
          : `${linea.nombre} <span>(${linea.ml}ml)</span>`;

      const marcaHtml =
        linea.tipo === 'pack'
          ? `${linea.items.map((i) => i.nombre).join(', ')} · ${Math.round(linea.descuentoPct * 100)}% off`
          : linea.marca;

      li.innerHTML = `
        <div class="cart-item__info">
          <p class="cart-item__nombre">${nombreHtml}</p>
          <p class="cart-item__marca">${marcaHtml}</p>
          <div class="cart-item__qty">
            <button type="button" class="qty-btn" data-action="decrease" data-key="${linea.key}" aria-label="Restar cantidad">-</button>
            <span>${linea.qty}</span>
            <button type="button" class="qty-btn" data-action="increase" data-key="${linea.key}" aria-label="Sumar cantidad">+</button>
          </div>
        </div>
        <div class="cart-item__side">
          <span class="cart-item__precio">S/ ${(linea.precio * linea.qty).toFixed(2)}</span>
          <button type="button" class="cart-item__remove" data-action="remove" data-key="${linea.key}" aria-label="Quitar del carrito">&times;</button>
        </div>
      `;
      itemsList.appendChild(li);
    });
  }

  totalEl.textContent = getCartTotal(cart).toFixed(2);
  countEl.textContent = getCartCount(cart);
  document.getElementById('checkout-whatsapp').disabled = cart.length === 0;
}

function openCart() {
  document.getElementById('cart-panel').hidden = false;
  document.getElementById('cart-backdrop').hidden = false;
}

function closeCart() {
  document.getElementById('cart-panel').hidden = true;
  document.getElementById('cart-backdrop').hidden = true;
}

function initCart() {
  renderCart();

  document.getElementById('cart-toggle').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-backdrop').addEventListener('click', closeCart);

  document.getElementById('cart-clear').addEventListener('click', clearCart);

  document.getElementById('cart-items').addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    const { action, key } = btn.dataset;
    const cart = getCart();
    const linea = cart.find((item) => item.key === key);
    if (!linea) return;

    if (action === 'increase') updateQty(key, linea.qty + 1);
    if (action === 'decrease') updateQty(key, linea.qty - 1);
    if (action === 'remove') removeFromCart(key);
  });
}

document.addEventListener('DOMContentLoaded', initCart);
