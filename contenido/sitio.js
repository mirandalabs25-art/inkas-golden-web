/* ==========================================================================
   INKAS GOLDEN — contenido de la web
   --------------------------------------------------------------------------
   Todo lo que dice la web sale de acá. `node herramientas/construir.js`
   arma las páginas. Las páginas generadas no se editan a mano.

   Estructura: la de las 10 primeras webs de «Machu Picchu» y las 10 de
   «Tambopata» (análisis del 2026-09-23 en Obsidian/proyectos/web-papa-florencio.md).

   Catálogo (desde el 2026-09-23, noche): el de Florencio, de dos fuentes.
   - Sus mensajes de WhatsApp del sábado 19/09 (lista de tours y precios).
   - Los programas de los albergues que reenvió: Collpas Tambopata Inn (2D/1N),
     Lago Sandoval 3D/2N y Full Day Collpa de Guacamayos.
   Originales en investigaciones/inkas-golden/recursos/.
   Todo dato que falta va en null o entre [corchetes], y el constructor lo
   marca como REVISAR. Nunca se inventa.
   ========================================================================== */

const MARCA = {
  nombre: 'Inkas Golden',
  // REVISAR: ¿el nombre lleva espacio? La página de Facebook dice «Inkas Goldent».
  lema: 'Agencia de viajes en Cusco',
  dominio: null,            // REVISAR: ¿inkasgolden.com es de Florencio? Hoy es un WordPress de 2015 sin usar.
};

// Datos de contacto: todos por confirmar con Florencio.
const CONTACTO = {
  whatsapp: null,           // REVISAR: número con código de país, solo dígitos (ej. 51984000000)
  whatsappVisible: null,    // REVISAR: cómo se muestra (ej. +51 984 000 000)
  correo: null,             // REVISAR
  direccion: null,          // REVISAR: oficina en Cusco
  horario: null,            // REVISAR
  ruc: null,                // REVISAR
  razonSocial: null,        // REVISAR
  facebook: 'https://www.facebook.com/people/Inkas-Goldent/100066264081032/', // REVISAR: confirmar que es la página de la agencia
  instagram: null,
  tiktok: null,
  tripadvisor: null,        // REVISAR: ¿tiene ficha? En las 20 webs de referencia es el sello de confianza más usado
  libroReclamaciones: null, // REVISAR: obligatorio en Perú para quien vende al público
};

const IDIOMAS = ['ES', 'EN'];

// --- Categorías = menú principal ---------------------------------------------
const CATEGORIAS = [
  {
    clave: 'machu-picchu', archivo: 'machu-picchu.html', menu: 'Machu Picchu',
    titulo: 'Tours a Machu Picchu', foto: 'machu-picchu',
    bajada: 'El Valle Sagrado, una noche al pie de la montaña y la ciudadela inca con guía.',
    intro: 'Machu Picchu está a unos 2,430 m de altura, sobre el valle del río Urubamba. Se llega en tren hasta Machu Picchu Pueblo (Aguas Calientes) y de ahí en bus hasta la entrada. Las entradas tienen cupos diarios: conviene reservar con anticipación.',
  },
  {
    clave: 'cusco', archivo: 'tours-en-cusco.html', menu: 'Tours en Cusco',
    titulo: 'Tours en Cusco', foto: 'valle-sagrado',
    bajada: 'El City Tour, el Valle Sagrado y el Valle Sur: el Cusco inca y colonial.',
    intro: 'Los tours culturales salen de Cusco y vuelven el mismo día. Son la mejor forma de aclimatarse a la altura antes de las caminatas.',
  },
  {
    clave: 'caminatas', archivo: 'caminatas.html', menu: 'Caminatas',
    titulo: 'Caminatas y montañas', foto: 'montana-colores',
    bajada: 'La Montaña de 7 Colores, Palcoyo, Humantay, las Siete Lagunas, Waqrapukara y el Salkantay.',
    intro: 'Son caminatas de altura: la mayoría supera los 4,000 m. Conviene hacerlas después de dos o tres días en Cusco, con ropa abrigadora y calzado con buena suela.',
  },
  {
    clave: 'selva', archivo: 'tambopata.html', menu: 'Tambopata y Manu',
    titulo: 'Tambopata y Manu', foto: 'lodge-collpa',
    bajada: 'La Amazonía peruana: collpas de guacamayos, el lago Sandoval, noches en albergue y el bosque nublado del Manu.',
    intro: 'Tambopata está en Madre de Dios: se llega en avión o en bus hasta Puerto Maldonado, y de ahí en bote a los albergues. El Manu se recorre por tierra desde Cusco, bajando por el bosque nublado.',
  },
  {
    clave: 'puno', archivo: 'lago-titicaca.html', menu: 'Lago Titicaca',
    titulo: 'Puno y el Lago Titicaca', foto: 'titicaca-uros',
    bajada: 'El lago navegable más alto del mundo y las islas flotantes de los Uros.',
    intro: 'Puno está a orillas del Lago Titicaca, a unos 3,800 m de altura, entre Perú y Bolivia.',
  },
];

