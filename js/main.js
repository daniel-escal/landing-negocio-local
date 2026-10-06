import { negocio } from './config.js';
import { estadoHorario, textoEstado } from './lib/horario.js';

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
