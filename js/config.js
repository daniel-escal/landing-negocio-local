/*
 * Datos del negocio que usa JavaScript.
 * El horario también aparece en la tabla de index.html y en el JSON-LD:
 * si se cambia aquí, hay que cambiarlo allí (ver docs/PERSONALIZAR.md).
 */
export const negocio = {
  nombre: 'Brocha & Latón',
  zonaHoraria: 'Europe/Madrid',
  // Claves = día de la semana (0 = domingo). Cada tramo: ['apertura', 'cierre'].
  horario: {
    0: [],
    1: [],
    2: [['10:00', '14:00'], ['16:30', '20:30']],
    3: [['10:00', '14:00'], ['16:30', '20:30']],
    4: [['10:00', '14:00'], ['16:30', '20:30']],
    5: [['10:00', '14:00'], ['16:30', '20:30']],
    6: [['09:30', '14:00']],
  },
};
