import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoHorario, textoEstado } from '../js/lib/horario.js';

// Lunes cerrado; martes a viernes con cierre a mediodía; sábado solo mañana; domingo cerrado.
// Claves = Date#getDay() (0 = domingo).
const horario = {
  0: [],
  1: [],
  2: [['10:00', '14:00'], ['16:30', '20:30']],
  3: [['10:00', '14:00'], ['16:30', '20:30']],
  4: [['10:00', '14:00'], ['16:30', '20:30']],
  5: [['10:00', '14:00'], ['16:30', '20:30']],
  6: [['09:30', '14:00']],
};

// Octubre de 2026: Madrid está en horario de verano (UTC+2). 2026-10-06 es martes.
const madrid = (isoLocal, offset = '+02:00') => new Date(`${isoLocal}${offset}`);

test('martes a media mañana: abierto, cierra a las 14:00', () => {
  assert.deepEqual(estadoHorario(horario, madrid('2026-10-06T11:00')), { abierto: true, cierra: '14:00' });
});

test('minuto exacto de apertura: abierto', () => {
  assert.equal(estadoHorario(horario, madrid('2026-10-06T10:00')).abierto, true);
});

test('minuto exacto de cierre: cerrado', () => {
  assert.equal(estadoHorario(horario, madrid('2026-10-06T14:00')).abierto, false);
});

test('cierre de mediodía: cerrado, abre hoy a las 16:30', () => {
  assert.deepEqual(estadoHorario(horario, madrid('2026-10-06T15:00')), {
    abierto: false,
    abre: { enDias: 0, dia: 2, hora: '16:30' },
  });
});

test('antes de abrir por la mañana: abre hoy', () => {
  assert.deepEqual(estadoHorario(horario, madrid('2026-10-06T08:00')).abre, { enDias: 0, dia: 2, hora: '10:00' });
});

test('lunes (cerrado todo el día): abre mañana martes', () => {
  assert.deepEqual(estadoHorario(horario, madrid('2026-10-12T12:00')).abre, { enDias: 1, dia: 2, hora: '10:00' });
});

test('sábado por la tarde: salta domingo y lunes, abre el martes', () => {
  assert.deepEqual(estadoHorario(horario, madrid('2026-10-10T15:00')).abre, { enDias: 3, dia: 2, hora: '10:00' });
});

test('usa la hora de Madrid aunque el instante venga en otra zona', () => {
  // 09:00 UTC = 11:00 en Madrid (verano) → abierto. En UTC serían las 09:00 → cerrado.
  assert.equal(estadoHorario(horario, new Date('2026-10-06T09:00:00Z')).abierto, true);
});

test('horario de invierno (UTC+1)', () => {
  // 1 de diciembre de 2026, martes. 09:30 UTC = 10:30 en Madrid → abierto.
  assert.equal(estadoHorario(horario, new Date('2026-12-01T09:30:00Z')).abierto, true);
  // 08:30 UTC = 09:30 en Madrid → todavía cerrado.
  assert.equal(estadoHorario(horario, new Date('2026-12-01T08:30:00Z')).abierto, false);
});

test('horario sin ningún tramo: siempre cerrado y sin próxima apertura', () => {
  const vacio = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  assert.deepEqual(estadoHorario(vacio, madrid('2026-10-06T11:00')), { abierto: false, abre: null });
});

test('textos para el visitante', () => {
  assert.equal(textoEstado({ abierto: true, cierra: '20:30' }), 'Abierto ahora · cierra a las 20:30');
  assert.equal(textoEstado({ abierto: false, abre: { enDias: 0, dia: 2, hora: '16:30' } }), 'Cerrado · abre hoy a las 16:30');
  assert.equal(textoEstado({ abierto: false, abre: { enDias: 1, dia: 2, hora: '10:00' } }), 'Cerrado · abre mañana a las 10:00');
  assert.equal(textoEstado({ abierto: false, abre: { enDias: 3, dia: 2, hora: '10:00' } }), 'Cerrado · abre el martes a las 10:00');
  assert.equal(textoEstado({ abierto: false, abre: null }), 'Cerrado');
});
