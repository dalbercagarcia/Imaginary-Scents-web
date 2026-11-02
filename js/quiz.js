// Imaginary Scents — Test "Encuentra tu perfume"
// 4 preguntas (ocasión, clima, perfil olfativo, presupuesto) → Top 3 con puntaje.
// Usa los datos de products.json: perfil, estaciones, momento y precio (5 ml).

const QUIZ_PREGUNTAS = [
  {
    id: 'ocasion',
    titulo: '¿Para qué ocasión lo quieres?',
    ayuda: 'Elige la que más usarás.',
    multi: false,
    opciones: [
      { v: 'diario', icono: '☀️', t: 'Día a día', d: 'Para usar siempre', momento: ['Día'], boost: ['citrica', 'fougere', 'amaderada'] },
      { v: 'trabajo', icono: '💼', t: 'Trabajo y oficina', d: 'Limpio y discreto', momento: ['Día'], boost: ['fougere', 'citrica', 'amaderada'] },
      { v: 'noche', icono: '🌙', t: 'Salida nocturna', d: 'Con presencia', momento: ['Noche'], boost: ['oriental', 'gourmand', 'amaderada'] },
      { v: 'cita', icono: '🥂', t: 'Cita o evento especial', d: 'Para dejar huella', momento: ['Noche'], boost: ['oriental', 'gourmand', 'floral'] },
      { v: 'cualquiera', icono: '✨', t: 'Me da igual', d: 'Sin preferencia', momento: [], boost: [] },
    ],
  },
  {
    id: 'clima',
    titulo: '¿Con qué clima lo usarás más?',
    ayuda: 'Pensando en Lima o donde vivas.',
    multi: false,
    opciones: [
      { v: 'calor', icono: '🌞', t: 'Calor', d: 'Primavera y verano', estaciones: ['Primavera', 'Verano'] },
      { v: 'frio', icono: '🍂', t: 'Fresco o frío', d: 'Otoño e invierno', estaciones: ['Otoño', 'Invierno'] },
      { v: 'todo', icono: '🌸', t: 'Todo el año', d: 'Que sirva siempre', estaciones: ['Primavera', 'Verano', 'Otoño', 'Invierno'], todo: true },
    ],
  },
  {
    id: 'perfil',
    titulo: '¿Qué tipo de aroma te gusta?',
    ayuda: 'Puedes elegir hasta 2.',
    multi: true,
    max: 2,
    opciones: [
      { v: 'citrica', icono: '🍋', t: 'Fresco y cítrico', d: 'Limón, bergamota, naranja' },
      { v: 'floral', icono: '🌸', t: 'Floral', d: 'Jazmín, rosa, iris' },
      { v: 'amaderada', icono: '🪵', t: 'Amaderado', d: 'Cedro, sándalo, vetiver' },
      { v: 'oriental', icono: '🔥', t: 'Especiado e intenso', d: 'Ámbar, incienso, oud' },
      { v: 'fougere', icono: '🌿', t: 'Aromático y verde', d: 'Lavanda, hierbas, marino' },
      { v: 'gourmand', icono: '🍫', t: 'Dulce y goloso', d: 'Vainilla, cacao, caramelo' },
      { v: 'sorpresa', icono: '🎁', t: 'Sorpréndeme', d: 'Sin preferencia', exclusivo: true },
    ],
  },
  {
    id: 'presupuesto',
    titulo: '¿Cuál es tu presupuesto?',
    ayuda: 'Referencia: decant de 5 ml.',
    multi: false,
    opciones: [
      { v: 'bajo', icono: '💚', t: 'Hasta S/ 40', min: 0, max: 40 },
      { v: 'medio', icono: '💛', t: 'S/ 41 a S/ 80', min: 41, max: 80 },
      { v: 'alto', icono: '🧡', t: 'Más de S/ 80', min: 81, max: 9999 },
      { v: 'libre', icono: '✨', t: 'Sin límite', d: 'Lo mejor para mí', min: 0, max: 9999 },
    ],
  },
];

let quizEstado = { paso: 0, resp: {} };

function quizOpcion(preguntaId, valor) {
  const p = QUIZ_PREGUNTAS.find((x) => x.id === preguntaId);
  return p.opciones.find((o) => o.v === valor);
}

function quizRespuestas(preguntaId) {
  const r = quizEstado.resp[preguntaId];
  return Array.isArray(r) ? r : r ? [r] : [];
}

function quizProgresoHtml() {
  const total = QUIZ_PREGUNTAS.length;
  const puntos = QUIZ_PREGUNTAS.map((_, i) => `<span class="quiz-punto ${i <= quizEstado.paso ? 'is-on' : ''}"></span>`).join('');
  return `<div class="quiz-progreso" aria-label="Pregunta ${quizEstado.paso + 1} de ${total}">${puntos}<span class="quiz-progreso__txt">Pregunta ${quizEstado.paso + 1} de ${total}</span></div>`;
}

