// Armario: la combinación del día con las fotos ordenadas, el armario por secciones, los looks y las medidas.
import * as store from './store.js';
import { SLOTS, TIPOS, CAMPOS, CATEGORIAS_BASE } from './datos.js';
import { silueta, PERCHA } from './silueta.js';
import { infoPrendas, chequear } from './calce.js';
import { guiaCompleta, guiaMedir } from './guia.js';

const $ = (s, r = document) => r.querySelector(s);
const vista = $('#vista');
const tabbar = $('#tabbar');
const hoja = $('#hoja');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let datos = store.leer();
let tab = 'hoy';
let slotActivo = 'top';
let soloTengo = false;
let catHoy = null;          // categoría activa en el selector de "Hoy"
let filtroCat = null;       // categoría activa en el Armario
let ocasionActiva = null;   // ocasión activa en los Looks
let look = { top: null, bottom: null, shoes: null, acc: [] };
let opts = { mangaDoblada: false, metida: 'no', vueltas: null };

// ---------- Utilidades ----------
let tAviso = 0;
function avisar(texto) {
  const el = $('#aviso');
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(tAviso);
  tAviso = setTimeout(() => { el.hidden = true; }, 2600);
}
const mapa = () => new Map(datos.prendas.map(p => [p.id, p]));

function reducirFoto(archivo, max = 640) {
  return new Promise((ok, mal) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * k);
      cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      ok(cv.toDataURL('image/jpeg', 0.66));
    };
    img.onerror = () => { URL.revokeObjectURL(url); mal(new Error('No se pudo leer la imagen.')); };
    img.src = url;
  });
}

function colorPromedio(dataUrl) {
  return new Promise(ok => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 24;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, img.width * 0.3, img.height * 0.3, img.width * 0.4, img.height * 0.4, 0, 0, 24, 24);
      const d = ctx.getImageData(0, 0, 24, 24).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4;
      const h = v => Math.round(v / n).toString(16).padStart(2, '0');
      ok(`#${h(r)}${h(g)}${h(b)}`);
    };
    img.src = dataUrl;
  });
}

