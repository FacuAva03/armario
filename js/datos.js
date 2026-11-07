// Catálogo de tipos de prenda y datos de demostración (genéricos, sin datos personales).
// Medidas de partida (genéricas). Las reales de cada persona viven en su perfil.
export const PERFIL_BASE = {
  altura: 175, peso: 72, pecho: 98, cintura: 82, cadera: 96, hombros: 46, brazo: 57, biceps: 33,
  muslo: 57, entrepierna: 77, cuello: 38, pie: 27,
};

// Categorías de partida; cada persona puede crear las suyas.
export const CATEGORIAS_BASE = ['Gym', 'Diario', 'Salir', 'Trabajo', 'Verano', 'Invierno', 'Casa'];

export const SLOTS = [
  { id: 'top', nombre: 'Arriba' },
  { id: 'capa', nombre: 'Encima' },
  { id: 'bottom', nombre: 'Abajo' },
  { id: 'medias', nombre: 'Medias' },
  { id: 'shoes', nombre: 'Calzado' },
  { id: 'acc', nombre: 'Extras' },
];

// `slot` es donde va por defecto; `otros` son los otros lugares donde también se puede usar
// (un buzo o una camisa se usan solos como prenda de arriba, o encima de una remera).
export const TIPOS = {
  remera: { nombre: 'Remera', slot: 'top' },
  musculosa: { nombre: 'Musculosa', slot: 'top' },
  camisa: { nombre: 'Camisa', slot: 'top', otros: ['capa'] },
  buzo: { nombre: 'Buzo / hoodie', slot: 'capa', otros: ['top'] },
  campera: { nombre: 'Campera / abrigo', slot: 'capa' },
  pantalon: { nombre: 'Pantalón / jean', slot: 'bottom' },
  short: { nombre: 'Short / bermuda', slot: 'bottom' },
  medias: { nombre: 'Medias', slot: 'medias' },
  zapatilla: { nombre: 'Zapatillas', slot: 'shoes' },
  zapato: { nombre: 'Zapatos / borcegos / ojotas', slot: 'shoes' },
  cadena: { nombre: 'Cadena', slot: 'acc' },
  reloj: { nombre: 'Reloj', slot: 'acc' },
  pulsera: { nombre: 'Pulsera / anillo', slot: 'acc' },
  gorra: { nombre: 'Gorra / gorro', slot: 'acc' },
  lentes: { nombre: 'Lentes', slot: 'acc' },
  cinturon: { nombre: 'Cinturón', slot: 'acc' },
  mochila: { nombre: 'Mochila / bolso', slot: 'acc' },
};

// Los lugares donde se puede usar una prenda de este tipo (el primero es el de por defecto).
export const slotsDe = tipo => (TIPOS[tipo] ? [TIPOS[tipo].slot, ...(TIPOS[tipo].otros || [])] : []);