function renderQuiz() {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  if (quizEstado.paso >= QUIZ_PREGUNTAS.length) return renderQuizResultado();

  const q = QUIZ_PREGUNTAS[quizEstado.paso];
  const sel = quizRespuestas(q.id);
  const opciones = q.opciones.map((o) => `
    <button type="button" class="quiz-opcion ${sel.includes(o.v) ? 'is-active' : ''}" data-v="${o.v}" aria-pressed="${sel.includes(o.v)}">
      <span class="quiz-opcion__icono" aria-hidden="true">${o.icono}</span>
      <span class="quiz-opcion__texto"><strong>${o.t}</strong>${o.d ? `<small>${o.d}</small>` : ''}</span>
    </button>`).join('');

  app.innerHTML = `
    <div class="quiz-card">
      ${quizProgresoHtml()}
      <h3 class="quiz-pregunta">${q.titulo}</h3>
      <p class="quiz-ayuda">${q.ayuda}</p>
      <div class="quiz-opciones">${opciones}</div>
      <div class="quiz-nav">
        ${quizEstado.paso > 0 ? '<button type="button" class="quiz-atras" id="quiz-atras">← Atrás</button>' : '<span></span>'}
        ${q.multi ? `<button type="button" class="btn-primary quiz-siguiente" id="quiz-siguiente" ${sel.length ? '' : 'disabled'}>Siguiente →</button>` : ''}
      </div>
    </div>`;
}

function quizResponder(valor) {
  const q = QUIZ_PREGUNTAS[quizEstado.paso];
  if (q.multi) {
    let sel = quizRespuestas(q.id);
    const op = quizOpcion(q.id, valor);
    if (op.exclusivo) sel = sel.includes(valor) ? [] : [valor];
    else {
      sel = sel.filter((x) => !quizOpcion(q.id, x).exclusivo);
      if (sel.includes(valor)) sel = sel.filter((x) => x !== valor);
      else if (sel.length < q.max) sel.push(valor);
      else sel = [...sel.slice(1), valor];
    }
    quizEstado.resp[q.id] = sel;
    renderQuiz();
    return;
  }
  quizEstado.resp[q.id] = valor;
  quizEstado.paso += 1;
  renderQuiz();
  quizScrollArriba();
}

