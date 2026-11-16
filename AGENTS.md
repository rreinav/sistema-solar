## Reglas personales
- Responde siempre en español, sin importar el idioma de los archivos o mensajes del sistema.
- Mantén el código, nombres de variables y comandos técnicos en inglés, pero redacta todas las explicaciones y comentarios en español.

## Información del proyecto

### Descripción
Visualización 3D interactiva del sistema solar en el navegador usando Canvas 2D con proyección de perspectiva matemática, datos astronómicos reales, inclinación orbital, animación proporcional a períodos orbitales y controles completos.

### Estructura de archivos
```text
sistema-solar-qwen3.6/
├── AGENTS.md                   # Reglas y contexto para agentes
├── README.md                   # Documentación del proyecto
├── package.json                # Metadatos y scripts
├── src/
│   ├── index.html              # Punto de entrada HTML5
│   ├── global.css              # Estilos globales y variables CSS
│   ├── main.js                 # Orquestador principal y bucle animationFrame (type="module")
│   └── modules/                # Módulos ES6+ desacoplados (<250 líneas cada uno)
│       ├── api.js              # Datos astronómicos reales extraídos de investigacion/
│       ├── state.js            # Estado global unificado (cámara, sim, visibilidad, mouse, canvas, resetState)
│       ├── math3d.js           # Cinemática orbital 3D (x, y, z), rotación de cámara y proyección 2D
│       ├── helpers.js          # Utilidades: roundRect, hexToRGBA, lightenColor, formatDays, capitalize
│       ├── ui.js               # Renderizado en canvas (Z-sorting), eventos de ratón y tarjeta hover
│       └── controls.js         # Panel de controles lateral (velocidad, pausa, toggles, inclinación)
└── investigacion/              # Documentación astronómica de referencia (ya completada)
    ├── sol.md
    ├── planetas-interiores.md
    ├── planetas-exteriores.md
    └── planetas-enanos.md
```

### Tecnologías y ejecución
- **HTML5 semántico:** Uso estricto de `header`, `main`, `section`, `nav`, `aside` y `canvas`.
- **CSS3 moderno:** Variables personalizadas (`:root`), Grid, Flexbox y unidades relativas en `src/global.css`.
- **JavaScript ES6+ nativo:** ES Modules (`<script type="module" src="main.js">`), sin frameworks ni librerías externas.
- **Ejecución local:** No abrir `index.html` con doble clic (`file://`) por bloqueo CORS de módulos. Levantar servidor con `pnpm run dev` → `servor src/ index.html 1234 --reload` y abrir `http://localhost:1234`.

## Arquitectura del Motor 3D (Canvas 2D + Proyección Matemática)
- **Coordenadas espaciales `(x, y, z)`:** Calculadas en 3D usando distancia logarítmica basada en UA, ángulo orbital actual, excentricidad e inclinación orbital real respecto a la eclíptica.
- **Cámara orbital 3D:** Soporta rotación libre (`yaw` y `pitch` arrastrando con el ratón), `zoom` con la rueda del ratón y centrado automático en el Sol (`0, 0, 0`).
- **Proyección en perspectiva:** Transforma `(x, y, z)` rotados por la cámara en coordenadas de pantalla `(screenX, screenY)` y factor de escala aparente según la profundidad `z` (los objetos más cercanos se ven más grandes).
- **Ordenamiento por profundidad (Z-sorting):** Antes de dibujar cada fotograma, todos los cuerpos celestes y partículas se ordenan de mayor a menor profundidad `z` respecto a la cámara para garantizar una oclusión 3D correcta (que los planetas pasen por delante o detrás del Sol).
- **Detección de Hover 3D:** Se calcula comparando la posición del cursor con las coordenadas proyectadas `(screenX, screenY)` y el radio proyectado de cada cuerpo celeste.

## Características principales
- **Velocidades:** Proporcionales a períodos orbitales y de rotación reales (`1 año terrestre = 10 s` de simulación por defecto).
- **Controles:** Panel lateral vertical para velocidad de simulación, pausa/reanudar, reinicio de cámara 3D, zoom, select de ángulo de inclinación (0°, 25°, 50°, 75°, 90°), filtros de visibilidad (planetas, cinturón de asteroides, planetas enanos, órbitas, etiquetas) y tarjeta flotante (`hover`) con ficha astronómica.

## Herramientas disponibles
- `webfetch`: ✅ Disponible para consultar URLs si hiciera falta.
- `websearch`: ❌ No disponible (error HTTP 402) — nunca intentar usarla.

## Estado actual del proyecto
- Todos los módulos están implementados y funcionando (6 archivos JS en `src/modules/` + `main.js`).
- Duplicados eliminados: `src/state.js` y `src/math3d.js` removidos. Consolidación completa a `src/modules/state.js`.
- No se han configurado scripts de lint/format — son mejoras futuras opcionales.

## Revisión pendiente
1. **Órbitas planetarias** — trayectorias elípticas con excentricidad e inclinación adecuadas.
   - Los planetas parece que sí se muestran correctamente.
   - Los planetas enanos (excepto Ceres) parecen tener trayectorias incorrectas.
2. **Posiciones de los planetas** — posición orbital basada en parámetros keplerianos.
   - Parece que sí.
3. **Renderizado 3D** — proyección perspectiva, Z-sorting y oclusión correcta.
   - Confirmado: funciona (planetas más cercanos se ven más grandes, oclusión correcta).
4. **Controles** — panel lateral con velocidad, pausa, inclinación y toggles de visibilidad.
   - Velocidad: funciona correctamente.
   - Pausa: funciona bien, pero debe moverse junto a los botones de velocidad. Al pausar desactiva las etiquetas; al reanudarlas activa.
   - Inclinación: funciona correctamente.
   - Visibilidad: funcionan cinturón de asteroides y órbitas; no funcionan planetas, planetas enanos ni etiquetas.
5. **Hover cards** — ficha astronómica al pasar el mouse sobre un planeta.
   - Aparece correctamente, pero debe desaparecer al quitar el cursor del planeta.

## Convenciones de código y estilo
- **Edición quirúrgica:** Lee solo las secciones necesarias antes de editar y aplica cambios precisos sin reescribir archivos completos.
- **Modularidad estricta:** Mantén cada archivo en `src/modules/` por debajo de **250 líneas**. Si `ui.js` crece demasiado, extrae el panel de controles a `src/modules/controls.js`.
- **Nomenclatura y unidades (UAI):** `1 UA = 149597870.7 km`. Símbolos: Sol (`☉`), Mercurio (`☿`), Venus (`♀`), Tierra (`🜨`), Marte (`♂`), Júpiter (`♃`), Saturno (`♄`), Urano (`⛢`), Neptuno (`♆`).
- **Formato numérico (Crítico):**
  - En **Markdown e interfaz visual (HTML)**, usa coma decimal y punto de miles (`149.597.870,7`).
  - En **código (`.js`, `.json`)**, usa siempre punto decimal estándar (`149597870.7`) y formatea para mostrar al usuario con `new Intl.NumberFormat('es-ES')`.
