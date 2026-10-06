# Spec: Landing para negocio local (plantilla barbería/peluquería)

> Estado: **APROBADA** (2026-10-06).

## Objetivo

Construir una plantilla de landing page de una sola página para barberías y peluquerías de barrio, que Daniel pueda personalizar y vender a negocios locales de Valencia.

**Para quién:**
- **El cliente final** (vecino del barrio, casi siempre desde el móvil): quiere saber en segundos qué servicios hay, cuánto cuestan, dónde está el local, cuándo abre y cómo pedir cita.
- **El dueño del negocio**: quiere que le lleguen citas por WhatsApp o teléfono y tener presencia en Google.
- **Daniel**: quiere reutilizar la plantilla para cada cliente cambiando datos, colores y fotos en menos de una hora.

**Historias de usuario:**
- Como cliente, desde el móvil, veo nada más entrar el nombre del negocio, qué hace y un botón para pedir cita.
- Como cliente, consulto la lista de servicios con su precio y duración.
- Como cliente, veo el horario de apertura y la dirección, y abro la ruta en mi app de mapas con un toque.
- Como cliente, pido cita por WhatsApp con un mensaje ya escrito, o llamo con un toque.
- Como cliente, veo fotos de trabajos reales y alguna reseña.
- Como dueño, mi negocio aparece bien en Google gracias a los datos estructurados de negocio local.
- Como Daniel, cambio la marca de un cliente editando un archivo de tokens CSS y los datos editando `index.html`.

## Contenido de la página (secciones)

1. **Cabecera:** logo o nombre, navegación por anclas y botón "Pedir cita".
2. **Hero:** nombre, propuesta de valor en una frase, botón de WhatsApp y botón de llamar, y una foto principal.
3. **Servicios:** lista con nombre, descripción corta, precio y duración.
4. **Galería:** de 6 a 8 fotos de trabajos.
5. **Sobre nosotros:** texto breve (la subsección de equipo queda fuera de la v1).
6. **Reseñas:** 3 testimonios (con la nota "reseñas de Google", sin incrustar widgets).
7. **Horario y ubicación:** tabla de horario, dirección, enlace "Cómo llegar" a Google Maps y, en vez de un mapa incrustado, una imagen estática o una ilustración.
8. **Contacto / pie:** teléfono, WhatsApp, Instagram, enlaces legales (aviso legal y privacidad) y el crédito "Web por Daniel Escalante".

El contenido de demostración usa un **negocio ficticio**, marcado como tal. No se usan nombres, logos ni fotos de negocios reales.

## Stack

- HTML5 semántico, CSS3 (custom properties, Grid/Flexbox, `clamp()`) y JavaScript vanilla (ES2020+, módulos).
- Sin frameworks, sin build y sin dependencias en producción.
- Fuentes: pila de fuentes del sistema o una sola fuente variable alojada en el propio sitio (`woff2`). No se carga nada de Google Fonts ni de otros dominios.
- Imágenes en AVIF/WebP con `<picture>` y respaldo JPEG, con `width` y `height` declarados.
- Hosting: cualquier hosting estático (IONOS, Netlify, GitHub Pages).

## Comandos

```bash
# Servidor local (no instala nada en el proyecto)
npx --yes serve@14 . -l 5173

# Tests de la lógica JS (runner nativo de Node, sin dependencias)
node --test

# Validar el HTML
npx --yes html-validate@9 index.html legal/*.html
```

Auditoría de calidad: **Lighthouse** desde el MCP de Chrome DevTools contra `http://localhost:5173`, versión móvil.

## Estructura del proyecto

```
index.html            → La landing (todo el contenido indexable vive aquí)
legal/
  aviso-legal.html    → Plantilla de aviso legal
  privacidad.html     → Plantilla de política de privacidad
css/
  tokens.css          → Marca del cliente: colores, tipografía, radios, espaciado (lo ÚNICO que se toca para cambiar de marca)
  base.css            → Reset, tipografía base y utilidades
  components.css      → Estilos por sección/componente
js/
  config.js           → Datos de contacto usados por JS (teléfono, WhatsApp, mensaje por defecto)
  main.js             → Menú móvil, enlaces de WhatsApp, horario "abierto ahora"
  lib/                → Funciones puras y testeables (p. ej. hours.js, whatsapp.js)
assets/
  img/                → Imágenes optimizadas
  fonts/              → Fuente propia (si se usa)
tests/                → Tests con node:test de js/lib/
docs/
  SPEC.md             → Este documento
  PERSONALIZAR.md     → Guía paso a paso para adaptar la plantilla a un cliente
tasks/                → plan.md y todo.md (fase de planificación)
```

## Estilo de código

- **HTML:** semántico (`header`, `nav`, `main`, `section` con `aria-labelledby`, `footer`) y en español (`lang="es"`). Una sola `h1`.
- **CSS:** metodología BEM ligera (`.servicios__item`, `.boton--whatsapp`). Todo color, tipografía y espaciado sale de los tokens; no hay valores sueltos en los componentes. Mobile-first.
- **JS:** módulos ES, sin globales. Las funciones puras van en `js/lib/` y el acceso al DOM en `main.js`. `camelCase` para variables y funciones, nombres en español cuando son de dominio (`estaAbierto`, `crearEnlaceWhatsApp`).
- **Mejora progresiva:** la página se lee y se puede usar entera sin JavaScript. JS solo añade comodidad (menú, estado "abierto ahora").
- Archivos en kebab-case.