function quizScrollArriba() {
  const sec = document.getElementById('test');
  if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Puntaje ----
function quizCalcular() {
  const oc = quizOpcion('ocasion', quizEstado.resp.ocasion);
  const cl = quizOpcion('clima', quizEstado.resp.clima);
  const perfiles = quizRespuestas('perfil').filter((v) => v !== 'sorpresa');
  const pr = quizOpcion('presupuesto', quizEstado.resp.presupuesto);

  const lista = PRODUCTS.filter((p) => p.disponible !== false).map((p) => {
    let s = 0;
    const razones = [];

    // Perfil olfativo (lo que más pesa)
    if (perfiles.length) {
      const coin = perfiles.filter((x) => p.perfil.includes(x));
      if (coin.length) {
        s += p.perfil[0] && perfiles.includes(p.perfil[0]) ? 6 : 4;
        s += (coin.length - 1) * 2;
        razones.push(coin.map((x) => FAMILIA_LABELS[x]).join(' · '));
      }
    }

    // Ocasión: momento + familias típicas
    const mom = momentosDe(p);
    if (oc.momento.length) {
      if (oc.momento.some((m) => mom.includes(m))) {
        s += 3;
        razones.push(mom.length === 2 ? 'Día y noche' : oc.momento[0] === 'Noche' ? 'Para la noche' : 'Para el día');
      } else s -= 1;
    }
    if (oc.boost.length && p.perfil.some((x) => oc.boost.includes(x))) s += 1;

    // Clima
    const est = estacionesDe(p);
    const comun = cl.estaciones.filter((e) => est.includes(e)).length;
    if (cl.todo) {
      if (est.length === 4) { s += 3; razones.push('Todo el año'); }
      else if (est.length === 3) s += 1.5;
    } else if (comun === 2) { s += 3; razones.push(cl.v === 'calor' ? 'Ideal para el calor' : 'Ideal para el frío'); }
    else if (comun === 1) s += 1;
    else s -= 2;

    // Presupuesto (precio de 5 ml o el más cercano)
    const precio = precioRef(p);
    if (precio >= pr.min && precio <= pr.max) {
      s += pr.v === 'libre' ? 0 : 4;
      if (pr.v !== 'libre') razones.push('En tu presupuesto');
    } else {
      const fuera = precio < pr.min ? (pr.min - precio) / Math.max(pr.min, 1) : (precio - pr.max) / pr.max;
      s += fuera <= 0.2 ? 1 : -3;
    }

    if (p.masVendido) s += 0.5;
    return { p, s, razones, precio };
  });

  lista.sort((a, b) => b.s - a.s || a.p.nombre.localeCompare(b.p.nombre, 'es'));

  // Un perfume por marca primero, para dar variedad
  const elegidos = [];
  const marcas = new Set();
  lista.forEach((x) => { if (elegidos.length < 3 && !marcas.has(x.p.marca)) { elegidos.push(x); marcas.add(x.p.marca); } });
  lista.forEach((x) => { if (elegidos.length < 3 && !elegidos.includes(x)) elegidos.push(x); });
  return elegidos;
}

function quizResumenTexto() {
  const oc = quizOpcion('ocasion', quizEstado.resp.ocasion).t;
  const cl = quizOpcion('clima', quizEstado.resp.clima).t;
  const pf = quizRespuestas('perfil').map((v) => quizOpcion('perfil', v).t).join(' + ');
  const pr = quizOpcion('presupuesto', quizEstado.resp.presupuesto).t;
  return { oc, cl, pf, pr };
}

function renderQuizResultado() {
  const app = document.getElementById('quiz-app');
  if (!PRODUCTS.length) {
    app.innerHTML = '<div class="quiz-card"><p class="quiz-ayuda">Cargando fragancias…</p></div>';
    setTimeout(renderQuizResultado, 400);
    return;
  }
  const top = quizCalcular();
  const r = quizResumenTexto();

  const tarjetas = top.map((x, i) => {
    const v = variantePorDefecto(x.p, 5);
    return `
      <article class="quiz-res ${i === 0 ? 'quiz-res--top' : ''}">
        <span class="quiz-res__rank">${i === 0 ? '⭐ Mejor opción' : `Opción ${i + 1}`}</span>
        <img src="${x.p.imagen}" alt="${x.p.nombre} — ${x.p.marca}" class="quiz-res__img" loading="lazy">
        <div class="quiz-res__info">
          <p class="quiz-res__marca">${x.p.marca}</p>
          <h4 class="quiz-res__nombre">${x.p.nombre}</h4>
          ${crearLineaDatos(x.p)}
          <p class="quiz-res__razones">${x.razones.length ? x.razones.slice(0, 4).map((t) => `<span>${t}</span>`).join('') : '<span>Alternativa cercana</span>'}</p>
          <p class="quiz-res__precio">${v.ml}ml — ${formatPrecio(v.precio)}</p>
          <div class="quiz-res__acciones">
            <button type="button" class="sugerencia__btn" data-quiz="ver" data-product-id="${x.p.id}">Ver notas</button>
            <button type="button" class="sugerencia__btn sugerencia__btn--add" data-quiz="add" data-product-id="${x.p.id}" data-ml="${v.ml}">+ Agregar</button>
          </div>
        </div>
      </article>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-card quiz-card--res">
      <h3 class="quiz-pregunta">Tus 3 perfumes ideales</h3>
      <p class="quiz-ayuda">${r.oc} · ${r.cl} · ${r.pf} · ${r.pr}</p>
      <div class="quiz-res-lista">${tarjetas}</div>
      <div class="quiz-fin">
        <a class="btn-whatsapp quiz-wa" id="quiz-wa" href="${quizWaLink(top, r)}" target="_blank" rel="noopener">Pedir mi recomendación por WhatsApp</a>
        <button type="button" class="quiz-atras" id="quiz-repetir">↻ Repetir el test</button>
      </div>
    </div>`;
}

function quizWaLink(top, r) {
  const lista = top.map((x, i) => `${i + 1}. ${x.p.marca} ${x.p.nombre}`).join('\n');
  const msg = `Hola! Hice el test de Imaginary Scents.\nBusco: ${r.oc} · ${r.cl} · ${r.pf} · ${r.pr}.\n\nMe salieron:\n${lista}\n\n¿Me ayudas a elegir?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function initQuiz() {
  const app = document.getElementById('quiz-app');
  if (!app) return;
  renderQuiz();

  app.addEventListener('click', (event) => {
    const op = event.target.closest('.quiz-opcion');
    if (op) return quizResponder(op.dataset.v);
    if (event.target.closest('#quiz-atras')) { quizEstado.paso = Math.max(0, quizEstado.paso - 1); return renderQuiz(); }
    if (event.target.closest('#quiz-siguiente')) { quizEstado.paso += 1; renderQuiz(); return quizScrollArriba(); }
    if (event.target.closest('#quiz-repetir')) { quizEstado = { paso: 0, resp: {} }; renderQuiz(); return quizScrollArriba(); }

    const b = event.target.closest('[data-quiz]');
    if (!b) return;
    const product = PRODUCTS.find((p) => p.id === b.dataset.productId);
    if (!product) return;
    if (b.dataset.quiz === 'ver') abrirNotas(product.id);
    else {
      const v = product.variantes.find((x) => String(x.ml) === b.dataset.ml) || product.variantes[0];
      addToCart(product, v);
      openCart();
    }
  });
}

document.addEventListener('DOMContentLoaded', initQuiz);