// --- Programas de Jaguar Tambopata Jungle (JTJ) --------------------------------
// De los 4 PDFs «2026_Programa…_JTJ» y del catálogo «Programas 2026» (páginas
// 13 a 37 = los mismos 4 programas). Ninguno trae precio. Lo que comparten:
const JTJ = {
  alojamiento: 'Casa hospedaje Jaguar Tambopata Jungle, en la Reserva Nacional Tambopata, a unos 40 minutos en bote desde Puerto Maldonado: bungalows con terraza, restaurante, piscina, tirolesa y puente colgante, rodeados de bosque conservado. Ingreso desde las 10:00 a. m.; salida hasta las 5:00 p. m.',
  incluye: ['Entrada a la Reserva Nacional Tambopata', 'Guía profesional', 'Hospedaje y alimentación', 'Transporte fluvial'],
  noIncluye: ['Bebidas del bar'],
  llevar: ['Documentos personales', 'Repelente', 'Protector solar', 'Gorro', 'Lentes de sol', 'Ropa de baño', 'Abrigo', 'Poncho de lluvia portátil', 'Botella de agua reutilizable', 'Ropa cómoda', 'Calzado cerrado y cómodo para caminar', 'Tus medicamentos, si tomas alguno', 'Ventilador de mano'],
  nota: 'El orden y los horarios pueden cambiar según el guía, el clima y el estado físico del grupo. Avísanos la hora de tu vuelo de regreso para programar el retorno a la ciudad.',
  llegada: 'Salida desde el Puerto Capitanía de Puerto Maldonado: unos 40 minutos en bote por el río Madre de Dios hasta la casa hospedaje, en la Reserva Nacional Tambopata.',
  sandoval: [
    'Unos 15 minutos en bote hasta el puesto de control del lago Sandoval.',
    'Caminata de unos 3 km por el bosque, entre ficus, lupunas, palmeras y shihuahuacos, con la posibilidad de ver monos, aves y ardillas.',
    'Paseo en canoa a remo por el lago: con suerte, lobos de río, guacamayos, shanshos, garzas, caimán negro y monos.',
  ],
  monos: 'Kayak por el río Madre de Dios y visita a la Isla de Monos Rolín, donde viven monos capuchinos rescatados por pobladores locales.',
  matsiguenka: 'Visita a una familia Matsiguenka, originaria del Parque Nacional del Manu, que vive a orillas del río Madre de Dios: el hilado, el fuego encendido a la manera tradicional y el tiro con flecha.',
};

