import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { negocio } from '../js/config.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

test('el JSON-LD es un HairSalon con nombre, teléfono y dirección', () => {
  assert.equal(ld['@type'], 'HairSalon');
  assert.equal(ld.name, negocio.nombre);
  assert.equal(ld.telephone.replace(/\D/g, ''), negocio.telefono.replace(/\D/g, ''));
  assert.equal(ld.address.addressCountry, 'ES');
});

test('el horario del JSON-LD coincide con js/config.js', () => {
  const desdeConfig = Object.entries(negocio.horario).flatMap(([dia, tramos]) =>
    tramos.map(([abre, cierra]) => `${DIAS_SCHEMA[dia]} ${abre}-${cierra}`),
  );
  const desdeJsonLd = ld.openingHoursSpecification.flatMap(({ dayOfWeek, opens, closes }) =>
    [dayOfWeek].flat().map((dia) => `${dia} ${opens}-${closes}`),
  );
  assert.deepEqual(desdeJsonLd.sort(), desdeConfig.sort());
});

test('el catálogo del JSON-LD tiene los mismos servicios y precios que la carta', () => {
  const carta = [...html.matchAll(/<h3 class="carta__nombre">([^<]+)<\/h3>[\s\S]*?<data class="carta__precio" value="(\d+)">/g)]
    .map(([, nombre, precio]) => `${nombre}: ${precio}`);
  const catalogo = ld.hasOfferCatalog.itemListElement.map((oferta) => `${oferta.itemOffered.name}: ${oferta.price}`);
  assert.deepEqual(catalogo, carta);
});

test('la meta description mide entre 120 y 160 caracteres', () => {
  const descripcion = html.match(/<meta name="description" content="([^"]+)">/)[1];
  assert.ok(descripcion.length >= 120 && descripcion.length <= 160, `mide ${descripcion.length}`);
});
