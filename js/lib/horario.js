const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const INDICE_DIA = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Día de la semana (0 = domingo) y minutos desde medianoche de `fecha` en `zona`. */
function horaLocal(fecha, zona) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: zona,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(fecha)
      .map(({ type, value }) => [type, value]),
  );
  return { dia: INDICE_DIA[partes.weekday], minutos: Number(partes.hour) * 60 + Number(partes.minute) };
}

/**
 * Indica si el negocio está abierto en `fecha` según `horario`
 * ({ [díaDeLaSemana]: [['HH:MM', 'HH:MM'], ...] }, 0 = domingo).
 * Un tramo incluye su minuto de apertura y excluye el de cierre.
 *
 * @returns {{ abierto: true, cierra: string } | { abierto: false, abre: { enDias: number, dia: number, hora: string } | null }}
 */
export function estadoHorario(horario, fecha = new Date(), zona = 'Europe/Madrid') {
  const { dia, minutos } = horaLocal(fecha, zona);

  for (const [inicio, fin] of horario[dia] ?? []) {
    if (minutos >= aMinutos(inicio) && minutos < aMinutos(fin)) {
      return { abierto: true, cierra: fin };
    }
  }

  for (let enDias = 0; enDias < 7; enDias++) {
    const diaBuscado = (dia + enDias) % 7;
    const siguiente = (horario[diaBuscado] ?? []).find(
      ([inicio]) => enDias > 0 || aMinutos(inicio) > minutos,
    );
    if (siguiente) return { abierto: false, abre: { enDias, dia: diaBuscado, hora: siguiente[0] } };
  }

  return { abierto: false, abre: null };
}

/** Frase corta para el visitante a partir del resultado de `estadoHorario`. */
export function textoEstado(estado) {
  if (estado.abierto) return `Abierto ahora · cierra a las ${estado.cierra}`;
  if (!estado.abre) return 'Cerrado';

  const { enDias, dia, hora } = estado.abre;
  const cuando = enDias === 0 ? 'hoy' : enDias === 1 ? 'mañana' : `el ${DIAS[dia]}`;
  return `Cerrado · abre ${cuando} a las ${hora}`;
}
