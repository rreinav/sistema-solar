# Sistema Solar

Visualización interactiva del sistema solar en el navegador, con datos astronómicos reales, animación proporcional a los períodos orbitales y herramientas de control completas.

## Características

- **Planetas, planetas enanos y cinturones de asteroides**
- **Fuentes** Wikipedia en la medida de lo posible
- **Escala logarítmica** para las distancias reales (UA) — permite visualizar Mercurio hasta Neptuno en un solo plano
- **Velocidades proporcionales** a los períodos orbitales y de rotación reales (1 año real = 10 s de simulación)
- **Sol siempre centrado** en el canvas

## Controles (menu vertical situado en la derecha)

| Control | Acción |
|---|---|
| `Velocidad:` | Etiqueta de sección |
| `──○─── 1×` | Deslizador (rango 0–8, paso 0.5) con valor numérico a la derecha |
| `⏸  1×  4×  8×` | Botones rápidos: pausa/play y velocidades predefinidas |
| `Planetas` | Checkbox para mostrar/ocultar los planetas |
| `Planetas enanos` | Checkbox para mostrar/ocultar los planetas enanos |
| `Cinturones de asteroides` | Checkbox para mostrar/ocultar los cinturones de asteroides |
| `Inclinación` | Select con distintos angulos de inclinación (0, 25, 50, 75, 90) |
| `−  1.0×  +` | Controles de zoom (botones) + rueda del ratón centrada en el Sol |
| Hover sobre un astro | Muestra su nombre y datos informativos |

## Tecnologías

- HTML5, JavaScript vanilla — sin dependencias externas, CSS (variables y flexbox) — interfaz flotante responsive

## Ejecución local

Abre `src/index.html` en cualquier navegador moderno (Chrome, Edge, Firefox). No se requiere servidor ni dependencias externas.