// Medidas que se piden por tipo. Todas son de la prenda apoyada en plano, en cm.
export const CAMPOS = {
  remera: [
    { k: 'ancho_pecho', t: 'Ancho de pecho (plano, de axila a axila)', def: 54, min: 36, max: 80 },
    { k: 'ancho_bajo', t: 'Ancho del borde inferior (plano)', def: 54, min: 36, max: 80 },
    { k: 'largo', t: 'Largo (del cuello al borde de abajo)', def: 60, min: 40, max: 90 },
    { k: 'largo_manga', t: 'Largo de manga (desde el hombro)', def: 22, min: 4, max: 40 },
    { k: 'boca_manga', t: 'Boca de manga (plana)', def: 19, min: 12, max: 32 },
    { k: 'caida_hombro', t: 'Caída del hombro (0 = en su lugar)', def: 1, min: 0, max: 8 },
  ],
  musculosa: [
    { k: 'ancho_pecho', t: 'Ancho de pecho (plano, de axila a axila)', def: 50, min: 36, max: 70 },
    { k: 'largo', t: 'Largo (del hombro al borde de abajo)', def: 56, min: 40, max: 85 },
    { k: 'sisa', t: 'Hueco del brazo', tipo: 'opcion', def: 'media', opciones: [['media', 'Medio'], ['profunda', 'Profundo']] },
  ],
  pantalon: [
    { k: 'cintura', t: 'Cintura (plana)', def: 42, min: 30, max: 60 },
    { k: 'cadera', t: 'Cadera (plana)', def: 54, min: 36, max: 70 },
    { k: 'muslo', t: 'Muslo (plano)', def: 34, min: 22, max: 48 },
    { k: 'boca', t: 'Boca de la pierna (plana)', def: 24, min: 14, max: 40 },
    { k: 'largo', t: 'Largo total (de la cintura al ruedo)', def: 104, min: 60, max: 125 },
  ],
  short: [
    { k: 'cintura', t: 'Cintura (plana)', def: 41, min: 30, max: 60 },
    { k: 'cadera', t: 'Cadera (plana)', def: 52, min: 36, max: 70 },
    { k: 'muslo', t: 'Muslo (plano)', def: 31, min: 22, max: 48 },
    { k: 'boca', t: 'Boca de la pierna (plana)', def: 28, min: 14, max: 45 },
    { k: 'largo', t: 'Largo total (de la cintura al borde)', def: 42, min: 20, max: 70 },
  ],
  zapatilla: [
    { k: 'largo', t: 'Largo de la zapatilla (cm)', def: 29, min: 24, max: 34 },
    { k: 'cana', t: 'Altura', tipo: 'opcion', def: 'baja', opciones: [['baja', 'Baja'], ['botita', 'Botita']] },
    { k: 'logo', t: 'Con logo en el costado', tipo: 'casilla', def: false },
  ],
  camisa: [
    { k: 'ancho_pecho', t: 'Ancho de pecho (plano, de axila a axila)', def: 56, min: 36, max: 80 },
    { k: 'ancho_bajo', t: 'Ancho del borde inferior (plano)', def: 54, min: 36, max: 80 },
    { k: 'largo', t: 'Largo (del cuello al borde de abajo)', def: 72, min: 40, max: 95 },
    { k: 'largo_manga', t: 'Largo de manga (desde el hombro hasta el puño)', def: 62, min: 4, max: 75 },
    { k: 'boca_manga', t: 'Boca de manga (plana)', def: 11, min: 8, max: 32 },
    { k: 'caida_hombro', t: 'Caída del hombro (0 = en su lugar)', def: 1, min: 0, max: 8 },
  ],
  buzo: [
    { k: 'ancho_pecho', t: 'Ancho de pecho (plano, de axila a axila)', def: 60, min: 40, max: 85 },
    { k: 'ancho_bajo', t: 'Ancho del borde inferior (plano)', def: 52, min: 36, max: 85 },
    { k: 'largo', t: 'Largo (del cuello al borde de abajo)', def: 66, min: 45, max: 95 },
    { k: 'largo_manga', t: 'Largo de manga (desde el hombro hasta el puño)', def: 62, min: 4, max: 75 },
    { k: 'boca_manga', t: 'Boca de manga (plana, el puño)', def: 10, min: 7, max: 32 },
    { k: 'caida_hombro', t: 'Caída del hombro (0 = en su lugar)', def: 3, min: 0, max: 10 },
    { k: 'capucha', t: 'Tiene capucha', tipo: 'casilla', def: false },
  ],
  campera: [
    { k: 'ancho_pecho', t: 'Ancho de pecho (plano, de axila a axila)', def: 60, min: 40, max: 85 },
    { k: 'ancho_bajo', t: 'Ancho del borde inferior (plano)', def: 58, min: 36, max: 85 },
    { k: 'largo', t: 'Largo (del cuello al borde de abajo)', def: 66, min: 45, max: 100 },
    { k: 'largo_manga', t: 'Largo de manga (desde el hombro hasta el puño)', def: 62, min: 4, max: 75 },
    { k: 'boca_manga', t: 'Boca de manga (plana)', def: 12, min: 7, max: 34 },
    { k: 'caida_hombro', t: 'Caída del hombro (0 = en su lugar)', def: 2, min: 0, max: 10 },
    { k: 'capucha', t: 'Tiene capucha', tipo: 'casilla', def: false },
  ],
  medias: [
    { k: 'largo_media', t: 'Largo de la media', tipo: 'opcion', def: 'media', opciones: [['tobillera', 'Tobillera (no pasa el tobillo)'], ['media', 'Media caña (sobre el tobillo)'], ['larga', 'Larga (hasta la pantorrilla)']] },
  ],
  zapato: [
    { k: 'largo', t: 'Largo del calzado (cm)', def: 29, min: 24, max: 34 },
    { k: 'cana', t: 'Altura', tipo: 'opcion', def: 'baja', opciones: [['baja', 'Bajo (zapato, mocasín, ojota)'], ['botita', 'Alto (borcego, bota)']] },
  ],
  cadena: [{ k: 'largo', t: 'Largo de la cadena (cm)', def: 50, min: 36, max: 80 }],
  reloj: [],
  pulsera: [],
  gorra: [],
  lentes: [],
  cinturon: [{ k: 'largo', t: 'Largo total (cm)', def: 105, min: 70, max: 140 }],
  mochila: [],
};

