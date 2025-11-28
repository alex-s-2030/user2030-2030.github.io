// Consistent color mapping for countries across all visualizations
export const COUNTRY_COLORS: Record<string, string> = {
  // North America
  US: '#3b82f6',      // Blue
  CA: '#ef4444',      // Red
  MX: '#10b981',      // Green
  
  // Western Europe
  GB: '#8b5cf6',      // Purple
  FR: '#ec4899',      // Pink
  DE: '#f59e0b',      // Orange
  IT: '#14b8a6',      // Teal
  ES: '#f97316',      // Orange-Red
  NL: '#06b6d4',      // Cyan
  BE: '#6366f1',      // Indigo
  CH: '#84cc16',      // Lime
  AT: '#a855f7',      // Purple-Pink
  
  // Northern Europe
  SE: '#0ea5e9',      // Sky Blue
  NO: '#22c55e',      // Green
  DK: '#eab308',      // Yellow
  FI: '#06b6d4',      // Cyan
  
  // Southern Europe  
  GR: '#f43f5e',      // Rose
  PT: '#8b5cf6',      // Purple
  
  // Eastern Europe
  PL: '#64748b',      // Slate
  CZ: '#71717a',      // Zinc
};

export function getCountryColor(countryCode: string): string {
  return COUNTRY_COLORS[countryCode] || 'hsl(var(--chart-1))';
}