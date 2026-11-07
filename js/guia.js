// Guía para medir las prendas: dibujos (SVG) y tablas. Todo es texto fijo de la app (nada viene de los datos).

const LINEA = '#b98a3e';
const letra = (cx, cy, l) => `<circle cx="${cx}" cy="${cy}" r="10" fill="#ecd08a" stroke="#7a5b25" stroke-width="1"/><text class="gl" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central">${l}</text>`;

const SVG_REMERA = `<svg class="guia-svg" viewBox="0 0 345 340" role="img" aria-label="Dónde medir una remera apoyada plana">
  <path d="M150 56 L70 76 L36 142 L76 160 L98 128 L98 300 L262 300 L262 128 L284 160 L324 142 L290 76 L210 56 Q180 84 150 56 Z" fill="#efe2c8" stroke="#b9a583" stroke-width="1.5"/>
  <g stroke="${LINEA}" stroke-width="2" stroke-linecap="round" fill="none">
    <line x1="98" y1="140" x2="262" y2="140"/><line x1="98" y1="133" x2="98" y2="147"/><line x1="262" y1="133" x2="262" y2="147"/>
    <line x1="98" y1="318" x2="262" y2="318"/><line x1="98" y1="311" x2="98" y2="325"/><line x1="262" y1="311" x2="262" y2="325"/>
    <line x1="150" y1="56" x2="150" y2="300"/><line x1="143" y1="56" x2="157" y2="56"/><line x1="143" y1="300" x2="157" y2="300"/>
    <line x1="58" y1="69" x2="24" y2="135"/><line x1="32" y1="151" x2="72" y2="169"/>
    <circle cx="290" cy="76" r="7" stroke-dasharray="3 3"/><line x1="296" y1="71" x2="306" y2="62"/>
  </g>
  ${letra(230, 140, 'A')}${letra(180, 318, 'B')}${letra(150, 230, 'C')}${letra(41, 102, 'D')}${letra(52, 160, 'E')}${letra(318, 52, 'F')}
</svg>`;

const SVG_JEAN = `<svg class="guia-svg" viewBox="60 0 270 365" role="img" aria-label="Dónde medir un jean o un short apoyado plano">
  <path d="M110 40 L250 40 L262 110 L266 320 L190 320 L182 150 L178 150 L160 320 L94 320 L98 110 Z" fill="#efe2c8" stroke="#b9a583" stroke-width="1.5"/>
  <g stroke="${LINEA}" stroke-width="2" stroke-linecap="round" fill="none">
    <line x1="110" y1="26" x2="250" y2="26"/><line x1="110" y1="19" x2="110" y2="33"/><line x1="250" y1="19" x2="250" y2="33"/>
    <line x1="98" y1="112" x2="262" y2="112"/><line x1="98" y1="105" x2="98" y2="119"/><line x1="262" y1="105" x2="262" y2="119"/>
    <line x1="97" y1="172" x2="176" y2="172"/><line x1="97" y1="165" x2="97" y2="179"/><line x1="176" y1="165" x2="176" y2="179"/>
    <line x1="94" y1="340" x2="160" y2="340"/><line x1="94" y1="333" x2="94" y2="347"/><line x1="160" y1="333" x2="160" y2="347"/>
    <line x1="264" y1="38" x2="282" y2="320"/><line x1="257" y1="38" x2="271" y2="38"/><line x1="275" y1="320" x2="289" y2="320"/>
  </g>
  ${letra(180, 26, 'A')}${letra(180, 112, 'B')}${letra(136, 172, 'C')}${letra(127, 340, 'D')}${letra(273, 180, 'E')}
</svg>`;

const fila = (l, medida, como) => `<tr><td><span class="letra">${l}</span></td><th scope="row">${medida}</th><td>${como}</td></tr>`;

const TABLA_REMERA = `<table class="tabla-guia"><tbody>
  ${fila('A', 'Ancho de pecho', 'De axila a axila, en línea recta, 2 cm bajo la axila.')}
  ${fila('B', 'Ancho del borde de abajo', 'De costado a costado, en el borde de abajo.')}
  ${fila('C', 'Largo', 'Desde el punto más alto, donde el cuello apoya sobre el hombro, hasta el borde de abajo.')}
  ${fila('D', 'Largo de manga', 'Desde la costura del hombro hasta el borde de la manga, por arriba.')}
  ${fila('E', 'Boca de manga', 'El ancho de la abertura de la manga, aplanada.')}
  ${fila('F', 'Caída del hombro', 'Cuánto baja la costura del hombro: 0 si cae justo, 3 a 5 si es oversize.')}
</tbody></table>
<p class="nota">La caída del hombro es la más difícil en plano. Si dudás, poné 0 a 1 en una remera normal y 4 si es claramente oversize. En la musculosa solo importan el ancho de pecho, el largo (del hombro al borde) y si el hueco del brazo es medio o profundo.</p>`;

