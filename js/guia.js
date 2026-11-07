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

const TXT_ZAPA = `<ul class="lista-guia">
  <li><b>Largo:</b> de la punta al talón por fuera, con la zapatilla apoyada en el piso. Un valor típico es 29 cm para un talle 41-42.</li>
  <li><b>Altura:</b> <b>baja</b> si el tobillo queda libre, <b>botita</b> si lo cubre.</li>
</ul>`;

const TXT_CADENA = `<ul class="lista-guia"><li><b>Largo:</b> estirala sobre una mesa y medí de punta a punta, sin contar el cierre.</li></ul>`;

const BASICOS = `<ul class="lista-guia">
  <li><b>Necesitás</b> una cinta métrica de costura (o una regla grande). Todo en <b>centímetros</b>.</li>
  <li><b>"En plano" significa ancho, no contorno.</b> Apoyá la prenda sobre la cama o el piso, alisala con la mano y medí de un costado al otro, en línea recta. No rodees la prenda con la cinta: la app multiplica por 2 cuando lo necesita.</li>
  <li><b>No estires la prenda</b> al medir, aunque sea elástica. Que quede relajada y sin arrugas.</li>
  <li><b>Cinta tirante</b> y pegada a la tela, sin que se hunda.</li>
  <li><b>Medí dos veces</b> cada una; si no coinciden, usá el promedio. Podés usar medio centímetro (54,5).</li>
  <li><b>Si no estás seguro</b> de una medida, tildá <i>Las medidas son estimadas</i>: el chequeo de calce avisa que es aproximado y después la corregís.</li>
</ul>`;

const TXT_MANGA_LARGA = `<p class="nota">En <b>buzos, camperas y camisas</b> el largo de manga se mide hasta el puño (o hasta el borde de la manga), y la boca de manga es el ancho del puño relajado, sin estirarlo. En el buzo, el borde de abajo suele ser más angosto que el pecho (el elástico): medilo igual, de costado a costado, sin estirarlo.</p>`;

const TXT_MEDIAS = `<ul class="lista-guia">
  <li><b>Tobillera:</b> no pasa el hueso del tobillo; con zapatillas bajas casi no se ve.</li>
  <li><b>Media caña:</b> llega justo sobre el tobillo, a unos 2 o 3 dedos.</li>
  <li><b>Larga:</b> sube hasta la pantorrilla; es la típica de gym o de fútbol.</li>
  <li>Las medias no llevan más medidas: contá el color y el largo.</li>
</ul>`;

const TXT_CINTURON = `<ul class="lista-guia"><li><b>Largo total:</b> estiralo sobre una mesa y medí desde el extremo de la hebilla hasta el último agujero. Un cinturón se compra para que el agujero que más usás quede al medio.</li></ul>`;

const TXT_SIN_MEDIDAS = `<ul class="lista-guia"><li><b>Gorras, lentes, pulseras y mochilas</b> no piden medidas: alcanza con la foto, el color y las categorías.</li></ul>`;

export const esRemera = t => t === 'remera' || t === 'musculosa';
export const esJean = t => t === 'pantalon' || t === 'short';

// Guía corta, para mostrar dentro del editor de una prenda.
export function guiaMedir(tipo) {
  if (esRemera(tipo)) return `<div class="guia-cuerpo">${SVG_REMERA}${TABLA_REMERA}</div>`;
  if (['camisa', 'buzo', 'campera'].includes(tipo)) return `<div class="guia-cuerpo">${SVG_REMERA}${TABLA_REMERA}${TXT_MANGA_LARGA}</div>`;
  if (tipo === 'medias') return `<div class="guia-cuerpo">${TXT_MEDIAS}</div>`;
  if (tipo === 'cinturon') return `<div class="guia-cuerpo">${TXT_CINTURON}</div>`;
  if (esJean(tipo)) return `<div class="guia-cuerpo">${SVG_JEAN}${TABLA_JEAN}</div>`;
  if (tipo === 'zapatilla' || tipo === 'zapato') return `<div class="guia-cuerpo">${TXT_ZAPA}</div>`;
  if (tipo === 'cadena') return `<div class="guia-cuerpo">${TXT_CADENA}</div>`;
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
    ${sec('Camisa, buzo o campera', SVG_REMERA + TABLA_REMERA + TXT_MANGA_LARGA)}
    ${sec('Jean, pantalón o short', SVG_JEAN + TABLA_JEAN)}
    ${sec('Medias', TXT_MEDIAS)}
    ${sec('Zapatillas y zapatos', TXT_ZAPA)}
    ${sec('Cadena', TXT_CADENA)}
    ${sec('Cinturón', TXT_CINTURON)}
    ${sec('Gorras, lentes y otros', TXT_SIN_MEDIDAS)}
  </div>`;
}
