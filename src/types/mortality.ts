export interface CauseBreakdown {
  cardiovascular: number;
  cancer: number;
  respiratory: number;
  diabetes: number;
  infectious: number;
  accidents: number;
  other: number;
}

export interface AgeGroup {
  range: string;
  deaths: number;
  population: number;
}

export interface MortalityData {
  country: string;
  countryCode: string;
  region?: string; // For US states, EU countries
  year: number;
  population: number;
  totalDeaths: number;
  mortalityRate: number; // Per 100,000
  lifeExpectancy: number;
  causeBreakdown: CauseBreakdown;
  preventableDeaths: number;
  preventablePercentage: number;
  ageGroups: AgeGroup[];
  healthcareSpendingPerCapita?: number;
  gdpPerCapita?: number;
}

export interface CountryInfo {
  name: string;
  code: string;
  region: 'North America' | 'Europe';
  latitude: number;
  longitude: number;
}

export interface YearlyTrend {
  year: number;
  value: number;
}

export interface MetricSummary {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: YearlyTrend[];
}