// --- Tours --------------------------------------------------------------------
// precio: { monto, moneda: 'PEN' | 'USD' | null } — null = por confirmar.
// fuente: de dónde sale la ficha ('florencio' = sus mensajes; 'programa' =
// programa del albergue; 'referencia' = lo que ofrecen las webs líderes,
// marcado «por confirmar» en pantalla).
const TOURS = [
  // ---- Machu Picchu ----
  {
    slug: 'machu-picchu-2-dias', cat: 'machu-picchu', destacado: true,
    nombre: 'Machu Picchu 2 días / 1 noche', duracion: '2 días / 1 noche', dificultad: 'Fácil', altura: '2,430 m',
    foto: 'machu-picchu', galeria: ['valle-sagrado', 'machu-picchu-nubes'],
    precio: { monto: 310, moneda: 'USD' }, // REVISAR: el mensaje dice «310» sin moneda
    resumen: 'El Valle Sagrado con el tour de conexión, tren a Machu Picchu Pueblo, una noche allí y la ciudadela con guía al día siguiente.',
    lugares: ['Cusco', 'Valle Sagrado', 'Ollantaytambo', 'Machu Picchu Pueblo', 'Machu Picchu'],
    fuente: 'florencio',
    itinerario: [
      { titulo: 'Día 1 · Valle Sagrado y tren a Machu Picchu', pasos: ['Tour de conexión por el Valle Sagrado.', 'Tren a Machu Picchu Pueblo.', 'Noche en Machu Picchu Pueblo.'] },
      { titulo: 'Día 2 · Machu Picchu y regreso', pasos: ['Bus de subida a Machu Picchu.', 'Visita guiada.', 'Bus de bajada.', 'Tren de regreso a Ollantaytambo y bus a Cusco.'] },
    ],
    incluye: ['Tour de conexión', 'Tour del Valle Sagrado', 'Tren de ida y retorno', 'Ingreso a Machu Picchu', 'Bus de subida y bajada', 'Guía', 'Bus de retorno Ollantaytambo – Cusco', '1 noche en Machu Picchu Pueblo'],
    noIncluye: ['Boleto turístico'],
  },

  // ---- Tours en Cusco ----
  {
    slug: 'city-tour-cusco', cat: 'cusco', destacado: true,
    nombre: 'City Tour Cusco', duracion: 'Medio día', dificultad: 'Fácil', altura: '3,400 a 3,700 m',
    foto: 'cusco', galeria: ['valle-sagrado', 'machu-picchu-atardecer'],
    precio: { monto: 40, moneda: 'PEN' },
    resumen: 'El Cusco inca: el Qorikancha y los cuatro sitios arqueológicos de las alturas de la ciudad.',
    lugares: ['Qorikancha', 'Sacsayhuamán', "Q'enqo", 'Puka Pukara', 'Tambomachay'],
    fuente: 'florencio',
    itinerario: [
      { titulo: 'City Tour', pasos: ['Qorikancha, el templo del Sol.', 'Sacsayhuamán.', "Q'enqo.", 'Puka Pukara.', 'Tambomachay.'] },
    ],
    incluye: null, noIncluye: null,
  },
  {
    slug: 'valle-sagrado', cat: 'cusco', destacado: true,
    nombre: 'Valle Sagrado de los Incas', duracion: '1 día', dificultad: 'Fácil', altura: 'hasta 3,760 m',
    foto: 'valle-sagrado', galeria: ['moray', 'maras'],
    precio: { monto: 85, moneda: 'PEN' },
    resumen: 'Todo el día por el valle del río Urubamba, con visita a los sitios arqueológicos.',
    lugares: ['[Lugares por confirmar]'],
    fuente: 'florencio',
    itinerario: null,
    incluye: ['Bus de ida y retorno', 'Visita a los sitios arqueológicos'], noIncluye: null,
  },
  {
    slug: 'valle-sur', cat: 'cusco',
    nombre: 'Valle Sur', duracion: '[Duración por confirmar]', dificultad: 'Fácil', altura: 'hasta 3,300 m',
    foto: null, galeria: [],
    precio: { monto: 50, moneda: 'PEN' },
    resumen: 'El valle al sur de Cusco, con sus sitios arqueológicos y pueblos coloniales.',
    lugares: ['[Lugares por confirmar]'],
    fuente: 'florencio',
    itinerario: null,
    incluye: ['Bus', 'Guía'], noIncluye: null,
  },

  // ---- Caminatas y montañas ----
  {
    slug: 'montana-7-colores', cat: 'caminatas', destacado: true,
    nombre: 'Montaña de 7 Colores', duracion: '1 día', dificultad: 'Exigente', altura: 'más de 5,000 m',
    foto: 'montana-colores', galeria: ['salkantay', 'siete-lagunas'],
    precio: { monto: 75, moneda: 'PEN' }, // REVISAR: el mensaje dice «Tour montaña 75 todo incluido»
    resumen: 'Vinicunca, la montaña de franjas de colores. Caminata de altura, con oxígeno y bastones incluidos.',
    lugares: ['Vinicunca'],
    fuente: 'florencio',
    itinerario: null,
    incluye: ['Bus de ida y retorno', 'Desayuno', 'Almuerzo', 'Guía', 'Oxígeno', 'Bastones'], noIncluye: null,
  },
  {
    slug: 'palcoyo', cat: 'caminatas',
    nombre: 'Montaña de Palcoyo', duracion: '1 día', dificultad: 'Moderada', altura: 'más de 4,900 m',
    foto: null, galeria: [],
    precio: { monto: 95, moneda: 'PEN' },
    resumen: 'La otra montaña de colores, con una caminata más corta que la de Vinicunca.',
    lugares: ['Palcoyo'],
    fuente: 'florencio',
    itinerario: null, incluye: null, noIncluye: null,
  },
  {
    slug: 'laguna-humantay', cat: 'caminatas', destacado: true,
    nombre: 'Laguna Humantay', duracion: '1 día', dificultad: 'Exigente', altura: '4,200 m',
    foto: 'humantay', galeria: ['salkantay', 'siete-lagunas-2'],
    precio: null,
    resumen: 'Una laguna turquesa al pie del nevado Humantay. Con oxígeno y bastones incluidos.',
    lugares: ['Laguna Humantay'],
    fuente: 'florencio',
    itinerario: null,
    incluye: ['Bus de ida y retorno', 'Desayuno', 'Almuerzo', 'Guía', 'Oxígeno', 'Bastones'], noIncluye: null,
  },
  {
    slug: 'siete-lagunas', cat: 'caminatas',
    nombre: 'Siete Lagunas de Ausangate', duracion: '1 día', dificultad: 'Moderada', altura: 'más de 4,500 m',
    foto: 'siete-lagunas', galeria: ['siete-lagunas-2', 'humantay'],
    precio: { monto: 90, moneda: 'PEN' },
    resumen: 'Un circuito entre lagunas de colores al pie del nevado Ausangate. Todo incluido.',
    lugares: ['Ausangate', 'Siete Lagunas'],
    fuente: 'florencio',
    itinerario: null,
    incluye: ['Todo incluido [detalle por confirmar]'], noIncluye: null,
  },
  {
    slug: 'waqrapukara', cat: 'caminatas',
    nombre: 'Waqrapukara', duracion: '1 día', dificultad: 'Moderada', altura: 'unos 4,100 m',
    foto: null, galeria: [],
    precio: { monto: 100, moneda: 'PEN' },
    resumen: 'La fortaleza inca con forma de cuernos, sobre el cañón del río Apurímac.',
    lugares: ['Waqrapukara'],
    fuente: 'florencio',
    itinerario: null, incluye: null, noIncluye: null,
  },
  {
    slug: 'salkantay', cat: 'caminatas', destacado: true,
    nombre: 'Caminata al Salkantay', duracion: '[Días por confirmar]', dificultad: 'Exigente', altura: 'paso a unos 4,600 m',
    foto: 'salkantay', galeria: ['humantay', 'machu-picchu'],
    precio: { monto: 380, moneda: 'USD' },
    resumen: 'La caminata al pie del nevado Salkantay, con todo incluido.',
    lugares: ['Salkantay'],
    fuente: 'florencio',
    itinerario: null,
    incluye: ['Todo incluido [detalle por confirmar]'], noIncluye: null,
  },

  // ---- Tambopata y Manu ----
  {
    // Florencio: «Tour Tambopata 4 días 3 noches, 290 dólares». El programa de
    // 4D/3N que mandó es el de JTJ. REVISAR: confirmar que el precio es de este.
    slug: 'tambopata-4-dias', cat: 'selva', destacado: true,
    nombre: 'Gran experiencia en Tambopata · 4 días / 3 noches', duracion: '4 días / 3 noches', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'jtj-collpa-loros', galeria: ['jtj-bungalows', 'jtj-kayak'],
    precio: { monto: 290, moneda: 'USD' },
    resumen: 'Naturaleza, cultura, aventura y vida local: el lago Sandoval, la collpa de loros al amanecer, una familia Matsiguenka, una chacra, tirolesa y kayak.',
    lugares: ['Puerto Maldonado', 'Lago Sandoval', 'Collpa de loros La Cachuela', 'Familia Matsiguenka', 'Isla de Monos Rolín'],
    fuente: 'programa',
    alojamiento: JTJ.alojamiento + ' [Confirmar que los US$ 290 son de este programa]',
    itinerario: [
      { titulo: 'Día 1 · Llegada, pesca y caimanes', pasos: [JTJ.llegada, 'Instalación y caminata por el bosque que rodea el albergue.', '1:00 p. m. Almuerzo.', '3:00 p. m. Pesca deportiva cerca del río Madre de Dios y, si el día acompaña, el atardecer.', 'Salida por el río para ver caimanes y, con suerte, capibaras, aves y murciélagos.', '7:30 p. m. Cena.'] },
      { titulo: 'Día 2 · Lago Sandoval', pasos: ['8:00 a. m. Desayuno.', '10:00 a. m. ' + JTJ.sandoval[0], ...JTJ.sandoval.slice(1), 'Almuerzo en el puesto de una familia local y regreso por el mismo sendero.', '7:30 p. m. Cena.'] },
      { titulo: 'Día 3 · Collpa de loros, familia Matsiguenka y chacra', pasos: ['4:30 a. m. Salida en canoa por el río Madre de Dios, al amanecer, a la collpa de loros La Cachuela, donde los loros llegan a comer arcilla.', 'Regreso para el desayuno y mañana libre en la piscina.', '1:00 p. m. Almuerzo.', JTJ.matsiguenka, 'Visita a una chacra local: la agroforestería en la selva y los frutos de temporada.'] },
      { titulo: 'Día 4 · Tirolesa, kayak y retorno', pasos: ['8:00 a. m. Desayuno.', 'Tirolesa y puente colgante cerca del albergue.', '1:00 p. m. Almuerzo.', '3:00 p. m. ' + JTJ.monos, 'Recojo del equipaje y retorno a la ciudad.'] },
    ],
    notaItinerario: JTJ.nota,
    incluye: JTJ.incluye, noIncluye: JTJ.noIncluye, llevar: JTJ.llevar,
  },
  {
    slug: 'experiencia-completa-3-dias', cat: 'selva', destacado: true,
    nombre: 'Experiencia completa de Tambopata · 3 días / 2 noches', duracion: '3 días / 2 noches', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'jtj-puente-colgante', galeria: ['jtj-lago-canoa', 'jtj-capuchino'],
    precio: null,
    resumen: 'Naturaleza, cultura y aventura: una familia Matsiguenka, el lago Sandoval, caminata nocturna, tirolesa, puente colgante y kayak.',
    lugares: ['Puerto Maldonado', 'Familia Matsiguenka', 'Lago Sandoval', 'Isla de Monos Rolín'],
    fuente: 'programa',
    alojamiento: JTJ.alojamiento,
    itinerario: [
      { titulo: 'Día 1 · Llegada, familia Matsiguenka y caimanes', pasos: [JTJ.llegada, 'Instalación y caminata por el bosque que rodea el albergue.', '1:00 p. m. Almuerzo.', '3:00 p. m. ' + JTJ.matsiguenka, 'Pesca deportiva cerca del río y, si el día acompaña, el atardecer.', 'Salida por el río para ver caimanes y, con suerte, capibaras, aves y murciélagos.', 'Cena.'] },
      { titulo: 'Día 2 · Lago Sandoval y caminata nocturna', pasos: ['8:00 a. m. Desayuno.', '10:00 a. m. ' + JTJ.sandoval[0], ...JTJ.sandoval.slice(1), 'Almuerzo en el puesto de una familia local y regreso al albergue.', 'Cena.', 'Caminata nocturna para descubrir insectos, aves y reptiles.'] },
      { titulo: 'Día 3 · Tirolesa, kayak y retorno', pasos: ['8:00 a. m. Desayuno.', '10:00 a. m. Tirolesa y puente colgante cerca del albergue.', '1:00 p. m. Almuerzo.', '3:00 p. m. ' + JTJ.monos, 'Recojo del equipaje y retorno a la ciudad.'] },
    ],
    notaItinerario: JTJ.nota,
    incluye: JTJ.incluye, noIncluye: JTJ.noIncluye, llevar: JTJ.llevar,
  },
  {
    slug: 'aventura-lago-sandoval-2-dias', cat: 'selva',
    nombre: 'Aventura y Lago Sandoval · 2 días / 1 noche', duracion: '2 días / 1 noche', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'jtj-tirolesa', galeria: ['jtj-lobo-de-rio', 'jtj-kayak'],
    precio: null,
    resumen: 'Tirolesa, puente colgante, kayak, caimanes y caminata nocturna el primer día; el lago Sandoval el segundo.',
    lugares: ['Puerto Maldonado', 'Isla de Monos Rolín', 'Lago Sandoval'],
    fuente: 'programa',
    alojamiento: JTJ.alojamiento,
    itinerario: [
      { titulo: 'Día 1 · Aventura en la selva', pasos: [JTJ.llegada, '10:30 a. m. Instalación en las habitaciones.', 'Tirolesa y puente colgante cerca del albergue.', '1:00 p. m. Almuerzo.', JTJ.monos, 'Salida por el río para ver caimanes y, con suerte, capibaras, aves y murciélagos.', '7:00 p. m. Cena.', '8:00 p. m. Caminata nocturna para descubrir insectos, aves y reptiles.'] },
      { titulo: 'Día 2 · Lago Sandoval y retorno', pasos: [...JTJ.sandoval, 'Almuerzo en el puesto de una familia local.', 'Regreso al albergue por el mismo sendero, recojo de las pertenencias y retorno a la ciudad.'] },
    ],
    notaItinerario: JTJ.nota,
    incluye: JTJ.incluye, noIncluye: JTJ.noIncluye, llevar: JTJ.llevar,
  },
  {
    slug: 'lago-sandoval-2-dias', cat: 'selva',
    nombre: 'Lago Sandoval · 2 días / 1 noche', duracion: '2 días / 1 noche', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'jtj-lago-canoa', galeria: ['jtj-shansho', 'jtj-tortugas'],
    precio: null,
    resumen: 'Kayak, la Isla de Monos Rolín y caimanes el primer día; el lago Sandoval en canoa a remo el segundo.',
    lugares: ['Puerto Maldonado', 'Isla de Monos Rolín', 'Lago Sandoval'],
    fuente: 'programa',
    alojamiento: JTJ.alojamiento,
    itinerario: [
      { titulo: 'Día 1 · Llegada, kayak y caimanes', pasos: [JTJ.llegada, '11:00 a. m. Instalación y caminata de introducción.', '1:00 p. m. Almuerzo.', '3:00 p. m. ' + JTJ.monos, '5:00 p. m. Salida para ver caimanes en las orillas del río Madre de Dios, y otras especies nocturnas como aves o capibaras.', '7:30 p. m. Cena.', 'Opcional: caminata nocturna alrededor del albergue.'] },
      { titulo: 'Día 2 · Lago Sandoval y retorno', pasos: [...JTJ.sandoval, 'Almuerzo a orillas del lago.', 'Regreso al albergue por el mismo sendero, recojo de las pertenencias y retorno a la ciudad.'] },
    ],
    notaItinerario: JTJ.nota,
    incluye: JTJ.incluye, noIncluye: JTJ.noIncluye, llevar: JTJ.llevar,
  },
  {
    slug: 'collpas-tambopata-inn-2-dias', cat: 'selva', destacado: true,
    nombre: 'Collpa Chuncho · 2 días / 1 noche', duracion: '2 días / 1 noche', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'lodge-collpa', galeria: ['lodge-habitacion', 'lodge-botes'],
    precio: { monto: 250, moneda: 'USD' },
    resumen: 'Una noche en un eco-lodge al límite de la Reserva Nacional Tambopata y, al amanecer, la collpa Chuncho, donde bajan guacamayos y loros a comer arcilla.',
    lugares: ['Puerto Maldonado', 'Río Tambopata', 'Torre de observación', 'Collpa Chuncho'],
    fuente: 'programa',
    alojamiento: 'Collpas Tambopata Inn: eco-lodge con bar, piscina y comida buffet, en el límite de la Reserva Nacional Tambopata. Habitaciones de 24 a 68 m², con baño privado y ventana abierta al bosque.',
    itinerario: [
      { titulo: 'Día 1 · Puerto Maldonado – albergue', pasos: [
        'Llegada a Puerto Maldonado, capital de Madre de Dios.',
        'Unas 2 horas en bus y un tramo en bote hasta el albergue.',
        'Bebida de bienvenida y una charla corta sobre el albergue.',
        'Por la tarde, caminata de 2 a 4 km por bosque primario: plantas medicinales, las actividades económicas de la zona y la posibilidad de ver siete especies de monos y muchas aves.',
        'Visita a la torre de observación de 50 m, con vista de la cuenca amazónica.',
        'Opcional por la noche: salida en bote por el río Tambopata para ver caimanes blancos y negros.',
      ] },
      { titulo: 'Día 2 · Collpa Chuncho – Puerto Maldonado', pasos: [
        'Salida al amanecer, cuando la collpa está más activa.',
        'Observación a 50 m del barranco: guacamayos rojo y verde, escarlata y azul y amarillo, y varias especies de loros más pequeños.',
        'En el bote, posibilidad de ver capibaras, tortugas y aves de río.',
        'Regreso a Puerto Maldonado, con llegada alrededor de las 12:30 p. m.',
      ] },
    ],
    incluye: ['Traslado de llegada y salida desde el aeropuerto de Puerto Maldonado', 'Alojamiento', 'Comidas, desde el almuerzo del primer día hasta el desayuno del último', 'Excursiones con guía bilingüe (grupos de hasta 10 personas por guía)', 'Las actividades del itinerario', 'Transporte fluvial'],
    noIncluye: ['Seguros', 'Pasajes aéreos nacionales o internacionales', 'Pasaje de bus a Puerto Maldonado', 'Noches adicionales por cancelación de vuelos', 'Bebidas alcohólicas', 'Agua embotellada y snacks', 'Gastos personales', 'Tasas de aeropuerto', 'Exceso de equipaje', 'Visas', 'Lavandería'],
    llevar: ['Repelente de insectos', 'Protector solar', 'Lentes de sol', 'Sombrero', 'Mochila pequeña', 'Linterna con pilas', 'Cámara, cargador y baterías', 'Binoculares, si tienes', 'Poncho o casaca para la lluvia', 'Pantalones largos y livianos, de colores claros', 'Camisas de manga larga, livianas y de colores claros', 'Polos de manga corta', 'Sandalias para el albergue', 'Botas de jebe o zapatos de trekking impermeables'],
  },
  {
    slug: 'lago-sandoval-3-dias', cat: 'selva',
    nombre: 'Lago Sandoval y canopy · 3 días / 2 noches', duracion: '3 días / 2 noches', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'tambopata-lago', galeria: ['lodge-capibaras', 'tambopata-mono'],
    precio: null,
    resumen: 'La Isla de los Monos, el lago Sandoval en bote a remo y el amanecer en un puente colgante a 30 m sobre el bosque.',
    lugares: ['Puerto Maldonado', 'Río Madre de Dios', 'Isla de los Monos', 'Lago Sandoval', 'Canopy'],
    fuente: 'programa',
    alojamiento: 'Monte Amazónico Lodge, con piscina, a orillas del río Madre de Dios.',
    itinerario: [
      { titulo: 'Día 1 · Llegada a Puerto Maldonado', pasos: [
        'Recepción en el aeropuerto o el terminal terrestre.',
        'Traslado al albergue en bote por el río Madre de Dios.',
        'Bienvenida, instalación y almuerzo.',
        'Visita a la Isla de los Monos, para ver especies como el mono capuchino.',
        'Por la noche, salida para ver caimanes blancos y capibaras.',
        'Cena y descanso.',
      ] },
      { titulo: 'Día 2 · Lago Sandoval', pasos: [
        'Después del desayuno, caminata de 3 km por la selva hasta el lago Sandoval, uno de los más grandes de la Reserva Nacional Tambopata.',
        'Paseo en bote a remo para ver aves, monos y otras especies, con posibilidad de ver nutrias gigantes y caimanes grandes.',
        'Almuerzo típico en el albergue.',
        'Por la noche, caminata para descubrir la fauna nocturna.',
        'Cena y descanso.',
      ] },
      { titulo: 'Día 3 · Canopy y retorno', pasos: [
        'A las 5:30 a. m., caminata por el canopy, a 30 metros de altura, con vista del río Madre de Dios.',
        'Desde las plataformas se ven aves como tucanes, guacamayos, tangaras y oropéndolas.',
        'Desayuno y traslado al aeropuerto o al terminal de bus.',
      ] },
    ],
    incluye: ['Hospedaje', 'Guía', 'Transporte aeropuerto – albergue – aeropuerto', 'Alimentación: desayuno, almuerzo y cena', 'Piscina'],
    noIncluye: ['Consumo de bar (bebidas alcohólicas)', 'Entrada a la Reserva Nacional Tambopata (US$ 20)', 'Propinas'],
    llevar: ['Repelente', 'Linterna', 'Binoculares', 'Protector solar', 'Zapatos de caminata', 'Camisa de manga larga y pantalón largo, de preferencia de colores claros'],
  },
  {
    slug: 'collpa-guacamayos-full-day', cat: 'selva',
    nombre: 'Full Day Collpa de Guacamayos', duracion: '1 día', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'lodge-guacamayos', galeria: ['lodge-collpa', 'lodge-botes'],
    precio: null,
    resumen: 'Un día desde Puerto Maldonado a la collpa Chuncho, una de las collpas de guacamayos más grandes del mundo.',
    lugares: ['Puerto Maldonado', 'Comunidad de Filadelfia', 'Collpa Chuncho'],
    fuente: 'programa',
    itinerario: [
      { titulo: 'Collpa Chuncho', pasos: [
        'Salida a las 3:00 a. m. desde Puerto Maldonado, con opción de recojo en cualquier punto de la ciudad.',
        'Unas 2 horas en carro hasta la comunidad de Filadelfia.',
        '30 minutos en bote hasta la collpa Chuncho.',
        'Observación del descenso de guacamayos y otras aves amazónicas, que llegan en las primeras horas de la mañana a comer minerales.',
        'Regreso a la ciudad por la misma ruta.',
      ] },
    ],
    incluye: null, noIncluye: null,
  },
  {
    slug: 'manu-4-dias', cat: 'selva', destacado: true,
    nombre: 'Manu 4 días / 3 noches', duracion: '4 días / 3 noches', dificultad: 'Moderada', altura: 'de 3,500 m a selva baja',
    foto: 'manu-gallito', galeria: ['manu-gallito-2', 'tambopata-mono'],
    precio: { monto: 270, moneda: 'USD' },
    resumen: 'De Cusco a la Amazonía por tierra: el bosque nublado, con orquídeas y el gallito de las rocas, y los días en la selva del Manu. Todo incluido.',
    lugares: ['Cusco', 'Paucartambo', 'Bosque nublado', 'Manu'],
    fuente: 'florencio',
    itinerario: [
      { titulo: 'Día 1 · Cusco – bosque nublado – Paucartambo', pasos: [
        'Recojo en tu hotel de Cusco [hora por confirmar].',
        'Paso por Paucartambo y bajada al bosque nublado, lleno de orquídeas, heliconias y helechos primitivos.',
        'Con suerte, el ritual de apareamiento del gallito de las rocas, y la posibilidad de ver águilas.',
        'Noche en el albergue.',
      ] },
      { titulo: 'Días 2 a 4', pasos: ['[Itinerario por confirmar: está en el documento «Manu básico 4 días y 3 noches»]'] },
    ],
    incluye: ['Todo incluido [detalle por confirmar]'], noIncluye: null,
  },

  // ---- Puno ----
  {
    slug: 'puno-lago-titicaca', cat: 'puno', destacado: true,
    nombre: 'Puno y Lago Titicaca', duracion: '[Días por confirmar]', dificultad: 'Fácil', altura: '3,800 m',
    foto: 'titicaca-uros', galeria: ['titicaca-balsa', 'cusco'],
    precio: { monto: 360, moneda: null }, // REVISAR: «360» sin moneda
    resumen: 'El Lago Titicaca desde Puno: las islas flotantes de los Uros y el lago navegable más alto del mundo.',
    lugares: ['Puno', 'Lago Titicaca'],
    fuente: 'florencio',
    itinerario: null, incluye: null, noIncluye: null,
  },
];

