/* ==========================================================================
   INKAS GOLDEN — constructor de la web
   Uso: node herramientas/construir.js
   Lee contenido/sitio.js (español) y contenido/sitio.en.js (solo los textos en
   inglés) y escribe todas las páginas: español en la raíz, inglés en en/.
   Las páginas generadas no se editan a mano: se cambia el contenido y se
   vuelve a correr. Los precios, fotos y enlaces salen solo de sitio.js.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RAIZ = path.resolve(__dirname, '..');
delete require.cache[require.resolve('../contenido/sitio.js')];
delete require.cache[require.resolve('../contenido/sitio.en.js')];
const ES = require('../contenido/sitio.js');
const EN = require('../contenido/sitio.en.js');

const PAGINAS = {};
const faltas = new Set();
const sinTraducir = new Set();

// --- idioma --------------------------------------------------------------------
// LANG decide los textos; BASE es el camino a la raíz (las páginas en inglés
// viven en en/ y los recursos son los mismos).
let LANG = 'es';
let BASE = '';
let S = ES;
let MARCA = ES.MARCA;
let CONTACTO = ES.CONTACTO;
let CATEGORIAS = ES.CATEGORIAS;
let TOURS = ES.TOURS;
const L = (es, en) => (LANG === 'en' ? en : es);

// El contenido en inglés se arma sobre el español: textos de sitio.en.js,
// todo lo demás (precios, fotos, slugs, enlaces) de sitio.js.
function contenidoEn() {
  const tours = ES.TOURS.map((t) => {
    const tr = EN.TOURS[t.slug];
    if (!tr) sinTraducir.add('tour ' + t.slug);
    return { ...t, ...(tr || {}) };
  });
  const categorias = ES.CATEGORIAS.map((c) => {
    const tr = EN.CATEGORIAS[c.clave];
    if (!tr) sinTraducir.add('categoría ' + c.clave);
    return { ...c, ...(tr || {}) };
  });
  const destinos = ES.DESTINOS.map((d, i) => ({ ...d, ...(EN.DESTINOS[i] || {}) }));
  return {
    ...ES,
    MARCA: { ...ES.MARCA, ...EN.MARCA },
    CONTACTO: { ...ES.CONTACTO, ...EN.CONTACTO },
    CATEGORIAS: categorias, TOURS: tours, DESTINOS: destinos,
    LLEVAR: EN.LLEVAR, PREGUNTAS: EN.PREGUNTAS, POR_QUE: EN.POR_QUE, PAGOS: EN.PAGOS, GUIAS: EN.GUIAS,
  };
}

function idioma(lang) {
  LANG = lang;
  BASE = lang === 'en' ? '../' : '';
  S = lang === 'en' ? contenidoEn() : ES;
  ({ MARCA, CONTACTO, CATEGORIAS, TOURS } = S);
}

// --- utilidades -------------------------------------------------------------
const esc = (t) => String(t == null ? '' : t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Lo que falta del negocio se ve entre corchetes y queda marcado en el código.
// Se registra en español (la lista de la consola sale una sola vez).
function falta(es, en) {
  faltas.add(es);
  return `<!-- REVISAR --><span class="falta">[${esc(L(es, en || es))}]</span>`;
}
// Si un texto del contenido ya trae [corchetes], se muestran como falta.
function conFaltas(t) {
  return esc(t).replace(/\[([^\]]+)\]/g, (m, x) => { if (LANG === 'es') faltas.add(x); return `<!-- REVISAR --><span class="falta">[${x}]</span>`; });
}

// WhatsApp: sin número confirmado, wa.me/?text= deja elegir el contacto.
function wa(mensaje) {
  return `https://wa.me/${CONTACTO.whatsapp || ''}?text=${encodeURIComponent(mensaje)}`;
}

const img = (nombre) => `${BASE}assets/img/${nombre}.webp`;
const mini = (nombre) => `${BASE}assets/img/mini/${nombre}.webp`;
const catDe = (clave) => CATEGORIAS.find((c) => c.clave === clave);
// Con un solo tour, la tarjeta va ancha (foto al costado) para no dejar la fila vacía.
const claseTarjetas = (lista, base) => base + (lista.length === 1 ? ' tarjetas--una' : '');
const toursDe = (clave) => TOURS.filter((t) => t.cat === clave);
const paginaTour = (t) => `tour-${t.slug}.html`;
const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));

function version(rel) {
  const f = path.join(RAIZ, rel);
  return fs.existsSync(f) ? crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8) : '0';
}

// Precio en soles o dólares, como lo mandó Florencio. Sin moneda, se marca.
function monto(p) {
  if (!p || p.monto == null) return null;
  const n = Number(p.monto).toLocaleString('en-US');
  if (p.moneda === 'PEN') return `S/ ${n}`;
  if (p.moneda === 'USD') return `US$ ${n}`;
  faltas.add('moneda de algunos precios (¿soles o dólares?)');
  return `${n} <!-- REVISAR: moneda --><span class="falta">[${L('¿S/ o US$?', 'S/ or US$?')}]</span>`;
}
function precio(t) {
  const m = monto(t.precio);
  if (m) return `<b>${m}</b>`;
  if (LANG === 'es') faltas.add('precio de ' + t.nombre);
  return `<!-- REVISAR: precio --><span class="falta">${L('Precio por confirmar', 'Price to be confirmed')}</span>`;
}
const porPersona = () => L('por persona', 'per person');

// Foto del tour; si no hay una que sea de ese lugar, un recuadro que lo dice
// (una foto de otro sitio se leería como si fuera ese).
function fotoTarjeta(t) {
  if (t.foto) return `<img src="${mini(t.foto)}" alt="${esc(t.nombre)}" width="720" height="480" loading="lazy">`;
  if (LANG === 'es') faltas.add('foto de ' + t.nombre);
  return `<!-- REVISAR: foto --><span class="sin-foto"><b>${esc(t.nombre)}</b><small>[${L('Foto por conseguir', 'Photo coming soon')}]</small></span>`;
}

// --- iconos (trazos simples, sin librerías) ---------------------------------
const ICONO = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  si: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  no: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  monte: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19l6.5-11 4 6.5 2.5-3.5L21 19Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  idioma: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h11v8H9l-4 3v-3H4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 9h5v7h-1v3l-3-3h-4v-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  paso: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h4l3-6 3 3 6-9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
};

// La marca. El logo real lo genera ChatGPT (regla 8 del hub): basta soltar
// assets/img/logo.png (horizontal, fondo transparente) y, si hay,
// assets/img/isotipo.png (cuadrado, para la pestaña del navegador). Mientras
// tanto va la palabra con el sol dorado.
const LOGO = ['logo.svg', 'logo.png'].find((f) => existe('assets/img/' + f));
const ISOTIPO = ['isotipo.svg', 'isotipo.png'].find((f) => existe('assets/img/' + f));
function logo() {
  const dentro = LOGO
    ? `<img class="marca__logo" src="${BASE}assets/img/${LOGO}" alt="${esc(MARCA.nombre)}" height="44">`
    : `<span class="marca__sol" aria-hidden="true"></span>
      <span class="marca__texto"><span class="marca__inkas">Inkas</span><span class="marca__golden">Golden</span></span>`;
  return `<a class="marca" href="index.html" aria-label="${esc(MARCA.nombre)}, ${L('inicio', 'home')}">
      ${dentro}
    </a>`;
}

// --- cabecera ----------------------------------------------------------------
function idiomas(archivo) {
  return LANG === 'en'
    ? `<span class="barra__idiomas" aria-label="Language"><a href="../${archivo}" hreflang="es" lang="es">ES</a><b aria-current="true">EN</b></span>`
    : `<span class="barra__idiomas" aria-label="Idioma"><b aria-current="true">ES</b><a href="en/${archivo}" hreflang="en" lang="en">EN</a></span>`;
}

function barraSuperior(archivo) {
  const tel = CONTACTO.whatsappVisible ? esc(CONTACTO.whatsappVisible) : falta('WhatsApp');
  const correo = CONTACTO.correo ? esc(CONTACTO.correo) : falta('correo', 'email');
  const horario = CONTACTO.horario ? esc(CONTACTO.horario) : falta('horario de atención', 'opening hours');
  return `<div class="barra">
  <div class="barra__dentro">
    <a class="barra__dato" href="${wa(L('Hola, quiero información sobre sus tours', 'Hello, I would like information about your tours'))}" target="_blank" rel="noopener">${ICONO.wa}<span>${tel}</span></a>
    <span class="barra__dato barra__correo">${correo}</span>
    <span class="barra__dato barra__horario">${horario}</span>
    ${idiomas(archivo)}
  </div>
</div>`;
}

function submenu(cat) {
  const lista = toursDe(cat.clave);
  return `<div class="submenu" id="sub-${cat.clave}">
        <div class="submenu__dentro">
          <a class="submenu__foto" href="${cat.archivo}"><img src="${mini(cat.foto)}" alt="" width="360" height="240" loading="lazy"><span>${esc(cat.titulo)}</span></a>
          <ul class="submenu__lista" role="list">
${lista.map((t) => `            <li><a href="${paginaTour(t)}"><span>${esc(t.nombre)}</span><small>${/\[/.test(t.duracion) ? '' : esc(t.duracion)}</small></a></li>`).join('\n')}
          </ul>
          <a class="submenu__todos" href="${cat.archivo}">${L('Ver todos los tours →', 'See all tours →')}</a>
        </div>
      </div>`;
}

function cabecera(activa, esInicio, archivo) {
  const items = CATEGORIAS.map((c) => `      <li class="nav__item${activa === c.archivo ? ' nav__item--activo' : ''}">
        <button class="nav__boton" type="button" aria-expanded="false" aria-controls="sub-${c.clave}">${esc(c.menu)}${ICONO.flecha}</button>
        ${submenu(c)}
      </li>`).join('\n');
  const simples = [['informacion.html', L('Info útil', 'Travel info')], ['nosotros.html', L('Nosotros', 'About us')], ['contacto.html', L('Contacto', 'Contact')]]
    .map(([h, t]) => `      <li class="nav__item${activa === h ? ' nav__item--activo' : ''}"><a class="nav__enlace" href="${h}">${t}</a></li>`).join('\n');
  return `<header class="cabecera${esInicio ? ' cabecera--inicio' : ''}">
${barraSuperior(archivo)}
<nav class="nav" aria-label="${L('Principal', 'Main')}">
  ${logo()}
  <button class="nav__menu" type="button" aria-expanded="false" aria-controls="nav-lista"><span class="nav__menu-texto">${L('Menú', 'Menu')}</span><span class="nav__menu-rayas" aria-hidden="true"></span></button>
  <div class="nav__panel" id="nav-lista">
    <ul class="nav__lista" role="list">
${items}
${simples}
    </ul>
    <a class="boton boton--oro nav__cta" href="contacto.html#cotizar">${L('Cotiza tu viaje', 'Get a quote')}</a>
  </div>
</nav>
</header>`;
}

function pie() {
  const d = (v, es, en) => (v ? esc(v) : falta(es, en));
  const redes = [['Facebook', CONTACTO.facebook], ['Instagram', CONTACTO.instagram], ['TikTok', CONTACTO.tiktok], ['TripAdvisor', CONTACTO.tripadvisor]]
    .map(([n, u]) => (u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>` : `<span class="pie__apagado">${n} ${falta('enlace', 'link')}</span>`)).join('');
  return `<footer class="pie">
  <div class="pie__dentro">
    <div class="pie__col pie__col--marca">
      ${logo()}
      <p>${esc(MARCA.lema)}. ${L('Tours a Machu Picchu, Cusco y Tambopata.', 'Tours to Machu Picchu, Cusco and Tambopata.')}</p>
      <div class="pie__redes">${redes}</div>
    </div>
    <div class="pie__col">
      <h2 class="pie__titulo">Tours</h2>
      <ul role="list">${CATEGORIAS.map((c) => `<li><a href="${c.archivo}">${esc(c.titulo)}</a></li>`).join('')}</ul>
    </div>
    <div class="pie__col">
      <h2 class="pie__titulo">${L('Información', 'Information')}</h2>
      <ul role="list">
        <li><a href="informacion.html">${L('Info útil para tu viaje', 'Travel information')}</a></li>
        <li><a href="nosotros.html">${L('Nosotros', 'About us')}</a></li>
        <li><a href="contacto.html">${L('Contacto', 'Contact')}</a></li>
        <li><a href="reservas-y-pagos.html">${L('Reservas y pagos', 'Booking and payment')}</a></li>
        <li><a href="libro-de-reclamaciones.html">${L('Libro de reclamaciones', 'Complaints book')}</a></li>
      </ul>
    </div>
    <div class="pie__col">
      <h2 class="pie__titulo">${L('Contacto', 'Contact')}</h2>
      <ul role="list" class="pie__datos">
        <li>WhatsApp: ${d(CONTACTO.whatsappVisible, 'número', 'number')}</li>
        <li>${L('Correo', 'Email')}: ${d(CONTACTO.correo, 'correo', 'email')}</li>
        <li>${L('Oficina', 'Office')}: ${d(CONTACTO.direccion, 'dirección en Cusco', 'address in Cusco')}</li>
        <li>${L('Horario', 'Hours')}: ${d(CONTACTO.horario, 'horario', 'opening hours')}</li>
      </ul>
    </div>
  </div>
  <div class="pie__pagos">
    <h2 class="pie__titulo">${L('Formas de pago', 'Payment methods')}</h2>
    <ul class="pagos" role="list">${S.PAGOS.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
  </div>
  <div class="pie__base">
    <span>© 2026 ${esc(MARCA.nombre)}</span>
    <span>${CONTACTO.razonSocial ? esc(CONTACTO.razonSocial) : falta('razón social', 'company name')} · RUC ${CONTACTO.ruc ? esc(CONTACTO.ruc) : falta('RUC')}</span>
    <span>${L('Fotos de referencia: Unsplash', 'Reference photos: Unsplash')}</span>
  </div>
</footer>
<a class="flotante" href="${wa(L('Hola, quiero información sobre sus tours', 'Hello, I would like information about your tours'))}" target="_blank" rel="noopener" aria-label="${L('Escríbenos por WhatsApp', 'Message us on WhatsApp')}">${ICONO.wa}<span>${L('¿Consultas? Escríbenos', 'Questions? Message us')}</span></a>`;
}

// --- SEO ------------------------------------------------------------------------
// canonical, og:url, og:image, hreflang, migas y sitemap piden la dirección completa:
// sin dominio confirmado no se escriben (sería inventarla). Se encienden solos
// al cargar MARCA.dominio en sitio.js.
const ORIGEN = ES.MARCA.dominio ? (/^https?:/.test(ES.MARCA.dominio) ? ES.MARCA.dominio : 'https://' + ES.MARCA.dominio).replace(/\/$/, '') : null;
const urlDe = (archivo, lang = LANG) => `${ORIGEN}/${lang === 'en' ? 'en/' : ''}${archivo === 'index.html' ? '' : archivo}`;
const jsonLd = (dato) => `\n<script type="application/ld+json">${JSON.stringify(dato).replace(/</g, '\\u003c')}</script>`;

function agencia(descripcion) {
  const [calle, ...resto] = (CONTACTO.direccion || '').split(', ');
  const dato = {
    '@context': 'https://schema.org', '@type': 'TravelAgency',
    name: MARCA.nombre, description: descripcion,
    telephone: CONTACTO.whatsapp ? '+' + CONTACTO.whatsapp : undefined,
    email: CONTACTO.correo || undefined,
    address: calle ? { '@type': 'PostalAddress', streetAddress: calle, addressLocality: resto.join(', ') || 'Cusco', addressRegion: 'Cusco', addressCountry: 'PE' } : undefined,
    areaServed: ['Cusco', 'Machu Picchu', 'Valle Sagrado', 'Tambopata', 'Manu', 'Puno'],
    knowsLanguage: ['es', 'en'],
    paymentAccepted: (S.PAGOS || []).join(', '),
    currenciesAccepted: 'PEN, USD',
    // openingHours: REVISAR. El horario es de 8 a 8, pero no está confirmado qué días.
  };
  if (ORIGEN) {
    dato.url = urlDe('index.html');
    dato.image = `${ORIGEN}/assets/img/machu-picchu.webp`;
    if (LOGO) dato.logo = `${ORIGEN}/assets/img/${LOGO}`;
  }
  return dato;
}

function seo(o) {
  let h = `\n<meta property="og:site_name" content="${esc(MARCA.nombre)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.titulo)}">
<meta name="twitter:description" content="${esc(o.descripcion)}">`;
  if (ORIGEN) {
    const foto = `${ORIGEN}/assets/img/${o.foto || 'machu-picchu'}.webp`;
    h += `\n<link rel="canonical" href="${urlDe(o.archivo)}">
<link rel="alternate" hreflang="es" href="${urlDe(o.archivo, 'es')}">
<link rel="alternate" hreflang="en" href="${urlDe(o.archivo, 'en')}">
<link rel="alternate" hreflang="x-default" href="${urlDe(o.archivo, 'es')}">
<meta property="og:url" content="${urlDe(o.archivo)}">
<meta property="og:image" content="${foto}">
<meta name="twitter:image" content="${foto}">`;
    if (o.migas) {
      h += jsonLd({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [[L('Inicio', 'Home'), 'index.html'], ...o.migas].map(([nombre, archivo], i) => ({ '@type': 'ListItem', position: i + 1, name: nombre, item: urlDe(archivo) })),
      });
    }
  }
  if (o.clase === 'inicio') h += jsonLd(agencia(o.descripcion));
  return h;
}

function pagina(o) {
  const vCss = version('assets/css/style.css');
  const vJs = version('assets/js/main.js');
  const vDat = version('assets/js/datos.js');
  const icono = ISOTIPO ? `\n<link rel="icon" href="${BASE}assets/img/${ISOTIPO}">` : '';
  return `<!doctype html>
<html lang="${L('es-PE', 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.titulo)}</title>
<meta name="description" content="${esc(o.descripcion)}">
<meta name="theme-color" content="#16120d">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(o.titulo)}">
<meta property="og:description" content="${esc(o.descripcion)}">
<meta property="og:locale" content="${L('es_PE', 'en_US')}">${seo(o)}${icono}
<!-- Generado por herramientas/construir.js: no editar a mano, se sobrescribe. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${BASE}assets/css/style.css?v=${vCss}">
</head>
<body class="${o.clase || 'pagina'}">
<a class="saltar" href="#contenido">${L('Saltar al contenido', 'Skip to content')}</a>
${cabecera(o.activa, o.clase === 'inicio', o.archivo)}
<main id="contenido">
${o.cuerpo}
</main>
${pie()}
<script src="${BASE}assets/js/datos.js?v=${vDat}"></script>
<script src="${BASE}assets/js/main.js?v=${vJs}" defer></script>
</body>
</html>
`;
}

// Guarda la página en su idioma: español en la raíz, inglés en en/.
function guardar(archivo, o) {
  PAGINAS[(LANG === 'en' ? 'en/' : '') + archivo] = pagina({ ...o, archivo });
}

// --- piezas -------------------------------------------------------------------
function tarjeta(t) {
  return `<li class="tarjeta revelar">
      <a href="${paginaTour(t)}">
        <span class="tarjeta__foto">${fotoTarjeta(t)}<span class="tarjeta__dur">${ICONO.reloj}${conFaltas(t.duracion)}</span></span>
        <span class="tarjeta__cuerpo">
          <span class="tarjeta__nivel">${esc(t.dificultad)} · ${esc(t.altura)}</span>
          <b class="tarjeta__nombre">${esc(t.nombre)}</b>
          <span class="tarjeta__lugares">${t.lugares.slice(0, 4).map(conFaltas).join(' · ')}</span>
          <span class="tarjeta__pie"><span class="tarjeta__precio">${precio(t)}${t.precio && t.precio.monto != null ? `<small> ${porPersona()}</small>` : ''}</span><span class="tarjeta__ver">${L('Ver tour →', 'See tour →')}</span></span>
        </span>
      </a>
    </li>`;
}

function cab(num, titulo, bajada, enlace) {
  return `<div class="cab">
    <p class="cab__num">${String(num).padStart(2, '0')}</p>
    <div class="cab__texto">
      <h2 class="cab__titulo">${esc(titulo)}</h2>
      ${bajada ? `<p class="cab__bajada">${esc(bajada)}</p>` : ''}
    </div>
    ${enlace ? `<a class="cab__todos" href="${enlace[0]}">${esc(enlace[1])}</a>` : ''}
  </div>`;
}

function preguntas(lista) {
  return `<div class="preguntas">
${lista.map(([p, r], i) => `    <details class="pregunta"${i === 0 ? ' open' : ''}><summary>${esc(p)}${ICONO.flecha}</summary><p>${conFaltas(r)}</p></details>`).join('\n')}
  </div>`;
}

function bandaFinal(texto, mensaje) {
  return `<section class="banda">
  <div class="banda__fondo"><img src="${img('machu-picchu-atardecer')}" alt="" loading="lazy" width="1600" height="1067"></div>
  <div class="banda__dentro">
    <p class="dato">${L('¿Listo para viajar?', 'Ready to travel?')}</p>
    <h2 class="banda__titulo">${esc(texto)}</h2>
    <div class="banda__botones">
      <a class="boton boton--oro" href="${wa(mensaje)}" target="_blank" rel="noopener">${ICONO.wa} ${L('Cotizar por WhatsApp', 'Get a quote on WhatsApp')}</a>
      <a class="boton boton--linea" href="contacto.html#cotizar">${L('Armar mi viaje', 'Plan my trip')}</a>
    </div>
  </div>
</section>`;
}

const opcionesViajeros = () => `${[1, 2, 3, 4, 5, 6].map((x) => `<option>${x}</option>`).join('')}<option>${L('7 o más', '7 or more')}</option>`;
const migas = (partes) => `<nav class="migas" aria-label="${L('Estás en', 'You are here')}"><a href="index.html">${L('Inicio', 'Home')}</a>${partes.map(([t, h]) => `<span>/</span>${h ? `<a href="${h}">${esc(t)}</a>` : `<span>${esc(t)}</span>`}`).join('')}</nav>`;

// --- portada ------------------------------------------------------------------
function paginaInicio() {
  const opciones = CATEGORIAS.map((c) => `<option>${esc(c.titulo)}</option>`).join('');
  let n = 0;
  const filas = CATEGORIAS.map((c) => {
    const lista = toursDe(c.clave).slice().sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)).slice(0, 4);
    return `<section class="seccion fila" id="${c.clave}">
  ${cab(++n, c.titulo, c.bajada, [c.archivo, L('Ver todos →', 'See all →')])}
  <ul class="${claseTarjetas(lista, 'tarjetas tarjetas--fila')}" role="list">
    ${lista.map(tarjeta).join('\n    ')}
  </ul>
</section>`;
  }).join('\n\n');

  const giro = `<section class="giro" id="destinos" style="--n:${S.DESTINOS.length}" aria-label="${L('Destinos', 'Destinations')}">
  <div class="giro__fijo">
${S.DESTINOS.map((d, i) => `    <figure class="giro__foto${i === 0 ? ' activo' : ''}" data-i="${i}"><img src="${img(d.foto)}" alt="${esc(d.nombre)}" width="1600" height="1067" loading="${i === 0 ? 'eager' : 'lazy'}"></figure>`).join('\n')}
    <div class="giro__velo"></div>
    <div class="giro__texto">
      <p class="dato dato--oro">${String(++n).padStart(2, '0')} — ${L('Destinos', 'Destinations')}</p>
      <div class="giro__pila">
${S.DESTINOS.map((d, i) => `        <div class="giro__destino${i === 0 ? ' activo' : ''}" data-i="${i}">
          <h2 class="giro__nombre">${esc(d.nombre)}</h2>
          <p class="giro__bajada">${esc(d.texto)}</p>
          <a class="boton boton--linea" href="${d.href}">${L('Ver tours →', 'See tours →')}</a>
        </div>`).join('\n')}
      </div>
    </div>
    <ol class="giro__lista" role="list">
${S.DESTINOS.map((d, i) => `      <li class="${i === 0 ? 'activo' : ''}" data-i="${i}"><a href="${d.href}">${esc(d.nombre)}</a></li>`).join('\n')}
    </ol>
  </div>
</section>`;

  const porQue = `<section class="seccion">
  ${cab(++n, L(`¿Por qué viajar con ${MARCA.nombre}?`, `Why travel with ${MARCA.nombre}?`))}
  <ul class="razones" role="list">
${S.POR_QUE.map(([t, d], i) => `    <li class="razon revelar"><span class="razon__num">${i + 1}</span><h3>${conFaltas(t)}</h3><p>${conFaltas(d)}</p></li>`).join('\n')}
  </ul>
</section>`;

  const opiniones = `<section class="seccion seccion--piedra">
  ${cab(++n, L('Lo que dicen nuestros viajeros', 'What our travelers say'))}
  <div class="opiniones">
    <!-- REVISAR: reseñas reales de Google, cuando exista el Perfil de Negocio. Nunca se inventa una. -->
    <p class="opiniones__vacio">${falta('Reseñas reales de Google: se juntan cuando la agencia tenga su Perfil de Negocio', 'Real Google reviews: coming once the agency has its Business Profile')}</p>
  </div>
</section>`;

  const info = `<section class="seccion">
  ${cab(++n, L('Antes de viajar', 'Before you travel'), L('Lo que más preguntan los viajeros.', 'What travelers ask us most.'), ['informacion.html', L('Toda la información →', 'All the information →')])}
  ${preguntas(S.PREGUNTAS)}
</section>`;

  const cuerpo = `<section class="hero">
  <div class="hero__fondo"><img src="${img('machu-picchu')}" alt="Machu Picchu" width="1600" height="1067" fetchpriority="high"></div>
  <div class="hero__velo"></div>
  <div class="hero__dentro">
    <div class="hero__texto">
      <p class="dato dato--oro">${esc(MARCA.lema)}</p>
      <h1 class="hero__titulo">${L('Tours a Machu Picchu, Cusco y Tambopata', 'Tours to Machu Picchu, Cusco and Tambopata')}</h1>
      <p class="hero__bajada">${L('Del Valle Sagrado a la selva amazónica, con una agencia de Cusco.', 'From the Sacred Valley to the Amazon rainforest, with a Cusco agency.')}</p>
      <div class="hero__botones">
        <a class="boton boton--oro" href="#machu-picchu">${L('Ver tours', 'See tours')}</a>
        <a class="boton boton--linea" href="${wa(L('Hola, quiero cotizar un viaje a Cusco', 'Hello, I would like a quote for a trip to Cusco'))}" target="_blank" rel="noopener">${ICONO.wa} ${L('Cotizar por WhatsApp', 'Get a quote on WhatsApp')}</a>
      </div>
    </div>
    <form class="disena" data-disena>
      <p class="disena__titulo">${L('Diseña tu viaje', 'Plan your trip')}</p>
      <label>${L('Destino', 'Destination')}<select name="destino" id="disena-destino">${opciones}<option>${L('Todavía no sé', 'Not sure yet')}</option></select></label>
      <label>${L('Fecha de llegada', 'Arrival date')}<input type="date" name="fecha" id="disena-fecha"></label>
      <label>${L('Viajeros', 'Travelers')}<select name="personas" id="disena-personas">${opcionesViajeros()}</select></label>
      <button class="boton boton--oro" type="submit">${ICONO.wa} ${L('Cotizar gratis', 'Free quote')}</button>
      <p class="disena__nota">${L('Te respondemos por WhatsApp.', 'We reply on WhatsApp.')}</p>
    </form>
  </div>
</section>

${filas}

${giro}

${porQue}

${opiniones}

${info}

${bandaFinal(L('Cuéntanos cuántos días tienes y armamos tu viaje.', 'Tell us how many days you have and we will plan your trip.'), L('Hola, quiero armar un viaje a Cusco', 'Hello, I would like to plan a trip to Cusco'))}`;

  guardar('index.html', {
    titulo: L(`${MARCA.nombre} — Tours a Machu Picchu, Cusco y Tambopata`, `${MARCA.nombre} — Tours to Machu Picchu, Cusco and Tambopata`),
    descripcion: L(`${MARCA.nombre}, agencia de viajes en Cusco: tours a Machu Picchu, Valle Sagrado, Montaña de 7 Colores, Laguna Humantay, Salkantay, Tambopata, Manu y el Lago Titicaca.`,
      `${MARCA.nombre}, a travel agency in Cusco: tours to Machu Picchu, the Sacred Valley, Rainbow Mountain, Humantay Lake, Salkantay, Tambopata, Manu and Lake Titicaca.`),
    clase: 'inicio', activa: 'index.html', cuerpo,
  });
}

// --- categorías ---------------------------------------------------------------
function paginaCategoria(c) {
  const otras = CATEGORIAS.filter((x) => x !== c);
  const cuerpo = `<section class="pcabeza">
  <div class="pcabeza__fondo"><img src="${img(c.foto)}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    ${migas([[c.titulo]])}
    <h1 class="pcabeza__titulo">${esc(c.titulo)}</h1>
    <p class="pcabeza__bajada">${esc(c.bajada)}</p>
  </div>
</section>

<section class="seccion">
  <p class="intro">${esc(c.intro)}</p>
  <ul class="${claseTarjetas(toursDe(c.clave), 'tarjetas')}" role="list">
    ${toursDe(c.clave).map(tarjeta).join('\n    ')}
  </ul>
</section>

<section class="seccion seccion--piedra">
  ${cab(1, L('Otros tours', 'Other tours'))}
  <ul class="categorias" role="list">
${otras.map((o) => `    <li><a class="categoria revelar" href="${o.archivo}"><img src="${mini(o.foto)}" alt="" width="720" height="480" loading="lazy"><span>${esc(o.titulo)}</span></a></li>`).join('\n')}
  </ul>
</section>

${bandaFinal(L('¿No encuentras el tour que buscas? Te lo armamos.', 'Can\'t find the tour you want? We will put it together for you.'), L(`Hola, quiero información sobre ${c.titulo.toLowerCase()}`, `Hello, I would like information about ${c.titulo}`))}`;
  guardar(c.archivo, {
    titulo: `${c.titulo} — ${MARCA.nombre}`,
    descripcion: L(`${c.titulo} con ${MARCA.nombre}, agencia de viajes en Cusco. ${c.bajada}`, `${c.titulo} with ${MARCA.nombre}, a travel agency in Cusco. ${c.bajada}`),
    activa: c.archivo, cuerpo, foto: c.foto, migas: [[c.titulo, c.archivo]],
  });
}

// --- tour -----------------------------------------------------------------------
function paginaTourHtml(t) {
  const c = catDe(t.cat);
  const llevar = t.llevar || S.LLEVAR[t.cat];
  const relacionados = toursDe(t.cat).filter((x) => x !== t).slice(0, 3);
  const duracionTexto = /\[/.test(t.duracion) || t.nombre.includes(t.duracion) ? '' : ` (${t.duracion})`;
  const msg = L(`Hola, quiero reservar el tour ${t.nombre}${duracionTexto}`, `Hello, I would like to book the tour ${t.nombre}${duracionTexto}`);
  const delPrograma = t.fuente === 'programa' ? ` <span class="etiqueta etiqueta--ok">${L('Programa completo', 'Full program')}</span>` : '';

  const chicas = t.galeria.slice(0, 6);
  const galeria = t.foto
    ? `<div class="galeria galeria--n${chicas.length}">
    <figure class="galeria__grande"><img src="${img(t.foto)}" alt="${esc(t.nombre)}" width="1600" height="1067"></figure>
${chicas.map((g) => `    <figure><img src="${mini(g)}" alt="" width="720" height="480" loading="lazy"></figure>`).join('\n')}
  </div>`
    : `<div class="galeria galeria--sin">${fotoTarjeta(t)}</div>`;

  const itinerario = t.itinerario
    ? `<div class="itinerario">
${t.itinerario.map((d, i) => `          <details class="dia"${i === 0 ? ' open' : ''}>
            <summary><span class="dia__num">${String(i + 1).padStart(2, '0')}</span>${conFaltas(d.titulo)}${ICONO.flecha}</summary>
            <ol role="list">${d.pasos.map((p) => `<li>${conFaltas(p)}</li>`).join('')}</ol>
          </details>`).join('\n')}
        </div>
        ${t.notaItinerario ? `<p class="bloque__nota">${conFaltas(t.notaItinerario)}</p>` : ''}
        ${t.fuente === 'programa' ? '' : `<p class="bloque__nota">${falta('Horarios de este tour', 'Times for this tour')}</p>`}`
    : `<p>${falta('Itinerario de este tour', 'Itinerary for this tour')}</p>`;

  const lista = (items, clase, icono) => `<ul role="list" class="${clase}">${items.map((x) => `<li>${icono}<span>${conFaltas(x)}</span></li>`).join('')}</ul>`;
  const incluye = `<div class="incluye">
          <div><h3 class="bloque__sub">${L('Incluye', 'Included')}</h3>${t.incluye ? lista(t.incluye, 'incluye__si', ICONO.si) : `<p>${falta('Qué incluye', 'What is included')}</p>`}</div>
          <div><h3 class="bloque__sub">${L('No incluye', 'Not included')}</h3>${t.noIncluye ? lista(t.noIncluye, 'incluye__no', ICONO.no) : `<p>${falta('Qué no incluye', 'What is not included')}</p>`}</div>
        </div>`;

  const cuerpo = `<div class="tour">
  <div class="tour__cabeza">
    ${migas([[c.titulo, c.archivo], [t.nombre]]).replace('class="migas"', 'class="migas migas--oscuras"')}
    <h1 class="tour__titulo">${esc(t.nombre)}</h1>
    <ul class="tour__datos" role="list">
      <li>${ICONO.reloj}<span><small>${L('Duración', 'Duration')}</small>${conFaltas(t.duracion)}</span></li>
      <li>${ICONO.paso}<span><small>${L('Dificultad', 'Difficulty')}</small>${esc(t.dificultad)}</span></li>
      <li>${ICONO.monte}<span><small>${L('Altura', 'Altitude')}</small>${esc(t.altura)}</span></li>
      <li>${ICONO.idioma}<span><small>${L('Guía', 'Guide')}</small>${esc(S.GUIAS)}</span></li>
    </ul>
  </div>

  ${galeria}

  <div class="tour__cuerpo">
    <div class="tour__principal">
      <section class="bloque">
        <h2 class="bloque__titulo">${L('Resumen', 'Overview')}</h2>
        <p class="tour__resumen">${esc(t.resumen)}</p>
        <h3 class="bloque__sub">${L('Lugares que visitarás', 'Places you will visit')}</h3>
        <ul class="lugares" role="list">${t.lugares.map((l) => `<li>${conFaltas(l)}</li>`).join('')}</ul>
      </section>
${t.alojamiento ? `
      <section class="bloque">
        <h2 class="bloque__titulo">${L('Alojamiento', 'Accommodation')}</h2>
        <p>${conFaltas(t.alojamiento)}</p>
      </section>
` : ''}
      <section class="bloque">
        <h2 class="bloque__titulo">${L('Itinerario', 'Itinerary')}${delPrograma}</h2>
        ${itinerario}
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">${L('Qué incluye', 'What is included')}${delPrograma}</h2>
        ${incluye}
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">${L('Qué llevar', 'What to bring')}</h2>
        <ul role="list" class="llevar">${llevar.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">${L('Precio', 'Price')}</h2>
        <table class="precios">
          <tbody>
            <tr><th scope="row">${L('Precio del tour', 'Tour price')}</th><td>${precio(t)} ${porPersona()}</td></tr>
            <tr><th scope="row">${L('Tour privado', 'Private tour')}</th><td>${falta('por confirmar', 'to be confirmed')}</td></tr>
            <tr><th scope="row">${L('Descuentos (estudiantes, niños)', 'Discounts (students, children)')}</th><td>${falta('por confirmar', 'to be confirmed')}</td></tr>
          </tbody>
        </table>
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">${L('Preguntas frecuentes', 'Frequently asked questions')}</h2>
        ${preguntas(S.PREGUNTAS.slice(0, 4))}
      </section>
    </div>

    <aside class="reserva" id="reservar" aria-label="${L('Reservar', 'Book')}">
      <div class="reserva__caja">
        <p class="reserva__precio">${precio(t)}<small>${L('Por persona', 'Per person')} · ${esc(t.nombre)}</small></p>
        <form data-reserva data-tour="${esc(t.nombre)}${esc(duracionTexto)}">
          <label>${L('Fecha', 'Date')}<input type="date" name="fecha" id="reserva-fecha"></label>
          <label>${L('Viajeros', 'Travelers')}<select name="personas" id="reserva-personas">${opcionesViajeros()}</select></label>
          <label>${L('Tu nombre', 'Your name')}<input type="text" name="nombre" id="reserva-nombre" autocomplete="name" placeholder="${L('Opcional', 'Optional')}"></label>
          <button class="boton boton--oro" type="submit">${ICONO.wa} ${L('Reservar por WhatsApp', 'Book on WhatsApp')}</button>
        </form>
        <p class="reserva__nota">${L('Te confirmamos disponibilidad y precio por WhatsApp antes de cualquier pago.', 'We confirm availability and the price on WhatsApp before any payment.')}</p>
        <ul class="pagos pagos--claro" role="list" aria-label="${L('Formas de pago', 'Payment methods')}">${S.PAGOS.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <p class="reserva__nota"><a href="reservas-y-pagos.html">${L('Cómo reservar y pagar', 'How to book and pay')}</a></p>
      </div>
    </aside>
  </div>
</div>

${relacionados.length ? `<section class="seccion seccion--piedra">
  ${cab(1, L('Tours relacionados', 'Related tours'), null, [c.archivo, L('Ver todos →', 'See all →')])}
  <ul class="${claseTarjetas(relacionados, 'tarjetas')}" role="list">
    ${relacionados.map(tarjeta).join('\n    ')}
  </ul>
</section>` : ''}

<a class="reservar-movil" href="${wa(msg)}" target="_blank" rel="noopener"><span>${precio(t)}</span><b>${ICONO.wa} ${L('Reservar', 'Book')}</b></a>`;
  guardar(paginaTour(t), {
    titulo: `${t.nombre} — ${MARCA.nombre}`,
    descripcion: L(`${t.nombre}${duracionTexto} con ${MARCA.nombre}. ${t.resumen}`, `${t.nombre}${duracionTexto} with ${MARCA.nombre}. ${t.resumen}`),
    activa: c.archivo, cuerpo, clase: 'pagina pagina--tour', foto: t.foto,
    migas: [[c.titulo, c.archivo], [t.nombre, paginaTour(t)]],
  });
}

// --- info útil ------------------------------------------------------------------
const TEMAS = {
  es: [
    ['epoca', 'Mejor época para viajar', ['La temporada seca va de mayo a septiembre: días soleados y noches frías en Cusco. Es también la temporada con más viajeros.', 'De diciembre a marzo es la temporada de lluvias. El Camino Inca cierra en febrero por mantenimiento.']],
    ['altura', 'La altura y el soroche', ['Cusco está a unos 3,400 m; Machu Picchu, más abajo, a unos 2,430 m. El primer día conviene descansar, comer liviano y tomar agua.', 'Los tours más altos —la Montaña de 7 Colores, a más de 5,000 m, y la Laguna Humantay, a unos 4,200 m— se dejan para después de dos o tres días en Cusco.']],
    ['machu-picchu', 'Cómo llegar a Machu Picchu', ['En tren: desde Cusco o desde Ollantaytambo hasta Aguas Calientes, y de ahí en bus hasta la entrada.', 'Por tierra: en carro hasta la Hidroeléctrica y unas tres horas de caminata junto a la vía del tren.', 'A pie: por el Camino Inca, con permiso oficial, o por rutas alternativas como el Salkantay.']],
    ['entradas', 'Entradas a Machu Picchu', ['Las entradas son por horario y por circuito, y tienen un cupo diario limitado. Se piden con el pasaporte o documento de identidad original.', 'Huayna Picchu y la montaña Machu Picchu tienen cupos aparte, todavía más limitados.']],
    ['tambopata', 'Cómo llegar a Tambopata', ['Puerto Maldonado tiene aeropuerto con vuelos desde Cusco y Lima. Desde Cusco también se llega en bus por la carretera Interoceánica.', 'Desde Puerto Maldonado, los albergues se alcanzan en bote por los ríos Madre de Dios y Tambopata.']],
  ],
  en: [
    ['epoca', 'Best time to travel', ['The dry season runs from May to September: sunny days and cold nights in Cusco. It is also the busiest season.', 'December to March is the rainy season. The Inca Trail closes in February for maintenance.']],
    ['altura', 'Altitude and soroche', ['Cusco is at about 3,400 m; Machu Picchu, lower down, at about 2,430 m. On your first day, rest, eat light and drink water.', 'Leave the highest tours —Rainbow Mountain, over 5,000 m, and Humantay Lake, at about 4,200 m— until you have spent two or three days in Cusco.']],
    ['machu-picchu', 'How to get to Machu Picchu', ['By train: from Cusco or Ollantaytambo to Aguas Calientes, then by bus to the entrance.', 'Overland: by car to Hidroeléctrica and about three hours on foot along the railway.', 'On foot: on the Inca Trail, with an official permit, or on alternative routes such as Salkantay.']],
    ['entradas', 'Machu Picchu tickets', ['Tickets are sold by time slot and by circuit, with a limited daily quota. You need your original passport or ID.', 'Huayna Picchu and Machu Picchu Mountain have separate quotas, even more limited.']],
    ['tambopata', 'How to get to Tambopata', ['Puerto Maldonado has an airport with flights from Cusco and Lima. From Cusco you can also go by bus on the Interoceanic Highway.', 'From Puerto Maldonado, the lodges are reached by boat on the Madre de Dios and Tambopata rivers.']],
  ],
};

function paginaInformacion() {
  const temas = TEMAS[LANG];
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('cusco')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    ${migas([[L('Info útil', 'Travel info')]])}
    <h1 class="pcabeza__titulo">${L('Información para tu viaje', 'Information for your trip')}</h1>
    <p class="pcabeza__bajada">${L('Lo que conviene saber antes de viajar a Cusco, Machu Picchu y Tambopata.', 'What to know before you travel to Cusco, Machu Picchu and Tambopata.')}</p>
  </div>
</section>

<section class="seccion">
  <div class="info">
    <nav class="info__indice" aria-label="${L('Temas', 'Topics')}">
${temas.map(([id, t]) => `      <a href="#${id}">${esc(t)}</a>`).join('\n')}
    </nav>
    <div class="info__temas">
${temas.map(([id, t, ps], i) => `      <article class="tema" id="${id}"><p class="cab__num">${String(i + 1).padStart(2, '0')}</p><h2>${esc(t)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join('')}</article>`).join('\n')}
    </div>
  </div>
</section>

<section class="seccion seccion--piedra">
  ${cab(1, L('Preguntas frecuentes', 'Frequently asked questions'))}
  ${preguntas(S.PREGUNTAS)}
</section>

${bandaFinal(L('¿Tienes otra duda? Pregúntanos.', 'Any other question? Ask us.'), L('Hola, tengo una pregunta sobre mi viaje', 'Hello, I have a question about my trip'))}`;
  guardar('informacion.html', {
    titulo: L(`Información para viajar a Cusco y Machu Picchu — ${MARCA.nombre}`, `Travel information for Cusco and Machu Picchu — ${MARCA.nombre}`),
    descripcion: L('Mejor época para viajar, la altura, cómo llegar a Machu Picchu y a Tambopata, y cómo funcionan las entradas.', 'Best time to travel, the altitude, how to get to Machu Picchu and Tambopata, and how the tickets work.'),
    activa: 'informacion.html', cuerpo,
  });
}

// --- nosotros y contacto ----------------------------------------------------------
function paginaNosotros() {
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('valle-sagrado')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    ${migas([[L('Nosotros', 'About us')]])}
    <h1 class="pcabeza__titulo">${L('Nosotros', 'About us')}</h1>
    <p class="pcabeza__bajada">${esc(MARCA.nombre)}, ${L('agencia de viajes en Cusco', 'a travel agency in Cusco')}.</p>
  </div>
</section>

<section class="seccion">
  <div class="nosotros">
    <div class="nosotros__texto">
      <h2 class="cab__titulo">${L('Nuestra historia', 'Our story')}</h2>
      <!-- Rodrigo (23/09 y 24/09): 20-25 años en el turismo; el dueño es la única persona de la agencia.
           NO está registrada en DIRCETUR: no se menciona. REVISAR: cómo empezó, y si el dueño quiere aparecer con su nombre. -->
      <p>${L('Llevamos más de 20 años en el turismo, organizando viajes desde Cusco a Machu Picchu, los valles, las montañas y la selva.', 'We have been in tourism for over 20 years, organizing trips from Cusco to Machu Picchu, the valleys, the mountains and the rainforest.')}</p>
      <p>${L('Somos una agencia pequeña: te atiende directamente el dueño, desde la primera consulta hasta el final del viaje.', 'We are a small agency: the owner looks after you personally, from your first question to the end of your trip.')}</p>
      <p>${falta('Cómo empezó la agencia, y el nombre del dueño si quiere que aparezca', 'How the agency started, and the owner\'s name if he wants it shown')}</p>
    </div>
    <figure class="nosotros__foto">
      <!-- REVISAR: foto real del equipo o de la oficina (no de banco de imágenes) -->
      <div class="nosotros__hueco">${falta('Foto del equipo o de la oficina', 'Photo of the team or the office')}</div>
    </figure>
  </div>
</section>

<section class="seccion seccion--piedra">
  ${cab(1, L(`¿Por qué viajar con ${MARCA.nombre}?`, `Why travel with ${MARCA.nombre}?`))}
  <ul class="razones" role="list">
${S.POR_QUE.map(([t, d], i) => `    <li class="razon"><span class="razon__num">${i + 1}</span><h3>${conFaltas(t)}</h3><p>${conFaltas(d)}</p></li>`).join('\n')}
  </ul>
</section>

${bandaFinal(L('Conversemos sobre tu viaje.', 'Let\'s talk about your trip.'), L('Hola, quiero conocer más sobre la agencia', 'Hello, I would like to know more about the agency'))}`;
  guardar('nosotros.html', {
    titulo: `${L('Nosotros', 'About us')} — ${MARCA.nombre}`,
    descripcion: L(`${MARCA.nombre}, agencia de viajes en Cusco.`, `${MARCA.nombre}, a travel agency in Cusco.`),
    activa: 'nosotros.html', cuerpo,
  });
}

// Condiciones de reserva: 3 de las 10 webs de Tambopata tienen su página
// («Booking Policy and Conditions», «Términos y condiciones»). Solo se afirma
// lo que es cierto de cómo funciona esta web; lo del negocio va por confirmar.
function paginaReservas() {
  const pasos = L([
    ['Escríbenos', 'Por WhatsApp o desde el botón «Reservar» de cada tour, con el tour, la fecha y cuántas personas viajan.'],
    ['Te confirmamos', 'Revisamos la disponibilidad —en Machu Picchu y en los trenes los cupos son limitados— y te confirmamos el precio.'],
    ['Adelanto', '[Monto o porcentaje del adelanto para confirmar la reserva, y cuándo se paga]'],
    ['Saldo', '[Cuándo y cómo se paga el resto]'],
  ], [
    ['Write to us', 'On WhatsApp or with the "Book" button on each tour, with the tour, the date and how many people are traveling.'],
    ['We confirm', 'We check availability —Machu Picchu and the trains have limited spaces— and confirm the price.'],
    ['Deposit', '[Deposit amount or percentage to confirm the booking, and when it is paid]'],
    ['Balance', '[When and how the rest is paid]'],
  ]);
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('lodge-botes')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    ${migas([[L('Reservas y pagos', 'Booking and payment')]])}
    <h1 class="pcabeza__titulo">${L('Reservas y pagos', 'Booking and payment')}</h1>
    <p class="pcabeza__bajada">${L('Cómo reservar un tour, cómo pagarlo y qué pasa si necesitas cambiar la fecha.', 'How to book a tour, how to pay for it and what happens if you need to change the date.')}</p>
  </div>
</section>

<section class="seccion">
  ${cab(1, L('Cómo reservar', 'How to book'))}
  <ol class="razones" role="list">
${pasos.map(([t, d], i) => `    <li class="razon"><span class="razon__num">${i + 1}</span><h3>${esc(t)}</h3><p>${conFaltas(d)}</p></li>`).join('\n')}
  </ol>
</section>

<section class="seccion seccion--piedra">
  <div class="info__temas">
    <article class="tema" id="datos"><p class="cab__num">02</p><h2>${L('Qué datos necesitamos', 'What details we need')}</h2>
      <p>${L('Para Machu Picchu y los trenes: nombre completo, número de pasaporte o DNI y nacionalidad de cada viajero, porque las entradas y los pasajes van a nombre de cada persona.', 'For Machu Picchu and the trains: full name, passport or ID number and nationality of each traveler, because tickets are issued in each person\'s name.')}</p>
      <p>${L('Para los tours desde Cusco: el nombre de tu hotel, para el recojo.', 'For tours from Cusco: the name of your hotel, for the pickup.')}</p></article>
    <article class="tema" id="pagos"><p class="cab__num">03</p><h2>${L('Formas de pago', 'Payment methods')}</h2>
      <p>${L('Yape, Plin, transferencia bancaria, tarjeta, PayPal o efectivo.', 'Yape, Plin, bank transfer, card, PayPal or cash.')}</p></article>
    <article class="tema" id="cancelaciones"><p class="cab__num">04</p><h2>${L('Cambios y cancelaciones', 'Changes and cancellations')}</h2>
      <!-- REVISAR: plazos y devoluciones. Las entradas a Machu Picchu y los trenes suelen tener sus propias reglas. -->
      <p>${falta('Política de cambios y cancelaciones', 'Change and cancellation policy')}</p></article>
    <article class="tema" id="seguro"><p class="cab__num">05</p><h2>${L('Seguro de viaje', 'Travel insurance')}</h2>
      <p>${falta('Si la agencia lo incluye, lo recomienda o lo exige', 'Whether the agency includes, recommends or requires it')}</p></article>
  </div>
</section>

${bandaFinal(L('¿Listo para reservar? Escríbenos.', 'Ready to book? Message us.'), L('Hola, quiero reservar un tour', 'Hello, I would like to book a tour'))}`;
  guardar('reservas-y-pagos.html', {
    titulo: `${L('Reservas y pagos', 'Booking and payment')} — ${MARCA.nombre}`,
    descripcion: L(`Cómo reservar un tour con ${MARCA.nombre}: datos que necesitamos, formas de pago y cambios.`, `How to book a tour with ${MARCA.nombre}: the details we need, payment methods and changes.`),
    activa: 'reservas-y-pagos.html', cuerpo,
  });
}

function paginaContacto() {
  const d = (v, es, en) => (v ? esc(v) : falta(es, en));
  const opciones = CATEGORIAS.map((c) => `<option>${esc(c.titulo)}</option>`).join('');
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('machu-picchu-nubes')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    ${migas([[L('Contacto', 'Contact')]])}
    <h1 class="pcabeza__titulo">${L('Contacto', 'Contact')}</h1>
    <p class="pcabeza__bajada">${L('Cuéntanos qué quieres conocer y te enviamos una propuesta.', 'Tell us what you would like to see and we will send you a proposal.')}</p>
  </div>
</section>

<section class="seccion">
  <div class="contacto">
    <form class="cotizar" id="cotizar" data-cotizar>
      <h2 class="cab__titulo">${L('Cotiza tu viaje', 'Get a quote for your trip')}</h2>
      <label>${L('Tu nombre', 'Your name')}<input type="text" name="nombre" id="cotizar-nombre" autocomplete="name" required></label>
      <label>${L('¿Qué quieres conocer?', 'What would you like to see?')}<select name="destino" id="cotizar-destino">${opciones}<option>${L('Varios destinos', 'Several destinations')}</option></select></label>
      <div class="cotizar__doble">
        <label>${L('Fecha de llegada', 'Arrival date')}<input type="date" name="fecha" id="cotizar-fecha"></label>
        <label>${L('Viajeros', 'Travelers')}<select name="personas" id="cotizar-personas">${opcionesViajeros()}</select></label>
      </div>
      <label>${L('¿Algo más?', 'Anything else?')}<textarea name="mensaje" id="cotizar-mensaje" rows="4" placeholder="${L('Días que tienes, hotel, si viajas con niños…', 'How many days you have, your hotel, whether you travel with children…')}"></textarea></label>
      <button class="boton boton--oro" type="submit">${ICONO.wa} ${L('Enviar por WhatsApp', 'Send on WhatsApp')}</button>
    </form>
    <div class="contacto__datos">
      <h2 class="cab__titulo">${L('Datos', 'Details')}</h2>
      <dl>
        <dt>WhatsApp</dt><dd>${d(CONTACTO.whatsappVisible, 'número', 'number')}</dd>
        <dt>${L('Correo', 'Email')}</dt><dd>${d(CONTACTO.correo, 'correo', 'email')}</dd>
        <dt>${L('Oficina', 'Office')}</dt><dd>${d(CONTACTO.direccion, 'dirección en Cusco', 'address in Cusco')}</dd>
        <dt>${L('Horario', 'Hours')}</dt><dd>${d(CONTACTO.horario, 'horario', 'opening hours')}</dd>
        <dt>RUC</dt><dd>${d(CONTACTO.ruc, 'RUC')}</dd>
      </dl>
      <div class="contacto__mapa">${falta('Mapa de la oficina (Google Maps)', 'Office map (Google Maps)')}</div>
      <div class="reclamaciones" id="reclamaciones">
        <h3>${L('Libro de reclamaciones', 'Complaints book')}</h3>
        <p><a href="libro-de-reclamaciones.html">${L('Ingresar al libro de reclamaciones', 'Open the complaints book')}</a></p>
      </div>
    </div>
  </div>
</section>`;
  guardar('contacto.html', {
    titulo: `${L('Contacto', 'Contact')} — ${MARCA.nombre}`,
    descripcion: L(`Cotiza tu viaje a Machu Picchu, Cusco y Tambopata con ${MARCA.nombre}.`, `Get a quote for your trip to Machu Picchu, Cusco and Tambopata with ${MARCA.nombre}.`),
    activa: 'contacto.html', cuerpo,
  });
}

// --- libro de reclamaciones -------------------------------------------------------
// Hoja de reclamación virtual con los campos del Anexo I del Reglamento del
// Libro de Reclamaciones (D. S. 011-2011-PCM y modificatorias; Ley 29571).
// REVISAR (sin verificar con INDECOPI ni con un abogado): los datos del
// proveedor (RUC, razón social, dirección) y el envío. Para cumplir, cada hoja
// tiene que quedar registrada con número correlativo y la constancia tiene que
// llegar al correo del consumidor: eso necesita un servidor (webhook de n8n o
// un servicio de libro virtual). Hoy el formulario arma la hoja, la muestra
// para copiar y abre WhatsApp con ella.
function paginaLibro() {
  const d = (v, es, en) => (v ? esc(v) : falta(es, en));
  const opcion = (name, id, value, texto, req) => `<label class="opcion"><input type="radio" name="${name}" id="${id}" value="${esc(value)}"${req ? ' required' : ''}><span>${texto}</span></label>`;
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('cusco')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    ${migas([[L('Libro de reclamaciones', 'Complaints book')]])}
    <h1 class="pcabeza__titulo">${L('Libro de reclamaciones', 'Complaints book')}</h1>
    <p class="pcabeza__bajada">${L('Hoja de reclamación virtual, conforme al Código de Protección y Defensa del Consumidor.', 'Virtual complaint form (Libro de Reclamaciones), as required by Peru\'s Consumer Protection Code.')}</p>
  </div>
</section>

<section class="seccion">
  <div class="libro">
    <form class="cotizar libro__hoja" id="libro" data-libro novalidate>
      <fieldset class="libro__grupo">
        <legend>${L('Proveedor', 'Provider')}</legend>
        <dl class="libro__proveedor">
          <dt>${L('Nombre comercial', 'Trade name')}</dt><dd>${esc(MARCA.nombre)}</dd>
          <dt>${L('Razón social', 'Company name')}</dt><dd>${d(CONTACTO.razonSocial, 'razón social', 'company name')}</dd>
          <dt>RUC</dt><dd>${d(CONTACTO.ruc, 'RUC')}</dd>
          <dt>${L('Dirección', 'Address')}</dt><dd>${d(CONTACTO.direccion, 'dirección en Cusco', 'address in Cusco')}</dd>
          <dt>${L('Fecha', 'Date')}</dt><dd data-hoy>—</dd>
        </dl>
      </fieldset>

      <fieldset class="libro__grupo">
        <legend>1. ${L('Identificación del consumidor reclamante', 'Details of the person filing the complaint')}</legend>
        <label>${L('Nombre completo', 'Full name')}<input type="text" name="nombre" id="libro-nombre" autocomplete="name" required></label>
        <div class="cotizar__doble">
          <label>${L('Documento', 'Document')}<select name="tipoDoc" id="libro-tipo-doc"><option>DNI</option><option>${L('Carné de extranjería', 'Foreigner ID card')}</option><option>${L('Pasaporte', 'Passport')}</option></select></label>
          <label>${L('Número de documento', 'Document number')}<input type="text" name="numDoc" id="libro-num-doc" required></label>
        </div>
        <label>${L('Domicilio', 'Address')}<input type="text" name="domicilio" id="libro-domicilio" autocomplete="street-address" required></label>
        <div class="cotizar__doble">
          <label>${L('Teléfono', 'Phone')}<input type="tel" name="telefono" id="libro-telefono" autocomplete="tel" required></label>
          <label>${L('Correo electrónico', 'Email')}<input type="email" name="correo" id="libro-correo" autocomplete="email" required></label>
        </div>
        <label>${L('Si eres menor de edad: nombre de tu padre, madre o apoderado', 'If you are under 18: name of your parent or guardian')}<input type="text" name="apoderado" id="libro-apoderado"></label>
      </fieldset>

      <fieldset class="libro__grupo">
        <legend>2. ${L('Identificación del bien contratado', 'What you purchased')}</legend>
        <div class="libro__opciones" role="radiogroup" aria-label="${L('Tipo', 'Type')}">
          ${opcion('bien', 'libro-bien-servicio', L('Servicio', 'Service'), L('Servicio', 'Service'), true)}
          ${opcion('bien', 'libro-bien-producto', L('Producto', 'Product'), L('Producto', 'Product'))}
        </div>
        <div class="cotizar__doble">
          <label>${L('Tour o servicio', 'Tour or service')}<input type="text" name="descripcion" id="libro-descripcion" required></label>
          <label>${L('Monto reclamado', 'Amount claimed')}<input type="text" name="monto" id="libro-monto" inputmode="decimal" placeholder="${L('Ej.: S/ 85 o US$ 310', 'E.g. S/ 85 or US$ 310')}"></label>
        </div>
      </fieldset>

      <fieldset class="libro__grupo">
        <legend>3. ${L('Detalle de la reclamación y pedido del consumidor', 'Details of the complaint and your request')}</legend>
        <div class="libro__opciones" role="radiogroup" aria-label="${L('Tipo', 'Type')}">
          ${opcion('tipo', 'libro-tipo-reclamo', L('Reclamo', 'Reclamo (complaint)'), `<b>${L('Reclamo', 'Reclamo')}</b> ${L('Disconformidad relacionada a los productos o servicios.', 'Disagreement about the products or services.')}`, true)}
          ${opcion('tipo', 'libro-tipo-queja', L('Queja', 'Queja (grievance)'), `<b>${L('Queja', 'Queja')}</b> ${L('Disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público.', 'Disagreement not related to the products or services; or dissatisfaction with how you were attended.')}`)}
        </div>
        <label>${L('Detalle', 'Details')}<textarea name="detalle" id="libro-detalle" rows="5" required></textarea></label>
        <label>${L('Pedido', 'What you are asking for')}<textarea name="pedido" id="libro-pedido" rows="3" required></textarea></label>
      </fieldset>

      <fieldset class="libro__grupo">
        <legend>4. ${L('Observaciones y acciones adoptadas por el proveedor', 'Observations and actions taken by the provider')}</legend>
        <p class="libro__nota">${L('La completa la agencia al responder.', 'Completed by the agency when it replies.')}</p>
      </fieldset>

      <label class="opcion libro__acepto"><input type="checkbox" name="acepto" id="libro-acepto" required><span>${L('Declaro que los datos son verdaderos y autorizo su uso solo para atender esta reclamación.', 'I declare that these details are true and authorize their use only to handle this complaint.')}</span></label>
      <p class="libro__error" data-libro-error hidden>${L('Completa los campos obligatorios y marca la casilla.', 'Please fill in the required fields and tick the box.')}</p>
      <button class="boton boton--oro" type="submit">${ICONO.wa} ${L('Enviar hoja de reclamación', 'Send the complaint form')}</button>
      <p class="libro__nota">${falta('Registro con número correlativo y envío de la constancia a tu correo: se conecta cuando la agencia tenga RUC', 'Registration with a serial number and a copy sent to your email: connected once the agency has its RUC')}</p>
    </form>

    <aside class="libro__lado">
      <div class="reclamaciones">
        <h2 class="libro__titulo">${L('Importante', 'Important')}</h2>
        <p>${L('La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.', 'Filing a complaint does not prevent you from using other ways to resolve the dispute, and it is not a prerequisite for filing a claim with INDECOPI.')}</p>
        <p>${L('El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles improrrogables.', 'The provider must reply to the complaint within fifteen (15) business days, which cannot be extended.')}</p>
      </div>
      <div class="libro__copia" data-libro-copia hidden>
        <h2 class="libro__titulo">${L('Tu hoja de reclamación', 'Your complaint form')}</h2>
        <p>${L('Se abrirá WhatsApp con tu hoja lista para enviar a la agencia. Guarda también esta copia.', 'WhatsApp will open with your form ready to send to the agency. Keep this copy as well.')}</p>
        <pre data-libro-texto></pre>
        <button class="boton boton--linea libro__copiar" type="button" data-libro-copiar>${L('Copiar', 'Copy')}</button>
      </div>
    </aside>
  </div>
</section>`;
  guardar('libro-de-reclamaciones.html', {
    titulo: `${L('Libro de reclamaciones', 'Complaints book')} — ${MARCA.nombre}`,
    descripcion: L(`Libro de reclamaciones virtual de ${MARCA.nombre}.`, `${MARCA.nombre} virtual complaints book (Libro de Reclamaciones).`),
    activa: 'libro-de-reclamaciones.html', cuerpo,
  });
}

// --- construir -------------------------------------------------------------------
function construirIdioma(lang) {
  idioma(lang);
  paginaInicio();
  CATEGORIAS.forEach(paginaCategoria);
  TOURS.forEach(paginaTourHtml);
  paginaInformacion();
  paginaNosotros();
  paginaContacto();
  paginaReservas();
  paginaLibro();
}

function construir() {
  fs.writeFileSync(path.join(RAIZ, 'assets/js/datos.js'),
    '// Generado por herramientas/construir.js\nwindow.INKAS = ' + JSON.stringify({ marca: ES.MARCA.nombre, whatsapp: ES.CONTACTO.whatsapp || '' }) + ';\n');

  construirIdioma('es');
  construirIdioma('en');

  // Enlaces rotos: todo href interno tiene que existir (página o archivo),
  // resuelto desde la carpeta de cada página.
  const rotos = [];
  for (const [nombre, html] of Object.entries(PAGINAS)) {
    const dir = path.posix.dirname(nombre);
    for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const ref = m[1];
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      const destino = path.posix.normalize(path.posix.join(dir, ref));
      if (!PAGINAS[destino] && !fs.existsSync(path.join(RAIZ, destino))) rotos.push(`${nombre} → ${ref}`);
    }
  }
  if (rotos.length) {
    console.error('✗ Enlaces rotos, no se escribe nada:\n  ' + [...new Set(rotos)].join('\n  '));
    process.exit(1);
  }

  // Borrar páginas que ya no se generan.
  const registro = path.join(RAIZ, 'contenido/.generadas.json');
  const antes = fs.existsSync(registro) ? JSON.parse(fs.readFileSync(registro, 'utf8')) : [];
  antes.filter((f) => !PAGINAS[f]).forEach((f) => { try { fs.unlinkSync(path.join(RAIZ, f)); } catch (e) {} });
  for (const [nombre, html] of Object.entries(PAGINAS)) {
    fs.mkdirSync(path.dirname(path.join(RAIZ, nombre)), { recursive: true });
    fs.writeFileSync(path.join(RAIZ, nombre), html);
  }
  fs.writeFileSync(registro, JSON.stringify(Object.keys(PAGINAS), null, 1));

  // robots.txt siempre; el sitemap solo con dominio (pide direcciones completas).
  const sitemap = path.join(RAIZ, 'sitemap.xml');
  fs.writeFileSync(path.join(RAIZ, 'robots.txt'), `User-agent: *\nAllow: /\n${ORIGEN ? `\nSitemap: ${ORIGEN}/sitemap.xml\n` : ''}`);
  if (ORIGEN) {
    const urls = Object.keys(PAGINAS).map((f) => `  <url><loc>${ORIGEN}/${f.replace(/(^|\/)index\.html$/, '$1')}</loc></url>`);
    fs.writeFileSync(sitemap, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  } else if (fs.existsSync(sitemap)) fs.unlinkSync(sitemap);

  const enIngles = Object.keys(PAGINAS).filter((f) => f.startsWith('en/')).length;
  console.log(`✓ ${Object.keys(PAGINAS).length} páginas (${Object.keys(PAGINAS).length - enIngles} en español, ${enIngles} en inglés) · ${ES.TOURS.length} tours en ${ES.CATEGORIAS.length} categorías`);
  if (LOGO) console.log(`  Logo: assets/img/${LOGO}`); else console.log('  Logo: todavía la palabra (soltar assets/img/logo.png cuando llegue)');
  console.log(ORIGEN ? `  SEO: ${ORIGEN} (canonical, hreflang, og:image y sitemap.xml)` : '  SEO: sin dominio → canonical, hreflang, og:image y sitemap.xml apagados (cargar MARCA.dominio en sitio.js)');
  if (sinTraducir.size) console.log(`  ⚠ Sin traducir al inglés (sale en español): ${[...sinTraducir].join(', ')}`);
  console.log(`  ${faltas.size} datos distintos por confirmar (REVISAR):`);
  [...faltas].forEach((f) => console.log('    · ' + f));
}

construir();
