# Tareas: Landing barbería clásica

Plan: [`plan.md`](plan.md) · Spec: [`../docs/SPEC.md`](../docs/SPEC.md)

**Definition of Done de cada tarea:**
- se cumplen sus criterios de aceptación;
- `npx --yes html-validate@9 index.html legal/*.html` sin errores;
- `node --test tests/` en verde (si hay tests);
- consola limpia en el navegador;
- un commit atómico.

Comandos:
- Servidor: `npx --yes serve@14 . -l 5173`
- Tests: `node --test tests/`

---

## Fase 1: Base y riesgos

### Task 1: Esqueleto semántico, tokens de marca y estilos base

**Description:** Crear `index.html` con la estructura semántica completa: `header`, `nav`, `main` con una `section` vacía y con su id por cada parte de la spec, y `footer`. Una sola `h1`, `lang="es"` y meta viewport. Definir la marca de barbería clásica en `tokens.css`, más el reset y la tipografía base.

**Acceptance criteria:**
- [x] Todas las secciones de la spec existen como `section` con `id` y `aria-labelledby`
- [x] Ningún color, fuente ni radio está escrito fuera de `tokens.css`
- [x] El contraste del texto base sobre el fondo cumple AA (≥ 4,5:1)

**Verification:**
- [x] `html-validate` sin errores
- [x] Página servida en `localhost:5173` sin errores de consola
- [x] Manual: la estructura de encabezados es lógica (h1 → h2 por sección)

**Dependencies:** Ninguna
**Files:** `index.html`, `css/tokens.css`, `css/base.css`
**Scope:** S

### Task 2: Hero con botones de llamar y WhatsApp

**Description:** El hero con el nombre del negocio, su propuesta de valor y dos llamadas a la acción: "Pedir cita por WhatsApp" (`https://wa.me/...` con el mensaje ya codificado en el HTML) y "Llamar" (`tel:`). Funciona sin JS. Usa una imagen provisional de color sólido hasta T3.

**Acceptance criteria:**
- [x] A 375 px el nombre y los dos botones se ven sin hacer scroll
- [x] Los botones son enlaces reales (`<a>`) con texto descriptivo, área táctil ≥ 44×44 px y foco visible
- [x] El enlace de WhatsApp abre `wa.me` con el número y el mensaje correctos

**Verification:**
- [x] `html-validate` sin errores
- [x] Manual o DevTools: capturas a 375 y 1280 px; navegación con Tab hasta los dos botones

**Dependencies:** T1
**Files:** `index.html`, `css/components.css`
**Scope:** S

### Task 3: Flujo de imágenes de Unsplash optimizadas (aplicado al hero)

**Description:** Elegir las fotos de Unsplash (hero, galería y ubicación), descargarlas recortadas y convertirlas a AVIF, WebP y JPEG en 2 o 3 anchos. Aplicar la del hero con `<picture>`, `srcset`, `sizes`, `width`/`height` y `fetchpriority="high"`. Anotar autor y licencia.

**Acceptance criteria:**
- [x] La imagen del hero pesa ≤ 120 KB en AVIF al ancho móvil, y ninguna imagen de la galería pasa de 80 KB
- [x] Todas tienen `alt` descriptivo y `width`/`height`
- [x] `assets/img/CREDITOS.md` recoge autor, enlace y licencia de cada foto

**Verification:**
- [x] DevTools (pestaña Red): el hero sirve AVIF y no hay peticiones a `images.unsplash.com` en tiempo de ejecución
- [x] Manual: no hay saltos de maquetación al cargar el hero

**Dependencies:** T2 (herramienta: `npx sharp-cli`, aprobada)
**Files:** `assets/img/*`, `assets/img/CREDITOS.md`, `index.html`, `css/components.css`
**Scope:** M

### Checkpoint 1: base
- [x] Validación limpia, consola limpia y hero correcto a 375, 768 y 1280 px
- [ ] Revisión de la estética de marca con Daniel
- [x] Push (si se aprueba)

---

## Fase 2: Contenido principal

### Task 4: Sección de servicios con precios y duración

**Description:** La carta de servicios con 6 a 8 servicios (corte clásico, degradado, arreglo de barba, afeitado a navaja con toalla caliente…), cada uno con nombre, descripción corta, precio y duración. Maquetada como una carta de barbería (líneas de puntos hasta el precio), no como tarjetas idénticas.

