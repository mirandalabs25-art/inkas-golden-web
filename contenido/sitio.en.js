/* ==========================================================================
   INKAS GOLDEN — English version (2026-09-24)
   --------------------------------------------------------------------------
   Only TEXT lives here. Prices, photos, slugs and links come from sitio.js,
   so a price changed there changes in both languages. If a tour or category
   has no translation here, the builder warns and falls back to Spanish.
   Missing business data stays in [brackets], as in Spanish: nothing is made up.
   Why English: a buyer wrote in English on 21/09 (Manu, US$ 260), and 7 of
   the 20 leading websites have an English version.
   ========================================================================== */

const MARCA = { lema: 'Travel agency in Cusco' };
const CONTACTO = { horario: 'From 8:00 a.m. to 8:00 p.m.' };
const PAGOS = ['Yape', 'Plin', 'Bank transfer', 'Card', 'PayPal', 'Cash'];
const GUIAS = 'Spanish and English; other languages on request';

const CATEGORIAS = {
  'machu-picchu': {
    menu: 'Machu Picchu', titulo: 'Machu Picchu Tours',
    bajada: 'The Sacred Valley, a night at the foot of the mountain and the Inca citadel with a guide.',
    intro: 'Machu Picchu sits at about 2,430 m, above the Urubamba River valley. You reach Machu Picchu Pueblo (Aguas Calientes) by train and then take a bus to the entrance. Tickets have a daily limit, so it is best to book ahead.',
  },
  cusco: {
    menu: 'Cusco Tours', titulo: 'Cusco Tours',
    bajada: 'The City Tour, the Sacred Valley and the South Valley: Inca and colonial Cusco.',
    intro: 'The cultural tours leave from Cusco and return the same day. They are the best way to get used to the altitude before the treks.',
  },
  caminatas: {
    menu: 'Treks', titulo: 'Treks and Mountains',
    bajada: 'Rainbow Mountain, Palcoyo, Humantay, the Seven Lakes, Waqrapukara and Salkantay.',
    intro: 'These are high-altitude hikes: most go above 4,000 m. Do them after two or three days in Cusco, with warm clothes and shoes with a good grip.',
  },
  selva: {
    menu: 'Tambopata & Manu', titulo: 'Tambopata and Manu',
    bajada: 'The Peruvian Amazon: macaw clay licks, Lake Sandoval, nights in a lodge and the cloud forest of Manu.',
    intro: 'Tambopata is in Madre de Dios: you fly or take a bus to Puerto Maldonado, then a boat to the lodges. Manu is reached overland from Cusco, descending through the cloud forest.',
  },
  puno: {
    menu: 'Lake Titicaca', titulo: 'Puno and Lake Titicaca',
    bajada: 'The highest navigable lake in the world and the floating islands of the Uros.',
    intro: 'Puno lies on the shore of Lake Titicaca, at about 3,800 m, between Peru and Bolivia.',
  },
};

// Texts shared by the four Tambopata lodge programs.
const J = {
  alojamiento: 'Lodge in the Tambopata National Reserve, about 40 minutes by boat from Puerto Maldonado: bungalows with a terrace, restaurant, swimming pool, zip line and hanging bridge, surrounded by protected forest. Check-in from 10:00 a.m.; check-out until 5:00 p.m.',
  incluye: ['Entrance to the Tambopata National Reserve', 'Professional guide', 'Lodging and meals', 'River transport'],
  noIncluye: ['Drinks from the bar'],
  llevar: ['Personal documents', 'Insect repellent', 'Sunscreen', 'Hat', 'Sunglasses', 'Swimsuit', 'A warm layer', 'Portable rain poncho', 'Reusable water bottle', 'Comfortable clothes', 'Comfortable closed-toe walking shoes', 'Your medication, if you take any', 'Handheld fan'],
  nota: 'The order and times may change depending on the guide, the weather and the group\'s fitness. Tell us the time of your return flight so we can schedule your transfer back to the city.',
  llegada: 'Departure from the Capitanía port in Puerto Maldonado: about 40 minutes by boat on the Madre de Dios River to the lodge, in the Tambopata National Reserve.',
  sandoval: [
    'About 15 minutes by boat to the Lake Sandoval checkpoint.',
    'A walk of about 3 km through the forest, among fig, lupuna, palm and shihuahuaco trees, with a chance to see monkeys, birds and squirrels.',
    'Paddle canoe ride on the lake: with luck, giant otters, macaws, hoatzins, herons, black caimans and monkeys.',
  ],
  monos: 'Kayaking on the Madre de Dios River and a visit to Rolín Monkey Island, home to capuchin monkeys rescued by local residents.',
  matsiguenka: 'Visit to a Matsiguenka family, originally from Manu National Park, who live on the banks of the Madre de Dios River: spinning thread, lighting a fire the traditional way and archery.',
};
const SELVA = 'lowland rainforest';

