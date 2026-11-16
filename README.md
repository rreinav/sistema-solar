# Sistema Solar

Visualización interactiva del sistema solar en el navegador, con datos astronómicos reales, animación proporcional a los períodos orbitales y herramientas de control completas.

## Características

- **Planetas, planetas enanos y cinturones de asteroides**
- **Fuentes** Wikipedia en la medida de lo posible
- **Escala logarítmica** para las distancias reales (UA) — permite visualizar Mercurio hasta Neptuno en un solo plano
- **Velocidades proporcionales** a los períodos orbitales y de rotación reales (1 año real = 10 s de simulación)
- **Sol siempre centrado** en el canvas

## Controles (panel lateral derecho)

| Control | Acción |
|---|---|
| `×1  ×10  ×100` | Botones de velocidad de simulación |
| `⏸ Pausar / ▶ Reanudar` | Pausa y reanudación de la simulación |
| `🔄 Reiniciar cámara` | Restaura vista a posición por defecto (yaw=0.5, pitch=0.4) |
| `Inclinación` | Select: Plana (0°), Media (25°), Inclinada (50°), Marginal (75°), Lateral (90°) |
| `☑ Planetas` | Mostrar/ocultar planetas |
| `☑ Cinturón de asteroides` | Mostrar/ocultar cinturón de asteroides |
| `☑ Planetas enanos` | Mostrar/ocultar planetas enanos |
| `☑ Órbitas` | Mostrar/ocultar líneas orbitales |
| `☑ Etiquetas` | Mostrar/ocultar nombres de cuerpos celestes |
| Rueda del ratón | Zoom (centrado en el Sol) |
| Arrastrar con ratón | Rotación libre de cámara (yaw y pitch) |
| Hover sobre un astro | Muestra tarjeta flotante con datos astronómicos |

## Barra de estado (inferior del panel)

Muestra el día actual de simulación (`Día X`) y el estado: velocidad activa o `⏸ Pausado`.

## Tecnologías

- HTML5, JavaScript vanilla — sin dependencias externas, CSS (variables y flexbox) — interfaz flotante responsive

## Ejecución local

Levantar un servidor local (ej. `npx servor src/ index.html 1234 --reload`) y abrir `http://localhost:1234`. Los módulos ES6+ (`type="module"`) requieren protocolo `http(s)` — abrir con doble clic (`file://`) generará error de CORS.
