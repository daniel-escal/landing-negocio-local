# Plan de implementación: Landing barbería clásica

> Basado en [`docs/SPEC.md`](../docs/SPEC.md) (aprobada el 2026-10-06). Estado: **APROBADO** (2026-10-06). Decisiones: `npx sharp-cli` aprobado para imágenes; push en cada checkpoint.
> Lista de tareas: [`tasks/todo.md`](todo.md).

## Resumen

Una landing de una sola página para una barbería clásica ficticia, en HTML, CSS y JS sin dependencias. Se construye por **secciones verticales**: cada tarea deja una parte de la página terminada de punta a punta (contenido, estilos, JS si hace falta y tests), funcionando y verificada en el navegador. Primero van la base y lo arriesgado (el flujo de imágenes y el contacto por WhatsApp), después el contenido y al final la auditoría de calidad contra los criterios de éxito.

## Decisiones de arquitectura

- **El contenido vive en `index.html`, no en JS.** Así se indexa en Google y la página funciona sin JavaScript (mejora progresiva). `js/config.js` solo guarda los datos que el JS necesita (teléfono, mensaje de WhatsApp y horario).
- **Una sola fuente de verdad para el horario:** `js/config.js` alimenta el indicador "abierto ahora". La tabla de horario del HTML y el JSON-LD se escriben a mano a partir de esos mismos datos, y `docs/PERSONALIZAR.md` recordará mantener los tres sincronizados. Es más simple que generar HTML con JS y no rompe el SEO.
- **Lógica pura en `js/lib/`, DOM en `main.js`.** Lo que tiene casos límite (calcular si está abierto o construir el enlace de WhatsApp) se testea con `node --test` sin navegador.
- **La marca entera en `css/tokens.css`:** paleta oscura (verde botella o carbón), acento latón y serif en títulos. Componentes con BEM ligero, sin valores sueltos.
- **Imágenes optimizadas antes de hacer commit**, en tres formatos (AVIF, WebP y JPEG) y a 2-3 anchos, con `<picture>`, `width`/`height` y `loading="lazy"` salvo la del hero (`fetchpriority="high"`).
- **Sin Google Maps incrustado:** un enlace "Cómo llegar" y una imagen estática, para no hacer peticiones a terceros ni cargar cookies.
- **Un commit por tarea**, con validación y tests en verde. El push al remoto se pide en cada checkpoint.

## Grafo de dependencias

```
T1 Esqueleto + tokens + base
 ├── T2 Hero con contacto (tel/WhatsApp estáticos)
 │     └── T3 Flujo de imágenes (Unsplash → AVIF/WebP/JPEG) ── aplicado al hero
 │            ├── T7 Galería + Sobre nosotros + Reseñas
 │            └── T5 Horario y ubicación (+ "abierto ahora")
 ├── T4 Servicios con precios
 │     └── T6 WhatsApp con servicio preseleccionado (lib + tests)
 ├── T8 Navegación móvil + pie + páginas legales
 └── T9 SEO: metadatos, Open Graph, JSON-LD (depende de T4 y T5 por precios y horario)
T10 Auditoría en navegador ← todo lo anterior
T11 Lighthouse y rendimiento ← T10
T12 Documentación de personalización ← todo
```

## Lista de tareas (detalle en `todo.md`)

### Fase 1: Base y riesgos
- [x] T1: Esqueleto semántico, tokens de marca y estilos base
- [x] T2: Hero con botones de llamar y WhatsApp
- [x] T3: Flujo de imágenes de Unsplash optimizadas (aplicado al hero)

### Checkpoint 1: base
- [x] `html-validate` limpio, página servida en local, consola limpia y hero correcto a 375, 768 y 1280 px
- [x] Revisión con Daniel (estética de la marca) y push si lo aprueba

