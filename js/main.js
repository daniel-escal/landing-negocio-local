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

/** Menú plegable en móvil. Sin JS, la navegación se ve siempre desplegada. */
function activarMenu() {
  const cabecera = document.querySelector('[data-cabecera]');
  const boton = cabecera?.querySelector('[data-boton-menu]');
  if (!boton) return;

  const abrir = (abierto) => {
    cabecera.classList.toggle('cabecera--abierta', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
  };

  boton.addEventListener('click', () => abrir(boton.getAttribute('aria-expanded') !== 'true'));

  cabecera.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
      abrir(false);
      boton.focus();
    }
  });

  // Al elegir una sección, el menú se cierra para dejar ver el contenido.
  cabecera.querySelector('.cabecera__nav').addEventListener('click', (evento) => {
    if (evento.target.closest('a')) abrir(false);
  });
}

activarMenu();
mostrarEstadoHorario();
personalizarEnlacesDeServicio();
