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
