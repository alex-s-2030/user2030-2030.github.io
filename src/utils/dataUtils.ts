import { MortalityData, MetricSummary } from '@/types/mortality';

export function getLatestYear(data: MortalityData[]): number {
  return Math.max(...data.map(d => d.year));
}

export function getEarliestYear(data: MortalityData[]): number {
  return Math.min(...data.map(d => d.year));
}

export function getCountryDataByYear(
  data: MortalityData[],
  countryCode: string,
  year: number
): MortalityData | undefined {
  return data.find(d => d.countryCode === countryCode && d.year === year);
}

export function getCountryTimeSeries(
  data: MortalityData[],
  countryCode: string
): MortalityData[] {
  return data
    .filter(d => d.countryCode === countryCode)
    .sort((a, b) => a.year - b.year);
}

export function calculateMetricSummary(
  data: MortalityData[],
  metric: keyof MortalityData
): MetricSummary {
  const latestYear = getLatestYear(data);
  const previousYear = latestYear - 1;
  
  const latestData = data.filter(d => d.year === latestYear);
  const previousData = data.filter(d => d.year === previousYear);
  
  const current = latestData.reduce((sum, d) => {
    const value = d[metric];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0) / latestData.length;
  
  const previous = previousData.reduce((sum, d) => {
    const value = d[metric];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0) / previousData.length;
  
  const change = current - previous;
  const changePercentage = (change / previous) * 100;
  
  // Get trend data for all years
  const allYears = Array.from(new Set(data.map(d => d.year))).sort();
  const trend = allYears.map(year => {
    const yearData = data.filter(d => d.year === year);
    const value = yearData.reduce((sum, d) => {
      const val = d[metric];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0) / yearData.length;
    
    return { year, value };
  });
  
  return {
    current: Math.round(current * 100) / 100,
    previous: Math.round(previous * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercentage: Math.round(changePercentage * 100) / 100,
    trend,
  };
}

export function getRegionalAverage(
  data: MortalityData[],
  region: 'North America' | 'Europe',
  metric: keyof MortalityData,
  year: number
): number {
  const countries = region === 'North America' 
    ? ['US', 'CA', 'MX']
    : ['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO'];
  
  const regionData = data.filter(
    d => countries.includes(d.countryCode) && d.year === year
  );
  
  if (regionData.length === 0) return 0;
  
  const sum = regionData.reduce((acc, d) => {
    const value = d[metric];
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);
  
  return Math.round((sum / regionData.length) * 100) / 100;
}

export function getTopCountries(
  data: MortalityData[],
  metric: keyof MortalityData,
  year: number,
  limit: number = 5,
  ascending: boolean = true
): MortalityData[] {
  const yearData = data.filter(d => d.year === year);
  
  return yearData
    .filter(d => typeof d[metric] === 'number')
    .sort((a, b) => {
      const aVal = a[metric] as number;
      const bVal = b[metric] as number;
      return ascending ? aVal - bVal : bVal - aVal;
    })
    .slice(0, limit);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getYearRange(data: MortalityData[]): number[] {
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  return years;
}