// Utilidades generales: dibujo, formato de texto y colores

/** Dibuja un rectángulo con esquinas redondeadas */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Convierte hex a RGBA */
export function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Aclara un color hex */
export function lightenColor(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Capitaliza texto */
export function capitalize(str) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Formatea días en años si supera 365 */
export function formatDays(days) {
  const d = parseFloat(days);
  if (d >= 365.25) {
    const years = (d / 365.25).toFixed(1);
    return `${years} años (${Math.round(d)} días)`;
  }
  return `${Math.round(d)} días`;
}
