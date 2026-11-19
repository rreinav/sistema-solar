/** Motor 3D: proyección perspectiva, cinemática orbital, asteroides */

import { CELESTIAL_BODIES, SUN_DATA } from "./api.js";
import { state } from "./state.js";

const DEG = Math.PI / 180;
const distanceScale = 120; // Factor de escala visual para distancias en UA

/** Escala logarítmica: log2(1 + au) * distanceScale */
function scaleDistance(au) {
  return Math.log2(1 + au) * distanceScale;
}

/** Resuelve la ecuación de Kepler: M = E - e*sin(E), ~5 iteraciones */
function solveKepler(M, e) {
  let E = M; // Semiancho inicial
  for (let i = 0; i < 5; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  return E;
}

/** Calcula posición 3D (x, y, z) de un cuerpo en su órbita */
function getOrbitalPosition(body, simTimeDays) {
  const period = body.orbitalPeriod; // días
  if (!period || period <= 0) return { x: 0, y: 0, z: 0 };

  // Movimiento medio (radianes)
  const M = ((simTimeDays % period) / period) * 2 * Math.PI;
  const E = solveKepler(M, body.eccentricity);

  // Verdadera anomalía
  const cosV = (Math.cos(E) - body.eccentricity) / (1 - body.eccentricity * Math.cos(E));
  const sinV =
    (Math.sqrt(1 - body.eccentricity ** 2) * Math.sin(E)) / (1 - body.eccentricity * Math.cos(E));

  // Distancia al Sol en UA
  const r = body.semiMajorAxis * (1 - body.eccentricity * Math.cos(E));

  // Posición en el plano orbital (plano x-y antes de la inclinación)
  const xOrbit = r * cosV;
  const yOrbit = r * sinV;

  // Rotación del plano orbital por la inclinación respecto a la eclíptica
  const inclRad = body.inclination * DEG;
  const xInclined = xOrbit;
  const yInclined = yOrbit * Math.cos(inclRad);
  const zInclined = yOrbit * Math.sin(inclRad);

  // Escala logarítmica para visualización (y → eje vertical, z → profundidad)
  const scaledDist = scaleDistance(r);
  return {
    x: (scaledDist * xInclined) / (r || 1),
    y: (scaledDist * zInclined) / (r || 1),
    z: (scaledDist * yInclined) / (r || 1)
  };
}

/** Calcula posiciones de todos los cuerpos para el frame actual */
export function calculateAllPositions() {
  // Sol siempre en el centro sin proyección
  const sunProj = projectPosition(0, 0, 0);
  const positions = [{ ...SUN_DATA, x: 0, y: 0, z: 0, ...sunProj }];

  for (const body of CELESTIAL_BODIES) {
    const pos = getOrbitalPosition(body, state.simTime);
    const projected = projectPosition(pos.x, pos.y, pos.z);
    positions.push({ ...body, ...pos, ...projected });
  }

  return positions;
}

/** Proyección perspectiva: (x, y, z) → { screenX, screenY, depthZ, scale } */
export function projectPosition(x, y, z) {
  const { cameraYaw, cameraPitch, cameraZoom } = state;

  // Rotación por yaw (eje Y)
  const cosYaw = Math.cos(cameraYaw);
  const sinYaw = Math.sin(cameraYaw);
  const x1 = x * cosYaw - z * sinYaw;
  const z1 = x * sinYaw + z * cosYaw;

  // Rotación por pitch (eje X)
  const cosPitch = Math.cos(cameraPitch);
  const sinPitch = Math.sin(cameraPitch);
  const y1 = y * cosPitch - z1 * sinPitch;
  const z2 = y * sinPitch + z1 * cosPitch;

  // Proyección perspectiva: zoom escala coordenadas (distancia real de cámara)
  const fov = 800;
  const maxScale = 8;
  const scaleZ = cameraZoom || 1;
  const sx = x1 * scaleZ;
  const sy = y1 * scaleZ;
  const sz = z2 * scaleZ;
  const denom = fov + sz;
  const visible = denom > 0;
  const scale = visible ? Math.min(fov / denom, maxScale) : 0;

  return {
    screenX: state.canvasWidth / 2 + sx * scale,
    screenY: state.canvasHeight / 2 + sy * scale,
    depthZ: sz,
    scale,
    visible,
    denom
  };
}

/** Dibuja las trayectorias orbitales en el canvas con clipping near-plane */
export function drawOrbitPaths(ctx) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;

  for (const body of CELESTIAL_BODIES) {
    if (body.category === "planet" && !state.showPlanets) continue;
    if (body.category === "dwarf_planet" && !state.showDwarfPlanets) continue;

    const steps = 128;

    // Dibujar subtrayaclos con clipping en near-plane
    let pathStarted = false;
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
      const simTimeDays = (i / steps) * body.orbitalPeriod;
      const pos = getOrbitalPosition(body, simTimeDays);
      const projected = projectPosition(pos.x, pos.y, pos.z);

      if (!projected.visible) {
        // Punto detrás del near-plane: cortar segmento y reiniciar path
        pathStarted = false;
        ctx.beginPath();
        continue;
      }

      if (i > 0) {
        const prevPos = getOrbitalPosition(body, ((i - 1) / steps) * body.orbitalPeriod);
        const prevProj = projectPosition(prevPos.x, prevPos.y, prevPos.z);

        // Interpolar punto de corte si el segmento anterior no era visible
        if (!prevProj.visible && prevProj.denom !== 0) {
          const t = prevProj.denom / (prevProj.denom - projected.denom);
          const interpX = prevPos.x + (pos.x - prevPos.x) * t;
          const interpY = prevPos.y + (pos.y - prevPos.y) * t;
          const interpZ = prevPos.z + (pos.z - prevPos.z) * t;
          const interpProj = projectPosition(interpX, interpY, interpZ);
          if (interpProj.visible) {
            ctx.moveTo(interpProj.screenX, interpProj.screenY);
            pathStarted = true;
            continue;
          }
        }
      }

      if (!pathStarted) {
        ctx.moveTo(projected.screenX, projected.screenY);
        pathStarted = true;
      } else {
        ctx.lineTo(projected.screenX, projected.screenY);
      }
    }

    if (pathStarted) ctx.stroke();
  }
}