const TOURS = {
  'machu-picchu-2-dias': {
    nombre: 'Machu Picchu 2 Days / 1 Night', duracion: '2 days / 1 night', dificultad: 'Easy', altura: '2,430 m',
    resumen: 'The Sacred Valley on the connecting tour, the train to Machu Picchu Pueblo, a night there and a guided visit to the citadel the next day.',
    lugares: ['Cusco', 'Sacred Valley', 'Ollantaytambo', 'Machu Picchu Pueblo', 'Machu Picchu'],
    itinerario: [
      { titulo: 'Day 1 · Sacred Valley and train to Machu Picchu', pasos: ['Connecting tour through the Sacred Valley.', 'Train to Machu Picchu Pueblo.', 'Night in Machu Picchu Pueblo.'] },
      { titulo: 'Day 2 · Machu Picchu and return', pasos: ['Bus up to Machu Picchu.', 'Guided visit.', 'Bus down.', 'Train back to Ollantaytambo and bus to Cusco.'] },
    ],
    incluye: ['Connecting tour', 'Sacred Valley tour', 'Round-trip train', 'Entrance to Machu Picchu', 'Bus up and down', 'Guide', 'Return bus Ollantaytambo – Cusco', '1 night in Machu Picchu Pueblo'],
    noIncluye: ['Cusco tourist ticket (boleto turístico)'],
  },
  'city-tour-cusco': {
    nombre: 'Cusco City Tour', duracion: 'Half day', dificultad: 'Easy', altura: '3,400 to 3,700 m',
    resumen: 'Inca Cusco: the Qorikancha and the four archaeological sites above the city.',
    lugares: ['Qorikancha', 'Sacsayhuamán', "Q'enqo", 'Puka Pukara', 'Tambomachay'],
    itinerario: [
      { titulo: 'City Tour', pasos: ['Qorikancha, the Temple of the Sun.', 'Sacsayhuamán.', "Q'enqo.", 'Puka Pukara.', 'Tambomachay.'] },
    ],
  },
  'valle-sagrado': {
    nombre: 'Sacred Valley of the Incas', duracion: '1 day', dificultad: 'Easy', altura: 'up to 3,760 m',
    resumen: 'A full day along the Urubamba River valley, visiting its archaeological sites.',
    lugares: ['[Places to be confirmed]'],
    incluye: ['Round-trip bus', 'Visit to the archaeological sites'],
  },
  'valle-sur': {
    nombre: 'South Valley', duracion: '[Duration to be confirmed]', dificultad: 'Easy', altura: 'up to 3,300 m',
    resumen: 'The valley south of Cusco, with its archaeological sites and colonial towns.',
    lugares: ['[Places to be confirmed]'],
    incluye: ['Bus', 'Guide'],
  },
  'montana-7-colores': {
    nombre: 'Rainbow Mountain', duracion: '1 day', dificultad: 'Challenging', altura: 'over 5,000 m',
    resumen: 'Vinicunca, the mountain striped with colors. A high-altitude hike, with oxygen and trekking poles included.',
    lugares: ['Vinicunca'],
    incluye: ['Round-trip bus', 'Breakfast', 'Lunch', 'Guide', 'Oxygen', 'Trekking poles'],
  },
  palcoyo: {
    nombre: 'Palcoyo Mountain', duracion: '1 day', dificultad: 'Moderate', altura: 'over 4,900 m',
    resumen: 'The other rainbow mountain, with a shorter hike than Vinicunca.',
    lugares: ['Palcoyo'],
  },
  'laguna-humantay': {
    nombre: 'Humantay Lake', duracion: '1 day', dificultad: 'Challenging', altura: '4,200 m',
    resumen: 'A turquoise lake at the foot of the Humantay glacier. Oxygen and trekking poles included.',
    lugares: ['Humantay Lake'],
    incluye: ['Round-trip bus', 'Breakfast', 'Lunch', 'Guide', 'Oxygen', 'Trekking poles'],
  },
  'siete-lagunas': {
    nombre: 'Ausangate Seven Lakes', duracion: '1 day', dificultad: 'Moderate', altura: 'over 4,500 m',
    resumen: 'A loop among colorful lakes at the foot of the Ausangate glacier. All inclusive.',
    lugares: ['Ausangate', 'Seven Lakes'],
    incluye: ['All inclusive [details to be confirmed]'],
  },
  waqrapukara: {
    nombre: 'Waqrapukara', duracion: '1 day', dificultad: 'Moderate', altura: 'about 4,100 m',
    resumen: 'The horn-shaped Inca fortress above the Apurímac River canyon.',
    lugares: ['Waqrapukara'],
  },
  salkantay: {
    nombre: 'Salkantay Trek', duracion: '[Days to be confirmed]', dificultad: 'Challenging', altura: 'pass at about 4,600 m',
    resumen: 'The trek at the foot of the Salkantay glacier, all inclusive.',
    lugares: ['Salkantay'],
    incluye: ['All inclusive [details to be confirmed]'],
  },
  'tambopata-4-dias': {
    nombre: 'Tambopata Grand Experience · 4 Days / 3 Nights', duracion: '4 days / 3 nights', dificultad: 'Easy', altura: SELVA,
    resumen: 'Nature, culture, adventure and local life: Lake Sandoval, the parrot clay lick at dawn, a Matsiguenka family, a farm plot, zip line and kayaking.',
    lugares: ['Puerto Maldonado', 'Lake Sandoval', 'La Cachuela parrot clay lick', 'Matsiguenka family', 'Rolín Monkey Island'],
    alojamiento: J.alojamiento,
    itinerario: [
      { titulo: 'Day 1 · Arrival, fishing and caimans', pasos: [J.llegada, 'Check-in and a walk through the forest around the lodge.', '1:00 p.m. Lunch.', '3:00 p.m. Sport fishing near the Madre de Dios River and, if the day allows, the sunset.', 'Outing on the river to see caimans and, with luck, capybaras, birds and bats.', '7:30 p.m. Dinner.'] },
      { titulo: 'Day 2 · Lake Sandoval', pasos: ['8:00 a.m. Breakfast.', '10:00 a.m. ' + J.sandoval[0], ...J.sandoval.slice(1), 'Lunch at a local family\'s stand and return along the same trail.', '7:30 p.m. Dinner.'] },
      { titulo: 'Day 3 · Parrot clay lick, Matsiguenka family and farm', pasos: ['4:30 a.m. Canoe trip on the Madre de Dios River at dawn to the La Cachuela parrot clay lick, where parrots come to eat clay.', 'Back for breakfast and a free morning at the pool.', '1:00 p.m. Lunch.', J.matsiguenka, 'Visit to a local farm plot: agroforestry in the rainforest and seasonal fruit.'] },
      { titulo: 'Day 4 · Zip line, kayaking and return', pasos: ['8:00 a.m. Breakfast.', 'Zip line and hanging bridge near the lodge.', '1:00 p.m. Lunch.', '3:00 p.m. ' + J.monos, 'Pick up your luggage and return to the city.'] },
    ],
    notaItinerario: J.nota, incluye: J.incluye, noIncluye: J.noIncluye, llevar: J.llevar,
  },
  'experiencia-completa-3-dias': {
    nombre: 'Tambopata Complete Experience · 3 Days / 2 Nights', duracion: '3 days / 2 nights', dificultad: 'Easy', altura: SELVA,
    resumen: 'Nature, culture and adventure: a Matsiguenka family, Lake Sandoval, a night walk, zip line, hanging bridge and kayaking.',
    lugares: ['Puerto Maldonado', 'Matsiguenka family', 'Lake Sandoval', 'Rolín Monkey Island'],
    alojamiento: J.alojamiento,
    itinerario: [
      { titulo: 'Day 1 · Arrival, Matsiguenka family and caimans', pasos: [J.llegada, 'Check-in and a walk through the forest around the lodge.', '1:00 p.m. Lunch.', '3:00 p.m. ' + J.matsiguenka, 'Sport fishing near the river and, if the day allows, the sunset.', 'Outing on the river to see caimans and, with luck, capybaras, birds and bats.', 'Dinner.'] },
      { titulo: 'Day 2 · Lake Sandoval and night walk', pasos: ['8:00 a.m. Breakfast.', '10:00 a.m. ' + J.sandoval[0], ...J.sandoval.slice(1), 'Lunch at a local family\'s stand and return to the lodge.', 'Dinner.', 'Night walk to discover insects, birds and reptiles.'] },
      { titulo: 'Day 3 · Zip line, kayaking and return', pasos: ['8:00 a.m. Breakfast.', '10:00 a.m. Zip line and hanging bridge near the lodge.', '1:00 p.m. Lunch.', '3:00 p.m. ' + J.monos, 'Pick up your luggage and return to the city.'] },
    ],
    notaItinerario: J.nota, incluye: J.incluye, noIncluye: J.noIncluye, llevar: J.llevar,
  },
  'aventura-lago-sandoval-2-dias': {
    nombre: 'Adventure and Lake Sandoval · 2 Days / 1 Night', duracion: '2 days / 1 night', dificultad: 'Easy', altura: SELVA,
    resumen: 'Zip line, hanging bridge, kayaking, caimans and a night walk on the first day; Lake Sandoval on the second.',
    lugares: ['Puerto Maldonado', 'Rolín Monkey Island', 'Lake Sandoval'],
    alojamiento: J.alojamiento,
    itinerario: [
      { titulo: 'Day 1 · Adventure in the rainforest', pasos: [J.llegada, '10:30 a.m. Check-in.', 'Zip line and hanging bridge near the lodge.', '1:00 p.m. Lunch.', J.monos, 'Outing on the river to see caimans and, with luck, capybaras, birds and bats.', '7:00 p.m. Dinner.', '8:00 p.m. Night walk to discover insects, birds and reptiles.'] },
      { titulo: 'Day 2 · Lake Sandoval and return', pasos: [...J.sandoval, 'Lunch at a local family\'s stand.', 'Back to the lodge along the same trail, pick up your belongings and return to the city.'] },
    ],
    notaItinerario: J.nota, incluye: J.incluye, noIncluye: J.noIncluye, llevar: J.llevar,
  },
  'lago-sandoval-2-dias': {
    nombre: 'Lake Sandoval · 2 Days / 1 Night', duracion: '2 days / 1 night', dificultad: 'Easy', altura: SELVA,
    resumen: 'Kayaking, Rolín Monkey Island and caimans on the first day; Lake Sandoval by paddle canoe on the second.',
    lugares: ['Puerto Maldonado', 'Rolín Monkey Island', 'Lake Sandoval'],
    alojamiento: J.alojamiento,
    itinerario: [
      { titulo: 'Day 1 · Arrival, kayaking and caimans', pasos: [J.llegada, '11:00 a.m. Check-in and an introductory walk.', '1:00 p.m. Lunch.', '3:00 p.m. ' + J.monos, '5:00 p.m. Outing to see caimans on the banks of the Madre de Dios River, and other night species such as birds or capybaras.', '7:30 p.m. Dinner.', 'Optional: night walk around the lodge.'] },
      { titulo: 'Day 2 · Lake Sandoval and return', pasos: [...J.sandoval, 'Lunch on the lakeshore.', 'Back to the lodge along the same trail, pick up your belongings and return to the city.'] },
    ],
    notaItinerario: J.nota, incluye: J.incluye, noIncluye: J.noIncluye, llevar: J.llevar,
  },
  'collpa-chuncho-2-dias': {
    nombre: 'Chuncho Clay Lick · 2 Days / 1 Night', duracion: '2 days / 1 night', dificultad: 'Easy', altura: SELVA,
    resumen: 'A night in an eco-lodge on the edge of the Tambopata National Reserve and, at dawn, the Chuncho clay lick, where macaws and parrots come down to eat clay.',
    lugares: ['Puerto Maldonado', 'Tambopata River', 'Observation tower', 'Chuncho clay lick'],
    alojamiento: 'Eco-lodge with a bar, swimming pool and buffet meals, on the edge of the Tambopata National Reserve. Rooms of 24 to 68 m², with a private bathroom and a window open to the forest.',
    itinerario: [
      { titulo: 'Day 1 · Puerto Maldonado – lodge', pasos: [
        'Arrival in Puerto Maldonado, capital of Madre de Dios.',
        'About 2 hours by bus and a stretch by boat to the lodge.',
        'Welcome drink and a short talk about the lodge.',
        'In the afternoon, a 2 to 4 km walk through primary forest: medicinal plants, the local economy and a chance to see seven species of monkeys and many birds.',
        'Visit to the 50 m observation tower, with a view over the Amazon basin.',
        'Optional at night: boat outing on the Tambopata River to see white and black caimans.',
      ] },
      { titulo: 'Day 2 · Chuncho clay lick – Puerto Maldonado', pasos: [
        'Departure at dawn, when the clay lick is most active.',
        'Watching from 50 m away: red-and-green, scarlet and blue-and-yellow macaws, and several species of smaller parrots.',
        'From the boat, a chance to see capybaras, turtles and river birds.',
        'Return to Puerto Maldonado, arriving around 12:30 p.m.',
      ] },
    ],
    incluye: ['Arrival and departure transfer from Puerto Maldonado airport', 'Lodging', 'Meals, from lunch on the first day to breakfast on the last', 'Excursions with a bilingual guide (groups of up to 10 people per guide)', 'The activities in the itinerary', 'River transport'],
    noIncluye: ['Insurance', 'Domestic or international flights', 'Bus ticket to Puerto Maldonado', 'Extra nights due to flight cancellations', 'Alcoholic drinks', 'Bottled water and snacks', 'Personal expenses', 'Airport taxes', 'Excess baggage', 'Visas', 'Laundry'],
    llevar: ['Insect repellent', 'Sunscreen', 'Sunglasses', 'Hat', 'Small backpack', 'Flashlight with batteries', 'Camera, charger and batteries', 'Binoculars, if you have them', 'Poncho or rain jacket', 'Long, light-colored lightweight trousers', 'Long-sleeved, light-colored lightweight shirts', 'Short-sleeved T-shirts', 'Sandals for the lodge', 'Rubber boots or waterproof hiking shoes'],
  },
  'lago-sandoval-3-dias': {
    nombre: 'Lake Sandoval and Canopy · 3 Days / 2 Nights', duracion: '3 days / 2 nights', dificultad: 'Easy', altura: SELVA,
    resumen: 'Monkey Island, Lake Sandoval by rowing boat and sunrise on a hanging bridge 30 m above the forest.',
    lugares: ['Puerto Maldonado', 'Madre de Dios River', 'Monkey Island', 'Lake Sandoval', 'Canopy'],
    alojamiento: 'Lodge with a swimming pool, on the banks of the Madre de Dios River.',
    itinerario: [
      { titulo: 'Day 1 · Arrival in Puerto Maldonado', pasos: [
        'Pickup at the airport or the bus terminal.',
        'Transfer to the lodge by boat on the Madre de Dios River.',
        'Welcome, check-in and lunch.',
        'Visit to Monkey Island to see species such as the capuchin monkey.',
        'At night, an outing to see white caimans and capybaras.',
        'Dinner and rest.',
      ] },
      { titulo: 'Day 2 · Lake Sandoval', pasos: [
        'After breakfast, a 3 km walk through the rainforest to Lake Sandoval, one of the largest in the Tambopata National Reserve.',
        'Rowing boat ride to see birds, monkeys and other species, with a chance to see giant otters and large caimans.',
        'Traditional lunch at the lodge.',
        'At night, a walk to discover the nocturnal wildlife.',
        'Dinner and rest.',
      ] },
      { titulo: 'Day 3 · Canopy and return', pasos: [
        'At 5:30 a.m., a walk on the canopy, 30 meters up, with a view of the Madre de Dios River.',
        'From the platforms you can see birds such as toucans, macaws, tanagers and oropendolas.',
        'Breakfast and transfer to the airport or the bus terminal.',
      ] },
    ],
    incluye: ['Lodging', 'Guide', 'Transport airport – lodge – airport', 'Meals: breakfast, lunch and dinner', 'Swimming pool'],
    noIncluye: ['Bar consumption (alcoholic drinks)', 'Entrance to the Tambopata National Reserve (US$ 20)', 'Tips'],
    llevar: ['Insect repellent', 'Flashlight', 'Binoculars', 'Sunscreen', 'Walking shoes', 'Long-sleeved shirt and long trousers, preferably light-colored'],
  },
  'collpa-guacamayos-full-day': {
    nombre: 'Full Day Macaw Clay Lick', duracion: '1 day', dificultad: 'Easy', altura: SELVA,
    resumen: 'A day trip from Puerto Maldonado to the Chuncho clay lick, one of the largest macaw clay licks in the world.',
    lugares: ['Puerto Maldonado', 'Filadelfia community', 'Chuncho clay lick'],
    itinerario: [
      { titulo: 'Chuncho clay lick', pasos: [
        'Departure at 3:00 a.m. from Puerto Maldonado, with pickup anywhere in the city.',
        'About 2 hours by car to the Filadelfia community.',
        '30 minutes by boat to the Chuncho clay lick.',
        'Watching the macaws and other Amazon birds come down in the early morning to eat minerals.',
        'Return to the city by the same route.',
      ] },
    ],
  },
  'manu-4-dias': {
    nombre: 'Manu 4 Days / 3 Nights', duracion: '4 days / 3 nights', dificultad: 'Moderate', altura: 'from 3,600 m to lowland rainforest',
    resumen: 'From Cusco to the Amazon overland: the cloud forest of the cock-of-the-rock, the Alto Madre de Dios River, Lake Machuhuasi by raft and a parrot clay lick.',
    lugares: ['Paucartambo', 'Ninamarca', 'Cloud forest', 'Pilcopata', 'Alto Madre de Dios River', 'Lake Machuhuasi', 'Parrot clay lick', 'Maravilla Lake'],
    alojamiento: 'Night 1: lodge in Pilcopata, with showers and bathrooms. Nights 2 and 3: lodge in the rainforest, with a private bathroom and shower.',
    itinerario: [
      { titulo: 'Day 1 · Cusco – Paucartambo – cloud forest – Pilcopata', pasos: [
        'Pickup at your hotel in Cusco between 5:30 and 6:00 a.m.',
        'Drive up to the highlands of Paucartambo, with a visit to the chullpas (burial towers) of Ninamarca.',
        'Pass through Ajanaco, at 3,600 m, and descend through the cloud forest, full of orchids, heliconias and primitive ferns.',
        'Stop to try to see the mating display of the cock-of-the-rock. You may also see the Amazonian umbrellabird, trogons, quetzals or oropendolas; the spectacled bear lives in this area.',
        'In the afternoon, arrival in Pilcopata and night at the lodge.',
      ] },
      { titulo: 'Day 2 · Atalaya – Alto Madre de Dios River – Lake Machuhuasi', pasos: [
        'Breakfast and a walk through the rainforest: a coca plantation, birds, plants and monkeys.',
        'At the port of Atalaya, motorboat on the Alto Madre de Dios River, with a stop to walk a trail and bathe in hot springs.',
        'Arrival at the lodge and lunch.',
        'In the afternoon, a raft ride on Lake Machuhuasi: with luck, hoatzins, monkeys, dwarf caimans, capybaras and tapirs.',
        'After dinner, a night walk. Night at the lodge.',
      ] },
      { titulo: 'Day 3 · Parrot clay lick and Maravilla Lake', pasos: [
        'Very early, about 25 minutes by boat to the clay lick: a clay wall rich in minerals where many species of parrots gather.',
        'Breakfast.',
        'Walk through the forest to the private Maravilla Lake: from a platform you can see birds, monkeys or dwarf caimans.',
        'Lunch and rest at the lodge.',
        'In the afternoon and at night, walks to see insects, frogs and spiders. Night at the lodge.',
      ] },
      { titulo: 'Day 4 · Return to Cusco', pasos: [
        'Breakfast and boat back to Atalaya.',
        'Bus back to Cusco, through the cloud forest again.',
        'Arrival in Cusco around 7:00 p.m.',
      ] },
    ],
    notaItinerario: 'The program marks day 3 as optional: there is a 3-day version without the clay lick or Maravilla Lake. [Price of the 3-day version: to be confirmed]',
    incluye: ['Transport by bus and boat', 'Professional guide with telescope and binoculars', 'Support staff', 'Safety equipment', 'Professional cook', 'Breakfast, lunch, dinner and snacks', 'Nights in lodges with shared and private bathrooms', 'First-aid kit', 'Mineral water'],
    noIncluye: ['Breakfast and water on the first day', 'Alcoholic drinks, soft drinks and water on the first day'],
    llevar: ['Warm clothes: mornings by the river are cold', 'Rain gear', 'Water bottle', 'Binoculars', 'Sunscreen', 'Flashlight with spare batteries', 'Hat', 'Long-sleeved shirt and long trousers', 'Mosquito repellent (at least 30%)', 'Sandals, swimsuit and towel', 'Toiletries', 'Extra money'],
  },
  'puno-lago-titicaca': {
    nombre: 'Puno and Lake Titicaca', duracion: '[Days to be confirmed]', dificultad: 'Easy', altura: '3,800 m',
    resumen: 'Lake Titicaca from Puno: the floating islands of the Uros and the highest navigable lake in the world.',
    lugares: ['Puno', 'Lake Titicaca'],
  },
};

