// Imaginary Scents — armado de mensaje y apertura de WhatsApp
const WHATSAPP_NUMBER = '51944311196';

function buildWhatsAppMessage(cart) {
  const lineas = cart.map((item) => {
    if (item.tipo === 'pack') {
      const contenido = item.items.map((i) => i.nombre).join(', ');
      const antes = (item.precioOriginal * item.qty).toFixed(2);
      return `- Pack ${item.marca} (${item.ml}ml) x${item.qty} — incluye: ${contenido} — S/ ${(item.precio * item.qty).toFixed(2)} (${Math.round(item.descuentoPct * 100)}% off, antes S/ ${antes})`;
    }
    return `- ${item.nombre} (${item.ml}ml) x${item.qty} — S/ ${(item.precio * item.qty).toFixed(2)}`;
  });

  return [
    'Hola! Quiero hacer este pedido en Imaginary Scents:',
    '',
    ...lineas,
    '',
    `Total: S/ ${getCartTotal(cart).toFixed(2)}`,
  ].join('\n');
}

function initWhatsappCheckout() {
  document.getElementById('checkout-whatsapp').addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) return;

    const mensaje = buildWhatsAppMessage(cart);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', initWhatsappCheckout);