/** Generador unificado de cinturones (Principal, Kuiper, Oort) */
function generateBelt(count, auMin, auMax, spreadFn, brightnessRange) {
  const particles = [];
  let seed = 42;

  function pseudoRandom() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (let i = 0; i < count; i++) {
    const au = auMin + pseudoRandom() * (auMax - auMin);
    const angle = pseudoRandom() * 2 * Math.PI;
    const scaledDist = scaleDistance(au);

    particles.push({
      x: scaledDist * Math.cos(angle),
      y: spreadFn(pseudoRandom, scaledDist, auMax),
      z: scaledDist * Math.sin(angle),
      size: 0.5 + pseudoRandom() * 1.5,
      brightness: brightnessRange[0] + pseudoRandom() * (brightnessRange[1] - brightnessRange[0])
    });
  }

  return particles;
}

/** Spread lineal para cinturón principal y Kuiper */
const linearSpread = (rand) => (rand() - 0.5) * 15;
const kuiperSpread = (rand) => (rand() - 0.5) * 10;

/** Spread esférico para Nube de Oort (inclinación ~90°) */
const sphericalSpread = (rand, _, auMax) => (rand() - 0.5) * 2 * scaleDistance(auMax) * 0.8;

/** Genera asteroides del Cinturón Principal (2,2–3,2 UA) */
export function generateAsteroids(count = 300) {
  return generateBelt(count, 2.2, 3.2, linearSpread, [0.3, 0.8]);
}

/** Genera partículas del Cinturón de Kuiper (30–50 UA, ~1.5° inclinación) */
export function generateKuiperBelt(count = 300) {
  return generateBelt(count, 30, 50, kuiperSpread, [0.3, 0.8]);
}

/** Genera partículas de la Nube de Oort (2.000–100.000 UA, esférica) */
export function generateOortCloud(count = 500) {
  return generateBelt(count, 2000, 100000, sphericalSpread, [0.2, 0.6]);
}

/** Genera estrellas de fondo (pseudoaleatorio con seed fijo) */
export function generateStars(count = 400) {
  const stars = [];
  let seed = 42;

  function pseudoRandom() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (let i = 0; i < count; i++) {
    stars.push({
      x: pseudoRandom() * 3000 - 1500,
      y: pseudoRandom() * 2000 - 1000,
      size: 0.3 + pseudoRandom() * 1.2,
      brightness: 0.4 + pseudoRandom() * 0.6
    });
  }

  return stars;
}

export const starField = generateStars();
export const kuiperCache = generateKuiperBelt();
export const oortCache = generateOortCloud();
