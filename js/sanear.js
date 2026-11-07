// Validación de los datos que entran a la app (respaldos importados, base de datos, almacenamiento local).
// Todo lo que se imprime en pantalla pasa por acá: solo se aceptan colores hexadecimales, fotos en formato
// data:image y textos acotados. Cualquier otra cosa se descarta o se reemplaza por un valor seguro.
import { TIPOS, CAMPOS, PERFIL_BASE, slotsDe } from './datos.js';

const HEX = /^#[0-9a-f]{6}$/i;
const FOTO = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const MAX_FOTO = 1_500_000;                         // caracteres; las fotos de la app pesan ~100.000

export const colorSeguro = (v, def = '#8a7a68') => (typeof v === 'string' && HEX.test(v) ? v : def);
export const fotoSegura = v => (typeof v === 'string' && v.length < MAX_FOTO && FOTO.test(v) ? v : null);
const texto = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max);
const idSeguro = v => (typeof v === 'string' && v.length > 0 && v.length <= 80 ? v.replace(/[^\w\-.:]/g, '_') : null);
const numero = (v, def, min = 0, max = 1000) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };

const categorias = v => {
  if (!Array.isArray(v)) return [];
  const vistos = new Set();
  for (const c of v) {
    const t = texto(c, 24).trim();
    if (t) vistos.add(t);
  }
  return [...vistos].slice(0, 8);
};

export function sanearPrenda(p) {
  if (!p || typeof p !== 'object') return null;
  const id = idSeguro(p.id);
  const tipo = TIPOS[p.tipo] ? p.tipo : null;
  if (!id || !tipo) return null;
  const s = {
    id, tipo, slot: slotsDe(tipo).includes(p.slot) ? p.slot : TIPOS[tipo].slot,
    nombre: texto(p.nombre, 120), nota: texto(p.nota, 500),
    tengo: p.tengo !== false, estimado: !!p.estimado,
    color: colorSeguro(p.color), lavado: numero(p.lavado, 0, 0, 1),
    foto: fotoSegura(p.foto), categorias: categorias(p.categorias),
  };
  if (p.color2 !== undefined) s.color2 = colorSeguro(p.color2, '#eeeeee');
  if (p.denim !== undefined) s.denim = !!p.denim;
  if (p.vueltas !== undefined) s.vueltas = numero(p.vueltas, 0, 0, 4);
  for (const c of CAMPOS[tipo] || []) {
    if (c.tipo === 'opcion') s[c.k] = c.opciones.some(o => o[0] === p[c.k]) ? p[c.k] : c.def;
    else if (c.tipo === 'casilla') s[c.k] = !!p[c.k];
    else s[c.k] = numero(p[c.k], c.def, 0, c.max * 1.5);
  }
  return s;
}

export function sanearOutfit(o) {
  if (!o || typeof o !== 'object') return null;
  const id = idSeguro(o.id);
  if (!id) return null;
  const op = o.opts && typeof o.opts === 'object' ? o.opts : {};
  return {
    id, nombre: texto(o.nombre, 120), ocasion: texto(o.ocasion, 60), nota: texto(o.nota, 500), sugerido: !!o.sugerido,
    top: idSeguro(o.top), capa: idSeguro(o.capa), bottom: idSeguro(o.bottom), medias: idSeguro(o.medias), shoes: idSeguro(o.shoes),
    acc: Array.isArray(o.acc) ? o.acc.map(idSeguro).filter(Boolean).slice(0, 6) : [],
    opts: {
      mangaDoblada: !!op.mangaDoblada,
      metida: op.metida === 'media' ? 'media' : 'no',
      vueltas: op.vueltas === null || op.vueltas === undefined ? null : numero(op.vueltas, 0, 0, 4),
    },
  };
}

export function sanearPerfil(p) {
  const base = { ...PERFIL_BASE };
  const origen = p && typeof p === 'object' ? p : {};
  const s = {};
  for (const k of Object.keys(base)) s[k] = numero(origen[k], base[k], 1, 400);
  return s;
}

export const sanearPrendas = lista => (Array.isArray(lista) ? lista.map(sanearPrenda).filter(Boolean) : []);
export const sanearOutfits = lista => (Array.isArray(lista) ? lista.map(sanearOutfit).filter(Boolean) : []);
