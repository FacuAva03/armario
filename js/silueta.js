import { colorSeguro } from './sanear.js';

// Siluetas dibujadas (SVG) para las prendas que todavía no tienen foto, teñidas con el color de la prenda.

function oscurecer(hex, f = 0.7) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return '#4a3a2c';
  const n = parseInt(m[1], 16);
  const c = v => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, '0');
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
}

const FORMAS = {
  remera: 'M32 10 L10 24 L19 42 L30 36 L30 90 L70 90 L70 36 L81 42 L90 24 L68 10 Q50 24 32 10 Z',
  musculosa: 'M34 8 L34 28 Q34 40 27 46 L27 90 L73 90 L73 46 Q66 40 66 28 L66 8 L58 8 Q50 26 42 8 Z',
  pantalon: 'M27 8 H73 L80 92 H56 L50 40 L44 92 H20 Z',
  short: 'M24 14 H76 L84 62 H56 L50 38 L44 62 H16 Z',
  camisa: 'M32 8 L12 20 L8 66 L19 68 L27 36 L27 92 L73 92 L73 36 L81 68 L92 66 L88 20 L68 8 L50 20 Z',
  buzo: 'M30 14 L8 26 L8 68 L22 70 L28 42 L28 90 L72 90 L72 42 L78 70 L92 68 L92 26 L70 14 Q50 30 30 14 Z',
  campera: 'M30 10 L8 24 L8 70 L22 72 L28 40 L28 92 L72 92 L72 40 L78 72 L92 70 L92 24 L70 10 L60 16 H40 Z',
};

// Detalles que distinguen a cada prenda de arriba (cuello, botones, capucha, cierre, bolsillo).
function detalle(tipo, borde, color, capucha) {
  const l = `stroke="${borde}" stroke-width="1.6" fill="none" opacity=".75" stroke-linecap="round"`;
  if (tipo === 'camisa') return `<path d="M50 20 L40 8 L50 30 L60 8 Z" fill="${oscurecer(color, 0.85)}" stroke="${borde}" stroke-width="1.2"/><path d="M50 30 V92" ${l}/><circle cx="50" cy="44" r="1.3" fill="${borde}"/><circle cx="50" cy="58" r="1.3" fill="${borde}"/><circle cx="50" cy="72" r="1.3" fill="${borde}"/>`;
  if (tipo === 'buzo') return `${capucha ? `<path d="M34 14 Q50 -2 66 14 Q50 34 34 14 Z" fill="${oscurecer(color, 0.85)}" stroke="${borde}" stroke-width="1.4"/>` : `<path d="M40 14 Q50 24 60 14" ${l}/>`}<path d="M34 66 H66 L62 82 H38 Z" ${l}/><path d="M28 84 H72" ${l}/>`;
  if (tipo === 'campera') return `<path d="M50 16 V92" ${l}/>${capucha ? `<path d="M34 12 Q50 -2 66 12 L60 18 H40 Z" fill="${oscurecer(color, 0.85)}" stroke="${borde}" stroke-width="1.4"/>` : ''}<path d="M36 70 H44 M56 70 H64" ${l}/>`;
  return '';
}

