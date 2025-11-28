// Coordinates for country markers aligned to outline map (1000x500 viewBox)
export const COUNTRY_COORDINATES: Record<string, { x: number; y: number; name: string }> = {
  // North America
  CA: { x: 340, y: 180, name: 'Canada' },
  US: { x: 340, y: 290, name: 'United States' },
  MX: { x: 320, y: 400, name: 'Mexico' },
  
  // British Isles
  GB: { x: 520, y: 210, name: 'United Kingdom' },
  
  // Western Europe
  FR: { x: 555, y: 265, name: 'France' },
  ES: { x: 515, y: 320, name: 'Spain' },
  PT: { x: 485, y: 325, name: 'Portugal' },
  IT: { x: 595, y: 310, name: 'Italy' },
  
  // Central Europe
  DE: { x: 585, y: 225, name: 'Germany' },
  NL: { x: 565, y: 205, name: 'Netherlands' },
  BE: { x: 560, y: 220, name: 'Belgium' },
  CH: { x: 575, y: 265, name: 'Switzerland' },
  AT: { x: 610, y: 265, name: 'Austria' },
  CZ: { x: 605, y: 235, name: 'Czech Republic' },
  
  // Northern Europe (Scandinavia)
  NO: { x: 570, y: 120, name: 'Norway' },
  SE: { x: 605, y: 135, name: 'Sweden' },
  DK: { x: 580, y: 195, name: 'Denmark' },
  FI: { x: 640, y: 125, name: 'Finland' },
  
  // Eastern/Southern Europe
  PL: { x: 630, y: 225, name: 'Poland' },
  GR: { x: 650, y: 330, name: 'Greece' },
};