const LLEVAR = {
  'machu-picchu': ['Original passport or ID (required at the entrance)', 'Layered clothing', 'Sunscreen and a cap', 'Insect repellent', 'Water'],
  cusco: ['Warm layered clothing', 'Sunscreen', 'Water', 'Cash in soles'],
  caminatas: ['Hiking shoes or shoes with a good grip', 'Warm, waterproof jacket', 'Hat, gloves and sunglasses', 'Sunscreen', 'Water and something sweet', 'Cash in soles'],
  selva: ['Long-sleeved, light-colored clothing', 'Insect repellent', 'Flashlight', 'Rain poncho', 'Binoculars'],
  puno: ['Warm clothing', 'Sunscreen', 'Sunglasses', 'Hat'],
};

const PREGUNTAS = [
  ['Is the price per person?', 'Yes. All prices on this website are per person. For groups or a private tour, write to us and we will send you a quote.'],
  ['How can I pay?', 'With Yape, Plin, bank transfer, card, PayPal or cash. Before any payment, we confirm availability and the price with you on WhatsApp.'],
  ['What language does the guide speak?', 'Our guides speak Spanish and English. If you need another language, ask when you book and we will arrange it.'],
  ['Where and when will I be picked up?', 'All tours from Cusco include pickup at your hotel (confirmed by the agency on 25 Sep). The exact time depends on the tour: we confirm it on WhatsApp when you book. [Pickup times for each tour: to be confirmed]'],
  ['What shoes do I need?', 'Comfortable sneakers are enough for the cultural tours. For the mountains and treks, hiking shoes or shoes with a good grip, because there are stretches of dirt and stone. In the rainforest, shoes that can get wet.'],
  ['When is the best time to visit Cusco and Machu Picchu?', 'The dry season, from May to September, has clearer skies. From December to March it rains more, but there are fewer people.'],
  ['What is altitude sickness (soroche) and how can I avoid it?', 'It is the discomfort caused by the altitude: Cusco is at about 3,400 m. Rest on the first day, eat light, drink plenty of water and leave the mountains for later.'],
  ['How do I get to Tambopata?', 'By plane from Cusco or Lima to Puerto Maldonado, or by bus from Cusco on the Interoceanic Highway. From Puerto Maldonado, the lodges are reached by boat.'],
];