```css
/* css/tokens.css: cambiar de cliente = cambiar este bloque */
:root {
  --color-marca: #1f3a34;
  --color-acento: #c8a464;
  --color-fondo: #faf8f5;
  --color-texto: #1b1b1b;
  --fuente-titulos: "Fraunces", Georgia, serif;
  --fuente-texto: system-ui, -apple-system, "Segoe UI", sans-serif;
  --radio: 6px;
}
```

```js
// js/lib/whatsapp.js
export function crearEnlaceWhatsApp(telefono, mensaje) {
  const numero = telefono.replace(/\D/g, '');
  if (numero.length < 9) throw new Error(`Teléfono no válido: ${telefono}`);
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
```

## Estrategia de testing

| Nivel | Qué | Cómo |
| --- | --- | --- |
| Unitario | Funciones de `js/lib/` (enlace de WhatsApp, cálculo de "abierto ahora" con el horario, incluidos el cierre a mediodía y los domingos) | `node --test` |
| Validación | HTML válido en todas las páginas | `html-validate` |
| Navegador | Sin errores ni warnings en consola, peticiones solo al propio dominio, capturas a 375 px, 768 px y 1280 px | MCP de Chrome DevTools |
| Calidad | Lighthouse móvil: Rendimiento, Accesibilidad, Buenas prácticas y SEO | MCP de Chrome DevTools |
| Manual | Funciona sin JS, navegación con teclado y foco visible | Revisión en el navegador |

Cobertura: el 100 % de las funciones de `js/lib/`. El código de DOM de `main.js` se verifica en el navegador.

## Límites

- **Siempre:**
  - pasar los tests y la validación de HTML antes de cada commit;
  - commits pequeños y atómicos (uno por tarea);
  - usar los tokens CSS;
  - dar a las imágenes `alt`, `width` y `height`;
  - mantener contraste AA;
  - dejar la consola limpia.
- **Preguntar antes:**
  - añadir cualquier dependencia, script externo o recurso de otro dominio;
  - incrustar mapas, vídeos o widgets de terceros, porque traen cookies y afectan al rendimiento;
  - añadir formularios que envíen datos personales;
  - cambiar la estructura de carpetas;
  - hacer push al repositorio remoto.
- **Nunca:**
  - subir secretos o archivos `.env`;
  - usar contenido, marcas o fotos de un negocio real sin permiso;
  - añadir analytics o rastreadores;
  - usar `innerHTML` con datos;
  - dar por hecha una tarea sin verificarla.

## Criterios de éxito

1. **Lighthouse móvil:** Rendimiento ≥ 95, Accesibilidad = 100, Buenas prácticas = 100 y SEO = 100.
2. **Core Web Vitals en laboratorio:** LCP ≤ 2,5 s, CLS ≤ 0,1 y TBT ≤ 200 ms.
3. **Peso total** de la carga inicial ≤ 500 KB y **0 peticiones a dominios de terceros**, así que no hace falta banner de cookies.
4. **Accesibilidad WCAG 2.1 AA:** se puede usar entera con teclado, el foco es visible y el contraste cumple AA.
5. **Responsive** sin scroll horizontal de 320 px a 1920 px.
6. **Sin JavaScript**, todo el contenido es visible y los botones de WhatsApp y llamar funcionan (son enlaces normales).
7. **Botones de contacto:**
   - el de WhatsApp abre `wa.me` con el mensaje ya escrito;
   - el de llamar usa `tel:`;
   - "Cómo llegar" abre la ruta en Maps.
8. **Datos estructurados:** JSON-LD `HairSalon`/`LocalBusiness` con nombre, dirección, teléfono, horario y precios, sin errores en el validador de Schema.org.
9. **Personalizable** cambiando solo `css/tokens.css`, `js/config.js`, `index.html` y las imágenes, siguiendo `docs/PERSONALIZAR.md`.
10. **Estética propia, sin la "estética de IA":**
    - sin degradados morados;
    - sin `rounded-2xl` por todas partes;
    - sin rejillas de tarjetas idénticas.

    La jerarquía visual la marca el contenido.
11. `node --test` y `html-validate` pasan sin errores.

## Decisiones (antes preguntas abiertas)

1. **Estilo:** barbería clásica, con paleta oscura y acentos dorados o latón, tipografía serif en los títulos y estética de oficio tradicional.
2. **Fotos:** de Unsplash, optimizadas en local (AVIF/WebP + JPEG), con autor y licencia anotados en `assets/img/CREDITOS.md`.
3. **Idioma:** solo castellano.
4. **GitHub Pages:** pendiente; se decidirá al terminar la v1.
5. **Sección "Equipo":** opcional, fuera de la v1. La v1 incluye un "Sobre nosotros" breve.
