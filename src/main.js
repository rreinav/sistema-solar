// Orquestador principal: inicialización, bucle de animación y gestión de ciclo de vida

import { state } from './modules/state.js';
import { initUI } from './modules/ui.js';
import { createControls } from './modules/controls.js';

/** Tiempo de referencia: 1 año terrestre = 10 segundos a ×1 */
const SECONDS_PER_YEAR = 10;

let lastTimestamp = null;

/** Bucle principal de animación actualizado por requestAnimationFrame */
function animationLoop(timestamp) {
  // Calcular delta en segundos desde el último frame
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }

  const deltaTime = (timestamp - lastTimestamp) / 1000; // en segundos
  lastTimestamp = timestamp;

  // Actualizar tiempo de simulación si no está pausado
  if (!state.paused) {
    // Cada segundo del mundo real = (10s × velocidad) días terrestres
    const simDaysPerRealSecond = (SECONDS_PER_YEAR / 365.25) * state.speedMultiplier;
    state.simTime += deltaTime * simDaysPerRealSecond * 365.25;
  }

  // Ejecutar renderizado (expuesto como window._render en ui.js)
  if (typeof window._render === 'function') {
    window._render();
  }

  requestAnimationFrame(animationLoop);
}

/** Inicialización: se ejecuta al cargar el DOM */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#solar-canvas');
  if (!canvas) {
    console.error('No se encontró el elemento #solar-canvas');
    return;
  }

  // Inicializar motor de renderizado y event listeners del canvas
  initUI(canvas);

  // Crear panel lateral de controles
  createControls();

  // Iniciar bucle de animación
  requestAnimationFrame(animationLoop);

  console.log('Sistema Solar 3D inicializado');
});
