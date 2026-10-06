# Verificación contra los criterios de éxito

Comprobaciones hechas el 2026-10-06 sobre `http://localhost:5173` con el MCP de Chrome DevTools (Chrome estable), `puppeteer-core` para la prueba sin JavaScript, `html-validate@9` y `node --test`.

## T10: auditoría en navegador

### Responsive (criterio 5)

Sin scroll horizontal y sin ningún elemento fuera del viewport en ninguno de los cinco anchos:

| Ancho | Dispositivo emulado | Scroll horizontal | Elementos desbordados |
| --- | --- | --- | --- |
| 320 px | móvil, DPR 2 | no | 0 |
| 375 px | móvil, DPR 2 | no | 0 |
| 768 px | escritorio, DPR 1 | no | 0 |
| 1280 px | escritorio, DPR 1 | no | 0 |
| 1920 px | escritorio, DPR 1 | no | 0 |

### Teclado y foco (criterio 4)

- Hay 22 elementos que reciben el foco y ninguno tiene un `tabindex` positivo.
- Los 22 muestran un contorno de foco de 2 px o más. El peor contraste del contorno con su fondo es **5,53:1** (WCAG 1.4.11 pide 3:1).
- Menú móvil a 375 px: Tab hasta "Menú", Enter lo abre (`aria-expanded="true"`), Tab recorre los enlaces y Esc lo cierra y devuelve el foco al botón.
- El enlace "Saltar al contenido" es el primer elemento enfocable.

### Sin JavaScript (criterio 6)

Chrome headless con `page.setJavaScriptEnabled(false)`. Se comprueba que el script no llegó a ejecutarse porque la clase `cabecera--js` no aparece.

- Navegación: 5 enlaces visibles y el botón "Menú" oculto, porque no hace falta.
- Carta: 7 servicios visibles. Horario: 4 filas visibles. El indicador "abierto ahora" está oculto.
- Contacto: 10 enlaces de WhatsApp (todos con el mismo mensaje genérico), 2 de llamar y 1 de "Cómo llegar".
- La captura de página completa a 375 px muestra todas las secciones.

### Contacto (criterio 7)

- WhatsApp: `https://wa.me/34600000000?text=…` con el mensaje codificado. Con JS, cada servicio genera el suyo (comprobados los 7).
- Llamar: `tel:+34600000000`.
- Cómo llegar: búsqueda en Google Maps con la dirección.

### Consola y red (criterio 3, parte de terceros)

- La consola no muestra errores ni avisos en la portada ni en las páginas legales.
- Recorriendo la página entera (con todas las imágenes diferidas cargadas) hay 16 peticiones, **todas al propio dominio**: 0 a terceros.

### Calidad de código

- `html-validate` no da errores en `index.html` ni en `legal/*.html`.
- `node --test`: 22 tests en verde. Se comprobó que cada grupo de tests detecta fallos introduciendo un error a propósito: el cierre de horario, la codificación de WhatsApp y el horario del JSON-LD.

## T11: Lighthouse móvil y rendimiento (criterios 1, 2 y 3)

Lighthouse 12 en modo móvil (emulación de Moto G Power con limitación simulada), 3 ejecuciones por medición. La variación entre ejecuciones es de ±2 ms en el LCP y de 0 en el resto de métricas.

| Métrica | Objetivo | Línea base | Tras el arreglo |
| --- | --- | --- | --- |
| Rendimiento | ≥ 95 | 97 | **100** |
| Accesibilidad | 100 | 100 | 100 |
| Buenas prácticas | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| LCP | ≤ 2,5 s | 1,28 s | 1,28 s |
| CLS | ≤ 0,1 | **0,110** ❌ | **0,000** |
| TBT | ≤ 200 ms | 0 ms | 0 ms |
| Peso inicial | ≤ 500 KB | 104 KB | 104 KB |

### Registro de optimizaciones

| Idea | Antes → después | Veredicto | Por qué |
| --- | --- | --- | --- |
| Poner la clase `js` en `<html>` con un script inline en el `<head>` para que el menú móvil nazca plegado | CLS 0,110 → 0,000 · Rendimiento 97 → 100 | **aplicada** | Lighthouse señalaba `<main>` como elemento desplazado. Al medirla, la cabecera ocupaba 166 px antes de cargar el JS y 69 px después: el menú se plegaba a mitad de carga. Sin JS sigue en 166 px (desplegada). |
| Unir los 3 CSS o incrustar el CSS crítico (Lighthouse estima 150 ms) | no probada | descartada | Con 100 en rendimiento no hay problema que resolver, y añadiría un paso de build a un proyecto que no tiene. |
| Ajustar `sizes`/anchos de las imágenes de la galería (Lighthouse estima 22 KB) | no probada | descartada | El peso total es 104 KB frente al límite de 500 KB. |
| Caché de larga duración | no aplicable en local | pendiente de hosting | Es configuración del servidor (`Cache-Control`), no del código. Se configura al publicar. |

### Protección contra regresiones

En `tests/rendimiento.test.js`:
- el script de la clase `js` debe ir en el `<head>` antes de las hojas de estilo; se comprobó que el test falla si se quita;
- todas las imágenes declaran `width` y `height`;
- solo la imagen del hero lleva `fetchpriority="high"` y el resto, `loading="lazy"`;
- no se carga ningún recurso de otro dominio.
