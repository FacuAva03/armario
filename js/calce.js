// Chequeo de calce: convierte las medidas de las prendas en las reglas que usamos, en dedos.
// Todo en cm. La altura de cada punto del cuerpo sale de las proporciones de la altura de la persona.
export const DEDO = 2.0;

const dedos = n => { const v = Math.round(n * 10) / 10; return `${v} dedo${v === 1 ? '' : 's'}`; };

function puntos(perfil) {
  const H = perfil.altura || 173;
  return { H, cintura: 0.601 * H - 3, rodilla: 0.285 * H, hps: 0.847 * H + 0.5, tobillo: 0.046 * H, brazo: perfil.brazo || 56 };
}

// Prendas de arriba con manga: cómo se nombran y cuánto volumen en el pecho es razonable en cada una.
const SUPERIOR = {
  remera: { el: 'La remera', de: 'de la remera', f: true, holgura: [2, 24], caida: 3 },
  camisa: { el: 'La camisa', de: 'de la camisa', f: true, holgura: [4, 26], caida: 3 },
  buzo: { el: 'El buzo', de: 'del buzo', f: false, holgura: [4, 36], caida: 5 },
  campera: { el: 'La campera', de: 'de la campera', f: true, holgura: [4, 36], caida: 5 },
};

function superior(t, P, perfil, op) {
  const hemY = P.hps - (t.largo ?? 60);
  const doblada = !!op.mangaDoblada && (t.tipo === 'remera' || t.tipo === 'camisa');
  const caida = t.caida_hombro ?? 1;
  const manga = Math.max(3, caida + (t.largo_manga ?? 22) - (doblada ? 4 : 0));
  const frac = manga / P.brazo;
  return {
    tipo: t.tipo, dedosBajoCintura: (P.cintura - hemY) / DEDO, caida, doblada,
    mangaZona: frac < 0.2 ? 'hombro' : frac < 0.42 ? 'mitad de bíceps' : frac < 0.62 ? 'codo' : frac < 0.85 ? 'antebrazo' : frac <= 1.05 ? 'muñeca' : 'mano',
    holguraPecho: 2 * (t.ancho_pecho ?? 54) - (perfil.pecho || 100),
  };
}

// Mide lo que se puede decir de la combinación elegida.
export function infoPrendas(look, items, perfil, op = {}) {
  const P = puntos(perfil);
  const g = id => (id ? items.get(id) : null);
  const info = {};
  const calzado = g(look.shoes);
  const apoyo = calzado && (calzado.tipo === 'zapatilla' || calzado.tipo === 'zapato') ? (calzado.cana === 'botita' ? 11.5 : 8.6) : P.tobillo + 0.5;
  info.apoyo = apoyo;

  const top = g(look.top);
  const capa = g(look.capa);
  const capaConManga = capa && SUPERIOR[capa.tipo] ? capa : null;
  if (top && SUPERIOR[top.tipo]) {
    info.top = { ...superior(top, P, perfil, op), tapada: !!capaConManga };
  } else if (top?.tipo === 'musculosa') {
    info.top = { tipo: 'musculosa', dedosBajoCintura: (P.cintura - (P.hps - (top.largo ?? 56))) / DEDO };
  }
  if (capaConManga) {
    info.capa = superior(capaConManga, P, perfil, op);
    if (top && info.top) {
      // Cuánto más ancha es la capa que la prenda de abajo, y cuánto asoma la de abajo por debajo de la capa.
      info.capa.sobre = { holgura: (capaConManga.ancho_pecho ?? 54) - (top.ancho_pecho ?? 54), asoma: info.top.dedosBajoCintura - info.capa.dedosBajoCintura };
    }
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

function chequeoSuperior(t, ok, aviso, esCapa) {
  const N = SUPERIOR[t.tipo];
  const g = (a, o) => (N.f ? a : o);
  const d = t.dedosBajoCintura;
  const lim = t.tipo === 'buzo' || t.tipo === 'campera' ? [12, 16] : [8, 12];   // un buzo o una campera bajan más que una remera
  if (d < 0) aviso(`${N.el} ${g('es corta', 'es corto')}: ${g('termina', 'termina')} ${dedos(-d)} arriba de la cintura, se ve crop.`);
  else if (d < 2) aviso(`${N.el} ${g('es corta', 'es corto')}: el borde queda a ${dedos(d)} de la cintura, se ve crop.`);
  else if (d <= lim[0]) ok(`Largo ${N.de}: el borde queda a ${dedos(d)} bajo el cinturón.`);
  else if (d <= lim[1]) aviso(`${N.el} ${g('es algo larga', 'es algo largo')}: el borde baja ${dedos(d)} bajo el cinturón.${esCapa ? '' : ' Metela a medias para acortarla.'}`);
  else aviso(`${N.el} ${g('es larga', 'es largo')}: baja ${dedos(d)} bajo el cinturón y te tapa la cadera.`);

  if (!t.tapada) {
    const larga = t.tipo === 'buzo' || t.tipo === 'campera';
    const z = t.mangaZona;
    if (z === 'mitad de bíceps') ok('La manga llega a mitad de bíceps.');
    else if (z === 'codo') aviso(t.doblada ? 'Aun doblada, la manga llega casi al codo: doblala una vuelta más.' : t.tipo === 'remera' ? 'La manga llega al codo: doblala una vez para que llegue a mitad de bíceps.' : 'La manga llega al codo.');
    else if (z === 'antebrazo') aviso(larga ? 'La manga deja ver el antebrazo: queda corta.' : 'La manga pasa el codo.');
    else if (z === 'muñeca') ok('La manga llega a la muñeca.');
    else if (z === 'mano') aviso('La manga pasa la muñeca y te tapa la mano: arremangala o buscá una más corta.');
    else aviso('La manga es muy corta, queda en el hombro.');
  }
  if (t.caida > N.caida) aviso(`Hombro caído ${dedos(t.caida / DEDO)}: es estilo oversize, pero achica los hombros.`);
  if (t.holguraPecho < N.holgura[0]) aviso(`${N.el} ${g('queda ajustada', 'queda ajustado')} al pecho.`);
  else if (t.holguraPecho > N.holgura[1]) aviso(`Mucho volumen en el pecho: ${N.el.toLowerCase()} te tapa la forma del cuerpo.`);
}

export function chequear(info, op = {}) {
  const lista = [];
  const ok = texto => lista.push({ nivel: 'ok', texto });
  const aviso = texto => lista.push({ nivel: 'alerta', texto });

  const t = info.top;
  if (t?.tipo === 'musculosa') ok(`La musculosa baja ${dedos(t.dedosBajoCintura)} bajo el cinturón.`);
  else if (t) chequeoSuperior(t, ok, aviso, false);

  const c = info.capa;
  if (c) {
    chequeoSuperior(c, ok, aviso, true);
    if (c.sobre) {
      const N = SUPERIOR[c.tipo];
      if (c.sobre.holgura < 2) aviso(`${N.el} ${N.f ? 'va a quedar justa' : 'va a quedar justo'} sobre la prenda de abajo: buscá ${N.f ? 'una más ancha' : 'uno más ancho'}.`);
      if (c.sobre.asoma > 6) aviso(`La prenda de abajo asoma ${dedos(c.sobre.asoma)} bajo ${N.el.toLowerCase()}: se ve el escalón.`);
      else if (c.sobre.asoma >= 1.5) ok(`La prenda de abajo asoma ${dedos(c.sobre.asoma)} bajo ${N.el.toLowerCase()}: capas a la vista, queda bien.`);
    }
  }

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
