# Landing para negocio local

Plantilla de landing page para barberías y peluquerías de barrio, en HTML, CSS y JavaScript puro, sin dependencias ni paso de build. Se adapta a un cliente nuevo en menos de una hora cambiando la marca, los datos, el contenido y las fotos.

La demo es **Brocha & Latón**, una barbería clásica ficticia de Valencia.

## Qué incluye

- Portada con botones para pedir cita por WhatsApp (mensaje ya escrito) y para llamar
- Carta de servicios con precio y duración; cada servicio abre WhatsApp con su nombre en el mensaje
- Horario con indicador "abierto ahora", calculado en hora de Madrid
- Galería, "Sobre nosotros", reseñas, ubicación con enlace "Cómo llegar"
- Menú móvil accesible, páginas de aviso legal y privacidad
- Datos estructurados `HairSalon` (JSON-LD) para Google
- Funciona entera **sin JavaScript**; el JS solo añade comodidad

## Calidad

| | Resultado |
| --- | --- |
| Lighthouse móvil | Rendimiento 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 |
| Core Web Vitals (laboratorio) | LCP 1,28 s · CLS 0 · TBT 0 ms |
| Peso de la carga inicial | 104 KB |
| Peticiones a terceros | 0, así que no hay cookies ni banner de cookies |
| Tests | 26 con `node:test` |

Detalle y evidencias en [`docs/VERIFICACION.md`](docs/VERIFICACION.md).

## Arrancar en local

Servidor de desarrollo:

```bash
npx --yes serve@14 . -l 5173
```

Tests:

```bash
node --test
```

Validación del HTML:

```bash
npx --yes html-validate@9 index.html legal/*.html
```

Requisitos: Node.js 20 o superior.

## Personalizar para un cliente

Sigue [`docs/PERSONALIZAR.md`](docs/PERSONALIZAR.md). En resumen:

1. `css/tokens.css`: colores y tipografía de la marca
2. `js/config.js`: nombre, teléfono y horario
3. `index.html`: textos, servicios, reseñas reales, dirección y JSON-LD
4. `assets/img/`: fotos con los mismos nombres y medidas

Los tests avisan si los enlaces de WhatsApp, el horario del JSON-LD o el catálogo de servicios quedan desincronizados.

## Cómo se hizo

Con desarrollo guiado por especificación: [`docs/SPEC.md`](docs/SPEC.md) (qué se construye y cómo se sabe que está terminado), luego un plan de 12 tareas en [`tasks/`](tasks/plan.md), y una implementación incremental con un commit por tarea, verificada en el navegador con Chrome DevTools.

## Créditos

Fotos de Unsplash: ver [`assets/img/CREDITOS.md`](assets/img/CREDITOS.md).

Web por [Daniel Escalante](https://daniel-escal.es).
