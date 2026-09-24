/* ==========================================================================
   INKAS GOLDEN — constructor de la web
   Uso: node herramientas/construir.js
   Lee contenido/sitio.js y escribe todas las páginas en la raíz. Las páginas
   generadas no se editan a mano: se cambia sitio.js y se vuelve a correr.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RAIZ = path.resolve(__dirname, '..');
delete require.cache[require.resolve('../contenido/sitio.js')];
const S = require('../contenido/sitio.js');
const { MARCA, CONTACTO, CATEGORIAS, TOURS } = S;

const PAGINAS = {};
const faltas = new Set();

// --- utilidades -------------------------------------------------------------
const esc = (t) => String(t == null ? '' : t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Lo que falta del negocio se ve entre corchetes y queda marcado en el código.
function falta(texto) {
  faltas.add(texto);
  return `<!-- REVISAR --><span class="falta">[${esc(texto)}]</span>`;
}
// Si un texto de sitio.js ya trae [corchetes], se muestran como falta.
function conFaltas(t) {
  return esc(t).replace(/\[([^\]]+)\]/g, (m, x) => { faltas.add(x); return `<!-- REVISAR --><span class="falta">[${x}]</span>`; });
}

// WhatsApp: sin número confirmado, wa.me/?text= deja elegir el contacto.
function wa(mensaje) {
  return `https://wa.me/${CONTACTO.whatsapp || ''}?text=${encodeURIComponent(mensaje)}`;
}

const img = (nombre) => `assets/img/${nombre}.webp`;
const mini = (nombre) => `assets/img/mini/${nombre}.webp`;
const catDe = (clave) => CATEGORIAS.find((c) => c.clave === clave);
const toursDe = (clave) => TOURS.filter((t) => t.cat === clave);
const paginaTour = (t) => `tour-${t.slug}.html`;

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
  return `${n} <!-- REVISAR: moneda --><span class="falta">[¿S/ o US$?]</span>`;
}
function precio(t) {
  const m = monto(t.precio);
  if (m) return `<b>${m}</b>`;
  faltas.add('precio de ' + t.nombre);
  return '<!-- REVISAR: precio --><span class="falta">Precio por confirmar</span>';
}

// Foto del tour; si no hay una que sea de ese lugar, un recuadro que lo dice
// (una foto de otro sitio se leería como si fuera ese).
function fotoTarjeta(t) {
  if (t.foto) return `<img src="${mini(t.foto)}" alt="${esc(t.nombre)}" width="720" height="480" loading="lazy">`;
  faltas.add('foto de ' + t.nombre);
  return `<!-- REVISAR: foto --><span class="sin-foto"><b>${esc(t.nombre)}</b><small>[Foto por conseguir]</small></span>`;
}

// --- iconos (trazos simples, sin librerías) ---------------------------------
const ICONO = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  si: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  no: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  monte: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19l6.5-11 4 6.5 2.5-3.5L21 19Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  paso: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h4l3-6 3 3 6-9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
};

// La marca: palabra, hasta que llegue el logo de Inkas Golden (REVISAR).
function logo() {
  return `<a class="marca" href="index.html" aria-label="${esc(MARCA.nombre)}, inicio">
      <span class="marca__sol" aria-hidden="true"></span>
      <span class="marca__texto"><span class="marca__inkas">Inkas</span><span class="marca__golden">Golden</span></span>
    </a>`;
}

// --- cabecera ----------------------------------------------------------------
function barraSuperior() {
  const tel = CONTACTO.whatsappVisible ? esc(CONTACTO.whatsappVisible) : falta('WhatsApp');
  const correo = CONTACTO.correo ? esc(CONTACTO.correo) : falta('correo');
  const horario = CONTACTO.horario ? esc(CONTACTO.horario) : falta('horario de atención');
  return `<div class="barra">
  <div class="barra__dentro">
    <a class="barra__dato" href="${wa('Hola, quiero información sobre sus tours')}" target="_blank" rel="noopener">${ICONO.wa}<span>${tel}</span></a>
    <span class="barra__dato barra__correo">${correo}</span>
    <span class="barra__dato barra__horario">${horario}</span>
    <span class="barra__idiomas" aria-label="Idioma"><b>ES</b><span title="Versión en inglés: por hacer">EN</span></span>
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
          <a class="submenu__todos" href="${cat.archivo}">Ver todos los tours →</a>
        </div>
      </div>`;
}

function cabecera(activa, esInicio) {
  const items = CATEGORIAS.map((c) => `      <li class="nav__item${activa === c.archivo ? ' nav__item--activo' : ''}">
        <button class="nav__boton" type="button" aria-expanded="false" aria-controls="sub-${c.clave}">${esc(c.menu)}${ICONO.flecha}</button>
        ${submenu(c)}
      </li>`).join('\n');
  const simples = [['informacion.html', 'Info útil'], ['nosotros.html', 'Nosotros'], ['contacto.html', 'Contacto']]
    .map(([h, t]) => `      <li class="nav__item${activa === h ? ' nav__item--activo' : ''}"><a class="nav__enlace" href="${h}">${t}</a></li>`).join('\n');
  return `<header class="cabecera${esInicio ? ' cabecera--inicio' : ''}">
${barraSuperior()}
<nav class="nav" aria-label="Principal">
  ${logo()}
  <button class="nav__menu" type="button" aria-expanded="false" aria-controls="nav-lista"><span class="nav__menu-texto">Menú</span><span class="nav__menu-rayas" aria-hidden="true"></span></button>
  <div class="nav__panel" id="nav-lista">
    <ul class="nav__lista" role="list">
${items}
${simples}
    </ul>
    <a class="boton boton--oro nav__cta" href="contacto.html#cotizar">Cotiza tu viaje</a>
  </div>
</nav>
</header>`;
}

function pie() {
  const d = (v, t) => (v ? esc(v) : falta(t));
  const redes = [['Facebook', CONTACTO.facebook], ['Instagram', CONTACTO.instagram], ['TikTok', CONTACTO.tiktok], ['TripAdvisor', CONTACTO.tripadvisor]]
    .map(([n, u]) => (u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>` : `<span class="pie__apagado">${n} ${falta('enlace')}</span>`)).join('');
  return `<footer class="pie">
  <div class="pie__dentro">
    <div class="pie__col pie__col--marca">
      ${logo()}
      <p>${esc(MARCA.lema)}. Tours a Machu Picchu, Cusco y Tambopata.</p>
      <div class="pie__redes">${redes}</div>
    </div>
    <div class="pie__col">
      <h2 class="pie__titulo">Tours</h2>
      <ul role="list">${CATEGORIAS.map((c) => `<li><a href="${c.archivo}">${esc(c.titulo)}</a></li>`).join('')}</ul>
    </div>
    <div class="pie__col">
      <h2 class="pie__titulo">Información</h2>
      <ul role="list">
        <li><a href="informacion.html">Info útil para tu viaje</a></li>
        <li><a href="nosotros.html">Nosotros</a></li>
        <li><a href="contacto.html">Contacto</a></li>
        <li><a href="reservas-y-pagos.html">Reservas y pagos</a></li>
        <li><a href="contacto.html#reclamaciones">Libro de reclamaciones</a></li>
      </ul>
    </div>
    <div class="pie__col">
      <h2 class="pie__titulo">Contacto</h2>
      <ul role="list" class="pie__datos">
        <li>WhatsApp: ${d(CONTACTO.whatsappVisible, 'número')}</li>
        <li>Correo: ${d(CONTACTO.correo, 'correo')}</li>
        <li>Oficina: ${d(CONTACTO.direccion, 'dirección en Cusco')}</li>
        <li>Horario: ${d(CONTACTO.horario, 'horario')}</li>
      </ul>
    </div>
  </div>
  <div class="pie__base">
    <span>© 2026 ${esc(MARCA.nombre)}</span>
    <span>${CONTACTO.razonSocial ? esc(CONTACTO.razonSocial) : falta('razón social')} · RUC ${CONTACTO.ruc ? esc(CONTACTO.ruc) : falta('RUC')}</span>
    <span>Fotos de referencia: Unsplash</span>
  </div>
</footer>
<a class="flotante" href="${wa('Hola, quiero información sobre sus tours')}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">${ICONO.wa}<span>¿Consultas? Escríbenos</span></a>`;
}

function pagina(o) {
  const vCss = version('assets/css/style.css');
  const vJs = version('assets/js/main.js');
  const vDat = version('assets/js/datos.js');
  return `<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.titulo)}</title>
<meta name="description" content="${esc(o.descripcion)}">
<meta name="theme-color" content="#16120d">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(o.titulo)}">
<meta property="og:description" content="${esc(o.descripcion)}">
<meta property="og:locale" content="es_PE">
<!-- Generado por herramientas/construir.js: no editar a mano, se sobrescribe. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/css/style.css?v=${vCss}">
</head>
<body class="${o.clase || 'pagina'}">
<a class="saltar" href="#contenido">Saltar al contenido</a>
${cabecera(o.activa, o.clase === 'inicio')}
<main id="contenido">
${o.cuerpo}
</main>
${pie()}
<script src="assets/js/datos.js?v=${vDat}"></script>
<script src="assets/js/main.js?v=${vJs}" defer></script>
</body>
</html>
`;
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
          <span class="tarjeta__pie"><span class="tarjeta__precio">${precio(t)}</span><span class="tarjeta__ver">Ver tour →</span></span>
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
${lista.map(([p, r], i) => `    <details class="pregunta"${i === 0 ? ' open' : ''}><summary>${esc(p)}${ICONO.flecha}</summary><p>${esc(r)}</p></details>`).join('\n')}
  </div>`;
}

function bandaFinal(texto, mensaje) {
  return `<section class="banda">
  <div class="banda__fondo"><img src="${img('machu-picchu-atardecer')}" alt="" loading="lazy" width="1600" height="1067"></div>
  <div class="banda__dentro">
    <p class="dato">¿Listo para viajar?</p>
    <h2 class="banda__titulo">${esc(texto)}</h2>
    <div class="banda__botones">
      <a class="boton boton--oro" href="${wa(mensaje)}" target="_blank" rel="noopener">${ICONO.wa} Cotizar por WhatsApp</a>
      <a class="boton boton--linea" href="contacto.html#cotizar">Armar mi viaje</a>
    </div>
  </div>
</section>`;
}

// --- portada ------------------------------------------------------------------
function paginaInicio() {
  const opciones = CATEGORIAS.map((c) => `<option>${esc(c.titulo)}</option>`).join('');
  let n = 0;
  const filas = CATEGORIAS.map((c) => `<section class="seccion fila" id="${c.clave}">
  ${cab(++n, c.titulo, c.bajada, [c.archivo, 'Ver todos →'])}
  <ul class="tarjetas tarjetas--fila" role="list">
    ${toursDe(c.clave).slice().sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)).slice(0, 4).map(tarjeta).join('\n    ')}
  </ul>
</section>`).join('\n\n');

  const giro = `<section class="giro" id="destinos" style="--n:${S.DESTINOS.length}" aria-label="Destinos">
  <div class="giro__fijo">
${S.DESTINOS.map((d, i) => `    <figure class="giro__foto${i === 0 ? ' activo' : ''}" data-i="${i}"><img src="${img(d.foto)}" alt="${esc(d.nombre)}" width="1600" height="1067" loading="${i === 0 ? 'eager' : 'lazy'}"></figure>`).join('\n')}
    <div class="giro__velo"></div>
    <div class="giro__texto">
      <p class="dato dato--oro">${String(++n).padStart(2, '0')} — Destinos</p>
      <div class="giro__pila">
${S.DESTINOS.map((d, i) => `        <div class="giro__destino${i === 0 ? ' activo' : ''}" data-i="${i}">
          <h2 class="giro__nombre">${esc(d.nombre)}</h2>
          <p class="giro__bajada">${esc(d.texto)}</p>
          <a class="boton boton--linea" href="${d.href}">Ver tours →</a>
        </div>`).join('\n')}
      </div>
    </div>
    <ol class="giro__lista" role="list">
${S.DESTINOS.map((d, i) => `      <li class="${i === 0 ? 'activo' : ''}" data-i="${i}"><a href="${d.href}">${esc(d.nombre)}</a></li>`).join('\n')}
    </ol>
  </div>
</section>`;

  const porQue = `<section class="seccion">
  ${cab(++n, `¿Por qué viajar con ${MARCA.nombre}?`)}
  <ul class="razones" role="list">
${S.POR_QUE.map(([t, d], i) => `    <li class="razon revelar"><span class="razon__num">${i + 1}</span><h3>${conFaltas(t)}</h3><p>${conFaltas(d)}</p></li>`).join('\n')}
  </ul>
</section>`;

  const opiniones = `<section class="seccion seccion--piedra">
  ${cab(++n, 'Lo que dicen nuestros viajeros')}
  <div class="opiniones">
    <!-- REVISAR: reseñas reales de TripAdvisor o Google. Nunca se inventa una. -->
    <p class="opiniones__vacio">${falta('Reseñas reales de TripAdvisor o Google: 3 a 6, con nombre y país')}</p>
  </div>
</section>`;

  const info = `<section class="seccion">
  ${cab(++n, 'Antes de viajar', 'Lo que más preguntan los viajeros.', ['informacion.html', 'Toda la información →'])}
  ${preguntas(S.PREGUNTAS)}
</section>`;

  const cuerpo = `<section class="hero">
  <div class="hero__fondo"><img src="${img('machu-picchu')}" alt="Machu Picchu" width="1600" height="1067" fetchpriority="high"></div>
  <div class="hero__velo"></div>
  <div class="hero__dentro">
    <div class="hero__texto">
      <p class="dato dato--oro">${esc(MARCA.lema)}</p>
      <h1 class="hero__titulo">Tours a Machu Picchu, Cusco y Tambopata</h1>
      <p class="hero__bajada">Del Valle Sagrado a la selva amazónica, con una agencia de Cusco.</p>
      <div class="hero__botones">
        <a class="boton boton--oro" href="#machu-picchu">Ver tours</a>
        <a class="boton boton--linea" href="${wa('Hola, quiero cotizar un viaje a Cusco')}" target="_blank" rel="noopener">${ICONO.wa} Cotizar por WhatsApp</a>
      </div>
    </div>
    <form class="disena" data-disena>
      <p class="disena__titulo">Diseña tu viaje</p>
      <label>Destino<select name="destino">${opciones}<option>Todavía no sé</option></select></label>
      <label>Fecha de llegada<input type="date" name="fecha"></label>
      <label>Viajeros<select name="personas">${[1, 2, 3, 4, 5, 6].map((x) => `<option>${x}</option>`).join('')}<option>7 o más</option></select></label>
      <button class="boton boton--oro" type="submit">${ICONO.wa} Cotizar gratis</button>
      <p class="disena__nota">Te respondemos por WhatsApp.</p>
    </form>
  </div>
</section>

${filas}

${giro}

${porQue}

${opiniones}

${info}

${bandaFinal('Cuéntanos cuántos días tienes y armamos tu viaje.', 'Hola, quiero armar un viaje a Cusco')}`;

  PAGINAS['index.html'] = pagina({
    titulo: `${MARCA.nombre} — Tours a Machu Picchu, Cusco y Tambopata`,
    descripcion: `${MARCA.nombre}, agencia de viajes en Cusco: tours a Machu Picchu, Valle Sagrado, Montaña de 7 Colores, Laguna Humantay, Salkantay, Tambopata, Manu y el Lago Titicaca.`,
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
    <nav class="migas" aria-label="Estás en"><a href="index.html">Inicio</a><span>/</span><span>${esc(c.titulo)}</span></nav>
    <h1 class="pcabeza__titulo">${esc(c.titulo)}</h1>
    <p class="pcabeza__bajada">${esc(c.bajada)}</p>
  </div>
</section>

<section class="seccion">
  <p class="intro">${esc(c.intro)}</p>
  <ul class="tarjetas" role="list">
    ${toursDe(c.clave).map(tarjeta).join('\n    ')}
  </ul>
</section>

<section class="seccion seccion--piedra">
  ${cab(1, 'Otros tours')}
  <ul class="categorias" role="list">
${otras.map((o) => `    <li><a class="categoria revelar" href="${o.archivo}"><img src="${mini(o.foto)}" alt="" width="720" height="480" loading="lazy"><span>${esc(o.titulo)}</span></a></li>`).join('\n')}
  </ul>
</section>

${bandaFinal(`¿No encuentras el tour que buscas? Te lo armamos.`, `Hola, quiero información sobre ${c.titulo.toLowerCase()}`)}`;
  PAGINAS[c.archivo] = pagina({
    titulo: `${c.titulo} — ${MARCA.nombre}`,
    descripcion: `${c.titulo} con ${MARCA.nombre}, agencia de viajes en Cusco. ${c.bajada}`,
    activa: c.archivo, cuerpo,
  });
}

// --- tour -----------------------------------------------------------------------
function paginaTourHtml(t) {
  const c = catDe(t.cat);
  const llevar = t.llevar || S.LLEVAR[t.cat];
  const relacionados = toursDe(t.cat).filter((x) => x !== t).slice(0, 3);
  const duracionTexto = /\[/.test(t.duracion) ? '' : ` (${t.duracion})`;
  const msg = `Hola, quiero reservar el tour ${t.nombre}${duracionTexto}`;
  const delPrograma = t.fuente === 'programa' ? ' <span class="etiqueta etiqueta--ok">Del programa del operador</span>' : '';

  const galeria = t.foto
    ? `<div class="galeria">
    <figure class="galeria__grande"><img src="${img(t.foto)}" alt="${esc(t.nombre)}" width="1600" height="1067"></figure>
${t.galeria.map((g) => `    <figure><img src="${mini(g)}" alt="" width="720" height="480" loading="lazy"></figure>`).join('\n')}
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
        ${t.fuente === 'programa' ? '' : `<p class="bloque__nota">${falta('Horarios de este tour')}</p>`}`
    : `<p>${falta('Itinerario de este tour')}</p>`;

  const lista = (items, clase, icono) => `<ul role="list" class="${clase}">${items.map((x) => `<li>${icono}<span>${conFaltas(x)}</span></li>`).join('')}</ul>`;
  const incluye = `<div class="incluye">
          <div><h3 class="bloque__sub">Incluye</h3>${t.incluye ? lista(t.incluye, 'incluye__si', ICONO.si) : `<p>${falta('Qué incluye')}</p>`}</div>
          <div><h3 class="bloque__sub">No incluye</h3>${t.noIncluye ? lista(t.noIncluye, 'incluye__no', ICONO.no) : `<p>${falta('Qué no incluye')}</p>`}</div>
        </div>`;

  const cuerpo = `<div class="tour">
  <div class="tour__cabeza">
    <nav class="migas migas--oscuras" aria-label="Estás en"><a href="index.html">Inicio</a><span>/</span><a href="${c.archivo}">${esc(c.titulo)}</a><span>/</span><span>${esc(t.nombre)}</span></nav>
    <h1 class="tour__titulo">${esc(t.nombre)}</h1>
    <ul class="tour__datos" role="list">
      <li>${ICONO.reloj}<span><small>Duración</small>${conFaltas(t.duracion)}</span></li>
      <li>${ICONO.paso}<span><small>Dificultad</small>${esc(t.dificultad)}</span></li>
      <li>${ICONO.monte}<span><small>Altura</small>${esc(t.altura)}</span></li>
    </ul>
  </div>

  ${galeria}

  <div class="tour__cuerpo">
    <div class="tour__principal">
      <section class="bloque">
        <h2 class="bloque__titulo">Resumen</h2>
        <p class="tour__resumen">${esc(t.resumen)}</p>
        <h3 class="bloque__sub">Lugares que visitarás</h3>
        <ul class="lugares" role="list">${t.lugares.map((l) => `<li>${conFaltas(l)}</li>`).join('')}</ul>
      </section>
${t.alojamiento ? `
      <section class="bloque">
        <h2 class="bloque__titulo">Alojamiento</h2>
        <p>${conFaltas(t.alojamiento)}</p>
      </section>
` : ''}
      <section class="bloque">
        <h2 class="bloque__titulo">Itinerario${delPrograma}</h2>
        ${itinerario}
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">Qué incluye${delPrograma}</h2>
        ${incluye}
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">Qué llevar</h2>
        <ul role="list" class="llevar">${llevar.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">Precio</h2>
        <table class="precios">
          <tbody>
            <tr><th scope="row">Precio del tour</th><td>${precio(t)} <!-- REVISAR: ¿por persona? --></td></tr>
            <tr><th scope="row">Tour privado</th><td>${falta('por confirmar')}</td></tr>
            <tr><th scope="row">Descuentos (estudiantes, niños)</th><td>${falta('por confirmar')}</td></tr>
          </tbody>
        </table>
      </section>

      <section class="bloque">
        <h2 class="bloque__titulo">Preguntas frecuentes</h2>
        ${preguntas(S.PREGUNTAS.slice(0, 4))}
      </section>
    </div>

    <aside class="reserva" id="reservar" aria-label="Reservar">
      <div class="reserva__caja">
        <p class="reserva__precio">${precio(t)}<small>${esc(t.nombre)}</small></p>
        <form data-reserva data-tour="${esc(t.nombre)}${esc(duracionTexto)}">
          <label>Fecha<input type="date" name="fecha"></label>
          <label>Viajeros<select name="personas">${[1, 2, 3, 4, 5, 6].map((x) => `<option>${x}</option>`).join('')}<option>7 o más</option></select></label>
          <label>Tu nombre<input type="text" name="nombre" autocomplete="name" placeholder="Opcional"></label>
          <button class="boton boton--oro" type="submit">${ICONO.wa} Reservar por WhatsApp</button>
        </form>
        <p class="reserva__nota">Te confirmamos disponibilidad y precio por WhatsApp antes de cualquier pago. <a href="reservas-y-pagos.html">Cómo reservar y pagar</a></p>
      </div>
    </aside>
  </div>
</div>

${relacionados.length ? `<section class="seccion seccion--piedra">
  ${cab(1, 'Tours relacionados', null, [c.archivo, 'Ver todos →'])}
  <ul class="tarjetas" role="list">
    ${relacionados.map(tarjeta).join('\n    ')}
  </ul>
</section>` : ''}

<a class="reservar-movil" href="${wa(msg)}" target="_blank" rel="noopener"><span>${precio(t)}</span><b>${ICONO.wa} Reservar</b></a>`;
  PAGINAS[paginaTour(t)] = pagina({
    titulo: `${t.nombre} — ${MARCA.nombre}`,
    descripcion: `${t.nombre}${duracionTexto} con ${MARCA.nombre}. ${t.resumen}`,
    activa: c.archivo, cuerpo, clase: 'pagina pagina--tour',
  });
}

// --- info útil ------------------------------------------------------------------
function paginaInformacion() {
  const temas = [
    ['epoca', 'Mejor época para viajar', ['La temporada seca va de mayo a septiembre: días soleados y noches frías en Cusco. Es también la temporada con más viajeros.', 'De diciembre a marzo es la temporada de lluvias. El Camino Inca cierra en febrero por mantenimiento.']],
    ['altura', 'La altura y el soroche', ['Cusco está a unos 3,400 m; Machu Picchu, más abajo, a unos 2,430 m. El primer día conviene descansar, comer liviano y tomar agua.', 'Los tours más altos —la Montaña de 7 Colores, a más de 5,000 m, y la Laguna Humantay, a unos 4,200 m— se dejan para después de dos o tres días en Cusco.']],
    ['machu-picchu', 'Cómo llegar a Machu Picchu', ['En tren: desde Cusco o desde Ollantaytambo hasta Aguas Calientes, y de ahí en bus hasta la entrada.', 'Por tierra: en carro hasta la Hidroeléctrica y unas tres horas de caminata junto a la vía del tren.', 'A pie: por el Camino Inca, con permiso oficial, o por rutas alternativas como el Salkantay.']],
    ['entradas', 'Entradas a Machu Picchu', ['Las entradas son por horario y por circuito, y tienen un cupo diario limitado. Se piden con el pasaporte o documento de identidad original.', 'Huayna Picchu y la montaña Machu Picchu tienen cupos aparte, todavía más limitados.']],
    ['tambopata', 'Cómo llegar a Tambopata', ['Puerto Maldonado tiene aeropuerto con vuelos desde Cusco y Lima. Desde Cusco también se llega en bus por la carretera Interoceánica.', 'Desde Puerto Maldonado, los albergues se alcanzan en bote por los ríos Madre de Dios y Tambopata.']],
  ];
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('cusco')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    <nav class="migas" aria-label="Estás en"><a href="index.html">Inicio</a><span>/</span><span>Info útil</span></nav>
    <h1 class="pcabeza__titulo">Información para tu viaje</h1>
    <p class="pcabeza__bajada">Lo que conviene saber antes de viajar a Cusco, Machu Picchu y Tambopata.</p>
  </div>
</section>

<section class="seccion">
  <div class="info">
    <nav class="info__indice" aria-label="Temas">
${temas.map(([id, t]) => `      <a href="#${id}">${esc(t)}</a>`).join('\n')}
    </nav>
    <div class="info__temas">
${temas.map(([id, t, ps], i) => `      <article class="tema" id="${id}"><p class="cab__num">${String(i + 1).padStart(2, '0')}</p><h2>${esc(t)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join('')}</article>`).join('\n')}
    </div>
  </div>
</section>

<section class="seccion seccion--piedra">
  ${cab(1, 'Preguntas frecuentes')}
  ${preguntas(S.PREGUNTAS)}
</section>

${bandaFinal('¿Tienes otra duda? Pregúntanos.', 'Hola, tengo una pregunta sobre mi viaje')}`;
  PAGINAS['informacion.html'] = pagina({
    titulo: `Información para viajar a Cusco y Machu Picchu — ${MARCA.nombre}`,
    descripcion: 'Mejor época para viajar, la altura, cómo llegar a Machu Picchu y a Tambopata, y cómo funcionan las entradas.',
    activa: 'informacion.html', cuerpo,
  });
}

// --- nosotros y contacto ----------------------------------------------------------
function paginaNosotros() {
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('valle-sagrado')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    <nav class="migas" aria-label="Estás en"><a href="index.html">Inicio</a><span>/</span><span>Nosotros</span></nav>
    <h1 class="pcabeza__titulo">Nosotros</h1>
    <p class="pcabeza__bajada">${esc(MARCA.nombre)}, ${esc(MARCA.lema.toLowerCase())}.</p>
  </div>
</section>

<section class="seccion">
  <div class="nosotros">
    <div class="nosotros__texto">
      <h2 class="cab__titulo">Nuestra historia</h2>
      <!-- REVISAR: la historia de la agencia, con los datos de Florencio -->
      <p>${falta('Desde cuándo opera la agencia y cómo empezó')}</p>
      <p>${falta('Quién la dirige y qué la distingue')}</p>
      <p>${falta('Registro de agencia (DIRCETUR / MINCETUR) y asociaciones, si las tiene')}</p>
    </div>
    <figure class="nosotros__foto">
      <!-- REVISAR: foto real del equipo o de la oficina (no de banco de imágenes) -->
      <div class="nosotros__hueco">${falta('Foto del equipo o de la oficina')}</div>
    </figure>
  </div>
</section>

<section class="seccion seccion--piedra">
  ${cab(1, `¿Por qué viajar con ${MARCA.nombre}?`)}
  <ul class="razones" role="list">
${S.POR_QUE.map(([t, d], i) => `    <li class="razon"><span class="razon__num">${i + 1}</span><h3>${conFaltas(t)}</h3><p>${conFaltas(d)}</p></li>`).join('\n')}
  </ul>
</section>

${bandaFinal('Conversemos sobre tu viaje.', 'Hola, quiero conocer más sobre la agencia')}`;
  PAGINAS['nosotros.html'] = pagina({
    titulo: `Nosotros — ${MARCA.nombre}`,
    descripcion: `${MARCA.nombre}, agencia de viajes en Cusco.`,
    activa: 'nosotros.html', cuerpo,
  });
}

// Condiciones de reserva: 3 de las 10 webs de Tambopata tienen su página
// («Booking Policy and Conditions», «Términos y condiciones»). Solo se afirma
// lo que es cierto de cómo funciona esta web; lo del negocio va por confirmar.
function paginaReservas() {
  const pasos = [
    ['Escríbenos', 'Por WhatsApp o desde el botón «Reservar» de cada tour, con el tour, la fecha y cuántas personas viajan.'],
    ['Te confirmamos', 'Revisamos la disponibilidad —en Machu Picchu y en los trenes los cupos son limitados— y te confirmamos el precio.'],
    ['Adelanto', '[Monto o porcentaje del adelanto para confirmar la reserva, y cuándo se paga]'],
    ['Saldo', '[Cuándo y cómo se paga el resto]'],
  ];
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('lodge-botes')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    <nav class="migas" aria-label="Estás en"><a href="index.html">Inicio</a><span>/</span><span>Reservas y pagos</span></nav>
    <h1 class="pcabeza__titulo">Reservas y pagos</h1>
    <p class="pcabeza__bajada">Cómo reservar un tour, cómo pagarlo y qué pasa si necesitas cambiar la fecha.</p>
  </div>
</section>

<section class="seccion">
  ${cab(1, 'Cómo reservar')}
  <ol class="razones" role="list">
${pasos.map(([t, d], i) => `    <li class="razon"><span class="razon__num">${i + 1}</span><h3>${esc(t)}</h3><p>${conFaltas(d)}</p></li>`).join('\n')}
  </ol>
</section>

<section class="seccion seccion--piedra">
  <div class="info__temas">
    <article class="tema" id="datos"><p class="cab__num">02</p><h2>Qué datos necesitamos</h2>
      <p>Para Machu Picchu y los trenes: nombre completo, número de pasaporte o DNI y nacionalidad de cada viajero, porque las entradas y los pasajes van a nombre de cada persona.</p>
      <p>Para los tours desde Cusco: el nombre de tu hotel, para el recojo.</p></article>
    <article class="tema" id="pagos"><p class="cab__num">03</p><h2>Formas de pago</h2>
      <!-- REVISAR: Yape, Plin, transferencia, efectivo, tarjeta, PayPal… -->
      <p>${falta('Formas de pago que acepta la agencia')}</p></article>
    <article class="tema" id="cancelaciones"><p class="cab__num">04</p><h2>Cambios y cancelaciones</h2>
      <!-- REVISAR: plazos y devoluciones. Las entradas a Machu Picchu y los trenes suelen tener sus propias reglas. -->
      <p>${falta('Política de cambios y cancelaciones')}</p></article>
    <article class="tema" id="seguro"><p class="cab__num">05</p><h2>Seguro de viaje</h2>
      <p>${falta('Si la agencia lo incluye, lo recomienda o lo exige')}</p></article>
  </div>
</section>

${bandaFinal('¿Listo para reservar? Escríbenos.', 'Hola, quiero reservar un tour')}`;
  PAGINAS['reservas-y-pagos.html'] = pagina({
    titulo: `Reservas y pagos — ${MARCA.nombre}`,
    descripcion: `Cómo reservar un tour con ${MARCA.nombre}: datos que necesitamos, formas de pago y cambios.`,
    activa: 'reservas-y-pagos.html', cuerpo,
  });
}

function paginaContacto() {
  const d = (v, t) => (v ? esc(v) : falta(t));
  const opciones = CATEGORIAS.map((c) => `<option>${esc(c.titulo)}</option>`).join('');
  const cuerpo = `<section class="pcabeza pcabeza--corta">
  <div class="pcabeza__fondo"><img src="${img('machu-picchu-nubes')}" alt="" width="1600" height="1067"></div>
  <div class="pcabeza__velo"></div>
  <div class="pcabeza__dentro">
    <nav class="migas" aria-label="Estás en"><a href="index.html">Inicio</a><span>/</span><span>Contacto</span></nav>
    <h1 class="pcabeza__titulo">Contacto</h1>
    <p class="pcabeza__bajada">Cuéntanos qué quieres conocer y te enviamos una propuesta.</p>
  </div>
</section>

<section class="seccion">
  <div class="contacto">
    <form class="cotizar" id="cotizar" data-cotizar>
      <h2 class="cab__titulo">Cotiza tu viaje</h2>
      <label>Tu nombre<input type="text" name="nombre" autocomplete="name" required></label>
      <label>¿Qué quieres conocer?<select name="destino">${opciones}<option>Varios destinos</option></select></label>
      <div class="cotizar__doble">
        <label>Fecha de llegada<input type="date" name="fecha"></label>
        <label>Viajeros<select name="personas">${[1, 2, 3, 4, 5, 6].map((x) => `<option>${x}</option>`).join('')}<option>7 o más</option></select></label>
      </div>
      <label>¿Algo más?<textarea name="mensaje" rows="4" placeholder="Días que tienes, hotel, si viajas con niños…"></textarea></label>
      <button class="boton boton--oro" type="submit">${ICONO.wa} Enviar por WhatsApp</button>
    </form>
    <div class="contacto__datos">
      <h2 class="cab__titulo">Datos</h2>
      <dl>
        <dt>WhatsApp</dt><dd>${d(CONTACTO.whatsappVisible, 'número')}</dd>
        <dt>Correo</dt><dd>${d(CONTACTO.correo, 'correo')}</dd>
        <dt>Oficina</dt><dd>${d(CONTACTO.direccion, 'dirección en Cusco')}</dd>
        <dt>Horario</dt><dd>${d(CONTACTO.horario, 'horario')}</dd>
        <dt>RUC</dt><dd>${d(CONTACTO.ruc, 'RUC')}</dd>
      </dl>
      <div class="contacto__mapa">${falta('Mapa de la oficina (Google Maps)')}</div>
      <div class="reclamaciones" id="reclamaciones">
        <h3>Libro de reclamaciones</h3>
        <!-- REVISAR: obligatorio en Perú. Enlace al libro virtual de la agencia. -->
        <p>${CONTACTO.libroReclamaciones ? `<a href="${esc(CONTACTO.libroReclamaciones)}">Ingresar al libro de reclamaciones</a>` : falta('Enlace al libro de reclamaciones virtual')}</p>
      </div>
    </div>
  </div>
</section>`;
  PAGINAS['contacto.html'] = pagina({
    titulo: `Contacto — ${MARCA.nombre}`,
    descripcion: `Cotiza tu viaje a Machu Picchu, Cusco y Tambopata con ${MARCA.nombre}.`,
    activa: 'contacto.html', cuerpo,
  });
}

// --- construir -------------------------------------------------------------------
function construir() {
  fs.writeFileSync(path.join(RAIZ, 'assets/js/datos.js'),
    '// Generado por herramientas/construir.js\nwindow.INKAS = ' + JSON.stringify({ marca: MARCA.nombre, whatsapp: CONTACTO.whatsapp || '' }) + ';\n');

  paginaInicio();
  CATEGORIAS.forEach(paginaCategoria);
  TOURS.forEach(paginaTourHtml);
  paginaInformacion();
  paginaNosotros();
  paginaContacto();
  paginaReservas();

  // Enlaces rotos: todo href interno tiene que existir (página o archivo).
  const rotos = [];
  for (const [nombre, html] of Object.entries(PAGINAS)) {
    for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const ref = m[1];
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      if (!PAGINAS[ref] && !fs.existsSync(path.join(RAIZ, ref))) rotos.push(`${nombre} → ${ref}`);
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
  for (const [nombre, html] of Object.entries(PAGINAS)) fs.writeFileSync(path.join(RAIZ, nombre), html);
  fs.writeFileSync(registro, JSON.stringify(Object.keys(PAGINAS), null, 1));

  console.log(`✓ ${Object.keys(PAGINAS).length} páginas · ${TOURS.length} tours en ${CATEGORIAS.length} categorías`);
  console.log(`  ${faltas.size} datos distintos por confirmar (REVISAR):`);
  [...faltas].forEach((f) => console.log('    · ' + f));
}

construir();
