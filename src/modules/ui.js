// Renderizado en canvas, eventos de ratón y panel UI

import { state } from "./state.js";
import {
  calculateAllPositions,
  drawOrbitPaths,
  generateAsteroids,
  projectPosition,
  starField
} from "./math3d.js";
import { SUN_DATA } from "./api.js";
import { hexToRGBA, lightenColor, roundRect, capitalize, formatDays } from "./helpers.js";

const fmt = (n) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3 }).format(n);

let asteroidCache = [];

/** Dibuja estrellas de fondo (distribución aleatoria real) */
function drawStars(ctx, W, H) {
  const rangeX = 3000; // -1500 a 1500
  const rangeY = 2000; // -1000 a 1000

  for (const star of starField) {
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = star.brightness;
    const screenX = ((star.x + 1500) / rangeX) * W;
    const screenY = ((star.y + 1000) / rangeY) * H;
    ctx.beginPath();
    ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Dibuja un cuerpo celeste individual */
function drawBody(ctx, body) {
  // Filtrar por categoría según toggles de visibilidad
  const isPlanet = body.category === "planet";
  const isDwarf = body.category === "dwarf_planet";

  if (isPlanet && !state.showPlanets) return;
  if (isDwarf && !state.showDwarfPlanets) return;

  const r = body.visualRadius * body.scale;

  // Anillos
  if (body.hasRings && body.category !== "star") {
    drawRings(ctx, body, r);
  }

  // Brillo/glow
  const glowGradient = ctx.createRadialGradient(
    body.screenX,
    body.screenY,
    0,
    body.screenX,
    body.screenY,
    r * 2.5
  );
  glowGradient.addColorStop(0, hexToRGBA(body.color, 0.3));
  glowGradient.addColorStop(1, "transparent");
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(body.screenX, body.screenY, r * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Cuerpo principal
  const gradient = ctx.createRadialGradient(
    body.screenX - r * 0.3,
    body.screenY - r * 0.3,
    r * 0.1,
    body.screenX,
    body.screenY,
    r
  );
  gradient.addColorStop(0, lightenColor(body.color, 30));
  gradient.addColorStop(1, body.color);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(body.screenX, body.screenY, r, 0, Math.PI * 2);
  ctx.fill();

  // Etiqueta de nombre
  if (state.showLabels) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(body.symbol + body.name, body.screenX, body.screenY + r + 16);
  }

  // Detección de hover
  if (state.mouseX !== undefined) {
    const dx = state.mouseX - body.screenX;
    const dy = state.mouseY - body.screenY;
    if (Math.sqrt(dx * dx + dy * dy) < r + 5) {
      state.hoveredBody = body;
    }
  }
}

/** Dibuja anillos planetarios */
function drawRings(ctx, body, bodyRadius) {
  ctx.save();
  ctx.translate(body.screenX, body.screenY);
  const ringInner = bodyRadius * 1.4;
  const ringOuter = bodyRadius * 2.3;
  const tilt = 0.35;

  ctx.strokeStyle = hexToRGBA(body.color, 0.4);
  ctx.lineWidth = (ringOuter - ringInner) / 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, ringOuter, ringOuter * tilt, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = hexToRGBA(lightenColor(body.color, 20), 0.25);
  ctx.lineWidth = (ringOuter - ringInner) / 4;
  const midR = ringInner + (ringOuter - ringInner) * 0.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, midR, midR * tilt, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Dibuja tarjeta flotante con ficha astronómica */
function drawHoverCard(ctx, body) {
  const padding = 16;
  const cardWidth = 280;
  const lineHeight = 22;

  // Estrellas (Sol): mostrar datos estelares desde SUN_DATA
  if (body.category === "star") {
    const lines = [
      `${SUN_DATA.symbol} ${SUN_DATA.name}`,
      `Tipo: ${SUN_DATA.type}`,
      `Masa: ${SUN_DATA.mass}`,
      `Radio: ${SUN_DATA.radius}`,
      `Temperatura: ${SUN_DATA.temperature}`,
      `Composición: ${SUN_DATA.composition}`,
      `Per. rotación: ${SUN_DATA.rotationPeriod}`
    ];

    const cardHeight = padding * 2 + lines.length * lineHeight;
    let cardX = body.screenX + 30;
    let cardY = body.screenY - cardHeight / 2;

    if (cardX + cardWidth > ctx.canvas.width) cardX = body.screenX - cardWidth - 30;
    if (cardY < 10) cardY = 10;
    if (cardY + cardHeight > ctx.canvas.height) cardY = ctx.canvas.height - cardHeight - 10;

    ctx.fillStyle = "rgba(20, 20, 40, 0.92)";
    ctx.strokeStyle = hexToRGBA(SUN_DATA.color, 0.6);
    ctx.lineWidth = 1;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 8);
    ctx.fill();
    ctx.stroke();

    lines.forEach((line, i) => {
      const y = cardY + padding + i * lineHeight;
      ctx.fillStyle = i === 0 ? SUN_DATA.color : "#ccc";
      ctx.font = i === 0 ? "bold 16px sans-serif" : "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(line, cardX + padding, y);
    });
    return;
  }

  // Cuerpos orbitales: planetas y planetas enanos
  const lines = [
    `${body.symbol} ${body.name}`,
    `Categoría: ${capitalize(body.category)}`,
    `Distancia al Sol: ${fmt(body.semiMajorAxis)} UA`,
    `Excentricidad: ${body.eccentricity.toFixed(4)}`,
    `Inclinación: ${body.inclination.toFixed(2)}°`,
    `Período orbital: ${formatDays(body.orbitalPeriod)}`,
    `Velocidad orbital: ${body.orbitalSpeed} km/s`,
    body.mass ? `Masa: ${body.mass}` : null,
    body.temperature ? `Temperatura: ${body.temperature}` : null,
    body.ringDescription ? `Anillos: ${body.ringDescription}` : null
  ].filter(Boolean);

  const cardHeight = padding * 2 + lines.length * lineHeight;
  let cardX = body.screenX + 30;
  let cardY = body.screenY - cardHeight / 2;

  if (cardX + cardWidth > ctx.canvas.width) cardX = body.screenX - cardWidth - 30;
  if (cardY < 10) cardY = 10;
  if (cardY + cardHeight > ctx.canvas.height) cardY = ctx.canvas.height - cardHeight - 10;

  ctx.fillStyle = "rgba(20, 20, 40, 0.92)";
  ctx.strokeStyle = hexToRGBA(body.color, 0.6);
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 8);
  ctx.fill();
  ctx.stroke();

  lines.forEach((line, i) => {
    const y = cardY + padding + i * lineHeight;
    ctx.fillStyle = i === 0 ? body.color : "#ccc";
    ctx.font = i === 0 ? "bold 16px sans-serif" : "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(line, cardX + padding, y);
  });
}

/** Inicializa el canvas y los event listeners */
export function initUI(canvas) {
  const ctx = canvas.getContext("2d");

  // Responsive: adaptar al tamaño de la ventana
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    state.canvasWidth = canvas.width;
    state.canvasHeight = canvas.height;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Generar asteroides una sola vez
  asteroidCache = generateAsteroids();

  // Eventos de ratón para rotación de cámara
  canvas.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      state.isDragging = true;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
    }
  });

  window.addEventListener("mousemove", (e) => {
    // Actualizar posición para hover detection
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

    if (state.isDragging) {
      const dx = e.clientX - state.lastMouseX;
      const dy = e.clientY - state.lastMouseY;
      state.cameraYaw += dx * 0.005;
      state.cameraPitch += dy * 0.005;

      // Limitar pitch para no invertir la vista
      state.cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, state.cameraPitch));

      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
    }
  });

  window.addEventListener("mouseup", () => {
    state.isDragging = false;
  });

  // Zoom con rueda del ratón
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      state.cameraZoom *= zoomFactor;
      state.cameraZoom = Math.max(0.1, Math.min(5, state.cameraZoom));
      // Sincronizar slider y display
      const slider = document.getElementById("slider-zoom");
      if (slider) {
        slider.value = state.cameraZoom;
        const display = document.getElementById("zoom-value");
        if (display) display.textContent = state.cameraZoom.toFixed(1);
      }
    },
    { passive: false }
  );

  // Dibujado principal (se llama desde el bucle de animación)
  function render() {
    // Reset hover card al inicio de cada frame
    state.hoveredBody = null;

    const W = canvas.width;
    const H = canvas.height;

    // Fondo estrellado
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, W, H);

    // Estrellas de fondo (generadas aleatoriamente pero con seed fijo por frame)
    drawStars(ctx, W, H);

    const allPositions = calculateAllPositions();

    // Dibujar órbitas si están visibles
    if (state.showOrbits) {
      drawOrbitPaths(ctx);
    }

    // Dibujar cinturón de asteroides
    if (state.showAsteroids) {
      for (const ast of asteroidCache) {
        const proj = projectPosition(ast.x, ast.y, ast.z);
        ctx.fillStyle = `rgba(180, 170, 150, ${ast.brightness})`;
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Z-sorting: ordenar por profundidad (de mayor z a menor z = atrás → adelante)
    allPositions.sort((a, b) => b.depthZ - a.depthZ);

    // Dibujar cuerpos celestes con Z-sorting
    for (const body of allPositions) {
      drawBody(ctx, body);
    }

    // Dibujar panel de hover si hay cuerpo sobre el cursor
    if (state.hoveredBody) {
      drawHoverCard(ctx, state.hoveredBody);
    }
  }

  // Exponer render para ser llamado desde main.js
  window._render = render;
}