export function silueta(p) {
  const color = colorSeguro(p.color);
  const borde = oscurecer(color, 0.62);
  if (FORMAS[p.tipo]) {
    const extra = (p.tipo === 'pantalon' || p.tipo === 'short')
      ? `<path d="M27 8 H73 V16 H27 Z" fill="${oscurecer(color, 0.85)}" opacity=".55"/><path d="M50 40 V16" stroke="${borde}" stroke-width="1.2" opacity=".6"/>`
      : (detalle(p.tipo, borde, color, !!p.capucha) || `<path d="M42 10 Q50 20 58 10" stroke="${borde}" stroke-width="1.6" fill="none" opacity=".7"/>`);
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${FORMAS[p.tipo]}" fill="${color}" stroke="${borde}" stroke-width="2" stroke-linejoin="round"/>${extra}</svg>`;
  }
  if (p.tipo === 'zapatilla' || p.tipo === 'zapato') {
    const suela = colorSeguro(p.color2, '#e8e2d6');
    const alta = p.cana === 'botita';
    const cuerpo = alta
      ? 'M10 70 L10 40 L36 40 L38 52 Q52 58 66 56 Q90 58 92 68 L92 70 Z'
      : 'M10 70 L10 52 Q24 52 30 42 L44 46 Q52 54 66 56 Q90 58 92 68 L92 70 Z';
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${cuerpo}" fill="${color}" stroke="${borde}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M8 70 H94 V78 Q94 80 92 80 H10 Q8 80 8 78 Z" fill="${suela}" stroke="${borde}" stroke-width="1.6"/>
      ${p.logo ? `<path d="M34 64 Q52 66 70 58 Q56 70 34 64 Z" fill="${suela}" opacity=".95"/>` : ''}</svg>`;
  }
  if (p.tipo === 'cadena') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M26 14 Q26 72 50 72 Q74 72 74 14" fill="none" stroke="#b9bec6" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 6"/>
      <path d="M26 14 Q26 72 50 72 Q74 72 74 14" fill="none" stroke="#8c929b" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  if (p.tipo === 'reloj') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="38" y="6" width="24" height="30" rx="4" fill="${color}"/><rect x="38" y="64" width="24" height="30" rx="4" fill="${color}"/>
      <rect x="30" y="30" width="40" height="40" rx="9" fill="${oscurecer(color, 0.8)}" stroke="#b9bec6" stroke-width="2"/><rect x="36" y="36" width="28" height="28" rx="5" fill="#0c0c10"/></svg>`;
  }
  if (p.tipo === 'medias') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M36 8 H62 V50 Q62 58 70 64 Q86 70 86 84 Q86 93 75 93 H44 Q33 93 34 80 Z" fill="${color}" stroke="${borde}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M36 8 H62 V18 H36 Z" fill="${oscurecer(color, 0.8)}" opacity=".6"/><path d="M34 78 Q50 84 66 78" stroke="${borde}" stroke-width="1.4" fill="none" opacity=".5"/></svg>`;
  }
  if (p.tipo === 'gorra') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 62 Q18 24 50 24 Q82 24 82 62 Z" fill="${color}" stroke="${borde}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M16 62 H84 Q98 64 94 72 Q70 76 48 70 L16 70 Z" fill="${oscurecer(color, 0.85)}" stroke="${borde}" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="24" r="3" fill="${borde}"/></svg>`;
  }
  if (p.tipo === 'lentes') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="30" cy="54" r="18" fill="${oscurecer(color, 0.45)}" stroke="${color}" stroke-width="4"/><circle cx="70" cy="54" r="18" fill="${oscurecer(color, 0.45)}" stroke="${color}" stroke-width="4"/>
      <path d="M47 50 Q50 46 53 50 M12 50 L4 42 M88 50 L96 42" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  }
  if (p.tipo === 'cinturon') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="40" width="88" height="20" rx="4" fill="${color}" stroke="${borde}" stroke-width="2"/>
      <rect x="62" y="35" width="22" height="30" rx="4" fill="none" stroke="#b9bec6" stroke-width="4"/><path d="M73 40 V60" stroke="#8c929b" stroke-width="2.5"/><circle cx="22" cy="50" r="2" fill="${borde}"/><circle cx="34" cy="50" r="2" fill="${borde}"/><circle cx="46" cy="50" r="2" fill="${borde}"/></svg>`;
  }
  if (p.tipo === 'pulsera') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="28" fill="none" stroke="${color}" stroke-width="9"/><circle cx="50" cy="50" r="28" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 9" opacity=".6"/></svg>`;
  }
  if (p.tipo === 'mochila') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M34 22 Q34 6 50 6 Q66 6 66 22" fill="none" stroke="${borde}" stroke-width="4"/><rect x="22" y="20" width="56" height="72" rx="14" fill="${color}" stroke="${borde}" stroke-width="2"/>
      <rect x="32" y="56" width="36" height="26" rx="6" fill="${oscurecer(color, 0.85)}" stroke="${borde}" stroke-width="1.6"/><path d="M32 40 H68" stroke="${borde}" stroke-width="1.6" opacity=".7"/></svg>`;
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="28" fill="${color}" stroke="${borde}" stroke-width="2"/></svg>`;
}

// Percha de latón para el riel.
export const PERCHA = `<svg class="percha" viewBox="0 0 60 30" aria-hidden="true"><path d="M30 14 L56 27 H4 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M30 14 V10 A4.2 4.2 0 1 0 25.8 5.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