**Acceptance criteria:**
- [ ] La lista es semántica (`ul`/`li` o `dl`) y el precio usa formato español ("15 €")
- [ ] Se lee bien desde 320 px hasta 1920 px, sin scroll horizontal
- [ ] Cada servicio tiene un botón "Pedir" que, sin JS, abre el WhatsApp genérico

**Verification:**
- [ ] `html-validate` sin errores
- [ ] Capturas a 320, 768 y 1280 px

**Dependencies:** T1
**Files:** `index.html`, `css/components.css`
**Scope:** S

### Task 5: Horario y ubicación con indicador "abierto ahora"

**Description:** Tabla de horario, dirección, enlace "Cómo llegar" a Google Maps e imagen estática del local. Añadir la función pura `estaAbierto(horario, fecha)` en `js/lib/horario.js`, con el horario de `js/config.js`. `main.js` muestra "Abierto ahora · cierra a las 20:00" o "Cerrado · abre el lunes a las 10:00".

**Acceptance criteria:**
- [ ] Los tests cubren: dentro de horario, cierre de mediodía, domingo cerrado, el minuto exacto de apertura y de cierre, y el cálculo de la próxima apertura
- [ ] El cálculo usa la hora de `Europe/Madrid`, sea cual sea la zona horaria del visitante
- [ ] Sin JS, la tabla de horario se ve completa y el indicador no aparece

**Verification:**
- [ ] `node --test tests/` en verde
- [ ] DevTools: el indicador coincide con la hora real; consola limpia

**Dependencies:** T1 y T3 (imagen del local)
**Files:** `index.html`, `css/components.css`, `js/config.js`, `js/lib/horario.js`, `tests/horario.test.js` (+ `js/main.js`)
**Scope:** M

### Task 6: WhatsApp con el servicio elegido ya en el mensaje

**Description:** `crearEnlaceWhatsApp(telefono, mensaje)` en `js/lib/whatsapp.js`. `main.js` mejora los botones "Pedir" de cada servicio para que el mensaje diga "Hola, quiero cita para: Afeitado a navaja". Si no hay JS, el enlace genérico del HTML sigue funcionando.

**Acceptance criteria:**
- [ ] Se limpian los caracteres no numéricos del teléfono y el mensaje va codificado (tildes, ñ, €)
- [ ] Un teléfono no válido lanza un error claro (cubierto por test)
- [ ] El texto del servicio se lee con `textContent`, nunca con `innerHTML`

**Verification:**
- [ ] `node --test tests/` en verde
- [ ] DevTools: pulsar "Pedir" en dos servicios distintos genera dos URL `wa.me` distintas y correctas

**Dependencies:** T4
**Files:** `js/lib/whatsapp.js`, `tests/whatsapp.test.js`, `js/main.js`, `js/config.js`
**Scope:** S

### Checkpoint 2: flujo de cita completo
- [ ] `node --test tests/` en verde
- [ ] Recorrido completo: ver un servicio, pedir cita por WhatsApp y consultar horario y ruta
- [ ] Con JS desactivado todo se ve y los enlaces funcionan
- [ ] Revisión con Daniel y push

---

## Fase 3: Resto de contenido y SEO

### Task 7: Galería, Sobre nosotros y Reseñas

**Description:** Galería de 6 a 8 fotos con `loading="lazy"`, un texto breve de "Sobre nosotros" y 3 reseñas con autor, la nota "Reseñas de Google" y estrellas accesibles (texto "5 de 5" para lectores de pantalla).

**Acceptance criteria:**
- [ ] Las imágenes de la galería se cargan en diferido y no provocan saltos de maquetación
- [ ] Las estrellas tienen una alternativa textual accesible
- [ ] La galería no es una rejilla uniforme genérica: tiene una composición con jerarquía

**Verification:**
- [ ] `html-validate` sin errores
- [ ] DevTools: las imágenes de la galería no se piden en la carga inicial (lazy)

**Dependencies:** T3
**Files:** `index.html`, `css/components.css`
**Scope:** S

### Task 8: Navegación móvil, pie y páginas legales

**Description:** Menú de anclas, con un botón hamburguesa accesible en móvil (`aria-expanded`, cierre con Esc, foco gestionado). Sin JS, el menú se ve desplegado. Pie con contacto, Instagram, enlaces legales, crédito y la nota "Negocio ficticio de demostración". Plantillas de `legal/aviso-legal.html` y `legal/privacidad.html`.

