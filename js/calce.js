// Chequeo de calce: convierte las medidas de las prendas en las reglas que usamos, en dedos.
// Todo en cm. La altura de cada punto del cuerpo sale de las proporciones de la altura de la persona.
export const DEDO = 2.0;

const dedos = n => { const v = Math.round(n * 10) / 10; return `${v} dedo${v === 1 ? '' : 's'}`; };

function puntos(perfil) {
  const H = perfil.altura || 173;
  return { H, cintura: 0.601 * H - 3, rodilla: 0.285 * H, hps: 0.847 * H + 0.5, tobillo: 0.046 * H, brazo: perfil.brazo || 56 };
}

// Mide lo que se puede decir de la combinación elegida.
export function infoPrendas(look, items, perfil, op = {}) {
  const P = puntos(perfil);
  const g = id => (id ? items.get(id) : null);
  const info = {};
  const calzado = g(look.shoes);
  const apoyo = calzado && calzado.tipo === 'zapatilla' ? (calzado.cana === 'botita' ? 11.5 : 8.6) : P.tobillo + 0.5;
  info.apoyo = apoyo;

  const top = g(look.top);
  if (top?.tipo === 'remera') {
    const hemY = Math.min(P.hps - (top.largo ?? 60), P.cintura - 6);
    const manga = Math.max(3, (top.caida_hombro ?? 1) + (top.largo_manga ?? 22) - (op.mangaDoblada ? 4 : 0));
    const frac = manga / P.brazo;
    info.top = {
      tipo: 'remera', dedosBajoCintura: (P.cintura - hemY) / DEDO, caida: top.caida_hombro ?? 1,
      mangaZona: frac < 0.2 ? 'hombro' : frac < 0.42 ? 'mitad de bíceps' : frac < 0.62 ? 'codo' : 'antebrazo',
      holguraPecho: 2 * (top.ancho_pecho ?? 54) - (perfil.pecho || 100),
    };
  } else if (top?.tipo === 'musculosa') {
    const hemY = Math.min(P.hps - (top.largo ?? 56), P.cintura - 6);
    info.top = { tipo: 'musculosa', dedosBajoCintura: (P.cintura - hemY) / DEDO };
  }

  const bajo = g(look.bottom);
  if (bajo?.tipo === 'pantalon') {
    const vueltas = op.vueltas ?? bajo.vueltas ?? 0;
    const hemSuelto = P.cintura - (bajo.largo ?? 104) + vueltas * 4.2;
    info.bottom = { tipo: 'pantalon', vueltas, exceso: Math.max(0, apoyo - hemSuelto), hemY: Math.max(hemSuelto, apoyo) };
  } else if (bajo?.tipo === 'short') {
    const hem = P.cintura - (bajo.largo ?? 42);
    info.bottom = { tipo: 'short', dedosRodilla: (hem - P.rodilla) / DEDO };
  }
  return info;
}

export function chequear(info, op = {}) {
  const lista = [];
  const ok = texto => lista.push({ nivel: 'ok', texto });
  const aviso = texto => lista.push({ nivel: 'alerta', texto });

  const t = info.top;
  if (t?.tipo === 'remera') {
    const d = t.dedosBajoCintura;
    if (d < 2) aviso(`Remera corta: el borde queda a ${dedos(d)} de la cintura, se ve crop.`);
    else if (d <= 8) ok(`Largo de la remera: el borde queda a ${dedos(d)} bajo el cinturón.`);
    else if (d <= 12) aviso(`Remera algo larga: el borde baja ${dedos(d)} bajo el cinturón. Metela a medias para acortarla.`);
    else aviso(`Remera larga: baja ${dedos(d)} bajo el cinturón y te tapa la cadera.`);
    if (t.mangaZona === 'mitad de bíceps') ok('La manga llega a mitad de bíceps.');
    else if (t.mangaZona === 'codo') aviso(op.mangaDoblada ? 'Aun doblada, la manga llega casi al codo: doblala una vuelta más.' : 'La manga llega al codo: doblala una vez para que llegue a mitad de bíceps.');
    else if (t.mangaZona === 'antebrazo') aviso('La manga pasa el codo.');
    else aviso('La manga es muy corta, queda en el hombro.');
    if (t.caida > 3) aviso(`Hombro caído ${dedos(t.caida / DEDO)}: es estilo oversize, pero achica los hombros.`);
    if (t.holguraPecho < 2) aviso('La remera queda ajustada al pecho.');
    else if (t.holguraPecho > 24) aviso('Mucho volumen en el pecho: la remera te tapa la forma del cuerpo.');
  }
  if (t?.tipo === 'musculosa') ok(`La musculosa baja ${dedos(t.dedosBajoCintura)} bajo el cinturón.`);

  const b = info.bottom;
  if (b?.tipo === 'pantalon') {
    if (b.exceso > 0.5) aviso(`El jean es largo: se amontona ${dedos(b.exceso / DEDO)} sobre la zapatilla. Doblá una vuelta de 2 dedos o llevalo al arreglista.`);
    else if (b.hemY - info.apoyo < 3) ok('El ruedo apoya justo sobre la zapatilla, con poco o ningún pliegue.');
    else aviso('El jean queda corto: se ve el tobillo.');
    if (b.vueltas > 0) ok(`Ruedo doblado ${b.vueltas} ${b.vueltas === 1 ? 'vuelta' : 'vueltas'}.`);
  }
  if (b?.tipo === 'short') {
    const d = b.dedosRodilla;
    if (d >= 7) ok(`El short llega a ${dedos(d)} sobre la rodilla: largo medio, el más estilizado.`);
    else if (d >= 3.5) ok(`El short llega a ${dedos(d)} sobre la rodilla: largo relajado (una palma).`);
    else if (d >= 1.5) aviso(`El short llega a ${dedos(d)} sobre la rodilla: te acorta la pierna.`);
    else aviso('El short llega a la rodilla o más abajo: te achica.');
  }
  if (info.top && info.bottom && op.metida === 'media') ok('Remera a medias metida: marca la cintura y deja ver la silueta.');
  return lista;
}