### Fase 2: Contenido principal
- [ ] T4: Sección de servicios con precios y duración
- [ ] T5: Horario y ubicación con indicador "abierto ahora"
- [ ] T6: WhatsApp con el servicio elegido ya en el mensaje

### Checkpoint 2: flujo de cita completo
- [ ] `node --test tests/` en verde
- [ ] Recorrido completo en el navegador: ver servicio, pedir cita por WhatsApp y ver horario y ruta
- [ ] Funciona con JS desactivado
- [ ] Revisión con Daniel y push

### Fase 3: Resto de contenido y SEO
- [ ] T7: Galería, Sobre nosotros y Reseñas
- [ ] T8: Navegación móvil, pie y páginas legales
- [ ] T9: Metadatos SEO, Open Graph y JSON-LD `HairSalon`

### Checkpoint 3: página completa
- [ ] Todas las secciones de la spec presentes, HTML válido, tests en verde
- [ ] Revisión con Daniel y push

### Fase 4: Verificación y documentación
- [ ] T10: Auditoría en navegador (consola, red, responsive, teclado, sin JS)
- [ ] T11: Lighthouse móvil y ajustes de rendimiento hasta cumplir los objetivos
- [ ] T12: `docs/PERSONALIZAR.md`, créditos de imágenes y README final

### Checkpoint final
- [ ] Los 11 criterios de éxito de la spec, comprobados uno a uno con evidencias
- [ ] Definition of Done (`references/definition-of-done.md`) cumplida
- [ ] Aprobación de Daniel. Decidir si se publica en GitHub Pages (pregunta abierta de la spec)

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Convertir imágenes a AVIF/WebP necesita una herramienta que no está en el proyecto | Alto: sin esto no se llega al rendimiento ≥ 95 | Se resuelve en T3, al principio. Opción propuesta: `npx sharp-cli` como herramienta puntual de desarrollo, sin añadirla a `package.json`. **Requiere tu aprobación** (la spec dice "preguntar antes de añadir dependencias") |
| Las fotos de Unsplash pesan varios MB | Alto: LCP y peso total | Descargarlas ya recortadas desde la URL de Unsplash (`w=` y `q=`) y optimizarlas en local. Máximo de 500 KB para toda la carga inicial |
| La "estética de IA" (tarjetas iguales, degradados) | Medio: es criterio de éxito | Diseño basado en el contenido: servicios como una carta de barbería (lista con puntos guía hasta el precio), no tarjetas |
| El cálculo de "abierto ahora" falla con zonas horarias o el cierre de mediodía | Medio: enseñaría información falsa al cliente | Lógica pura con la hora inyectada y tests de los casos límite (cierre de mediodía, domingo cerrado, justo a la hora de cierre). Siempre en hora de Madrid (`Intl` con `Europe/Madrid`) |
| Horario duplicado en config, HTML y JSON-LD | Bajo | Documentado en PERSONALIZAR.md; T10 comprueba que coinciden |
| Que se cuele un recurso de terceros (fuente o script) | Medio: rompe "0 peticiones a terceros" y obligaría a un banner de cookies | Auditoría de red en T10 con el MCP de Chrome DevTools |

## Qué se puede hacer en paralelo

- **En paralelo:** T7 y T8 una vez terminado el checkpoint 2. También T12, que solo es documentación.
- **En secuencia:** T1 → T2 → T3, y T9 después de T4 y T5.
- Al trabajar con un solo agente y en commits atómicos, se sigue el orden numérico.

## Preguntas abiertas

1. **¿Apruebas usar `npx sharp-cli` puntualmente** (solo en desarrollo, sin añadirlo al proyecto) para convertir las imágenes a AVIF/WebP? La alternativa es convertirlas tú a mano con squoosh.app.
2. **¿Nombre del negocio ficticio?** Propuesta: "Barbería La Navaja", marcada como demo en el pie. Antes compruebo que no sea una marca conocida de Valencia.
3. **¿Push en cada checkpoint** o todo junto al final?
