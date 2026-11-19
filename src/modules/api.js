// Datos astronómicos reales extraídos de investigacion/
// ⚠️ Valores numéricos en formato JS (punto decimal). Strings descriptivos usan Intl para es-ES.

const fmt = (n) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3 }).format(n);

export const SUN_DATA = {
  name: "Sol",
  symbol: "☉",
  category: "star",
  color: "#FDB813",
  visualRadius: 28,
  mass: "1,989 × 10³⁰ kg",
  radius: "~1.392.680 km (1 R☉)",
  temperature: "~5.505 °C (superficial)",
  type: "Enana amarilla (G2V)",
  composition: "~73% H, ~25% He",
  rotationPeriod: "~25,05 días (ecuador)"
};

export const CELESTIAL_BODIES = [
  {
    // Mercurio
    name: "Mercurio",
    symbol: "☿",
    category: "planet",
    color: "#A5A5A5",
    visualRadius: 4,
    hasRings: false,
    semiMajorAxis: 0.387,
    eccentricity: 0.2056,
    inclination: 7.0,
    orbitalPeriod: 87.969,
    orbitalSpeed: 47.36,
    mass: "3,301 × 10²³ kg",
    temperature: "-173 °C a 427 °C",
    description: `Semieje: ${fmt(0.387)} UA · e=${fmt(0.2056)} · i=${fmt(7.0)}°`
  },
  {
    // Venus
    name: "Venus",
    symbol: "♀",
    category: "planet",
    color: "#E8CDA0",
    visualRadius: 7,
    hasRings: false,
    semiMajorAxis: 0.723,
    eccentricity: 0.0068,
    inclination: 3.39,
    orbitalPeriod: 224.701,
    orbitalSpeed: 35.02,
    mass: "4,867 × 10²⁴ kg",
    temperature: "~462 °C",
    description: `Semieje: ${fmt(0.723)} UA · e=${fmt(0.0068)} · i=${fmt(3.39)}°`
  },
  {
    // Tierra
    name: "Tierra",
    symbol: "🜨",
    category: "planet",
    color: "#6B93D6",
    visualRadius: 7,
    hasRings: false,
    semiMajorAxis: 1.0,
    eccentricity: 0.0167,
    inclination: 0.0,
    orbitalPeriod: 365.256,
    orbitalSpeed: 29.78,
    mass: "5,972 × 10²⁴ kg",
    temperature: "~15 °C",
    description: `Semieje: ${fmt(1.0)} UA · e=${fmt(0.0167)} · i=${fmt(0.0)}°`
  },
  {
    // Marte
    name: "Marte",
    symbol: "♂",
    category: "planet",
    color: "#C1440E",
    visualRadius: 5,
    hasRings: false,
    semiMajorAxis: 1.524,
    eccentricity: 0.0934,
    inclination: 1.85,
    orbitalPeriod: 686.98,
    orbitalSpeed: 24.07,
    mass: "6,417 × 10²³ kg",
    temperature: "~-63 °C",
    description: `Semieje: ${fmt(1.524)} UA · e=${fmt(0.0934)} · i=${fmt(1.85)}°`
  },
  {
    // Júpiter
    name: "Júpiter",
    symbol: "♃",
    category: "planet",
    color: "#C88B3A",
    visualRadius: 16,
    hasRings: true,
    ringDescription: "4 anillos muy tenues",
    semiMajorAxis: 5.203,
    eccentricity: 0.0489,
    inclination: 1.3,
    orbitalPeriod: 4332.59,
    orbitalSpeed: 13.07,
    mass: "1,898 × 10²⁷ kg",
    temperature: "~-108 °C",
    description: `Semieje: ${fmt(5.203)} UA · e=${fmt(0.0489)} · i=${fmt(1.3)}°`
  },
  {
    // Saturno
    name: "Saturno",
    symbol: "♄",
    category: "planet",
    color: "#EAD6B8",
    visualRadius: 14,
    hasRings: true,
    ringDescription: "Sistema A-G, espectaculares (126.500–368.000 km)",
    semiMajorAxis: 9.537,
    eccentricity: 0.0565,
    inclination: 2.49,
    orbitalPeriod: 10759.22,
    orbitalSpeed: 9.69,
    mass: "5,683 × 10²⁶ kg",
    temperature: "~-139 °C",
    description: `Semieje: ${fmt(9.537)} UA · e=${fmt(0.0565)} · i=${fmt(2.49)}°`
  },
  {
    // Urano
    name: "Urano",
    symbol: "⛢",
    category: "planet",
    color: "#D1E7E7",
    visualRadius: 10,
    hasRings: true,
    ringDescription: "13 anillos tenues (desc. 1977)",
    semiMajorAxis: 19.19,
    eccentricity: 0.0457,
    inclination: 0.77,
    orbitalPeriod: 30688.5,
    orbitalSpeed: 6.81,
    mass: "8,681 × 10²⁵ kg",
    temperature: "~-197 °C",
    description: `Semieje: ${fmt(19.19)} UA · e=${fmt(0.0457)} · i=${fmt(0.77)}°`
  },
  {
    // Neptuno
    name: "Neptuno",
    symbol: "♆",
    category: "planet",
    color: "#5B5DDF",
    visualRadius: 10,
    hasRings: true,
    ringDescription: "5 anillos tenues (desc. 1984–1989)",
    semiMajorAxis: 30.07,
    eccentricity: 0.0113,
    inclination: 1.77,
    orbitalPeriod: 60182.0,
    orbitalSpeed: 5.43,
    mass: "1,024 × 10²⁶ kg",
    temperature: "~-201 °C",
    description: `Semieje: ${fmt(30.07)} UA · e=${fmt(0.0113)} · i=${fmt(1.77)}°`
  },
  {
    // Ceres
    name: "Ceres",
    symbol: "⚳",
    category: "dwarf_planet",
    color: "#8C8C8C",
    visualRadius: 3,
    hasRings: false,
    semiMajorAxis: 2.767,
    eccentricity: 0.0761,
    inclination: 10.59,
    orbitalPeriod: 1681.7,
    orbitalSpeed: 17.37,
    mass: "9,393 × 10²⁰ kg",
    temperature: "~-105 °C",
    description: `Semieje: ${fmt(2.767)} UA · e=${fmt(0.0761)} · i=${fmt(10.59)}°`
  },
  {
    // Plutón
    name: "Plutón",
    symbol: "♇",
    category: "dwarf_planet",
    color: "#9E8260",
    visualRadius: 3,
    hasRings: false,
    semiMajorAxis: 39.482,
    eccentricity: 0.2488,
    inclination: 17.16,
    orbitalPeriod: 9056.0,
    orbitalSpeed: 4.74,
    mass: "1,303 × 10²² kg",
    temperature: "~-229 °C",
    description: `Semieje: ${fmt(39.482)} UA · e=${fmt(0.2488)} · i=${fmt(17.16)}°`
  },
  {
    // Eris
    name: "Eris",
    symbol: "⯲",
    category: "dwarf_planet",
    color: "#E8E4E0",
    visualRadius: 3,
    hasRings: false,
    semiMajorAxis: 67.691,
    eccentricity: 0.4364,
    inclination: 44.04,
    orbitalPeriod: 161595.0,
    orbitalSpeed: 3.45,
    mass: "1,66 × 10²² kg",
    temperature: "~-243 °C",
    description: `Semieje: ${fmt(67.691)} UA · e=${fmt(0.4364)} · i=${fmt(44.04)}°`
  },
  {
    // Haumea
    name: "Haumea",
    symbol: "⯰",
    category: "dwarf_planet",
    color: "#C9C2B5",
    visualRadius: 3,
    hasRings: true,
    ringDescription: "Anillo plano (desc. 2017)",
    semiMajorAxis: 43.135,
    eccentricity: 0.2422,
    inclination: 28.19,
    orbitalPeriod: 103327.0,
    orbitalSpeed: 4.16,
    mass: "4,006 × 10²¹ kg",
    temperature: "~-241 °C",
    description: `Semieje: ${fmt(43.135)} UA · e=${fmt(0.2422)} · i=${fmt(28.19)}°`
  },
  {
    // Makemake
    name: "Makemake",
    symbol: "⯱",
    category: "dwarf_planet",
    color: "#BFA27A",
    visualRadius: 3,
    hasRings: false,
    semiMajorAxis: 45.746,
    eccentricity: 0.1704,
    inclination: 28.96,
    orbitalPeriod: 112991.0,
    orbitalSpeed: 3.95,
    mass: "~3,1 × 10²¹ kg",
    temperature: "~-229 °C",
    description: `Semieje: ${fmt(45.746)} UA · e=${fmt(0.1704)} · i=${fmt(28.96)}°`
  }
];

export const ASTEROID_BELTS = [
  {
    name: "Cinturón principal",
    location: "Entre Marte y Júpiter (2,2–3,2 UA)",
    inclination: 5.0,
    suggestedCount: 500
  },
  {
    name: "Cinturón de Kuiper",
    location: "Más allá de Neptuno (30–50 UA)",
    inclination: 1.5,
    suggestedCount: 300
  },
  {
    name: "Nube de Oort",
    location: "Heliósfera exterior (2.000–100.000 UA)",
    inclination: 90, // Distribución esférica
    suggestedCount: 500
  }
];
