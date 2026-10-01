/* Arma el paquete para republicar la web en el artifact de claude.ai.
   Uso: node herramientas/preparar-artifact.js <carpeta-de-salida>
   Escribe <salida>/inkas-golden.html (la portada, sin doctype/head/body: el
   artifact pone su propio envoltorio) y <salida>/inkas-files.json (el mapa de
   las demás páginas y recursos). Artifact: https://claude.ai/artifact/BkwPJKkydJUAwR8Y62rxMZ */
const fs = require('fs');
const path = require('path');
const Y = path.resolve(__dirname, '..');
const SALIDA = path.resolve(process.argv[2] || path.join(Y, 'produccion', 'artifact'));
fs.mkdirSync(SALIDA, { recursive: true });

const index = fs.readFileSync(path.join(Y, 'index.html'), 'utf8');
const head = index.match(/<head>([\s\S]*?)<\/head>/)[1];
const enlaces = head.match(/<link[^>]*>/g).join('\n');
const cuerpo = index.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
const clase = index.match(/<body class="([^"]*)"/)[1];
// La clase del body la pone un script mínimo, porque el envoltorio trae su propio <body>.
fs.writeFileSync(path.join(SALIDA, 'inkas-golden.html'),
  '<title>Inkas Golden</title>\n' + enlaces + '\n<script>document.body.className=' + JSON.stringify(clase) + ';</script>\n' + cuerpo.trim() + '\n');

const generadas = JSON.parse(fs.readFileSync(path.join(Y, 'contenido', '.generadas.json'), 'utf8')).filter((f) => f !== 'index.html');
const files = {};
const sumar = (f) => { files[f] = path.join(Y, f).split(path.sep).join('/'); };
generadas.forEach(sumar);
['assets/css/style.css', 'assets/js/main.js', 'assets/js/datos.js'].forEach(sumar);
fs.readdirSync(path.join(Y, 'assets/img')).filter((m) => /\.(webp|svg)$/.test(m)).forEach((m) => sumar('assets/img/' + m));
fs.readdirSync(path.join(Y, 'assets/img/mini')).forEach((m) => sumar('assets/img/mini/' + m));
fs.writeFileSync(path.join(SALIDA, 'inkas-files.json'), JSON.stringify(files, null, 1));
console.log(Object.keys(files).length, 'archivos;', fs.statSync(path.join(SALIDA, 'inkas-golden.html')).size, 'bytes la portada ->', SALIDA);