**Acceptance criteria:**
- [ ] El menú móvil funciona con teclado (abrir, recorrer y cerrar con Esc devolviendo el foco al botón)
- [ ] Sin JS, todos los enlaces de navegación son visibles y se pueden usar
- [ ] Las páginas legales comparten estilos y vuelven a la portada

**Verification:**
- [ ] `html-validate index.html legal/*.html` sin errores
- [ ] DevTools: recorrido con teclado a 375 px

**Dependencies:** T1
**Files:** `index.html`, `css/components.css`, `js/main.js`, `legal/aviso-legal.html`, `legal/privacidad.html`
**Scope:** M

### Task 9: Metadatos SEO, Open Graph y JSON-LD `HairSalon`

**Description:** `title`, `meta description`, canonical, Open Graph con imagen, favicon y JSON-LD `HairSalon` con dirección, teléfono, `openingHoursSpecification` (igual que `config.js`) y los servicios con precio.

**Acceptance criteria:**
- [ ] El JSON-LD es válido y su horario coincide con `js/config.js` y con la tabla del HTML
- [ ] La `meta description` tiene entre 120 y 160 caracteres
- [ ] El favicon y la imagen Open Graph están en local

**Verification:**
- [ ] El JSON-LD se analiza sin errores (`JSON.parse` en DevTools y validador de Schema.org)
- [ ] `html-validate` sin errores

**Dependencies:** T4 y T5
**Files:** `index.html`, `assets/img/og.jpg`, `assets/favicon.svg`
**Scope:** S

### Checkpoint 3: página completa
- [ ] Todas las secciones de la spec están presentes, el HTML es válido y los tests pasan
- [ ] Revisión con Daniel y push

---

## Fase 4: Verificación y documentación

### Task 10: Auditoría en navegador

**Description:** Pasada completa con el MCP de Chrome DevTools: consola, red (0 peticiones a terceros), capturas a 320, 375, 768, 1280 y 1920 px, recorrido con teclado y prueba con JS desactivado. Corregir lo que salga.

**Acceptance criteria:**
- [ ] 0 errores y 0 warnings en consola; 0 peticiones a otros dominios
- [ ] Sin scroll horizontal en ningún ancho
- [ ] Criterios de éxito 4, 5, 6 y 7 de la spec comprobados con evidencia (capturas o salida)

**Verification:**
- [ ] Informe breve con capturas en el mensaje del commit o en el PR

**Dependencies:** T1–T9
**Files:** los que necesiten arreglo
**Scope:** S–M

### Task 11: Lighthouse móvil y rendimiento

**Description:** Lighthouse móvil con el MCP de DevTools. Medir, arreglar el cuello de botella real, volver a medir y quedarse el cambio o revertirlo, hasta cumplir los objetivos de la spec.

**Acceptance criteria:**
- [ ] Rendimiento ≥ 95, y 100 en Accesibilidad, Buenas prácticas y SEO
- [ ] LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms y peso inicial ≤ 500 KB

**Verification:**
- [ ] Puntuaciones antes y después anotadas en el commit

**Dependencies:** T10
**Files:** los que necesiten arreglo
**Scope:** S–M

### Task 12: Documentación de personalización

**Description:** `docs/PERSONALIZAR.md` con el paso a paso para adaptar la plantilla a un cliente nuevo en menos de una hora (tokens, config, contenido, imágenes y mantener sincronizados horario y JSON-LD). Actualizar el README con capturas y estado.

**Acceptance criteria:**
- [ ] Siguiendo solo la guía, un cambio de marca toca únicamente los archivos que dice la spec
- [ ] El README explica qué es, cómo arrancarlo y cómo personalizarlo

**Verification:**
- [ ] Prueba: cambiar los tokens a otra paleta siguiendo la guía; la página sigue siendo válida y con contraste AA

**Dependencies:** T1–T11
**Files:** `docs/PERSONALIZAR.md`, `README.md`
**Scope:** S

### Checkpoint final
- [ ] Los 11 criterios de éxito de la spec, con evidencia
- [ ] Definition of Done cumplida
- [ ] Aprobación de Daniel y decisión sobre GitHub Pages
