/* ==========================================================================
   INKAS GOLDEN — contenido de la web
   --------------------------------------------------------------------------
   Todo lo que dice la web sale de acá. `node herramientas/construir.js`
   arma las páginas. Las páginas generadas no se editan a mano.

   Estructura copiada de las 10 primeras webs de «Machu Picchu» y las 10 de
   «Tambopata» (análisis del 2026-09-23 en Obsidian/proyectos/web-papa-florencio.md).
   El catálogo es el que se repite en esas 20 webs: **se reemplaza con los PDFs
   de Inkas Golden**. Todo dato del negocio que falta va en null o entre
   corchetes, y el constructor lo marca como REVISAR. Nunca se inventa.
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

// Idiomas: las webs de referencia van en inglés con ES y PT. Por ahora, español.
const IDIOMAS = ['ES', 'EN'];

// --- Categorías = menú principal ---------------------------------------------
const CATEGORIAS = [
  {
    clave: 'machu-picchu', archivo: 'machu-picchu.html', menu: 'Machu Picchu',
    titulo: 'Tours a Machu Picchu', foto: 'machu-picchu',
    bajada: 'En tren, en carro o caminando: todas las formas de llegar a la ciudadela inca desde Cusco.',
    intro: 'Machu Picchu está a unos 2,430 m de altura, sobre el valle del río Urubamba. Se llega en tren hasta Aguas Calientes y de ahí en bus hasta la entrada, o por tierra hasta la Hidroeléctrica. Las entradas son por horario y por circuito, con cupos diarios limitados: conviene reservar con anticipación.',
  },
  {
    clave: 'cusco', archivo: 'tours-en-cusco.html', menu: 'Tours en Cusco',
    titulo: 'Tours en Cusco', foto: 'valle-sagrado',
    bajada: 'City Tour, Valle Sagrado, Maras y Moray, la Montaña de 7 Colores y la Laguna Humantay.',
    intro: 'Cusco está a unos 3,400 m. Los tours de un día salen de la ciudad y vuelven en la tarde. Los de altura, como la Montaña de 7 Colores y Humantay, conviene dejarlos para después de dos o tres días de aclimatación.',
  },
  {
    clave: 'caminatas', archivo: 'caminatas.html', menu: 'Caminatas',
    titulo: 'Caminatas a Machu Picchu', foto: 'salkantay',
    bajada: 'El Camino Inca y las rutas alternativas, para llegar a Machu Picchu a pie.',
    intro: 'El Camino Inca necesita permiso oficial, con cupos limitados que se agotan meses antes, y cierra en febrero por mantenimiento. El Salkantay es la alternativa más conocida y no necesita ese permiso.',
  },
  {
    clave: 'tambopata', archivo: 'tambopata.html', menu: 'Tambopata',
    titulo: 'Tours a Tambopata', foto: 'tambopata-lago',
    bajada: 'La selva amazónica desde Puerto Maldonado: lagos, collpas de guacamayos y noches en el bosque.',
    intro: 'La Reserva Nacional Tambopata está en Madre de Dios, a alrededor de una hora de vuelo desde Cusco. Los tours salen de Puerto Maldonado y se mueven en bote por los ríos Madre de Dios y Tambopata.',
  },
  {
    clave: 'paquetes', archivo: 'paquetes.html', menu: 'Paquetes',
    titulo: 'Paquetes turísticos', foto: 'machu-picchu-atardecer',
    bajada: 'Varios días combinados, con los traslados resueltos: Cusco, Machu Picchu y la selva.',
    intro: 'Un paquete junta varios tours en un solo viaje, con los traslados y el orden pensados para aclimatarse bien. Se arman a medida según los días que tengas.',
  },
];

// --- Tours --------------------------------------------------------------------
// precio: null = «Precio por confirmar» en pantalla (REVISAR con los PDFs).
// itinerario, incluye y noIncluye: de referencia, iguales a los de las webs
// líderes. Se marcan «por confirmar» hasta tener la ficha de Inkas Golden.
const TOURS = [
  // Machu Picchu
  {
    slug: 'machu-picchu-full-day', cat: 'machu-picchu', destacado: true,
    nombre: 'Machu Picchu Full Day', duracion: '1 día', dificultad: 'Fácil', altura: '2,430 m',
    foto: 'machu-picchu', galeria: ['machu-picchu-huayna', 'machu-picchu-nubes'],
    resumen: 'La ciudadela inca en un solo día desde Cusco: tren por el valle del Urubamba, bus de subida y visita guiada.',
    lugares: ['Cusco', 'Ollantaytambo', 'Aguas Calientes', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Cusco – Machu Picchu – Cusco', pasos: [
        'Recojo en tu hotel de Cusco y traslado a la estación de tren.',
        'Tren por el valle del río Urubamba hasta Aguas Calientes.',
        'Bus de subida hasta la entrada de Machu Picchu.',
        'Visita guiada por el circuito que corresponde a tu entrada.',
        'Tiempo libre en Aguas Calientes.',
        'Tren de regreso y traslado a Cusco.',
      ] },
    ],
  },
  {
    slug: 'valle-sagrado-machu-picchu', cat: 'machu-picchu', destacado: true,
    nombre: 'Valle Sagrado y Machu Picchu', duracion: '2 días / 1 noche', dificultad: 'Fácil', altura: 'hasta 3,000 m',
    foto: 'valle-sagrado', galeria: ['machu-picchu', 'moray'],
    resumen: 'El Valle Sagrado el primer día, noche en Aguas Calientes y Machu Picchu temprano al día siguiente.',
    lugares: ['Pisac', 'Urubamba', 'Ollantaytambo', 'Aguas Calientes', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Día 1 · Valle Sagrado', pasos: ['Recojo en Cusco.', 'Mercado y andenes de Pisac.', 'Almuerzo en Urubamba.', 'Fortaleza de Ollantaytambo.', 'Tren a Aguas Calientes y noche en hotel.'] },
      { titulo: 'Día 2 · Machu Picchu', pasos: ['Bus temprano a Machu Picchu.', 'Visita guiada.', 'Tren de regreso y traslado a Cusco.'] },
    ],
  },
  {
    slug: 'machu-picchu-en-carro', cat: 'machu-picchu',
    nombre: 'Machu Picchu en carro', duracion: '2 días / 1 noche', dificultad: 'Moderada', altura: '2,430 m',
    foto: 'machu-picchu-nubes', galeria: ['machu-picchu', 'machu-picchu-huayna'],
    resumen: 'La ruta por tierra: carro hasta la Hidroeléctrica y unas tres horas de caminata junto a la vía del tren hasta Aguas Calientes.',
    lugares: ['Santa María', 'Santa Teresa', 'Hidroeléctrica', 'Aguas Calientes', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Día 1 · Cusco – Hidroeléctrica – Aguas Calientes', pasos: ['Salida temprano de Cusco en carro.', 'Paso por el abra Málaga y Santa María.', 'Llegada a la Hidroeléctrica.', 'Caminata junto a la vía del tren hasta Aguas Calientes.', 'Noche en hotel.'] },
      { titulo: 'Día 2 · Machu Picchu – Cusco', pasos: ['Subida a Machu Picchu.', 'Visita guiada.', 'Regreso a la Hidroeléctrica y en carro a Cusco.'] },
    ],
  },
  {
    slug: 'machu-picchu-huayna-picchu', cat: 'machu-picchu',
    nombre: 'Machu Picchu y Huayna Picchu', duracion: '1 día', dificultad: 'Exigente', altura: '2,720 m',
    foto: 'machu-picchu-huayna', galeria: ['machu-picchu-atardecer', 'machu-picchu-nubes'],
    resumen: 'Machu Picchu más la subida a Huayna Picchu, la montaña de todas las fotos. Cupos muy limitados.',
    lugares: ['Cusco', 'Aguas Calientes', 'Machu Picchu', 'Huayna Picchu'],
    itinerario: [
      { titulo: 'Cusco – Machu Picchu – Huayna Picchu – Cusco', pasos: ['Recojo y tren a Aguas Calientes.', 'Bus a Machu Picchu y visita guiada.', 'Subida a Huayna Picchu en el horario de tu entrada.', 'Tren de regreso a Cusco.'] },
    ],
  },
  // Tours en Cusco
  {
    slug: 'city-tour-cusco', cat: 'cusco', destacado: true,
    nombre: 'City Tour Cusco', duracion: 'Medio día', dificultad: 'Fácil', altura: '3,400 a 3,700 m',
    foto: 'cusco', galeria: ['valle-sagrado', 'machu-picchu-atardecer'],
    resumen: 'El Cusco inca y colonial: Qorikancha, la Catedral y los sitios arqueológicos de las alturas de la ciudad.',
    lugares: ['Qorikancha', 'Catedral', 'Sacsayhuamán', "Q'enqo", 'Puka Pukara', 'Tambomachay'],
    itinerario: [
      { titulo: 'Tarde en Cusco', pasos: ['Recojo en tu hotel o encuentro en la Plaza de Armas.', 'Qorikancha, el templo del Sol.', 'Catedral de Cusco.', "Sacsayhuamán, Q'enqo, Puka Pukara y Tambomachay.", 'Regreso a la Plaza de Armas.'] },
    ],
  },
  {
    slug: 'valle-sagrado', cat: 'cusco',
    nombre: 'Valle Sagrado de los Incas', duracion: '1 día', dificultad: 'Fácil', altura: 'hasta 3,760 m',
    foto: 'valle-sagrado', galeria: ['moray', 'maras'],
    resumen: 'Un día por el valle del Urubamba: Pisac, Urubamba, Ollantaytambo y Chinchero de regreso.',
    lugares: ['Pisac', 'Urubamba', 'Ollantaytambo', 'Chinchero'],
    itinerario: [
      { titulo: 'Valle Sagrado', pasos: ['Recojo en Cusco.', 'Mirador de Taray y Pisac.', 'Almuerzo en Urubamba.', 'Ollantaytambo.', 'Chinchero y regreso a Cusco.'] },
    ],
  },
  {
    slug: 'maras-moray', cat: 'cusco',
    nombre: 'Maras y Moray', duracion: 'Medio día', dificultad: 'Fácil', altura: '3,500 m',
    foto: 'moray', galeria: ['maras', 'valle-sagrado'],
    resumen: 'Los andenes circulares de Moray y las salineras de Maras, miles de pozos de sal en la ladera.',
    lugares: ['Moray', 'Salineras de Maras'],
    itinerario: [
      { titulo: 'Maras y Moray', pasos: ['Recojo en Cusco.', 'Andenes circulares de Moray.', 'Salineras de Maras.', 'Regreso a Cusco.'] },
    ],
  },
  {
    slug: 'montana-7-colores', cat: 'cusco', destacado: true,
    nombre: 'Montaña de 7 Colores', duracion: '1 día', dificultad: 'Exigente', altura: 'más de 5,000 m',
    foto: 'montana-colores', galeria: ['montana-colores-2', 'salkantay'],
    resumen: 'Vinicunca, la montaña de franjas de colores. Caminata de altura con salida de madrugada.',
    lugares: ['Cusipata', 'Vinicunca'],
    itinerario: [
      { titulo: 'Vinicunca', pasos: ['Recojo de madrugada en Cusco.', 'Desayuno en el camino.', 'Caminata de subida hasta el mirador.', 'Bajada y almuerzo.', 'Regreso a Cusco por la tarde.'] },
    ],
  },
  {
    slug: 'laguna-humantay', cat: 'cusco',
    nombre: 'Laguna Humantay', duracion: '1 día', dificultad: 'Exigente', altura: '4,200 m',
    foto: 'humantay', galeria: ['salkantay', 'montana-colores'],
    resumen: 'Una laguna turquesa al pie del nevado Humantay, en la ruta del Salkantay. Subida de alrededor de dos horas.',
    lugares: ['Mollepata', 'Soraypampa', 'Laguna Humantay'],
    itinerario: [
      { titulo: 'Humantay', pasos: ['Recojo de madrugada en Cusco.', 'Desayuno en Mollepata.', 'Caminata desde Soraypampa hasta la laguna.', 'Bajada y almuerzo.', 'Regreso a Cusco.'] },
    ],
  },
  // Caminatas
  {
    slug: 'camino-inca-4-dias', cat: 'caminatas', destacado: true,
    nombre: 'Camino Inca a Machu Picchu', duracion: '4 días / 3 noches', dificultad: 'Exigente', altura: 'paso a 4,215 m',
    foto: 'machu-picchu-atardecer', galeria: ['machu-picchu', 'salkantay'],
    resumen: 'El camino original de los incas hasta la Puerta del Sol. Permisos limitados: se reservan meses antes.',
    lugares: ['Km 82', 'Llactapata', 'Abra Warmiwañusca', 'Wiñay Wayna', 'Puerta del Sol', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Día 1', pasos: ['Traslado al km 82 e inicio de la caminata.', 'Llactapata.', 'Campamento.'] },
      { titulo: 'Día 2', pasos: ['Subida al abra Warmiwañusca, el punto más alto.', 'Campamento.'] },
      { titulo: 'Día 3', pasos: ['Sitios arqueológicos del camino.', 'Wiñay Wayna.', 'Campamento.'] },
      { titulo: 'Día 4', pasos: ['Puerta del Sol al amanecer.', 'Visita guiada de Machu Picchu.', 'Tren de regreso a Cusco.'] },
    ],
  },
  {
    slug: 'camino-inca-corto', cat: 'caminatas',
    nombre: 'Camino Inca corto', duracion: '2 días / 1 noche', dificultad: 'Moderada', altura: '2,720 m',
    foto: 'machu-picchu-huayna', galeria: ['machu-picchu-atardecer', 'machu-picchu'],
    resumen: 'El último tramo del Camino Inca, por Wiñay Wayna hasta la Puerta del Sol, y Machu Picchu al día siguiente.',
    lugares: ['Km 104', 'Wiñay Wayna', 'Puerta del Sol', 'Aguas Calientes', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Día 1', pasos: ['Tren hasta el km 104.', 'Caminata a Wiñay Wayna y la Puerta del Sol.', 'Bajada a Aguas Calientes y noche en hotel.'] },
      { titulo: 'Día 2', pasos: ['Visita guiada de Machu Picchu.', 'Tren de regreso a Cusco.'] },
    ],
  },
  {
    slug: 'salkantay-5-dias', cat: 'caminatas',
    nombre: 'Salkantay a Machu Picchu', duracion: '5 días / 4 noches', dificultad: 'Exigente', altura: 'paso a unos 4,600 m',
    foto: 'salkantay', galeria: ['humantay', 'machu-picchu'],
    resumen: 'Del nevado Salkantay a la selva alta, con la Laguna Humantay en el camino. No necesita permiso del Camino Inca.',
    lugares: ['Mollepata', 'Laguna Humantay', 'Abra Salkantay', 'Santa Teresa', 'Aguas Calientes', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Día 1', pasos: ['Traslado a Mollepata y Soraypampa.', 'Laguna Humantay.', 'Campamento.'] },
      { titulo: 'Día 2', pasos: ['Abra Salkantay, el punto más alto.', 'Bajada hacia la selva alta.'] },
      { titulo: 'Día 3', pasos: ['Caminata por el valle hasta Santa Teresa.'] },
      { titulo: 'Día 4', pasos: ['Hidroeléctrica y caminata a Aguas Calientes.'] },
      { titulo: 'Día 5', pasos: ['Visita guiada de Machu Picchu.', 'Regreso a Cusco.'] },
    ],
  },
  // Tambopata
  {
    slug: 'tambopata-3-dias', cat: 'tambopata', destacado: true,
    nombre: 'Tambopata', duracion: '3 días / 2 noches', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'tambopata-lago', galeria: ['tambopata-mono', 'tambopata-caiman'],
    resumen: 'Tres días en la Reserva Nacional Tambopata: lago Sandoval, caminatas por el bosque y salidas de noche.',
    lugares: ['Puerto Maldonado', 'Río Madre de Dios', 'Lago Sandoval', 'Reserva Nacional Tambopata'],
    itinerario: [
      { titulo: 'Día 1', pasos: ['Recojo en el aeropuerto o terminal de Puerto Maldonado.', 'Bote hasta el albergue.', 'Caminata nocturna.'] },
      { titulo: 'Día 2', pasos: ['Lago Sandoval en canoa.', 'Caminata por el bosque.', 'Salida de noche para ver caimanes.'] },
      { titulo: 'Día 3', pasos: ['Amanecer en la selva.', 'Regreso a Puerto Maldonado.'] },
    ],
  },
  {
    slug: 'tambopata-4-dias', cat: 'tambopata',
    nombre: 'Tambopata y collpa de guacamayos', duracion: '4 días / 3 noches', dificultad: 'Moderada', altura: 'selva baja',
    foto: 'tambopata-guacamayo', galeria: ['tambopata-lago', 'tambopata-rio'],
    resumen: 'Suma la collpa: la pared de arcilla donde, al amanecer, bajan loros y guacamayos.',
    lugares: ['Puerto Maldonado', 'Lago Sandoval', 'Collpa de guacamayos', 'Reserva Nacional Tambopata'],
    itinerario: [
      { titulo: 'Día 1', pasos: ['Recojo en Puerto Maldonado y bote al albergue.', 'Caminata nocturna.'] },
      { titulo: 'Día 2', pasos: ['Collpa de loros y guacamayos al amanecer.', 'Caminata por el bosque.'] },
      { titulo: 'Día 3', pasos: ['Lago Sandoval.', 'Salida de noche para ver caimanes.'] },
      { titulo: 'Día 4', pasos: ['Regreso a Puerto Maldonado.'] },
    ],
  },
  {
    slug: 'lago-sandoval-full-day', cat: 'tambopata',
    nombre: 'Lago Sandoval Full Day', duracion: '1 día', dificultad: 'Fácil', altura: 'selva baja',
    foto: 'tambopata-rio', galeria: ['tambopata-lago', 'tambopata-mono'],
    resumen: 'Un día desde Puerto Maldonado: bote por el río, caminata por el bosque y canoa por el lago Sandoval.',
    lugares: ['Puerto Maldonado', 'Río Madre de Dios', 'Lago Sandoval'],
    itinerario: [
      { titulo: 'Lago Sandoval', pasos: ['Recojo en Puerto Maldonado.', 'Bote por el río Madre de Dios.', 'Caminata hasta el lago.', 'Canoa por el lago Sandoval.', 'Regreso a Puerto Maldonado.'] },
    ],
  },
  // Paquetes
  {
    slug: 'cusco-machu-picchu-4-dias', cat: 'paquetes', destacado: true,
    nombre: 'Cusco y Machu Picchu', duracion: '4 días / 3 noches', dificultad: 'Fácil', altura: 'hasta 3,700 m',
    foto: 'machu-picchu', galeria: ['cusco', 'valle-sagrado'],
    resumen: 'Lo esencial en cuatro días: City Tour, Valle Sagrado y Machu Picchu, con los traslados.',
    lugares: ['Cusco', 'Valle Sagrado', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Día 1 · Llegada y City Tour', pasos: ['Recojo en el aeropuerto de Cusco.', 'Mañana libre para aclimatarse.', 'City Tour por la tarde.'] },
      { titulo: 'Día 2 · Valle Sagrado', pasos: ['Pisac, Urubamba y Ollantaytambo.', 'Tren a Aguas Calientes.'] },
      { titulo: 'Día 3 · Machu Picchu', pasos: ['Visita guiada de Machu Picchu.', 'Tren de regreso a Cusco.'] },
      { titulo: 'Día 4 · Salida', pasos: ['Traslado al aeropuerto.'] },
    ],
  },
  {
    slug: 'cusco-machu-picchu-tambopata-7-dias', cat: 'paquetes',
    nombre: 'Cusco, Machu Picchu y Tambopata', duracion: '7 días / 6 noches', dificultad: 'Moderada', altura: 'hasta 3,700 m',
    foto: 'tambopata-guacamayo', galeria: ['machu-picchu', 'tambopata-lago'],
    resumen: 'Los Andes y la Amazonía en un viaje: Cusco, Machu Picchu y tres días en Tambopata.',
    lugares: ['Cusco', 'Valle Sagrado', 'Machu Picchu', 'Puerto Maldonado', 'Tambopata'],
    itinerario: [
      { titulo: 'Días 1 a 4 · Cusco y Machu Picchu', pasos: ['Llegada, City Tour, Valle Sagrado y Machu Picchu.'] },
      { titulo: 'Días 5 a 7 · Tambopata', pasos: ['Vuelo a Puerto Maldonado.', 'Lago Sandoval y selva.', 'Regreso.'] },
    ],
  },
];

// Qué incluye, de referencia, por categoría (lo que ofrecen las webs líderes).
// REVISAR: se reemplaza con lo que incluye cada tour de Inkas Golden.
const INCLUYE = {
  'machu-picchu': { si: ['Recojo en tu hotel de Cusco', 'Tren de ida y vuelta', 'Bus de subida y bajada', 'Entrada a Machu Picchu', 'Guía'], no: ['Comidas no indicadas', 'Propinas'] },
  cusco: { si: ['Recojo en tu hotel de Cusco', 'Transporte turístico', 'Guía'], no: ['Boleto turístico o entradas', 'Comidas no indicadas'] },
  caminatas: { si: ['Traslados', 'Guía', 'Campamento y comidas durante la caminata', 'Entrada a Machu Picchu'], no: ['Bolsa de dormir', 'Propinas'] },
  tambopata: { si: ['Recojo en Puerto Maldonado', 'Transporte en bote', 'Albergue', 'Comidas en el albergue', 'Guía', 'Entrada a la reserva'], no: ['Vuelo a Puerto Maldonado', 'Bebidas'] },
  paquetes: { si: ['Traslados', 'Hoteles', 'Tours del itinerario', 'Guía'], no: ['Vuelos', 'Comidas no indicadas'] },
};

const LLEVAR = {
  'machu-picchu': ['Pasaporte o DNI original (lo piden en la entrada)', 'Ropa por capas', 'Protector solar y gorra', 'Repelente', 'Agua'],
  cusco: ['Ropa abrigadora por capas', 'Protector solar', 'Agua', 'Soles en efectivo'],
  caminatas: ['Pasaporte original', 'Zapatillas de trekking', 'Casaca impermeable', 'Ropa térmica', 'Bastones'],
  tambopata: ['Ropa de manga larga y colores claros', 'Repelente', 'Linterna', 'Poncho de lluvia', 'Binoculares'],
  paquetes: ['Pasaporte o DNI', 'Ropa por capas', 'Repelente para la selva'],
};

// Preguntas frecuentes, con datos generales y comprobables.
const PREGUNTAS = [
  ['¿Cuál es la mejor época para viajar a Cusco y Machu Picchu?', 'La temporada seca, de mayo a septiembre, tiene cielos más despejados. De diciembre a marzo llueve más, pero hay menos gente.'],
  ['¿Qué es el soroche y cómo evitarlo?', 'Es el malestar por la altura: Cusco está a unos 3,400 m. Descansa el primer día, come liviano, toma bastante agua y deja los tours más altos para después.'],
  ['¿Con cuánta anticipación reservo Machu Picchu?', 'Las entradas tienen cupos diarios. En temporada alta conviene reservar con semanas de anticipación, y el Camino Inca con meses.'],
  ['¿El Camino Inca está abierto todo el año?', 'No: cierra en febrero por mantenimiento. El resto del año necesita permiso oficial, que solo tramita una agencia autorizada.'],
  ['¿Cómo llego a Tambopata?', 'En avión desde Cusco o Lima hasta Puerto Maldonado. Desde Cusco también hay buses por la carretera Interoceánica.'],
];

// Sección «Por qué viajar con nosotros». REVISAR: nada de esto se afirma sin
// confirmarlo con Florencio (años, guías, permisos, reseñas).
const POR_QUE = [
  ['Agencia de Cusco', 'Estamos en Cusco: te atendemos antes, durante y después del viaje. [Dirección de la oficina por confirmar]'],
  ['[Años de experiencia]', '[Desde qué año opera la agencia]'],
  ['[Guías oficiales]', '[Idiomas de los guías y si son licenciados]'],
  ['[Agencia autorizada]', '[Registro en DIRCETUR / MINCETUR, si lo tiene]'],
];

// Destinos del «giro» de la portada, en orden de recorrido.
const DESTINOS = [
  { nombre: 'Machu Picchu', foto: 'machu-picchu', texto: 'La ciudadela inca, entre montañas, sobre el valle del Urubamba.', href: 'machu-picchu.html' },
  { nombre: 'Valle Sagrado', foto: 'valle-sagrado', texto: 'Pisac, Ollantaytambo y los pueblos del río Urubamba.', href: 'tour-valle-sagrado.html' },
  { nombre: 'Montaña de 7 Colores', foto: 'montana-colores', texto: 'Vinicunca, a más de 5,000 metros de altura.', href: 'tour-montana-7-colores.html' },
  { nombre: 'Laguna Humantay', foto: 'humantay', texto: 'Agua turquesa al pie del nevado.', href: 'tour-laguna-humantay.html' },
  { nombre: 'Tambopata', foto: 'tambopata-lago', texto: 'La Amazonía peruana: lagos, guacamayos y selva.', href: 'tambopata.html' },
];

module.exports = { MARCA, CONTACTO, IDIOMAS, CATEGORIAS, TOURS, INCLUYE, LLEVAR, PREGUNTAS, POR_QUE, DESTINOS };
