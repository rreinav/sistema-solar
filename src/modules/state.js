/** Estado global: cámara, simulación, visibilidad y eventos */

export const state = {
  // Cámara orbital 3D
  cameraYaw: 0,
  cameraPitch: Math.PI / 6,
  cameraZoom: 1,

  // Inclinación predefinida de la vista (grados)
  viewInclination: 0,

  // Simulación
  simTime: 0,
  paused: false,
  speedMultiplier: 1,

  // Escala de distancia visual (píxeles por UA base)
  distanceScale: 120,

  // Toggles de visibilidad
  showOrbits: true,
  showAsteroids: true,
  showPlanets: true,
  showDwarfPlanets: true,
  showLabels: true,

  // Mouse / interacción
  mouseX: 0,
  mouseY: 0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,

  // Hover (tarjeta flotante)
  hoveredBody: null,

  // Canvas dimensions
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
};

/** Velocidad angular media de un cuerpo (radianes por día) */
export function meanAnomalyVelocity(orbitalPeriodDays) {
  return (2 * Math.PI) / orbitalPeriodDays;
}

/** Convierte simTime en posición angular actual */
export function getBodyAngle(velocityRadPerDay, periodDays, simTime) {
  const steps = state.paused ? 0 : state.speedMultiplier;
  return (velocityRadPerDay * simTime * steps) % (2 * Math.PI);
}

/** Inicializa el estado a valores por defecto */
export function resetState() {
  state.cameraYaw = 0;
  state.cameraPitch = Math.PI / 6;
  state.cameraZoom = 1;
  state.viewInclination = 0;
  state.simTime = 0;
  state.paused = false;
  state.speedMultiplier = 1;
  state.showOrbits = true;
  state.showAsteroids = true;
  state.showPlanets = true;
  state.showDwarfPlanets = true;
  state.showLabels = true;
  state.hoveredBody = null;
}