const TABLA_JEAN = `<table class="tabla-guia"><tbody>
  ${fila('A', 'Cintura', 'De punta a punta del borde de arriba, con el pantalón cerrado.')}
  ${fila('B', 'Cadera', 'El ancho unos 20 cm más abajo que la cintura.')}
  ${fila('C', 'Muslo', 'El ancho de <b>una</b> pierna, justo debajo de la entrepierna.')}
  ${fila('D', 'Boca de la pierna', 'El ancho del borde de abajo de <b>una</b> pierna.')}
  ${fila('E', 'Largo total', 'De la cintura al borde de abajo, por la costura de afuera.')}
</tbody></table>`;

const SVG_MANGA_LARGA = `<svg class="guia-svg" viewBox="0 0 345 340" role="img" aria-label="Dónde medir un buzo, una campera o una camisa apoyados planos">
  <path d="M150 52 L88 70 L30 250 L68 262 L112 130 L112 300 L248 300 L248 130 L292 262 L330 250 L272 70 L210 52 Q180 80 150 52 Z" fill="#efe2c8" stroke="#b9a583" stroke-width="1.5"/>
  <g stroke="${LINEA}" stroke-width="2" stroke-linecap="round" fill="none">
    <line x1="112" y1="146" x2="248" y2="146"/><line x1="112" y1="139" x2="112" y2="153"/><line x1="248" y1="139" x2="248" y2="153"/>
    <line x1="112" y1="318" x2="248" y2="318"/><line x1="112" y1="311" x2="112" y2="325"/><line x1="248" y1="311" x2="248" y2="325"/>
    <line x1="150" y1="52" x2="150" y2="300"/><line x1="143" y1="52" x2="157" y2="52"/><line x1="143" y1="300" x2="157" y2="300"/>
    <line x1="73" y1="65" x2="15" y2="245"/><line x1="80" y1="67" x2="66" y2="63"/><line x1="22" y1="247" x2="8" y2="243"/>
    <line x1="25" y1="262" x2="63" y2="274"/><line x1="22" y1="270" x2="28" y2="256"/><line x1="60" y1="282" x2="66" y2="268"/>
    <circle cx="272" cy="70" r="7" stroke-dasharray="3 3"/><line x1="278" y1="65" x2="290" y2="52"/>
  </g>
  ${letra(230, 146, 'A')}${letra(180, 318, 'B')}${letra(150, 230, 'C')}${letra(44, 155, 'D')}${letra(22, 288, 'E')}${letra(302, 44, 'F')}
</svg>`;

const TABLA_MANGA_LARGA = `<table class="tabla-guia"><tbody>
  ${fila('A', 'Ancho de pecho', 'De axila a axila, en línea recta, 2 cm bajo la axila.')}
  ${fila('B', 'Ancho del borde de abajo', 'De costado a costado, sin estirar. En el buzo y en la campera suele ser más angosto por el elástico: medilo igual.')}
  ${fila('C', 'Largo', 'Desde el punto más alto del hombro, junto al cuello, hasta el borde de abajo. No cuentes la capucha.')}
  ${fila('D', 'Largo de manga', 'Desde la costura del hombro hasta el final del puño, por afuera de la manga estirada hacia abajo.')}
  ${fila('E', 'Boca de manga', 'El ancho del puño relajado, sin estirarlo. Un puño de buzo da unos 9 a 11 cm.')}
  ${fila('F', 'Caída del hombro', 'Cuánto baja la costura del hombro: 0 a 1 si cae justo, 3 a 5 si es oversize.')}
</tbody></table>
<ul class="lista-guia">
  <li><b>Camisa:</b> abrochala antes de medir, y no cuentes el cuello.</li>
  <li><b>Campera:</b> cerrala con el cierre antes de medir.</li>
  <li><b>Capucha:</b> no se mide, solo tildá la casilla <i>Tiene capucha</i>. Para la foto, dejala <b>hacia abajo</b>, apoyada plana sobre la espalda: en la foto de frente casi no se ve, y en la del dorso se ve entera. Con la capucha puesta la prenda se deforma y el largo cambia.</li>
  <li><b>Check rápido:</b> con un largo de brazo de 56 cm, una manga de unos 60 cm (con la caída incluida) te llega a la muñeca; más de 64 cm te tapa la mano.</li>
</ul>`;