const remeraReg = { ancho_pecho: 55, ancho_bajo: 55, largo: 58, largo_manga: 21, boca_manga: 18.5, caida_hombro: 1 };
const jeanRecto = { cintura: 42, cadera: 52, muslo: 31, boca: 22, largo: 104 };
const bermuda = { cintura: 42, cadera: 52, muslo: 31, boca: 29, largo: 44 };

const P = (o) => ({ tengo: true, estimado: false, lavado: 0, foto: null, nota: '', ...o });

export const PRENDAS_DEMO = [
  // Lo que ya tengo (medidas estimadas hasta que se midan en plano)
  P({ id: 'remera-azul-oscuro', nombre: 'Remera azul oscura lavada', tipo: 'remera', slot: 'top', color: '#232b3b', lavado: 0.55, estimado: true,
    ancho_pecho: 60, ancho_bajo: 60, largo: 64, largo_manga: 26, boca_manga: 22, caida_hombro: 4,
    nota: 'Oversize, con logo discreto del mismo tono.' }),
  P({ id: 'remera-azul-clara', nombre: 'Remera azul clara', tipo: 'remera', slot: 'top', color: '#8ab0d6', estimado: true, ...remeraReg }),
  P({ id: 'jean-recto-ancho', nombre: 'Jean azul recto (ancho)', tipo: 'pantalon', slot: 'bottom', color: '#6c92c2', lavado: 0.55, estimado: true,
    cintura: 42, cadera: 54, muslo: 34, boca: 25, largo: 98, nota: 'Largo: se amontona sobre la zapatilla si no se dobla el ruedo.' }),
  P({ id: 'short-azul-marino', nombre: 'Short de gym azul marino (2 en 1)', tipo: 'short', slot: 'bottom', color: '#1c2138', estimado: true,
    cintura: 41, cadera: 52, muslo: 31, boca: 29, largo: 41 }),
  P({ id: 'short-negro-franja', nombre: 'Short negro con franja gris', tipo: 'short', slot: 'bottom', color: '#17171b', estimado: true,
    cintura: 41, cadera: 52, muslo: 32, boca: 30, largo: 42 }),
  P({ id: 'nike-botita-negra', nombre: 'Zapatillas botita negras (logo blanco)', tipo: 'zapatilla', slot: 'shoes', color: '#17171a', color2: '#ececec', cana: 'botita', logo: true, largo: 29 }),
  P({ id: 'vans-negras', nombre: 'Zapatillas negras', tipo: 'zapatilla', slot: 'shoes', color: '#18181b', color2: '#26262a', cana: 'botita', logo: false, largo: 29 }),
  P({ id: 'vans-blancas', nombre: 'Zapatillas blancas', tipo: 'zapatilla', slot: 'shoes', color: '#f1efe9', color2: '#e6e1d3', cana: 'botita', logo: false, largo: 29 }),
  P({ id: 'cadena-plata', nombre: 'Cadena de plata', tipo: 'cadena', slot: 'acc', largo: 52 }),
  P({ id: 'reloj-negro', nombre: 'Reloj negro', tipo: 'reloj', slot: 'acc', color: '#141416' }),
  // Para comprar (medidas ideales según las reglas de calce)
  P({ id: 'remera-blanca', nombre: 'Remera blanca lisa regular', tipo: 'remera', slot: 'top', color: '#f2f0ea', tengo: false, ...remeraReg }),
  P({ id: 'remera-negra', nombre: 'Remera negra lisa regular', tipo: 'remera', slot: 'top', color: '#18181b', tengo: false, ...remeraReg }),
  P({ id: 'remera-gris', nombre: 'Remera gris carbón', tipo: 'remera', slot: 'top', color: '#4a4d52', tengo: false, ...remeraReg }),
  P({ id: 'remera-oliva', nombre: 'Remera verde oliva', tipo: 'remera', slot: 'top', color: '#5b6240', tengo: false, ...remeraReg }),
  P({ id: 'musculosa-negra', nombre: 'Musculosa negra', tipo: 'musculosa', slot: 'top', color: '#18181b', tengo: false, ancho_pecho: 51, largo: 56, sisa: 'media' }),
  P({ id: 'jean-azul-oscuro', nombre: 'Jean azul oscuro recto', tipo: 'pantalon', slot: 'bottom', color: '#34476b', lavado: 0.15, tengo: false, ...jeanRecto }),
  P({ id: 'jean-negro', nombre: 'Jean negro recto', tipo: 'pantalon', slot: 'bottom', color: '#232326', lavado: 0.2, tengo: false, ...jeanRecto }),
  P({ id: 'bermuda-arena', nombre: 'Bermuda chino arena', tipo: 'short', slot: 'bottom', color: '#c9b48f', tengo: false, denim: false, ...bermuda }),
  P({ id: 'bermuda-oliva', nombre: 'Bermuda verde oliva', tipo: 'short', slot: 'bottom', color: '#5f6b48', tengo: false, denim: false, ...bermuda }),
  P({ id: 'short-gris', nombre: 'Short de gym gris carbón (angosto)', tipo: 'short', slot: 'bottom', color: '#4b4e55', tengo: false, cintura: 41, cadera: 50, muslo: 30, boca: 27, largo: 40 }),
];

