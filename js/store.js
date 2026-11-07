// Capa de datos: Firebase (nube, sincroniza PC y celu) si hay configuración, o localStorage si no.
import { firebaseConfig } from '../config.js';
import { datosDemo, PERFIL_BASE } from './datos.js';
import { sanearPrenda, sanearPrendas, sanearOutfit, sanearOutfits, sanearPerfil } from './sanear.js';

const SDK = 'https://www.gstatic.com/firebasejs/11.0.2';
const CLAVE_LOCAL = 'armario:datos';
const CLAVE_DEMO = 'armario:demo';

// ?demo abre la app con datos de ejemplo, guardados aparte y sin tocar la nube.
export const modoDemo = new URLSearchParams(location.search).has('demo');
export const modoNube = !modoDemo && Boolean(firebaseConfig?.apiKey);

let estado = { listo: false, usuario: null, perfil: { ...PERFIL_BASE }, prendas: [], outfits: [] };
const oyentes = new Set();
const oyentesError = new Set();
let backend = null;

export function suscribir(fn) {
  oyentes.add(fn);
  fn(estado);
}
export function alError(fn) { oyentesError.add(fn); }
export const leer = () => estado;

function emitir(cambios) {
  // Todo lo que llega (almacenamiento local, base de datos, respaldos) se valida antes de mostrarse.
  const c = { ...cambios };
  if ('prendas' in c) c.prendas = sanearPrendas(c.prendas);
  if ('outfits' in c) c.outfits = sanearOutfits(c.outfits);
  if ('perfil' in c) c.perfil = sanearPerfil(c.perfil);
  estado = { ...estado, ...c };
  oyentes.forEach(fn => fn(estado));
}
function avisarError(err) {
  console.error(err);
  oyentesError.forEach(fn => fn(err));
}
function seguro(promesa) { Promise.resolve(promesa).catch(avisarError); }

export const nuevoId = () => crypto.randomUUID();

// Firestore no acepta undefined ni NaN.
function limpiar(obj) {
  const salida = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    salida[k] = typeof v === 'number' && !Number.isFinite(v) ? null : v;
  }
  return salida;
}

async function semillaLocal() {
  // Datos personales: si existe seed.local.json (que nunca se sube al repositorio) se usa de punto de partida.
  try {
    const r = await fetch('seed.local.json', { cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      if (d?.perfil) {
        // El archivo puede traer solo el perfil: el resto sale de los datos de ejemplo.
        const base = datosDemo();
        return { perfil: d.perfil, prendas: d.prendas ?? base.prendas, outfits: d.outfits ?? base.outfits };
      }
    }
  } catch { /* sin semilla personal */ }
  return datosDemo();
}

async function crearLocal(clave, semilla) {
  let datos = null;
  try { datos = JSON.parse(localStorage.getItem(clave)); } catch { datos = null; }
  if (!datos) {
    datos = await semilla();
  }
  datos.perfil = sanearPerfil({ ...PERFIL_BASE, ...datos.perfil });
  datos.prendas = sanearPrendas(datos.prendas);
  // Datos guardados antes de que existieran las categorías: se completan con las de las prendas de ejemplo.
  const ejemplo = new Map(datosDemo().prendas.map(q => [q.id, q.categorias]));
  for (const q of datos.prendas) if (!q.categorias.length && ejemplo.get(q.id)?.length) q.categorias = [...ejemplo.get(q.id)];
  datos.outfits = sanearOutfits(datos.outfits);

  function escribir() {
    try { localStorage.setItem(clave, JSON.stringify(datos)); } catch (err) { avisarError(err); }
  }
  function publicar() {
    emitir({ listo: true, usuario: { email: null, local: true, demo: modoDemo }, perfil: datos.perfil, prendas: datos.prendas, outfits: datos.outfits });
  }
  function guardarVarios(col, docs) {
    const lista = (datos[col] ||= []);
    for (const doc of docs) {
      const i = lista.findIndex(x => x.id === doc.id);
      if (i >= 0) lista[i] = doc; else lista.push(doc);
    }
    escribir(); publicar();
  }
  escribir();
  publicar();
  return {
    guardar: (col, doc) => guardarVarios(col, [doc]),
    guardarVarios,
    borrar(col, id) { datos[col] = (datos[col] || []).filter(x => x.id !== id); escribir(); publicar(); },
    guardarPerfil(perfil) { datos.perfil = perfil; escribir(); publicar(); },
    reiniciar() { localStorage.removeItem(clave); },
  };
}

async function crearNube() {
  const [appMod, auth, fs] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const app = appMod.initializeApp(firebaseConfig);
  const sesion = auth.getAuth(app);
  let db;
  try {
    db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) });
  } catch { db = fs.getFirestore(app); }

  const uid = () => sesion.currentUser?.uid;
  const coleccion = col => fs.collection(db, 'usuarios', uid(), col);
  const docPerfil = () => fs.doc(db, 'usuarios', uid(), 'ajustes', 'perfil');
  let cortes = [];

  auth.onAuthStateChanged(sesion, usuario => {
    cortes.forEach(cortar => cortar());
    cortes = [];
    if (!usuario) { emitir({ listo: true, usuario: null, prendas: [], outfits: [] }); return; }
    emitir({ listo: true, usuario: { email: usuario.email, uid: usuario.uid } });
    for (const col of ['prendas', 'outfits']) {
      cortes.push(fs.onSnapshot(coleccion(col),
        snap => emitir({ [col]: snap.docs.map(d => ({ ...d.data(), id: d.id })) }), avisarError));
    }
    cortes.push(fs.onSnapshot(docPerfil(),
      snap => emitir({ perfil: { ...PERFIL_BASE, ...(snap.data() || {}) } }), avisarError));
  });

  return {
    entrar: (email, clave) => auth.signInWithEmailAndPassword(sesion, email, clave),
    registrarse: (email, clave) => auth.createUserWithEmailAndPassword(sesion, email, clave),
    recuperar: email => auth.sendPasswordResetEmail(sesion, email),
    salir: () => auth.signOut(sesion),
    guardar(col, { id, ...resto }) { return fs.setDoc(fs.doc(coleccion(col), id), resto); },
    async guardarVarios(col, docs) {
      for (let i = 0; i < docs.length; i += 200) {
        const lote = fs.writeBatch(db);
        for (const { id, ...resto } of docs.slice(i, i + 200)) lote.set(fs.doc(coleccion(col), id), resto);
        await lote.commit();
      }
    },
    borrar: (col, id) => fs.deleteDoc(fs.doc(coleccion(col), id)),
    guardarPerfil: perfil => fs.setDoc(docPerfil(), perfil),
  };
}