const SVG_MEDIAS = `<svg class="guia-svg" viewBox="0 0 345 290" role="img" aria-label="Largos de medias sobre una pierna de costado">
  <path d="M120 12 H180 V212 L262 226 Q292 232 292 252 Q292 268 270 268 H132 Q118 268 118 252 Z" fill="#efe2c8" stroke="#b9a583" stroke-width="1.5"/>
  <circle cx="150" cy="222" r="6" fill="none" stroke="#b9a583" stroke-width="1.5" stroke-dasharray="3 3"/>
  <g stroke="${LINEA}" stroke-width="2" stroke-linecap="round" fill="none" stroke-dasharray="6 5">
    <line x1="100" y1="80" x2="200" y2="80"/><line x1="100" y1="196" x2="200" y2="196"/><line x1="100" y1="240" x2="205" y2="240"/>
  </g>
  ${letra(222, 80, 'A')}${letra(222, 196, 'B')}${letra(228, 240, 'C')}
  <text class="gl" x="150" y="285" text-anchor="middle" font-size="11" fill="#7a5b25">círculo punteado: hueso del tobillo</text>
</svg>`;

const TABLA_MEDIAS = `<table class="tabla-guia"><tbody>
  ${fila('A', 'Larga', 'Sube hasta la pantorrilla. Es la típica de gym o de fútbol: elegí <i>Larga</i>.')}
  ${fila('B', 'Media caña', 'Llega 2 o 3 dedos sobre el hueso del tobillo: elegí <i>Media caña</i>. Es la más usada para todos los días.')}
  ${fila('C', 'Tobillera', 'Termina bajo el hueso del tobillo y con zapatillas bajas casi no se ve: elegí <i>Tobillera</i>.')}
</tbody></table>
<p class="nota">Las medias no llevan centímetros: solo elegís el largo, el color y la foto. Para la foto, abrilas planas sobre un fondo liso.</p>`;

const SVG_ZAPA = `<svg class="guia-svg" viewBox="0 0 345 210" role="img" aria-label="Dónde medir una zapatilla de costado">
  <path d="M34 148 V58 H100 L106 84 Q132 118 180 122 Q300 122 310 146 V148 Z" fill="#efe2c8" stroke="#b9a583" stroke-width="1.5" stroke-linejoin="round"/>
  <rect x="30" y="148" width="284" height="16" rx="6" fill="#d9c9a8" stroke="#b9a583" stroke-width="1.5"/>
  <g stroke="${LINEA}" stroke-width="2" stroke-linecap="round" fill="none">
    <line x1="30" y1="188" x2="314" y2="188"/><line x1="30" y1="181" x2="30" y2="195"/><line x1="314" y1="181" x2="314" y2="195"/>
    <line x1="14" y1="58" x2="112" y2="58" stroke-dasharray="6 5"/>
  </g>
  ${letra(172, 188, 'A')}${letra(128, 58, 'B')}
</svg>`;

const TABLA_ZAPA = `<table class="tabla-guia"><tbody>
  ${fila('A', 'Largo', 'De la punta al talón por fuera, con la zapatilla apoyada en el piso (no la plantilla). Un valor típico es 29 cm para un talle 41-42.')}
  ${fila('B', 'Altura', 'Si el borde de arriba cubre el hueso del tobillo (línea punteada), elegí <b>Botita</b> o <b>Alto</b>. Si el tobillo queda libre, <b>Baja</b>.')}
</tbody></table>
<ul class="lista-guia">
  <li><b>Zapatos y mocasines:</b> son <i>Bajo</i>. <b>Borcegos y botas:</b> son <i>Alto</i>.</li>
  <li><b>Ojotas:</b> elegí <i>Bajo</i> y cargá el largo de la suela.</li>
  <li>El logo del costado solo cambia el dibujo cuando no hay foto.</li>
</ul>`;

const SVG_CINTURON = `<svg class="guia-svg" viewBox="0 0 345 150" role="img" aria-label="Dónde medir un cinturón estirado">
  <rect x="44" y="52" width="290" height="26" rx="5" fill="#d8c3a0" stroke="#b9a583" stroke-width="1.5"/>
  <rect x="8" y="40" width="46" height="50" rx="9" fill="none" stroke="#8c929b" stroke-width="5"/><line x1="22" y1="65" x2="62" y2="65" stroke="#8c929b" stroke-width="3" stroke-linecap="round"/>
  <g fill="#7a5b25"><circle cx="210" cy="65" r="3.5"/><circle cx="230" cy="65" r="3.5"/><circle cx="250" cy="65" r="3.5"/><circle cx="270" cy="65" r="3.5"/><circle cx="290" cy="65" r="3.5"/></g>
  <g stroke="${LINEA}" stroke-width="2" stroke-linecap="round" fill="none">
    <line x1="8" y1="118" x2="334" y2="118"/><line x1="8" y1="111" x2="8" y2="125"/><line x1="334" y1="111" x2="334" y2="125"/>
    <line x1="44" y1="26" x2="250" y2="26" stroke-dasharray="6 5"/><line x1="44" y1="20" x2="44" y2="32"/><line x1="250" y1="20" x2="250" y2="32"/>
  </g>
  ${letra(171, 118, 'A')}${letra(147, 26, 'B')}
</svg>`;

