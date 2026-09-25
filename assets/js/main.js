/* ==========================================================================
   INKAS GOLDEN — comportamiento
   Sin librerías. Menú con submenús, cabecera que se oscurece, el giro de
   destinos, formularios que arman el mensaje de WhatsApp y aparición al bajar.
   ========================================================================== */

(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATOS = window.INKAS || { whatsapp: '' };
  // Idioma de la página (las de en/ llevan lang="en"): los mensajes de
  // WhatsApp salen en el idioma de quien escribe.
  var EN = (doc.getAttribute('lang') || '').slice(0, 2) === 'en';
  var T = function (es, en) { return EN ? en : es; };

  /* 0. Cada página abre desde arriba -----------------------------------------
     Lección de la web de Yachai (2026-09-23): dentro del visor del artifact,
     la página nueva abría a la altura de la anterior. Sin #ancla y sin haber
     llegado con «atrás», se sube al inicio hasta que la persona toque. */
  (function () {
    if (location.hash) return;
    var llegada = null;
    try { llegada = performance.getEntriesByType('navigation')[0]; } catch (e) {}
    if (llegada && llegada.type === 'back_forward') return;
    var tocada = false;
    ['touchstart', 'wheel', 'keydown', 'mousedown'].forEach(function (t) {
      window.addEventListener(t, function () { tocada = true; }, { passive: true, once: true });
    });
    function arriba() {
      if (tocada || window.scrollY === 0) return;
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
    }
    arriba();
    document.addEventListener('DOMContentLoaded', arriba);
    window.addEventListener('load', function () { arriba(); requestAnimationFrame(arriba); setTimeout(arriba, 300); });
  })();

  function wa(mensaje) {
    return 'https://wa.me/' + (DATOS.whatsapp || '') + '?text=' + encodeURIComponent(mensaje);
  }
  // Un enlace real, tocado desde el envío del formulario: funciona en la web
  // publicada y en visores que bloquean window.open (como el del artifact).
  function abrir(url) {
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function fechaBonita(v) {
    if (!v) return '';
    var p = v.split('-');
    if (p.length !== 3) return v;
    return EN ? v : p[2] + '/' + p[1] + '/' + p[0];
  }

  /* 1. Cabecera y menú -------------------------------------------------------- */
  var cabecera = document.querySelector('.cabecera');
  var nav = document.querySelector('.nav');
  var botonMenu = document.querySelector('.nav__menu');
  var textoMenu = document.querySelector('.nav__menu-texto');
  var botones = Array.prototype.slice.call(document.querySelectorAll('.nav__boton'));
  var movil = window.matchMedia('(max-width: 1140px)');

  function algunoAbierto() {
    return botones.some(function (b) { return b.getAttribute('aria-expanded') === 'true'; });
  }
  function marcarFondo() {
    if (!cabecera) return;
    var abierto = (nav && nav.classList.contains('nav--abierta')) || algunoAbierto();
    cabecera.classList.toggle('con-fondo', abierto || window.scrollY > 60);
  }
  function cerrarSubs(excepto) {
    botones.forEach(function (b) { if (b !== excepto) b.setAttribute('aria-expanded', 'false'); });
    marcarFondo();
  }
  function menuMovil(abrirlo) {
    if (!nav || !botonMenu) return;
    nav.classList.toggle('nav--abierta', abrirlo);
    botonMenu.setAttribute('aria-expanded', String(abrirlo));
    if (textoMenu) textoMenu.textContent = abrirlo ? 'Cerrar' : 'Menú';
    doc.classList.toggle('con-menu', abrirlo);
    if (!abrirlo) cerrarSubs();
    marcarFondo();
  }

  botones.forEach(function (b) {
    b.addEventListener('click', function () {
      var abierto = b.getAttribute('aria-expanded') === 'true';
      cerrarSubs(b);
      b.setAttribute('aria-expanded', String(!abierto));
      marcarFondo();
    });
  });
  if (botonMenu) botonMenu.addEventListener('click', function () { menuMovil(!nav.classList.contains('nav--abierta')); });
  if (nav) nav.addEventListener('click', function (e) {
    if (!e.target.closest('a')) return;
    cerrarSubs();
    if (nav.classList.contains('nav--abierta')) menuMovil(false);
  });
  document.addEventListener('click', function (e) {
    if (nav && !movil.matches && !nav.contains(e.target) && algunoAbierto()) cerrarSubs();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var abierto = botones.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
    if (abierto && !movil.matches) { cerrarSubs(); abierto.focus(); return; }
    if (nav && nav.classList.contains('nav--abierta')) { menuMovil(false); botonMenu.focus(); }
  });
  var alCambiar = function () { menuMovil(false); cerrarSubs(); };
  if (movil.addEventListener) movil.addEventListener('change', alCambiar);
  else if (movil.addListener) movil.addListener(alCambiar);
  window.addEventListener('scroll', marcarFondo, { passive: true });
  marcarFondo();

  /* 2. Formularios → mensaje de WhatsApp ------------------------------------- */
  var disena = document.querySelector('[data-disena]');
  if (disena) disena.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = disena.elements;
    var m = T('Hola, quiero cotizar un viaje. Destino: ', 'Hello, I would like a quote for a trip. Destination: ') + f.destino.value +
      (f.fecha.value ? T('. Llegada: ', '. Arrival: ') + fechaBonita(f.fecha.value) : '') +
      T('. Viajeros: ', '. Travelers: ') + f.personas.value + '.';
    abrir(wa(m));
  });

  var reserva = document.querySelector('[data-reserva]');
  if (reserva) reserva.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = reserva.elements;
    var m = T('Hola', 'Hello') + (f.nombre.value ? T(', soy ', ', I am ') + f.nombre.value.trim() : '') +
      T('. Quiero reservar el tour ', '. I would like to book the tour ') + reserva.getAttribute('data-tour') +
      (f.fecha.value ? T(' para el ', ' for ') + fechaBonita(f.fecha.value) : '') +
      T('. Viajeros: ', '. Travelers: ') + f.personas.value + '.';
    abrir(wa(m));
  });

  var cotizar = document.querySelector('[data-cotizar]');
  if (cotizar) cotizar.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = cotizar.elements;
    var m = T('Hola, soy ', 'Hello, I am ') + f.nombre.value.trim() + T('. Quiero cotizar: ', '. I would like a quote for: ') + f.destino.value +
      (f.fecha.value ? T('. Llegada: ', '. Arrival: ') + fechaBonita(f.fecha.value) : '') +
      T('. Viajeros: ', '. Travelers: ') + f.personas.value + '.' +
      (f.mensaje.value.trim() ? ' ' + f.mensaje.value.trim() : '');
    abrir(wa(m));
  });

  /* 2b. Libro de reclamaciones ---------------------------------------------------
     Sin servidor todavía: la hoja se arma acá, se muestra para copiar y se
     abre WhatsApp con ella. Nunca se dice que «se envió»: eso depende de que
     la persona toque «enviar» en WhatsApp. */
  var libro = document.querySelector('[data-libro]');
  if (libro) {
    var hoy = new Date();
    var hoyTexto = ('0' + hoy.getDate()).slice(-2) + '/' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '/' + hoy.getFullYear();
    var celdaHoy = libro.querySelector('[data-hoy]');
    if (celdaHoy) celdaHoy.textContent = hoyTexto;
    libro.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = libro.elements;
      var aviso = libro.querySelector('[data-libro-error]');
      if (!libro.checkValidity()) {
        if (aviso) aviso.hidden = false;
        var primero = libro.querySelector(':invalid');
        if (primero) primero.focus();
        return;
      }
      if (aviso) aviso.hidden = true;
      var valor = function (n) { return ((f[n] && f[n].value) || '').trim(); };
      var marcado = function (n) { var r = libro.querySelector('input[name="' + n + '"]:checked'); return r ? r.value : ''; };
      var lineas = [
        T('LIBRO DE RECLAMACIONES — HOJA DE RECLAMACIÓN', 'COMPLAINTS BOOK (LIBRO DE RECLAMACIONES) — COMPLAINT FORM'),
        T('Proveedor: ', 'Provider: ') + (DATOS.marca || 'Inkas Golden'),
        T('Fecha: ', 'Date: ') + hoyTexto,
        '',
        T('1. Consumidor', '1. Consumer'),
        T('Nombre: ', 'Name: ') + valor('nombre'),
        valor('tipoDoc') + ': ' + valor('numDoc'),
        T('Domicilio: ', 'Address: ') + valor('domicilio'),
        T('Teléfono: ', 'Phone: ') + valor('telefono'),
        T('Correo: ', 'Email: ') + valor('correo')
      ];
      if (valor('apoderado')) lineas.push(T('Padre, madre o apoderado: ', 'Parent or guardian: ') + valor('apoderado'));
      lineas.push('', T('2. Bien contratado', '2. What was purchased'),
        T('Tipo: ', 'Type: ') + marcado('bien'),
        T('Descripción: ', 'Description: ') + valor('descripcion'));
      if (valor('monto')) lineas.push(T('Monto reclamado: ', 'Amount claimed: ') + valor('monto'));
      lineas.push('', T('3. Detalle', '3. Details'),
        T('Tipo: ', 'Type: ') + marcado('tipo'),
        T('Detalle: ', 'Details: ') + valor('detalle'),
        T('Pedido: ', 'Request: ') + valor('pedido'));
      var texto = lineas.join('\n');
      var copia = document.querySelector('[data-libro-copia]');
      var pre = document.querySelector('[data-libro-texto]');
      if (pre) pre.textContent = texto;
      if (copia) { copia.hidden = false; copia.scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'start' }); }
      abrir(wa(texto));
    });
    var copiar = document.querySelector('[data-libro-copiar]');
    if (copiar) copiar.addEventListener('click', function () {
      var pre = document.querySelector('[data-libro-texto]');
      if (!pre) return;
      var listo = function () { copiar.textContent = T('Copiado', 'Copied'); };
      var seleccionar = function () {
        var r = document.createRange(); r.selectNodeContents(pre);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pre.textContent).then(listo, seleccionar);
      } else { seleccionar(); }
    });
  }

  /* 3. El giro de destinos: el scroll elige qué destino se ve ------------------
     Cada tramo de scroll muestra un destino entero (nunca queda a medias). */
  var giro = document.querySelector('.giro');
  if (giro && !sinMovimiento) {
    var fotos = giro.querySelectorAll('.giro__foto');
    var textos = giro.querySelectorAll('.giro__destino');
    var items = giro.querySelectorAll('.giro__lista li');
    var total = fotos.length;
    var actual = 0;
    var pedido = false;
    function marcar(i) {
      if (i === actual) return;
      actual = i;
      [fotos, textos, items].forEach(function (lista) {
        Array.prototype.forEach.call(lista, function (el) {
          el.classList.toggle('activo', Number(el.getAttribute('data-i')) === i);
        });
      });
    }
    function medir() {
      pedido = false;
      var r = giro.getBoundingClientRect();
      var recorrido = giro.offsetHeight - window.innerHeight;
      var avance = Math.min(1, Math.max(0, -r.top / Math.max(1, recorrido)));
      marcar(Math.min(total - 1, Math.floor(avance * total)));
    }
    window.addEventListener('scroll', function () {
      if (!pedido) { pedido = true; requestAnimationFrame(medir); }
    }, { passive: true });
    window.addEventListener('resize', medir);
    medir();
    // La lista de destinos lleva a su tramo del giro en vez de salir de la página
    // (en el celular, los puntos también).
    Array.prototype.forEach.call(items, function (li) {
      var a = li.querySelector('a');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var i = Number(li.getAttribute('data-i'));
        var recorrido = giro.offsetHeight - window.innerHeight;
        var destino = giro.getBoundingClientRect().top + window.scrollY + recorrido * ((i + 0.5) / total);
        try { window.scrollTo({ top: destino, behavior: 'instant' }); } catch (err) { window.scrollTo(0, destino); }
      });
    });
  }

  /* 4. Aparición al bajar ------------------------------------------------------- */
  var revelar = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && !sinMovimiento) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revelar, function (el) { io.observe(el); });
    // Respaldo: en algunos visores el aviso llega tarde; al cargar, lo que ya
    // está a la vista aparece igual.
    window.addEventListener('load', function () {
      Array.prototype.forEach.call(revelar, function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
      });
    });
  } else {
    Array.prototype.forEach.call(revelar, function (el) { el.classList.add('visible'); });
  }
})();