export async function iniciar() {
  try {
    if (modoNube) backend = await crearNube();
    else if (modoDemo) backend = await crearLocal(CLAVE_DEMO, async () => datosDemo());
    else backend = await crearLocal(CLAVE_LOCAL, semillaLocal);
  } catch (err) {
    avisarError(err);
    emitir({ listo: true, error: 'No se pudo conectar con la nube. Revisá tu conexión y volvé a abrir la app.' });
  }
}

export const entrar = (email, clave) => backend.entrar(email, clave);
export const registrarse = (email, clave) => backend.registrarse(email, clave);
export const recuperar = email => backend.recuperar(email);
export const salir = () => seguro(backend.salir());

export function guardarPrenda(p) { const v = sanearPrenda(p); if (v) seguro(backend.guardar('prendas', limpiar(v))); }
export function borrarPrenda(id) { seguro(backend.borrar('prendas', id)); }
export function guardarOutfit(o) { const v = sanearOutfit(o); if (v) seguro(backend.guardar('outfits', limpiar(v))); }
export function borrarOutfit(id) { seguro(backend.borrar('outfits', id)); }
export function guardarPerfil(p) { seguro(backend.guardarPerfil(limpiar(sanearPerfil(p)))); }

export function reiniciarLocal() {
  backend?.reiniciar?.();
  location.reload();
}

export function exportar() {
  return {
    formato: 'armario', version: 1, exportado: new Date().toISOString(),
    perfil: estado.perfil, prendas: estado.prendas, outfits: estado.outfits,
  };
}

// Combina por id: reimportar no duplica.
export function importar(archivo) {
  if (archivo?.formato !== 'armario' && !(archivo?.perfil && Array.isArray(archivo.prendas))) {
    throw new Error('El archivo no es un respaldo del Armario.');
  }
  const prendas = sanearPrendas(archivo.prendas).map(limpiar);
  const outfits = sanearOutfits(archivo.outfits).map(limpiar);
  if (prendas.length) seguro(backend.guardarVarios('prendas', prendas));
  if (outfits.length) seguro(backend.guardarVarios('outfits', outfits));
  if (archivo.perfil) guardarPerfil({ ...estado.perfil, ...archivo.perfil });
  return { prendas: prendas.length, outfits: outfits.length };
}