const TABLA_CINTURON = `<table class="tabla-guia"><tbody>
  ${fila('A', 'Largo total', 'Estirado sobre una mesa, de la punta de la hebilla a la punta de la correa. Es el número que carga la app.')}
  ${fila('B', 'Hasta tu agujero', 'Opcional: de la hebilla al agujero que usás. Un cinturón sirve cuando ese agujero queda más o menos en el medio.')}
</tbody></table>`;

const TXT_CADENA = `<ul class="lista-guia"><li><b>Largo:</b> estirala sobre una mesa y medí de punta a punta, sin contar el cierre. Una de 50 cm te queda justo al cuello; una de 60 cm te llega al pecho.</li></ul>`;

const BASICOS = `<ul class="lista-guia">
  <li><b>Necesitás</b> una cinta métrica de costura (o una regla grande). Todo en <b>centímetros</b>.</li>
  <li><b>"En plano" significa ancho, no contorno.</b> Apoyá la prenda sobre la cama o el piso, alisala con la mano y medí de un costado al otro, en línea recta. No rodees la prenda con la cinta: la app multiplica por 2 cuando lo necesita.</li>
  <li><b>No estires la prenda</b> al medir, aunque sea elástica. Que quede relajada y sin arrugas.</li>
  <li><b>Cinta tirante</b> y pegada a la tela, sin que se hunda.</li>
  <li><b>Medí dos veces</b> cada una; si no coinciden, usá el promedio. Podés usar medio centímetro (54,5).</li>
  <li><b>Si no estás seguro</b> de una medida, tildá <i>Las medidas son estimadas</i>: el chequeo de calce avisa que es aproximado y después la corregís.</li>
  <li><b>Qué tiene cada tipo:</b> remera, musculosa, camisa, buzo, campera, pantalón y short tienen dibujo y tabla; medias, calzado y cinturón tienen su dibujo; gorra, lentes, pulsera y mochila no piden medidas.</li>
</ul>`;

const TXT_SIN_MEDIDAS = `<ul class="lista-guia">
  <li><b>Gorras, lentes, pulseras, anillos y mochilas</b> no piden medidas: alcanza con la foto, el color y las categorías.</li>
  <li><b>Reloj:</b> tampoco pide medidas, solo color y foto.</li>
  <li>Para la foto de estas cosas: sobre un fondo liso, de frente, con luz pareja.</li>
</ul>`;

export const esRemera = t => t === 'remera' || t === 'musculosa';
export const esJean = t => t === 'pantalon' || t === 'short';

// Guía corta, para mostrar dentro del editor de una prenda.
export function guiaMedir(tipo) {
  const c = x => `<div class="guia-cuerpo">${x}</div>`;
  if (esRemera(tipo)) return c(SVG_REMERA + TABLA_REMERA);
  if (['camisa', 'buzo', 'campera'].includes(tipo)) return c(SVG_MANGA_LARGA + TABLA_MANGA_LARGA);
  if (esJean(tipo)) return c(SVG_JEAN + TABLA_JEAN);
  if (tipo === 'medias') return c(SVG_MEDIAS + TABLA_MEDIAS);
  if (tipo === 'zapatilla' || tipo === 'zapato') return c(SVG_ZAPA + TABLA_ZAPA);
  if (tipo === 'cinturon') return c(SVG_CINTURON + TABLA_CINTURON);
  if (tipo === 'cadena') return c(TXT_CADENA);
  return '';
}

// Guía completa, para la pestaña Medidas.
export function guiaCompleta() {
  const sec = (titulo, cuerpo, abierta = false) => `<details class="guia"${abierta ? ' open' : ''}><summary>${titulo}</summary><div class="guia-cuerpo">${cuerpo}</div></details>`;
  return `<div class="tarjeta guia-tarjeta">
    <h3>Cómo medir tus prendas</h3>
    <p class="nota">Se miden con la prenda apoyada plana. Tocá cada sección para ver el dibujo y dónde va la cinta.</p>
    ${sec('Antes de empezar', BASICOS, true)}
    ${sec('Remera o musculosa', SVG_REMERA + TABLA_REMERA)}
    ${sec('Camisa, buzo o campera', SVG_MANGA_LARGA + TABLA_MANGA_LARGA)}
    ${sec('Jean, pantalón o short', SVG_JEAN + TABLA_JEAN)}
    ${sec('Medias', SVG_MEDIAS + TABLA_MEDIAS)}
    ${sec('Zapatillas, zapatos y borcegos', SVG_ZAPA + TABLA_ZAPA)}
    ${sec('Cinturón', SVG_CINTURON + TABLA_CINTURON)}
    ${sec('Cadena', TXT_CADENA)}
    ${sec('Gorras, lentes y otros', TXT_SIN_MEDIDAS)}
  </div>`;
}
