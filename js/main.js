import { negocio } from './config.js';
import { estadoHorario, textoEstado } from './lib/horario.js';
import { crearEnlaceWhatsApp, mensajeCita } from './lib/whatsapp.js';

/** Cada botón "Pedir" de la carta abre WhatsApp con su servicio ya escrito. Sin JS, queda el enlace genérico. */
function personalizarEnlacesDeServicio() {
  for (const enlace of document.querySelectorAll('a[data-servicio]')) {
    enlace.href = crearEnlaceWhatsApp(negocio.telefono, mensajeCita(negocio.nombre, enlace.dataset.servicio));
  }
}

function mostrarEstadoHorario() {
  const indicador = document.querySelector('[data-estado-horario]');
  if (!indicador) return;

  const pintar = () => {
    const estado = estadoHorario(negocio.horario, new Date(), negocio.zonaHoraria);
    indicador.textContent = textoEstado(estado);
    indicador.dataset.abierto = String(estado.abierto);
  };

  pintar();
  indicador.hidden = false;
  setInterval(pintar, 60_000);
}

mostrarEstadoHorario();
personalizarEnlacesDeServicio();
