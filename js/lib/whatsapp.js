/**
 * Enlace wa.me que abre un chat con `telefono` y `mensaje` ya escrito.
 * El teléfono debe llevar prefijo internacional ("+34 …" o "0034 …"): wa.me no lo deduce.
 */
export function crearEnlaceWhatsApp(telefono, mensaje) {
  const compacto = telefono.replace(/[\s\-().]/g, '');
  if (!/^(\+|00)/.test(compacto)) {
    throw new Error(`Teléfono sin prefijo internacional: ${telefono}`);
  }

  const numero = compacto.replace(/^\+|^00/, '');
  if (!/^\d{8,15}$/.test(numero)) {
    throw new Error(`Teléfono no válido: ${telefono}`);
  }

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje para pedir cita, con el servicio si se indica. */
export function mensajeCita(nombreNegocio, servicio) {
  return servicio
    ? `Hola, quiero pedir cita en ${nombreNegocio} para: ${servicio}.`
    : `Hola, quiero pedir cita en ${nombreNegocio}.`;
}
