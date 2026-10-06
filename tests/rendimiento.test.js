import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Guardas de las decisiones que llevaron Lighthouse móvil a 100 (ver docs/VERIFICACION.md).
// Sin comentarios HTML: las etiquetas comentadas (canonical, og:image) no se cargan.
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const head = html.slice(0, html.indexOf('</head>'));
const imagenes = [...html.matchAll(/<img\b[^>]*>/g)].map(([etiqueta]) => etiqueta);

test('la clase "js" se pone en el <head> antes de las hojas de estilo (evita CLS del menú)', () => {
  const script = head.indexOf('document.documentElement.classList.add("js")');
  const primeraHoja = head.indexOf('<link rel="stylesheet"');
  assert.ok(script !== -1, 'falta el script inline que añade la clase "js"');
  assert.ok(script < primeraHoja, 'el script debe ir antes de la primera hoja de estilo');
});

test('todas las imágenes declaran width y height (evita CLS)', () => {
  const sinDimensiones = imagenes.filter((img) => !/\bwidth="\d+"/.test(img) || !/\bheight="\d+"/.test(img));
  assert.deepEqual(sinDimensiones, []);
});

test('solo la imagen del hero es prioritaria; el resto se carga en diferido (LCP y peso inicial)', () => {
  const prioritarias = imagenes.filter((img) => img.includes('fetchpriority="high"'));
  assert.equal(prioritarias.length, 1);
  assert.match(prioritarias[0], /hero-/);

  const resto = imagenes.filter((img) => !img.includes('fetchpriority="high"'));
  assert.ok(resto.every((img) => img.includes('loading="lazy"')), 'hay imágenes no prioritarias sin loading="lazy"');
});

test('no se carga ningún recurso de otro dominio (sin terceros ni cookies)', () => {
  // rel="canonical" no se descarga: solo indica a los buscadores la URL oficial.
  const recursos = [...html.matchAll(/<(?:link|script|img|source)\b[^>]*\b(?:href|src|srcset)="([^"]+)"/g)]
    .filter(([etiqueta]) => !etiqueta.includes('rel="canonical"'))
    .map(([, url]) => url)
    .filter((url) => !url.startsWith('#'));
  const externos = recursos.filter((url) => /^(https?:)?\/\//.test(url) && !url.startsWith('https://schema.org'));
  assert.deepEqual(externos, []);
});