const CATS_DEMO = {
  'remera-azul-oscuro': ['Diario', 'Salir'], 'remera-azul-clara': ['Diario'], 'jean-recto-ancho': ['Diario', 'Salir'],
  'short-azul-marino': ['Gym'], 'short-negro-franja': ['Gym'], 'nike-botita-negra': ['Diario', 'Gym', 'Salir'],
  'vans-negras': ['Diario', 'Salir'], 'vans-blancas': ['Diario', 'Salir'], 'cadena-plata': ['Diario', 'Salir'],
  'reloj-negro': ['Diario', 'Gym', 'Salir'], 'remera-blanca': ['Diario', 'Verano'], 'remera-negra': ['Diario', 'Gym', 'Salir'],
  'remera-gris': ['Diario', 'Gym'], 'remera-oliva': ['Diario'], 'musculosa-negra': ['Gym', 'Verano'],
  'jean-azul-oscuro': ['Diario', 'Salir'], 'jean-negro': ['Salir'], 'bermuda-arena': ['Diario', 'Verano'],
  'bermuda-oliva': ['Verano'], 'short-gris': ['Gym', 'Casa'],
};
PRENDAS_DEMO.forEach(p => { p.categorias = CATS_DEMO[p.id] || []; });

const O = (o) => ({ sugerido: true, acc: [], opts: {}, nota: '', ...o });

