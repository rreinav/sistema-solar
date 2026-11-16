// Panel de controles UI (velocidad, pausa, toggles, inclinación)

import { state } from './state.js';

const DEG = Math.PI / 180;

/** Crea el panel de controles lateral */
export function createControls() {
  const panel = document.createElement('aside');
  panel.className = 'controls-panel';
  panel.innerHTML = `
    <header>☀️ Sistema Solar</header>

    <section class="control-group">
      <label>Velocidad</label>
      <div class="btn-group">
        <button data-speed="1" class="speed-btn active">×1</button>
        <button data-speed="10" class="speed-btn">×10</button>
        <button data-speed="100" class="speed-btn">×100</button>
      </div>
    </section>

    <section class="control-group">
      <button id="btn-pause">⏸ Pausar</button>
      <button id="btn-reset">🔄 Reiniciar cámara</button>
    </section>

    <section class="control-group">
      <label>Inclinación de vista</label>
      <select id="select-inclination">
        <option value="0">Plana (0°)</option>
        <option value="25">Media (25°)</option>
        <option value="50">Inclinada (50°)</option>
        <option value="75">Marginal (75°)</option>
        <option value="90">Lateral (90°)</option>
      </select>
    </section>

    <section class="control-group">
      <label>Opciones de visualización</label>
      <label class="toggle-label"><input type="checkbox" id="chk-planets" checked> Planetas</label>
      <label class="toggle-label"><input type="checkbox" id="chk-asteroids"> Cinturón de asteroides</label>
      <label class="toggle-label"><input type="checkbox" id="chk-dwarf" checked> Planetas enanos</label>
      <label class="toggle-label"><input type="checkbox" id="chk-orbits" checked> Órbitas</label>
      <label class="toggle-label"><input type="checkbox" id="chk-labels" checked> Etiquetas</label>
    </section>

    <nav class="status-bar">
      <span id="status-simtime">Día 0</span>
      <span id="status-info"></span>
    </nav>
  `;

  document.body.appendChild(panel);

  // Event listeners de los controles
  const btnPause = panel.querySelector('#btn-pause');
  const btnReset = panel.querySelector('#btn-reset');
  const selectInc = panel.querySelector('#select-inclination');
  const chkPlanets = panel.querySelector('#chk-planets');
  const chkAsteroids = panel.querySelector('#chk-asteroids');
  const chkDwarf = panel.querySelector('#chk-dwarf');
  const chkOrbits = panel.querySelector('#chk-orbits');
  const chkLabels = panel.querySelector('#chk-labels');

  // Velocidad
  panel.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.speedMultiplier = parseInt(btn.dataset.speed);
      panel.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Pausa
  btnPause.addEventListener('click', () => {
    state.paused = !state.paused;
    btnPause.textContent = state.paused ? '▶ Reanudar' : '⏸ Pausar';
  });

  // Reiniciar cámara
  btnReset.addEventListener('click', () => {
    state.cameraYaw = 0.5;
    state.cameraPitch = 0.4;
    state.cameraZoom = 1.0;
    state.viewInclination = 0;
    selectInc.value = '0';
  });

  // Inclinación
  selectInc.addEventListener('change', () => {
    const deg = parseFloat(selectInc.value);
    state.viewInclination = deg;
    state.cameraPitch = deg * DEG;
  });

  // Sincronizar toggles con estado inicial
  chkPlanets.checked = state.showPlanets;
  chkAsteroids.checked = state.showAsteroids;
  chkDwarf.checked = state.showDwarfPlanets;
  chkOrbits.checked = state.showOrbits;
  chkLabels.checked = state.showLabels;

  // Toggles
  chkPlanets.addEventListener('change', (e) => { state.showPlanets = e.target.checked; });
  chkAsteroids.addEventListener('change', (e) => { state.showAsteroids = e.target.checked; });
  chkDwarf.addEventListener('change', (e) => { state.showDwarfPlanets = e.target.checked; });
  chkOrbits.addEventListener('change', (e) => { state.showOrbits = e.target.checked; });
  chkLabels.addEventListener('change', (e) => { state.showLabels = e.target.checked; });

  // Actualizar status bar periódicamente
  setInterval(() => {
    const statusSimTime = panel.querySelector('#status-simtime');
    const statusInfo = panel.querySelector('#status-info');
    if (statusSimTime) statusSimTime.textContent = `Día ${Math.round(state.simTime)}`;
    if (statusInfo) statusInfo.textContent = state.paused ? '⏸ Pausado' : `×${state.speedMultiplier}`;
  }, 200);
}
