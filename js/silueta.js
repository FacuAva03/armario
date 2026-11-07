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
};

export function silueta(p) {
  const color = colorSeguro(p.color);
  const borde = oscurecer(color, 0.62);
  if (FORMAS[p.tipo]) {
    const extra = (p.tipo === 'pantalon' || p.tipo === 'short')
      ? `<path d="M27 8 H73 V16 H27 Z" fill="${oscurecer(color, 0.85)}" opacity=".55"/><path d="M50 40 V16" stroke="${borde}" stroke-width="1.2" opacity=".6"/>`
      : `<path d="M42 10 Q50 20 58 10" stroke="${borde}" stroke-width="1.6" fill="none" opacity=".7"/>`;
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${FORMAS[p.tipo]}" fill="${color}" stroke="${borde}" stroke-width="2" stroke-linejoin="round"/>${extra}</svg>`;
  }
  if (p.tipo === 'zapatilla') {
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
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="28" fill="${color}" stroke="${borde}" stroke-width="2"/></svg>`;
}

// Percha de latón para el riel.
export const PERCHA = `<svg class="percha" viewBox="0 0 60 30" aria-hidden="true"><path d="M30 14 L56 27 H4 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M30 14 V10 A4.2 4.2 0 1 0 25.8 5.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
