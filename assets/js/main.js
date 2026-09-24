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
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v;
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
    var m = 'Hola, quiero cotizar un viaje. Destino: ' + f.destino.value +
      (f.fecha.value ? '. Llegada: ' + fechaBonita(f.fecha.value) : '') +
      '. Viajeros: ' + f.personas.value + '.';
    abrir(wa(m));
  });

  var reserva = document.querySelector('[data-reserva]');
  if (reserva) reserva.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = reserva.elements;
    var m = 'Hola' + (f.nombre.value ? ', soy ' + f.nombre.value.trim() : '') +
      '. Quiero reservar el tour ' + reserva.getAttribute('data-tour') +
      (f.fecha.value ? ' para el ' + fechaBonita(f.fecha.value) : '') +
      '. Viajeros: ' + f.personas.value + '.';
    abrir(wa(m));
  });

  var cotizar = document.querySelector('[data-cotizar]');
  if (cotizar) cotizar.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = cotizar.elements;
    var m = 'Hola, soy ' + f.nombre.value.trim() + '. Quiero cotizar: ' + f.destino.value +
      (f.fecha.value ? '. Llegada: ' + fechaBonita(f.fecha.value) : '') +
      '. Viajeros: ' + f.personas.value + '.' +
      (f.mensaje.value.trim() ? ' ' + f.mensaje.value.trim() : '');
    abrir(wa(m));
  });

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