// Qué llevar, general por categoría (consejo, no dato del negocio). Si el tour
// tiene su propia lista (la del programa del albergue), se usa esa.
const LLEVAR = {
  'machu-picchu': ['Pasaporte o DNI original (lo piden en la entrada)', 'Ropa por capas', 'Protector solar y gorra', 'Repelente', 'Agua'],
  cusco: ['Ropa abrigadora por capas', 'Protector solar', 'Agua', 'Soles en efectivo'],
  caminatas: ['Zapatillas de trekking o con buena suela', 'Casaca abrigadora e impermeable', 'Gorro, guantes y lentes de sol', 'Protector solar', 'Agua y algo dulce', 'Soles en efectivo'],
  selva: ['Ropa de manga larga y colores claros', 'Repelente', 'Linterna', 'Poncho de lluvia', 'Binoculares'],
  puno: ['Ropa abrigadora', 'Protector solar', 'Lentes de sol', 'Gorro'],
};

// Preguntas frecuentes, con datos generales y comprobables.
const PREGUNTAS = [
  ['¿Dónde y a qué hora me recogen?', 'En los tours desde Cusco, en tu hotel. La hora exacta depende del tour: te la confirmamos por WhatsApp al reservar. [Horarios de recojo de cada tour: por confirmar]'],
  ['¿Qué calzado necesito?', 'Para los tours culturales bastan zapatillas cómodas. Para las montañas y las caminatas, zapatillas de trekking o con buena suela, porque hay tramos de tierra y piedra. En la selva, calzado que se pueda mojar.'],
  ['¿Cuál es la mejor época para viajar a Cusco y Machu Picchu?', 'La temporada seca, de mayo a septiembre, tiene cielos más despejados. De diciembre a marzo llueve más, pero hay menos gente.'],
  ['¿Qué es el soroche y cómo evitarlo?', 'Es el malestar por la altura: Cusco está a unos 3,400 m. Descansa el primer día, come liviano, toma bastante agua y deja las montañas para después.'],
  ['¿Cómo llego a Tambopata?', 'En avión desde Cusco o Lima hasta Puerto Maldonado, o en bus desde Cusco por la carretera Interoceánica. Desde Puerto Maldonado, los albergues se alcanzan en bote.'],
];