export const OUTFITS_DEMO = [
  O({ id: 'o1', nombre: 'Comer con los compas', ocasion: 'Salida', top: 'remera-azul-oscuro', bottom: 'jean-recto-ancho', shoes: 'vans-negras', acc: ['cadena-plata', 'reloj-negro'],
    opts: { metida: 'media', mangaDoblada: true, vueltas: 1 },
    nota: 'Media remera adentro, manga doblada una vez y una vuelta de ruedo para que el jean no se amontone.' }),
  O({ id: 'o2', nombre: 'Facultad con calor', ocasion: 'Día', top: 'remera-blanca', bottom: 'bermuda-arena', shoes: 'vans-negras', acc: ['cadena-plata', 'reloj-negro'],
    nota: 'Bermuda a una palma sobre la rodilla, 2 dedos de aire en el muslo.' }),
  O({ id: 'o3', nombre: 'Facultad, mañana fresca', ocasion: 'Día', top: 'remera-gris', bottom: 'jean-recto-ancho', shoes: 'vans-negras', acc: ['reloj-negro'], opts: { vueltas: 1 },
    nota: 'Sumá un buzo azul marino liviano para sacar cuando suba la temperatura.' }),
  O({ id: 'o4', nombre: 'Mate o salir de día', ocasion: 'Día', top: 'remera-blanca', bottom: 'bermuda-oliva', shoes: 'vans-blancas', acc: ['cadena-plata'],
    nota: 'Si tenés una camisa de lino crema, abierta y arremangada sobre la remera blanca.' }),
  O({ id: 'o5', nombre: 'Barrio y mandados con calor', ocasion: 'Día', top: 'remera-negra', bottom: 'short-gris', shoes: 'vans-negras', acc: ['reloj-negro'],
    nota: 'Cómodo sin verse descuidado.' }),
  O({ id: 'o6', nombre: 'Salida de noche', ocasion: 'Noche', top: 'remera-negra', bottom: 'jean-negro', shoes: 'nike-botita-negra', acc: ['cadena-plata', 'reloj-negro'],
    nota: 'Todo oscuro con la plata de la cadena como único brillo. Si refresca: campera liviana verde oliva abierta.' }),
  O({ id: 'o7', nombre: 'Cita', ocasion: 'Noche', top: 'remera-blanca', bottom: 'jean-azul-oscuro', shoes: 'vans-blancas', acc: ['cadena-plata', 'reloj-negro'],
    nota: 'Prolijo sin parecer producido. Con camisa blanca arremangada también funciona.' }),
  O({ id: 'o8', nombre: 'Asado o reunión familiar', ocasion: 'Día', top: 'remera-oliva', bottom: 'bermuda-arena', shoes: 'vans-blancas', acc: ['reloj-negro'],
    nota: 'El oliva favorece tu tono de piel y es cómodo para comer.' }),
  O({ id: 'o9', nombre: 'Gym: pierna', ocasion: 'Gimnasio', top: 'remera-negra', bottom: 'short-azul-marino', shoes: 'vans-negras', acc: ['reloj-negro'],
    nota: 'Short a 2 palmas sobre la rodilla, angosto. Sin cadena para entrenar.' }),
  O({ id: 'o10', nombre: 'Gym: torso', ocasion: 'Gimnasio', top: 'musculosa-negra', bottom: 'short-negro-franja', shoes: 'vans-negras', acc: ['reloj-negro'],
    nota: 'Para días de torso y espalda. Sin cadena.' }),
];

export function datosDemo() {
  return {
    perfil: { ...PERFIL_BASE },
    prendas: PRENDAS_DEMO.map(p => ({ ...p })),
    outfits: OUTFITS_DEMO.map(o => ({ ...o, acc: [...o.acc], opts: { ...o.opts } })),
  };
}
