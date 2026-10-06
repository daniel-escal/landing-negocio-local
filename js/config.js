/*
 * Datos del negocio que usa JavaScript.
 * El teléfono y el horario también aparecen en index.html (enlaces y tabla) y en el JSON-LD:
 * si se cambian aquí, hay que cambiarlos allí (ver docs/PERSONALIZAR.md).
 * `node --test` comprueba que los enlaces de WhatsApp del HTML coinciden con estos datos.
 */
export const negocio = {
  nombre: 'Brocha & Latón',
  telefono: '+34 600 000 000', // con prefijo internacional
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
