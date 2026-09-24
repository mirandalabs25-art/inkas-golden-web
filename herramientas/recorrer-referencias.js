// Recorre webs de referencia en un Chrome sin pantalla y saca, de cada una: captura completa
// (reducida), captura de la primera pantalla, menú con submenús, títulos en orden, pie,
// si tiene WhatsApp/TripAdvisor, precios e idiomas. Sin dependencias (Node 22+).
// Uso: SITIOS=lista.json SALIDA=carpeta node herramientas/recorrer-referencias.js
//   lista.json = [["clave", "https://..."], ...]
// Se usó el 2026-09-23 con las 10 primeras de «Machu Picchu» y de «Tambopata».
// Receta: Obsidian/resources/webs-desde-referencia-visual.md
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const SALIDA = path.resolve(process.env.SALIDA || path.join(__dirname, '..', 'produccion', 'referencias'));
fs.mkdirSync(SALIDA, { recursive: true });
const PUERTO = 9344;
const SITIOS = JSON.parse(fs.readFileSync(path.resolve(process.env.SITIOS || path.join(SALIDA, 'sitios.json')), 'utf8'));
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'ref-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=' + PUERTO, '--user-data-dir=' + perfil,
  '--no-first-run', '--lang=es-PE', '--hide-scrollbars', 'about:blank'
], { stdio: 'ignore' });

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pend = {};
function cmd(method, params = {}, tope = 30000) {
  return new Promise((res, rej) => {
    const i = ++id; pend[i] = { res, rej };
    ws.send(JSON.stringify({ id: i, method, params }));
    setTimeout(() => { if (pend[i]) { delete pend[i]; rej(new Error('tiempo: ' + method)); } }, tope);
  });
}
async function ev(expr, tope) {
  const r = await cmd('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, tope);
  return r.result && r.result.value;
}

const EXTRAER = `(function(){
  function txt(e){return ((e&&(e.innerText||e.textContent))||'').replace(/\\s+/g,' ').trim();}
  var cands=[].slice.call(document.querySelectorAll('header ul, nav ul, ul[class*=menu], ul[id*=menu], ul[class*=nav]'))
    .filter(function(u){return !u.parentElement.closest('li') && !u.closest('footer');});
  var best=null,bs=0;
  cands.forEach(function(u){var r=u.getBoundingClientRect();var n=u.children.length;var s=n*(r.top<320?4:1)*(txt(u).length>8?1:0);if(s>bs){bs=s;best=u;}});
  var menu=[];
  if(best){[].slice.call(best.children).forEach(function(li){
    var a=li.querySelector('a,button,span');
    var subs=[].slice.call(li.querySelectorAll('ul a, .sub-menu a, .dropdown-menu a, [class*=mega] a')).map(txt).filter(Boolean);
    subs=subs.filter(function(v,i,arr){return arr.indexOf(v)===i;});
    menu.push({t:txt(a||li).slice(0,70),n:subs.length,sub:subs.slice(0,45)});
  });}
  var hs=[].slice.call(document.querySelectorAll('h1,h2,h3')).filter(function(h){return txt(h)&&!h.closest('footer');}).map(function(h){return h.tagName+' '+txt(h).slice(0,100);}).slice(0,70);
  var body=document.body?document.body.innerText:'';
  var html=document.documentElement.innerHTML;
  var foot=document.querySelector('footer');
  return JSON.stringify({
    titulo:document.title,
    desc:(document.querySelector('meta[name=description]')||{}).content||'',
    menu:menu,
    titulos:hs,
    whatsapp:/wa\\.me|api\\.whatsapp|whatsapp/i.test(html),
    tripadvisor:/tripadvisor/i.test(html),
    precios:(body.match(/(US\\$|USD|\\$) ?\\d{2,5}/g)||[]).slice(0,8),
    idiomas:[].slice.call(document.querySelectorAll('[hreflang]')).map(function(a){return a.getAttribute('hreflang');}).filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,10),
    pie:foot?[].slice.call(foot.querySelectorAll('h2,h3,h4,h5,h6,.widget-title')).map(txt).filter(Boolean).slice(0,25):[],
    pieTexto:foot?txt(foot).slice(0,700):'',
    formularios:document.forms.length,
    alto:document.documentElement.scrollHeight
  });
})()`;

(async () => {
  let lista;
  for (let k = 0; k < 40; k++) {
    try { lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json(); break; } catch (e) { await espera(250); }
  }
  const pag = lista.find((t) => t.type === 'page');
  ws = new WebSocket(pag.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend[d.id]) { d.error ? pend[d.id].rej(new Error(d.error.message)) : pend[d.id].res(d.result); delete pend[d.id]; }
  });
  await cmd('Page.enable'); await cmd('Runtime.enable');
  await cmd('Network.enable');
  await cmd('Network.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', acceptLanguage: 'es-PE,es;q=0.9,en;q=0.8' });
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  const resultados = {};
  for (const [clave, url] of SITIOS) {
    const t0 = Date.now();
    try {
      await cmd('Page.navigate', { url }, 45000);
      for (let k = 0; k < 60; k++) { await espera(250); try { if (await ev('document.readyState', 5000) === 'complete') break; } catch (e) {} }
      await espera(1500);
      // Bajar de a poco para que carguen las imágenes diferidas, y volver arriba.
      await ev(`(async function(){var h=document.documentElement.scrollHeight;for(var y=0;y<Math.min(h,16000);y+=700){window.scrollTo(0,y);await new Promise(function(r){setTimeout(r,120);});}window.scrollTo(0,0);return 1;})()`, 60000);
      await espera(1200);
      const datos = JSON.parse(await ev(EXTRAER, 15000));
      const alto = Math.min(datos.alto || 900, 12000);
      const shot = await cmd('Page.captureScreenshot', {
        format: 'jpeg', quality: 55, captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: 1440, height: alto, scale: 0.28 }
      }, 60000);
      fs.writeFileSync(path.join(SALIDA, 'cap-' + clave + '.jpg'), Buffer.from(shot.data, 'base64'));
      // Primera pantalla, a tamaño real: el hero y la cabecera.
      const hero = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 60, clip: { x: 0, y: 0, width: 1440, height: 900, scale: 0.6 } }, 30000);
      fs.writeFileSync(path.join(SALIDA, 'hero-' + clave + '.jpg'), Buffer.from(hero.data, 'base64'));
      datos.url = url; datos.segundos = Math.round((Date.now() - t0) / 1000);
      resultados[clave] = datos;
      console.log('ok ', clave.padEnd(26), datos.alto, 'px ·', datos.menu.length, 'ítems de menú ·', datos.segundos, 's');
    } catch (e) {
      resultados[clave] = { url, error: String(e.message) };
      console.log('ERR', clave, e.message);
    }
    fs.writeFileSync(path.join(SALIDA, 'estructura.json'), JSON.stringify(resultados, null, 1));
  }
  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