const POR_QUE = [
  ['A Cusco agency', 'We are in Cusco: we look after you before, during and after your trip. Our office is at Calle Plateros 328.'],
  ['Over 20 years in tourism', 'We have been organizing trips from Cusco for over 20 years.'],
  ['Guides in your language', 'Guides in Spanish and English, and in other languages if you ask when you book.'],
  ['Pay the way you prefer', 'Yape, Plin, bank transfer, card, PayPal or cash.'],
];

// Same order as DESTINOS in sitio.js.
const DESTINOS = [
  { nombre: 'Machu Picchu', texto: 'The Inca citadel, among mountains, above the Urubamba valley.' },
  { nombre: 'Sacred Valley', texto: 'The Urubamba River valley and its archaeological sites.' },
  { nombre: 'Rainbow Mountain', texto: 'Vinicunca, over 5,000 meters high.' },
  { nombre: 'Humantay Lake', texto: 'Turquoise water at the foot of the glacier.' },
  { nombre: 'Tambopata', texto: 'The macaw clay lick, Lake Sandoval and the rainforest.' },
  { nombre: 'Manu', texto: 'The cloud forest of the cock-of-the-rock.' },
];

module.exports = { MARCA, CONTACTO, PAGOS, GUIAS, CATEGORIAS, TOURS, LLEVAR, PREGUNTAS, POR_QUE, DESTINOS };
