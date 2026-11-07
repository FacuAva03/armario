# Mi armario

Armario personal en forma de PWA (se instala en el celular y funciona sin conexión): las prendas que tengo,
ordenadas como en un armario, y las combinaciones para cada ocasión, armadas con las fotos de cada prenda.

- **Hoy:** la combinación del día. Las prendas elegidas quedan ordenadas donde iría cada una (remera arriba,
  pantalón abajo, calzado al pie, cadena y reloj a los costados), con su foto. Opciones de uso (manga doblada,
  remera a medias adentro, vueltas de ruedo) y un *chequeo de calce* en dedos.
- **Armario:** por secciones, como un armario de verdad: riel con perchas, estantes, zapatero y cajón de
  accesorios. Las prendas que faltan comprar van en una lista aparte.
- **Categorías:** cada prenda puede tener varias (Gym, Diario, Salir, Trabajo, Verano, Invierno, Casa o las que crees).
  Se usan para filtrar el armario y el selector de *Hoy*; los looks se filtran por ocasión.
- **Looks:** combinaciones guardadas y sugeridas, con una miniatura ordenada de cada una y si se pueden armar hoy.
- **Medidas:** las del cuerpo (para el chequeo de calce), una guía con dibujos de cómo medir cada prenda (también
  dentro del editor de cada prenda, en *¿Cómo se mide?*), exportar e importar respaldo.

Stack: HTML + CSS + JavaScript sin build, sin librerías. Firebase Spark (login con email y Firestore) para
sincronizar la compu y el celu, y GitHub Pages. Costo: $0.

## Correrlo en la compu

```bash
python -m http.server 8769 --bind 127.0.0.1
```

Abrir <http://localhost:8769>. Sin `config.js` completo la app va en **modo local** (los datos quedan solo en ese
navegador). `?demo` abre datos de ejemplo sin tocar nada.

## Cargar las prendas

En *Armario → + Prenda*: nombre, tipo, **foto** (de frente, plana sobre la cama o el piso, con luz pareja),
color (hay un botón para tomarlo de la foto), categorías y las medidas de la prenda apoyada en plano. Si todavía no hay foto,
se dibuja una silueta del color de la prenda.

## Datos personales

Las medidas reales **no van al repositorio**. En local, el archivo `seed.local.json` (ignorado por git) se usa como
punto de partida. Su formato es el del respaldo que se exporta desde *Medidas*:

```json
{ "formato": "armario", "version": 1, "perfil": { "altura": 173, "pecho": 100, "...": 0 } }
```

Puede traer también `prendas` y `outfits`; lo que falte sale de los datos de ejemplo (`js/datos.js`).

## Sincronizar compu y celu (Firebase)

1. En [Firebase](https://console.firebase.google.com) crear un proyecto **armario** (sin Analytics).
2. **Authentication → Método de acceso → Correo/contraseña.**
3. **Firestore Database** en modo producción, región `southamerica-east1`.
4. **Configuración del proyecto → Tus apps → Web** y pegar el bloque `firebaseConfig` en `config.js`
   (no es secreto: lo protegen las reglas).
5. Pegar `firestore.rules` en **Firestore → Reglas**.
6. Abrir la app, **crear la cuenta** una vez, copiar el UID (Authentication → Usuarios), ponerlo en la línea
   comentada de `firestore.rules` y publicar las reglas de nuevo: así nadie más puede usar la base.
7. En *Medidas → Importar respaldo* cargar `seed.local.json` (o un respaldo exportado) para subir los datos.

Las fotos de las prendas se guardan comprimidas (~50 KB) dentro de Firestore, porque Firebase Storage ya no es
gratis.

## Publicar

El workflow de `.github/workflows/publicar.yml` revisa la sintaxis y publica en GitHub Pages en cada push a
`main`. Solo publica el código; `seed.local.json`, los respaldos y `_archivo_3d/` están en `.gitignore`.

## Mapa del código

| Archivo | Qué hace |
|---|---|
| `js/app.js` | Interfaz: Hoy, Armario, Looks y Medidas. |
| `js/silueta.js` | Siluetas dibujadas para las prendas sin foto, y la percha. |
| `js/calce.js` | Reglas de calce en dedos (largo del short, manga, ruedo…). |
| `js/datos.js` | Tipos de prenda, categorías, medidas que se piden y datos de ejemplo. |
| `js/guia.js` | La guía de cómo medir las prendas (dibujos y tablas). |
| `js/sanear.js` | Valida todo dato que entra (colores, fotos, textos, categorías) antes de mostrarlo. |
| `js/store.js` | Datos: Firebase si hay configuración, `localStorage` si no. |

## Versión 3D (archivada)

Hubo una versión con un avatar 3D (modelo "Man base mesh" de BlakkMato, CC BY 4.0, ajustado a las medidas) que
se retiró porque no convencía. Está guardada, sin publicar, en `_archivo_3d/` por si se quiere retomar.
