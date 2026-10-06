import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearEnlaceWhatsApp, mensajeCita } from '../js/lib/whatsapp.js';
import { negocio } from '../js/config.js';

test('limpia espacios, guiones y el "+" del teléfono', () => {
  assert.equal(crearEnlaceWhatsApp('+34 600-000-000', 'Hola'), 'https://wa.me/34600000000?text=Hola');
});

test('acepta el prefijo internacional con "00"', () => {
  assert.equal(crearEnlaceWhatsApp('0034 600 000 000', 'Hola'), 'https://wa.me/34600000000?text=Hola');
});

test('codifica tildes, ñ, "&" y "€" del mensaje', () => {
  const enlace = crearEnlaceWhatsApp('+34600000000', 'Peña & Latón: 16 €');
  assert.equal(enlace, 'https://wa.me/34600000000?text=Pe%C3%B1a%20%26%20Lat%C3%B3n%3A%2016%20%E2%82%AC');
  assert.equal(decodeURIComponent(new URL(enlace).searchParams.get('text')), 'Peña & Latón: 16 €');
});

test('rechaza un teléfono sin prefijo internacional (wa.me lo necesita)', () => {
  assert.throws(() => crearEnlaceWhatsApp('600 000 000', 'Hola'), /prefijo internacional/);
});

test('rechaza un teléfono demasiado corto o demasiado largo', () => {
  assert.throws(() => crearEnlaceWhatsApp('+34 600', 'Hola'), /Teléfono no válido/);
  assert.throws(() => crearEnlaceWhatsApp('+34 600 000 000 000 00', 'Hola'), /Teléfono no válido/);
});

test('mensaje genérico y mensaje con servicio', () => {
  assert.equal(mensajeCita('Brocha & Latón'), 'Hola, quiero pedir cita en Brocha & Latón.');
  assert.equal(mensajeCita('Brocha & Latón', 'Degradado'), 'Hola, quiero pedir cita en Brocha & Latón para: Degradado.');
});

test('el enlace genérico escrito en index.html coincide con el que genera config.js', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const esperado = crearEnlaceWhatsApp(negocio.telefono, mensajeCita(negocio.nombre));
  const enlacesEnHtml = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map(([, href]) => href);

  assert.ok(enlacesEnHtml.length > 0, 'index.html no tiene enlaces de WhatsApp');
  for (const href of enlacesEnHtml) assert.equal(href, esperado);
});