// «Por qué viajar con nosotros». REVISAR: nada de esto se afirma sin
// confirmarlo con Florencio (años, guías, permisos, reseñas).
const POR_QUE = [
  ['Agencia de Cusco', 'Estamos en Cusco: te atendemos antes, durante y después del viaje. [Dirección de la oficina por confirmar]'],
  ['[Años de experiencia]', '[Desde qué año opera la agencia]'],
  ['[Guías oficiales]', '[Idiomas de los guías y si son licenciados]'],
  ['[Agencia autorizada]', '[Registro en DIRCETUR / MINCETUR, si lo tiene]'],
];

// Destinos del «giro» de la portada, en orden de recorrido.
const DESTINOS = [
  { nombre: 'Machu Picchu', foto: 'machu-picchu', texto: 'La ciudadela inca, entre montañas, sobre el valle del Urubamba.', href: 'tour-machu-picchu-2-dias.html' },
  { nombre: 'Valle Sagrado', foto: 'valle-sagrado', texto: 'El valle del río Urubamba y sus sitios arqueológicos.', href: 'tour-valle-sagrado.html' },
  { nombre: 'Montaña de 7 Colores', foto: 'montana-colores', texto: 'Vinicunca, a más de 5,000 metros de altura.', href: 'tour-montana-7-colores.html' },
  { nombre: 'Laguna Humantay', foto: 'humantay', texto: 'Agua turquesa al pie del nevado.', href: 'tour-laguna-humantay.html' },
  { nombre: 'Tambopata', foto: 'lodge-collpa', texto: 'La collpa de guacamayos, el lago Sandoval y la selva.', href: 'tambopata.html' },
  { nombre: 'Manu', foto: 'manu-gallito', texto: 'El bosque nublado del gallito de las rocas.', href: 'tour-manu-4-dias.html' },
];

module.exports = { MARCA, CONTACTO, IDIOMAS, CATEGORIAS, TOURS, LLEVAR, PREGUNTAS, POR_QUE, DESTINOS };
