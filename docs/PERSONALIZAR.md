# Personalizar la plantilla para un cliente

Objetivo: adaptar la landing a un negocio nuevo en menos de una hora tocando solo `css/tokens.css`, `js/config.js`, `index.html` y las imágenes. Al final, `node --test` y `html-validate` comprueban que no se ha quedado nada desincronizado.

## Antes de empezar: datos que pedir al cliente

- Nombre del negocio, dirección completa y teléfono con prefijo (+34…)
- Horario por días, con el cierre de mediodía si lo hay
- Servicios con nombre, descripción corta, precio y duración
- 6 a 8 fotos propias (trabajos, local) o permiso para usar fotos de banco
- 3 reseñas reales (por ejemplo, de su ficha de Google) con nombre y su permiso
- Colores de su marca (o una foto del local para sacar la paleta)
- Datos legales del titular: nombre o razón social, NIF y correo
- Dominio donde se publicará

## 1. Marca: `css/tokens.css`

Es el único archivo de estilos que se toca. Cambia los colores, las fuentes y, si quieres, el radio de las esquinas.

Comprueba el contraste de estos pares (por ejemplo, con el [comprobador de WebAIM](https://webaim.org/resources/contrastchecker/)):

| Texto / elemento | Fondo | Mínimo |
| --- | --- | --- |
| `--color-texto` y `--color-texto-suave` | `--color-fondo` y `--color-fondo-alterno` | 4,5:1 |
| `--color-texto-claro` | `--color-oscuro` | 4,5:1 |
| `--color-acento` (texto, foco y bordes en zonas oscuras) | `--color-oscuro` | 4,5:1 |
| `--color-acento-oscuro` (texto y foco en zonas claras) | `--color-fondo` y `--color-fondo-alterno` | 4,5:1 |
| `--color-oscuro` (texto del botón principal) | `--color-acento` | 4,5:1 |

Anota los valores obtenidos en los comentarios del archivo, como en la plantilla.

## 2. Datos: `js/config.js`

- `nombre`: el nombre del negocio.
- `telefono`: **con prefijo internacional** (`'+34 6XX XXX XXX'`). Sin prefijo, los enlaces de WhatsApp dan error.
- `horario`: un tramo `['HH:MM', 'HH:MM']` por cada franja de apertura, con claves `0` (domingo) a `6` (sábado). Un día cerrado es `[]`.

## 3. Contenido: `index.html`

Ve sección por sección:

1. **`<head>`:** `<title>`, `meta description` (120–160 caracteres), `og:title`, `og:description` y `theme-color` (= `--color-oscuro`).
2. **Enlaces de WhatsApp:** todos los `href="https://wa.me/…"` deben ser el enlace genérico del nuevo negocio. Genéralo desde `config.js` con este comando y sustitúyelo en todo el archivo:
   ```bash
   node --input-type=module -e "import {negocio} from './js/config.js'; import {crearEnlaceWhatsApp, mensajeCita} from './js/lib/whatsapp.js'; console.log(crearEnlaceWhatsApp(negocio.telefono, mensajeCita(negocio.nombre)))"
   ```
   Cambia también los `tel:` y el texto de los botones de llamar, manteniendo `&nbsp;` entre las cifras.
3. **Portada:** antetítulo, nombre y lema.
4. **Carta:** cada servicio tiene el nombre en `<h3>` y en `data-servicio`, el precio en `<data value="16">16&nbsp;€</data>` y la duración. El nombre de `data-servicio` es el que llega en el mensaje de WhatsApp.
5. **Sobre nosotros y reseñas:** sustituye las reseñas de ejemplo por reseñas reales y cambia el aviso de "Reseñas de ejemplo" por la fuente real (por ejemplo, "Reseñas de Google").
6. **Horario y ubicación:** la tabla de horario (⚠️ esta **no** la comprueban los tests, así que revísala a mano contra `config.js`), la dirección y el enlace "Cómo llegar" (`query=` con la dirección codificada).
7. **Pie:** contacto, Instagram (está comentado: descoméntalo con el usuario real) y **quita la frase "negocio ficticio de demostración"**.
8. **JSON-LD** (`<script type="application/ld+json">`): nombre, teléfono, dirección, `openingHoursSpecification`, `priceRange` y `hasOfferCatalog`. Los tests comprueban que el horario coincide con `config.js` y que el catálogo coincide con la carta.

## 4. Imágenes: `assets/img/`

Mantén los mismos nombres de archivo y medidas para no tener que tocar el HTML:

| Archivo | Proporción | Anchos | Uso |
| --- | --- | --- | --- |
| `hero-{480,800,1200}` | 4:5 | 480, 800, 1200 | Portada, carga prioritaria |
| `galeria-sillon-{600,1200}` | 3:2 | 600, 1200 | Foto ancha de la galería |
| `galeria-{barba,entresacar,degradado,navaja,afeitado}-{400,800}` | 4:5 | 400, 800 | Resto de la galería |
| `local-{600,1200}` | 3:2 | 600, 1200 | Foto del local |
| `og.jpg` | 1200×630 | — | Vista previa al compartir |

Cada imagen va en tres formatos: `.avif` (calidad aprox. 50), `.webp` (aprox. 72) y `.jpg` (aprox. 75). Puedes convertirlas en [squoosh.app](https://squoosh.app). Objetivo de peso: hero ≤ 120 KB y galería ≤ 80 KB en AVIF.

Actualiza los `alt` en el HTML para que describan las fotos nuevas, y `assets/img/CREDITOS.md` si son fotos de banco. Si cambias el número de fotos de la galería, ajusta `.galeria__item--ancha` y `.galeria__item--alta` para mantener la composición.

Cambia también los colores de `assets/favicon.svg`.

## 5. Páginas legales: `legal/`

Rellena todos los `[CORCHETES]` de `aviso-legal.html` y `privacidad.html`, quita el aviso de "plantilla orientativa" y **haz que las revise la asesoría del cliente**. Si añades analítica, formularios o contenido de terceros, la política de privacidad deja de ser válida y hará falta un aviso de cookies.

## 6. Al publicar

- Descomenta en el `<head>` `canonical`, `og:url` y `og:image`, con URL absolutas del dominio real.
- Configura en el hosting una caché larga (`Cache-Control: max-age=31536000`) para `assets/`, y una corta para `index.html`.

## 7. Comprobación final

```bash
node --test
```

```bash
npx --yes html-validate@9 index.html legal/*.html
```

Después, pasa Lighthouse en modo móvil sobre la web publicada. Los objetivos son los de `docs/SPEC.md`: Rendimiento ≥ 95; Accesibilidad, Buenas prácticas y SEO = 100.