function descargar(nombre, contenido) {
  const url = URL.createObjectURL(new Blob([contenido], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = nombre; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- Imágenes de las prendas ----------
function imagen(p) {
  if (p.foto) return `<div class="img foto" style="background-image:url(${esc(p.foto)})" role="img" aria-label="${esc(p.nombre)}"></div>`;
  return `<div class="img sil">${silueta(p)}</div>`;
}

function etiqueta(p) {
  if (!p.tengo) return '<span class="etq compra">Por comprar</span>';
  if (p.estimado) return '<span class="etq est">Medidas estimadas</span>';
  return '';
}

// ---------- Tablero: las prendas ordenadas donde iría cada una ----------
function tablero(lk, mp, mini = false) {
  const it = id => (id ? mp.get(id) : null);
  const extras = (lk.acc || []).map(it).filter(Boolean);
  const pieza = (clase, p, slot, vacio) => {
    const cuerpo = p ? `${imagen(p)}${mini ? '' : `<span class="nom">${esc(p.nombre)}</span>`}` : `<div class="hueco"><b>+</b><small>${vacio}</small></div>`;
    return mini
      ? `<div class="pieza ${clase}${p ? '' : ' vacia'}">${cuerpo}</div>`
      : `<button class="pieza ${clase}${p ? '' : ' vacia'}" data-pick="${slot}" aria-label="${vacio}">${cuerpo}</button>`;
  };
  return `<div class="tablero${mini ? ' mini' : ''}">
    ${pieza('p-e1', extras[0], 'acc', 'Extra')}
    ${pieza('p-top', it(lk.top), 'top', 'Arriba')}
    ${pieza('p-e2', extras[1], 'acc', 'Extra')}
    ${pieza('p-bottom', it(lk.bottom), 'bottom', 'Abajo')}
    ${pieza('p-shoes', it(lk.shoes), 'shoes', 'Calzado')}
  </div>`;
}

function notasDeUso(lk, op, mp) {
  const top = lk.top ? mp.get(lk.top) : null;
  const bajo = lk.bottom ? mp.get(lk.bottom) : null;
  const n = [];
  if (op.mangaDoblada && top?.tipo === 'remera') n.push('Manga doblada');
  if (op.metida === 'media' && top && bajo) n.push('Remera a medias adentro');
  const v = op.vueltas ?? bajo?.vueltas ?? 0;
  if (v > 0 && bajo?.tipo === 'pantalon') n.push(`${v} ${v === 1 ? 'vuelta' : 'vueltas'} de ruedo`);
  return n;
}

// ---------- Hoy: la combinación ----------
// Categorías que hay en uso: primero las de partida (en su orden) y después las que creó la persona.
function categoriasUsadas() {
  const set = new Set();
  datos.prendas.forEach(p => (p.categorias || []).forEach(c => set.add(c)));
  return [...CATEGORIAS_BASE.filter(c => set.has(c)), ...[...set].filter(c => !CATEGORIAS_BASE.includes(c)).sort()];
}
const enCategoria = (p, cat) => !cat || (p.categorias || []).includes(cat);

function prendasDe(slot) {
  return datos.prendas.filter(p => p.slot === slot && (!soloTengo || p.tengo) && enCategoria(p, catHoy));
}

function tarjetaChica(p, activo) {
  return `<button class="chica${activo ? ' on' : ''}" data-elegir="${esc(p.id)}">${etiqueta(p)}${imagen(p)}<b>${esc(p.nombre)}</b></button>`;
}

function pintarHoy() {
  const mp = mapa();
  const info = infoPrendas(look, mp, datos.perfil, opts);
  const avisos = chequear(info, opts);
  const sel = slotActivo === 'acc' ? look.acc : [look[slotActivo]];
  const notas = notasDeUso(look, opts, mp);
  const faltan = [look.top, look.bottom, look.shoes, ...look.acc].filter(Boolean).map(id => mp.get(id)).filter(p => p && !p.tengo);

  $('#mesa').innerHTML = `${tablero(look, mp)}
    ${notas.length ? `<div class="notas-uso">${notas.map(n => `<span>${esc(n)}</span>`).join('')}</div>` : ''}
    ${faltan.length ? `<p class="faltan">Te falta comprar: ${faltan.map(p => esc(p.nombre)).join(', ')}.</p>` : ''}`;

  $('#sel').innerHTML = `<h3>Elegí de tu armario</h3>
    <div class="pestanas">${SLOTS.map(s => `<button class="chip${s.id === slotActivo ? ' on' : ''}" data-slot="${s.id}">${s.nombre}</button>`).join('')}
      <button class="chip suave${soloTengo ? ' on' : ''}" data-solotengo>Solo las que tengo</button></div>
    ${categoriasUsadas().length ? `<div class="pestanas filtros-cat"><button class="chip suave${!catHoy ? ' on' : ''}" data-cathoy="">Todas</button>
      ${categoriasUsadas().map(c => `<button class="chip suave${catHoy === c ? ' on' : ''}" data-cathoy="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    <div class="tira">
      <button class="chica nada${(slotActivo === 'acc' ? !look.acc.length : !look[slotActivo]) ? ' on' : ''}" data-quitar="${slotActivo}"><div class="img sil nada-x">✕</div><b>Nada</b></button>
      ${prendasDe(slotActivo).map(p => tarjetaChica(p, sel.includes(p.id))).join('')}
    </div>`;

  $('#opc').innerHTML = `<h3>Cómo la uso</h3>
    <div class="fila"><span>Manga doblada<small>Una vuelta, llega a mitad de bíceps</small></span>
      <div class="conmut"><button data-opt="manga:0" class="${!opts.mangaDoblada ? 'on' : ''}">No</button><button data-opt="manga:1" class="${opts.mangaDoblada ? 'on' : ''}">Sí</button></div></div>
    <div class="fila"><span>Remera adentro<small>Solo la parte de adelante</small></span>
      <div class="conmut"><button data-opt="metida:no" class="${opts.metida === 'no' ? 'on' : ''}">Afuera</button><button data-opt="metida:media" class="${opts.metida === 'media' ? 'on' : ''}">A medias</button></div></div>
    <div class="fila"><span>Vueltas de ruedo<small>Cada una acorta unos 4 cm</small></span>
      <div class="conmut"><button data-opt="vueltas:-1">−</button><button class="on" disabled>${opts.vueltas ?? 'Prenda'}</button><button data-opt="vueltas:1">+</button></div></div>`;

  $('#chk').innerHTML = `<h3>Chequeo de calce</h3>
    ${avisos.length ? `<ul class="chequeo">${avisos.map(a => `<li class="${a.nivel}"><span>${a.nivel === 'ok' ? '✓' : '!'}</span><div>${esc(a.texto)}</div></li>`).join('')}</ul>`
    : '<p class="nota">Elegí una remera o un pantalón para ver cómo te queda.</p>'}`;
}

function renderHoy() {
  if (!$('.hoy')) {
    vista.innerHTML = `<header class="cab"><div><h1>Mi combinación</h1><p>Ordená las prendas como las vas a usar.</p></div></header>
      <section class="hoy">
        <div class="col-mesa"><div class="mesa" id="mesa"></div></div>
        <div class="col-panel">
          <div class="tarjeta" id="sel"></div>
          <div class="tarjeta" id="opc"></div>
          <div class="tarjeta" id="chk"></div>
          <div class="acciones">
            <button class="btn" data-accion="guardar-outfit">Guardar este look</button>
            <button class="btn sec" data-accion="sacar-todo">Vaciar</button>
          </div>
        </div>
      </section>`;
  }
  pintarHoy();
}

function aplicarLook(o) {
  look = { top: o.top || null, bottom: o.bottom || null, shoes: o.shoes || null, acc: [...(o.acc || [])] };
  opts = { mangaDoblada: !!o.opts?.mangaDoblada, metida: o.opts?.metida || 'no', vueltas: o.opts?.vueltas ?? null };
}

function elegir(id) {
  const p = mapa().get(id);
  if (!p) return;
  if (p.slot === 'acc') {
    const i = look.acc.indexOf(id);
    if (i >= 0) look.acc.splice(i, 1);
    else {
      look.acc = look.acc.filter(x => mapa().get(x)?.tipo !== p.tipo);
      look.acc.push(id);
    }
  } else {
    look[p.slot] = look[p.slot] === id ? null : id;
  }
  pintarHoy();
}

// ---------- Armario: percha, estantes, zapatero y cajón ----------
function tarjetaArmario(p, colgada = false) {
  return `<button class="prenda${colgada ? ' colgada' : ''}" data-editar="${esc(p.id)}">
    ${colgada ? PERCHA : ''}${imagen(p)}<b>${esc(p.nombre)}</b>${(p.categorias || []).length ? `<small>${esc(p.categorias.join(' · '))}</small>` : ''}${p.estimado ? '<small>medidas estimadas</small>' : ''}</button>`;
}

function renderArmario() {
  if (filtroCat && !categoriasUsadas().includes(filtroCat)) filtroCat = null;
  const tengo = datos.prendas.filter(p => p.tengo && enCategoria(p, filtroCat));
  const comprar = datos.prendas.filter(p => !p.tengo && enCategoria(p, filtroCat));
  const cats = categoriasUsadas();
  const de = (...tipos) => tengo.filter(p => tipos.includes(p.tipo));
  const seccion = (titulo, cuerpo, vacio) => (!cuerpo && filtroCat ? '' : `<section class="seccion"><h2 class="rotulo">${titulo}</h2>${cuerpo || `<p class="nota vacio-s">${vacio}</p>`}</section>`);
  const colgado = de('remera', 'musculosa');
  const abajo = de('pantalon', 'short');
  const zapas = de('zapatilla');
  const extras = de('cadena', 'reloj');
  vista.innerHTML = `<header class="cab"><div><h1>Mi armario</h1><p>${tengo.length} prendas guardadas${filtroCat ? ` en “${esc(filtroCat)}”` : ''}${comprar.length ? ` · ${comprar.length} en la lista de compras` : ''}</p></div>
      <button class="btn" data-accion="nueva-prenda">+ Prenda</button></header>
    ${cats.length ? `<div class="pestanas filtros"><button class="chip${!filtroCat ? ' on' : ''}" data-filtrocat="">Todas</button>
      ${cats.map(c => `<button class="chip${filtroCat === c ? ' on' : ''}" data-filtrocat="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    <div class="armario">
      ${seccion('Colgado', colgado.length ? `<div class="riel">${colgado.map(p => tarjetaArmario(p, true)).join('')}</div>` : '', 'Todavía no hay remeras ni musculosas.')}
      ${seccion('Pantalones y shorts', abajo.length ? `<div class="estante">${abajo.map(p => tarjetaArmario(p)).join('')}</div>` : '', 'Todavía no hay pantalones.')}
      ${seccion('Zapatero', zapas.length ? `<div class="estante zapatero">${zapas.map(p => tarjetaArmario(p)).join('')}</div>` : '', 'Todavía no hay calzado.')}
      ${seccion('Cajón de accesorios', extras.length ? `<div class="cajon">${extras.map(p => tarjetaArmario(p)).join('')}</div>` : '', 'Cadenas, relojes y demás.')}
    </div>
    ${comprar.length ? `<section class="compras"><h2>Lista de compras</h2><p class="nota">Lo que te falta para armar los looks sugeridos.</p>
      <div class="notas-compra">${comprar.map(p => `<button class="papelito" data-editar="${esc(p.id)}">${imagen(p)}<b>${esc(p.nombre)}</b></button>`).join('')}</div></section>` : ''}`;
}

// ---------- Editor de prenda ----------
function camposHTML(tipo, p) {
  return (CAMPOS[tipo] || []).map(c => {
    const v = p[c.k] ?? c.def;
    if (c.tipo === 'opcion') {
      return `<div class="campo"><label>${esc(c.t)}</label><select name="${c.k}">${c.opciones.map(([val, n]) => `<option value="${val}"${v === val ? ' selected' : ''}>${n}</option>`).join('')}</select></div>`;
    }
    if (c.tipo === 'casilla') return `<label class="check"><input type="checkbox" name="${c.k}"${v ? ' checked' : ''}> ${esc(c.t)}</label>`;
    return `<div class="campo"><label>${esc(c.t)}</label><input type="number" inputmode="decimal" step="0.5" min="${c.min}" max="${c.max}" name="${c.k}" value="${v}"></div>`;
  }).join('');
}

function abrirEditor(id) {
  const existente = id ? datos.prendas.find(p => p.id === id) : null;
  let p = existente ? { ...existente } : { id: store.nuevoId(), nombre: '', tipo: 'remera', tengo: true, estimado: false, color: '#444444', lavado: 0, foto: null, nota: '' };
  const conColor = t => t !== 'cadena';
  let cats = [...(p.categorias || [])];
  const todasCats = () => [...new Set([...CATEGORIAS_BASE, ...categoriasUsadas(), ...cats])];
  const pintar = () => {
    hoja.innerHTML = `
      <form method="dialog" id="formPrenda">
        <div class="encab"><h2>${existente ? 'Editar prenda' : 'Nueva prenda'}</h2>
          <button type="button" class="cerrar-x" id="cerrarX" aria-label="Cerrar">✕</button></div>
        <div class="campo"><label>Nombre</label><input type="text" name="nombre" value="${esc(p.nombre)}" placeholder="Ej: Remera azul lavada" required></div>
        <div class="campo"><label>Tipo</label><select name="tipo">${Object.entries(TIPOS).map(([k, v]) => `<option value="${k}"${p.tipo === k ? ' selected' : ''}>${v.nombre}</option>`).join('')}</select></div>
        <div class="campo"><label>Foto (de frente, plana sobre la cama o el piso, con luz pareja)</label>
          <div class="foto-previa" id="prev" style="${p.foto ? `background-image:url(${esc(p.foto)})` : ''}">${p.foto ? '' : 'Sin foto'}</div>
          <input type="file" accept="image/*" id="archivoFoto"></div>
        ${conColor(p.tipo) ? `<div class="dos">
          <div class="campo"><label>Color principal</label><input type="color" name="color" value="${esc(p.color || '#444444')}"></div>
          ${p.tipo === 'zapatilla' ? `<div class="campo"><label>Color de la suela</label><input type="color" name="color2" value="${esc(p.color2 || '#eeeeee')}"></div>` : '<div class="campo"><label>&nbsp;</label><button type="button" class="btn sec chico" id="detectar">Tomar color de la foto</button></div>'}
        </div>` : ''}
        ${camposHTML(p.tipo, p)}
        ${guiaMedir(p.tipo) ? `<details class="guia guia-mini"><summary>¿Cómo se mide?</summary>${guiaMedir(p.tipo)}</details>` : ''}
        <div class="campo"><label>Categorías (para qué la usás)</label>
          <div class="cats-editor">${todasCats().map(c => `<button type="button" class="chip${cats.includes(c) ? ' on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
          <div class="agregar-cat"><input type="text" id="nuevaCat" maxlength="24" placeholder="Otra categoría (ej: Running)"><button type="button" class="btn sec chico" id="addCat">Agregar</button></div></div>
        <label class="check"><input type="checkbox" name="tengo"${p.tengo ? ' checked' : ''}> La tengo (si no, queda en la lista de compras)</label>
        <label class="check"><input type="checkbox" name="estimado"${p.estimado ? ' checked' : ''}> Las medidas son estimadas</label>
        <div class="campo"><label>Nota</label><textarea name="nota" rows="2">${esc(p.nota || '')}</textarea></div>
        <div class="acciones">
          <button type="submit" class="btn" value="guardar">Guardar</button>
          <button type="button" class="btn sec" id="probar">Usar hoy</button>
          ${existente ? '<button type="button" class="btn peligro" id="borrar">Borrar</button>' : ''}
          <button type="button" class="btn sec" id="cerrar">Cerrar</button>
        </div>
      </form>`;
    const form = $('#formPrenda');
    const leer = () => {
      const fd = new FormData(form);
      const nuevo = { ...p, nombre: fd.get('nombre') || '', tipo: fd.get('tipo') };
      nuevo.slot = TIPOS[nuevo.tipo].slot;
      nuevo.tengo = form.elements.tengo.checked;
      nuevo.estimado = form.elements.estimado.checked;
      nuevo.nota = fd.get('nota') || '';
      nuevo.categorias = [...cats];
      if (form.elements.color) nuevo.color = fd.get('color');
      if (form.elements.color2) nuevo.color2 = fd.get('color2');
      for (const c of CAMPOS[nuevo.tipo] || []) {
        // Al cambiar de tipo, los campos del tipo nuevo todavía no están en el formulario: se usa lo que había o el valor por defecto.
        if (!form.elements[c.k]) { nuevo[c.k] = p[c.k] ?? c.def; continue; }
        if (c.tipo === 'opcion') nuevo[c.k] = fd.get(c.k);
        else if (c.tipo === 'casilla') nuevo[c.k] = form.elements[c.k].checked;
        else { const n = Number(fd.get(c.k)); nuevo[c.k] = Number.isFinite(n) ? n : c.def; }
      }
      return nuevo;
    };
    form.elements.tipo.addEventListener('change', () => {
      p = leer();
      // Cada tipo tiene sus propias medidas: al cambiar, se parte de los valores típicos del tipo nuevo.
      for (const c of CAMPOS[p.tipo] || []) p[c.k] = c.def;
      pintar();
    });
    form.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
      const c = b.dataset.cat;
      cats = cats.includes(c) ? cats.filter(x => x !== c) : [...cats, c].slice(0, 8);
      b.classList.toggle('on', cats.includes(c));
    }));
    const agregarCat = () => {
      const t = $('#nuevaCat').value.trim().slice(0, 24);
      if (!t) return;
      if (!cats.includes(t)) cats = [...cats, t].slice(0, 8);
      p = leer(); pintar();
    };
    $('#addCat').addEventListener('click', agregarCat);
    $('#nuevaCat').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); agregarCat(); } });
    $('#archivoFoto').addEventListener('change', async e => {
      const f = e.target.files[0];
      if (!f) return;
      try { p = leer(); p.foto = await reducirFoto(f); pintar(); avisar('Foto cargada. Podés tomar el color desde ella.'); } catch (err) { avisar(err.message); }
    });
    $('#detectar')?.addEventListener('click', async () => {
      if (!p.foto) { avisar('Primero cargá una foto.'); return; }
      p = leer(); p.color = await colorPromedio(p.foto); pintar();
    });
    $('#probar').addEventListener('click', () => {
      const n = leer();
      store.guardarPrenda(n);
      if (n.slot === 'acc') look.acc = [...look.acc.filter(x => datos.prendas.find(q => q.id === x)?.tipo !== n.tipo), n.id];
      else look[n.slot] = n.id;
      hoja.close();
      location.hash = '#hoy';
    });
    $('#borrar')?.addEventListener('click', () => {
      if (!confirm(`¿Borrar “${p.nombre}” del armario?`)) return;
      store.borrarPrenda(p.id);
      for (const k of ['top', 'bottom', 'shoes']) if (look[k] === p.id) look[k] = null;
      look.acc = look.acc.filter(x => x !== p.id);
      hoja.close();
    });
    $('#cerrar').addEventListener('click', () => hoja.close());
    $('#cerrarX').addEventListener('click', () => hoja.close());
    form.addEventListener('submit', e => {
      e.preventDefault();
      const n = leer();
      if (!n.nombre.trim()) { avisar('Poné un nombre.'); return; }
      store.guardarPrenda(n);
      hoja.close();
      avisar('Prenda guardada.');
    });
  };
  pintar();
  hoja.showModal();
}

// ---------- Looks ----------
function renderLooks() {
  const mp = mapa();
  const ocasiones = [...new Set(datos.outfits.map(o => o.ocasion).filter(Boolean))];
  if (ocasionActiva && !ocasiones.includes(ocasionActiva)) ocasionActiva = null;
  const ordenados = [...datos.outfits].filter(o => !ocasionActiva || o.ocasion === ocasionActiva)
    .sort((a, b) => (a.sugerido === b.sugerido ? 0 : a.sugerido ? 1 : -1));
  vista.innerHTML = `<header class="cab"><div><h1>Mis looks</h1><p>Los tuyos y los que armamos juntos. Tocá uno para usarlo hoy.</p></div></header>
    ${ocasiones.length > 1 ? `<div class="pestanas filtros"><button class="chip${!ocasionActiva ? ' on' : ''}" data-ocasion="">Todos</button>
      ${ocasiones.map(c => `<button class="chip${ocasionActiva === c ? ' on' : ''}" data-ocasion="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    <div class="looks">${ordenados.map(o => {
      const ids = [o.top, o.bottom, o.shoes, ...(o.acc || [])].filter(Boolean);
      const faltan = ids.filter(id => mp.get(id) && !mp.get(id).tengo).length;
      const notas = notasDeUso(o, o.opts || {}, mp);
      return `<article class="look">
        <button class="look-tablero" data-probar-outfit="${esc(o.id)}" aria-label="Usar ${esc(o.nombre)}">${tablero(o, mp, true)}</button>
        <div class="look-datos">
          <h2>${esc(o.nombre)}</h2>
          <p class="nota">${esc(o.ocasion || '')}${o.sugerido ? ' · sugerido' : ''}</p>
          <p><span class="estado ${faltan ? 'falta' : 'ok'}">${faltan ? `Te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan}` : 'Lo podés armar hoy'}</span></p>
          ${notas.length ? `<div class="notas-uso">${notas.map(n => `<span>${esc(n)}</span>`).join('')}</div>` : ''}
          ${o.nota ? `<p class="detalle">${esc(o.nota)}</p>` : ''}
          <div class="acciones"><button class="btn chico" data-probar-outfit="${esc(o.id)}">Usar hoy</button>
            <button class="btn sec chico" data-dup-outfit="${esc(o.id)}">Duplicar</button>
            <button class="btn peligro chico" data-borrar-outfit="${esc(o.id)}">Borrar</button></div>
        </div>
      </article>`;
    }).join('') || '<p class="nota">Todavía no hay looks. Armá uno en “Hoy” y tocá “Guardar este look”.</p>'}</div>`;
}

function guardarOutfitActual() {
  const nombre = prompt('Nombre del look', 'Mi look');
  if (!nombre) return;
  const ocasion = (prompt('¿Para qué ocasión? (Gym, Diario, Salir…)', catHoy || 'Diario') || 'Diario').trim().slice(0, 40);
  store.guardarOutfit({
    id: store.nuevoId(), nombre, ocasion, sugerido: false, ...look, acc: [...look.acc],
    opts: { mangaDoblada: opts.mangaDoblada, metida: opts.metida, vueltas: opts.vueltas }, nota: '',
  });
  avisar('Look guardado.');
}

// ---------- Yo ----------
const MEDIDAS = [
  ['altura', 'Altura (cm)'], ['peso', 'Peso (kg)'], ['pecho', 'Pecho (contorno)'], ['cintura', 'Cintura (ombligo)'],
  ['cadera', 'Cadera (contorno)'], ['hombros', 'Hombros (punta a punta)'], ['brazo', 'Largo de brazo (hombro a muñeca)'],
  ['biceps', 'Bíceps (contorno)'], ['muslo', 'Muslo (contorno)'], ['entrepierna', 'Entrepierna (ingle a tobillo)'],
  ['cuello', 'Cuello (contorno)'], ['pie', 'Pie (largo)'],
];

function renderYo() {
  const p = datos.perfil;
  const u = datos.usuario;
  vista.innerHTML = `
    <header class="cab"><div><h1>Mis medidas</h1><p>Las de tu cuerpo y cómo medir tus prendas. Todo en centímetros.</p></div></header>
    <form id="formPerfil" class="tarjeta" style="display:grid;gap:12px">
      <div class="dos">${MEDIDAS.map(([k, n]) => `<div class="campo"><label>${n}</label><input type="number" inputmode="decimal" step="0.5" name="${k}" value="${p[k] ?? ''}"></div>`).join('')}</div>
      <button class="btn" type="submit">Guardar medidas</button>
    </form>
    ${guiaCompleta()}
    <div class="tarjeta" style="margin-top:12px;display:grid;gap:10px">
      <h3>Datos y sincronización</h3>
      <p class="nota">${store.modoNube ? `Sincronizado en la nube${u?.email ? ` como ${esc(u.email)}` : ''}. Los mismos datos en la compu y el celu, solo con tu cuenta.` : store.modoDemo ? 'Modo demostración: datos de ejemplo guardados solo en este navegador.' : 'Modo local: los datos están solo en este dispositivo. Para usarlos en la compu y el celu hay que activar la nube (ver README).'}</p>
      <div class="acciones">
        <button class="btn sec chico" data-accion="exportar">Exportar respaldo</button>
        <label class="btn sec chico" style="cursor:pointer">Importar respaldo<input type="file" accept="application/json" id="archivoImportar" hidden></label>
        ${store.modoNube ? '<button class="btn sec chico" data-accion="salir">Cerrar sesión</button>' : '<button class="btn peligro chico" data-accion="reiniciar">Volver a los datos iniciales</button>'}
      </div>
    </div>`;
  $('#formPerfil').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target.elements;
    const nuevo = { ...datos.perfil };
    for (const [k] of MEDIDAS) { const n = Number(f[k].value); if (Number.isFinite(n) && n > 0) nuevo[k] = n; }
    store.guardarPerfil(nuevo);
    avisar('Medidas guardadas.');
  });
  $('#archivoImportar').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const r = store.importar(JSON.parse(await f.text()));
      avisar(`Importado: ${r.prendas} prendas y ${r.outfits} looks.`);
    } catch (err) { avisar(err.message); }
  });
}

// ---------- Login (modo nube) ----------
function renderLogin(error = '') {
  tabbar.hidden = true;
  vista.innerHTML = `
    <form class="centro" id="formLogin">
      <h1>Mi armario</h1>
      <p class="nota">Entrá con tu cuenta para ver tus prendas en cualquier dispositivo.</p>
      <div class="campo"><label>Email</label><input type="email" name="email" autocomplete="username" required></div>
      <div class="campo"><label>Contraseña</label><input type="password" name="clave" autocomplete="current-password" minlength="6" required></div>
      ${error ? `<p class="nota" style="color:var(--alerta)">${esc(error)}</p>` : ''}
      <button class="btn" type="submit" value="entrar">Entrar</button>
      <button class="btn sec chico" type="button" data-accion="recuperar">Olvidé mi contraseña</button>
    </form>`;
  $('#formLogin').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target.elements;
    try { await store.entrar(f.email.value, f.clave.value); } catch { renderLogin('No se pudo entrar. Revisá el email y la contraseña.'); }
  });
}

// ---------- Navegación ----------
const TABS = ['hoy', 'armario', 'looks', 'yo'];
const VIEJOS = { probador: 'hoy', outfits: 'looks' };

function leerHash() {
  const h = location.hash.replace('#', '');
  tab = TABS.includes(h) ? h : (VIEJOS[h] || 'hoy');
}

function render() {
  datos = store.leer();
  if (!datos.listo) return;
  if (datos.error) { vista.innerHTML = `<p class="centro">${esc(datos.error)}</p>`; return; }
  if (store.modoNube && !datos.usuario) { renderLogin(); return; }
  tabbar.hidden = false;
  tabbar.querySelectorAll('a').forEach(a => a.classList.toggle('activa', a.dataset.tab === tab));
  document.body.dataset.tab = tab;
  if (tab === 'hoy') renderHoy();
  else if (tab === 'armario') renderArmario();
  else if (tab === 'looks') renderLooks();
  else renderYo();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-slot],[data-elegir],[data-quitar],[data-opt],[data-accion],[data-editar],[data-solotengo],[data-probar-outfit],[data-dup-outfit],[data-borrar-outfit],[data-pick],[data-cathoy],[data-filtrocat],[data-ocasion]');
  if (!t) return;
  const d = t.dataset;
  if (d.slot) { slotActivo = d.slot; pintarHoy(); }
  else if (d.pick) { slotActivo = d.pick; pintarHoy(); $('#sel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  else if (d.elegir) elegir(d.elegir);
  else if (d.quitar) { if (d.quitar === 'acc') look.acc = []; else look[d.quitar] = null; pintarHoy(); }
  else if (d.solotengo !== undefined) { soloTengo = !soloTengo; pintarHoy(); }
  else if (d.cathoy !== undefined) { catHoy = d.cathoy || null; pintarHoy(); }
  else if (d.filtrocat !== undefined) { filtroCat = d.filtrocat || null; renderArmario(); }
  else if (d.ocasion !== undefined) { ocasionActiva = d.ocasion || null; renderLooks(); }
  else if (d.opt) {
    const [k, v] = d.opt.split(':');
    if (k === 'manga') opts.mangaDoblada = v === '1';
    if (k === 'metida') opts.metida = v;
    if (k === 'vueltas') opts.vueltas = Math.max(0, Math.min(4, (opts.vueltas ?? 0) + Number(v)));
    pintarHoy();
  } else if (d.editar) abrirEditor(d.editar);
  else if (d.probarOutfit) {
    const o = datos.outfits.find(x => x.id === d.probarOutfit);
    if (o) { aplicarLook(o); location.hash = '#hoy'; if (tab === 'hoy') renderHoy(); }
  } else if (d.dupOutfit) {
    const o = datos.outfits.find(x => x.id === d.dupOutfit);
    if (o) { store.guardarOutfit({ ...o, id: store.nuevoId(), nombre: `${o.nombre} (copia)`, sugerido: false }); avisar('Look duplicado.'); }
  } else if (d.borrarOutfit) {
    const o = datos.outfits.find(x => x.id === d.borrarOutfit);
    if (o && confirm(`¿Borrar el look “${o.nombre}”?`)) store.borrarOutfit(o.id);
  } else if (d.accion) {
    const a = d.accion;
    if (a === 'nueva-prenda') abrirEditor(null);
    if (a === 'guardar-outfit') guardarOutfitActual();
    if (a === 'sacar-todo') { look = { top: null, bottom: null, shoes: null, acc: [] }; pintarHoy(); }
    if (a === 'exportar') descargar(`armario-respaldo-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(store.exportar(), null, 1));
    if (a === 'salir') store.salir();
    if (a === 'reiniciar' && confirm('Se borran los cambios locales y vuelven los datos iniciales. ¿Seguro?')) store.reiniciarLocal();
    if (a === 'recuperar') {
      const email = $('#formLogin').elements.email.value;
      if (email) store.recuperar(email).then(() => avisar('Te mandamos un email para cambiar la contraseña.')).catch(() => avisar('No se pudo enviar el email.'));
      else avisar('Escribí tu email primero.');
    }
  }
});

window.addEventListener('hashchange', () => { leerHash(); render(); });
hoja.addEventListener('close', () => { datos = store.leer(); render(); });
// Tocar fuera de la hoja (sobre el fondo oscuro) también la cierra.
hoja.addEventListener('click', e => { if (e.target === hoja) hoja.close(); });

store.alError(err => avisar(`Error: ${err.message || err}`));
let primera = true;
store.suscribir(() => {
  datos = store.leer();
  if (!datos.listo) return;
  if (primera) {
    primera = false;
    leerHash();
    const o1 = datos.outfits.find(o => o.id === 'o1') || datos.outfits[0];
    if (o1) aplicarLook(o1);
    render();
    return;
  }
  if (!hoja.open) render();
});

store.iniciar();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
