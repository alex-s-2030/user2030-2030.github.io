import { MortalityData, CountryInfo } from '@/types/mortality';

export const countries: CountryInfo[] = [
  // North America
  { name: 'United States', code: 'US', region: 'North America', latitude: 37.0902, longitude: -95.7129 },
  { name: 'Canada', code: 'CA', region: 'North America', latitude: 56.1304, longitude: -106.3468 },
  { name: 'Mexico', code: 'MX', region: 'North America', latitude: 23.6345, longitude: -102.5528 },
  
  // Western Europe
  { name: 'United Kingdom', code: 'GB', region: 'Europe', latitude: 55.3781, longitude: -3.4360 },
  { name: 'France', code: 'FR', region: 'Europe', latitude: 46.2276, longitude: 2.2137 },
  { name: 'Germany', code: 'DE', region: 'Europe', latitude: 51.1657, longitude: 10.4515 },
  { name: 'Italy', code: 'IT', region: 'Europe', latitude: 41.8719, longitude: 12.5674 },
  { name: 'Spain', code: 'ES', region: 'Europe', latitude: 40.4637, longitude: -3.7492 },
  { name: 'Netherlands', code: 'NL', region: 'Europe', latitude: 52.1326, longitude: 5.2913 },
  { name: 'Belgium', code: 'BE', region: 'Europe', latitude: 50.5039, longitude: 4.4699 },
  { name: 'Switzerland', code: 'CH', region: 'Europe', latitude: 46.8182, longitude: 8.2275 },
  
  // Northern Europe
  { name: 'Sweden', code: 'SE', region: 'Europe', latitude: 60.1282, longitude: 18.6435 },
  { name: 'Norway', code: 'NO', region: 'Europe', latitude: 60.4720, longitude: 8.4689 },
  { name: 'Denmark', code: 'DK', region: 'Europe', latitude: 56.2639, longitude: 9.5018 },
  { name: 'Finland', code: 'FI', region: 'Europe', latitude: 61.9241, longitude: 25.7482 },
  
  // Eastern Europe
  { name: 'Poland', code: 'PL', region: 'Europe', latitude: 51.9194, longitude: 19.1451 },
  { name: 'Czech Republic', code: 'CZ', region: 'Europe', latitude: 49.8175, longitude: 15.4730 },
  { name: 'Hungary', code: 'HU', region: 'Europe', latitude: 47.1625, longitude: 19.5033 },
  { name: 'Romania', code: 'RO', region: 'Europe', latitude: 45.9432, longitude: 24.9668 },
];

function generateAgeGroups(totalDeaths: number, countryCode: string, year: number): MortalityData['ageGroups'] {
  // Age distribution varies by country development level
  const agingFactor = ['IT', 'DE', 'ES'].includes(countryCode) ? 1.3 : 1.0;
  
  const baseDistribution = [
    { range: '0-14', proportion: 0.01, population: 15 },
    { range: '15-29', proportion: 0.02, population: 18 },
    { range: '30-44', proportion: 0.04, population: 20 },
    { range: '45-59', proportion: 0.12, population: 22 },
    { range: '60-74', proportion: 0.30 * agingFactor, population: 15 },
    { range: '75+', proportion: 0.51 * agingFactor, population: 10 },
  ];
  
  return baseDistribution.map(ag => ({
    range: ag.range,
    deaths: Math.round(totalDeaths * ag.proportion),
    population: ag.population * 1000000,
  }));
}

function generateCauseBreakdown(countryCode: string, year: number) {
  // Different mortality profiles for different regions
  const profiles: Record<string, any> = {
    'US': { cardiovascular: 0.30, cancer: 0.22, respiratory: 0.10, diabetes: 0.04, infectious: 0.02, accidents: 0.08, other: 0.24 },
    'MX': { cardiovascular: 0.26, cancer: 0.15, respiratory: 0.08, diabetes: 0.18, infectious: 0.05, accidents: 0.10, other: 0.18 },
    'GB': { cardiovascular: 0.28, cancer: 0.26, respiratory: 0.12, diabetes: 0.02, infectious: 0.02, accidents: 0.04, other: 0.26 },
    'DE': { cardiovascular: 0.32, cancer: 0.24, respiratory: 0.08, diabetes: 0.03, infectious: 0.02, accidents: 0.05, other: 0.26 },
    'IT': { cardiovascular: 0.34, cancer: 0.25, respiratory: 0.09, diabetes: 0.03, infectious: 0.02, accidents: 0.04, other: 0.23 },
    'SE': { cardiovascular: 0.30, cancer: 0.27, respiratory: 0.07, diabetes: 0.02, infectious: 0.01, accidents: 0.05, other: 0.28 },
    'PL': { cardiovascular: 0.38, cancer: 0.22, respiratory: 0.08, diabetes: 0.03, infectious: 0.03, accidents: 0.07, other: 0.19 },
  };
  
  const profile = profiles[countryCode] || profiles['US'];
  
  // Slight improvements over time in cardiovascular, increase in cancer
  const yearFactor = (year - 2010) * 0.002;
  
  return {
    cardiovascular: Math.max(0.15, profile.cardiovascular - yearFactor),
    cancer: profile.cancer + yearFactor * 0.5,
    respiratory: profile.respiratory,
    diabetes: profile.diabetes,
    infectious: profile.infectious,
    accidents: profile.accidents,
    other: profile.other,
  };
}

export function generateMortalityData(): MortalityData[] {
  const data: MortalityData[] = [];
  const startYear = 2010;
  const endYear = 2023;
  
  for (const country of countries) {
    // Base population and characteristics
    const basePopulation = country.code === 'US' ? 310000000 :
                          country.code === 'MX' ? 115000000 :
                          country.code === 'CA' ? 34000000 :
                          country.code === 'DE' ? 81000000 :
                          country.code === 'FR' ? 65000000 :
                          country.code === 'GB' ? 62000000 :
                          country.code === 'IT' ? 60000000 :
                          country.code === 'ES' ? 46000000 :
                          country.code === 'PL' ? 38000000 :
                          country.code === 'RO' ? 21000000 :
                          country.code === 'NL' ? 16500000 :
                          country.code === 'SE' ? 9400000 :
                          country.code === 'CH' ? 7800000 :
                          country.code === 'NO' ? 4900000 :
                          country.code === 'FI' ? 5400000 :
                          country.code === 'DK' ? 5500000 :
                          country.code === 'CZ' ? 10500000 :
                          country.code === 'HU' ? 10000000 :
                          5000000;
    
    const baseLifeExpectancy = country.code === 'CH' ? 83.0 :
                               country.code === 'ES' ? 82.5 :
                               country.code === 'IT' ? 82.3 :
                               country.code === 'SE' ? 82.0 :
                               country.code === 'NO' ? 81.8 :
                               country.code === 'FR' ? 81.5 :
                               country.code === 'CA' ? 81.2 :
                               country.code === 'NL' ? 81.0 :
                               country.code === 'GB' ? 80.5 :
                               country.code === 'DE' ? 80.3 :
                               country.code === 'US' ? 78.5 :
                               country.code === 'CZ' ? 78.0 :
                               country.code === 'PL' ? 76.5 :
                               country.code === 'HU' ? 75.5 :
                               country.code === 'RO' ? 74.0 :
                               country.code === 'MX' ? 75.5 :
                               78.0;
    
    const baseMortalityRate = country.code === 'MX' ? 620 :
                              country.code === 'RO' ? 1350 :
                              country.code === 'HU' ? 1300 :
                              country.code === 'PL' ? 1050 :
                              country.code === 'US' ? 850 :
                              country.code === 'GB' ? 920 :
                              country.code === 'CZ' ? 1080 :
                              country.code === 'IT' ? 1050 :
                              700;
    
    const baseHealthcareSpending = country.code === 'US' ? 11000 :
                                   country.code === 'CH' ? 9000 :
                                   country.code === 'NO' ? 7000 :
                                   country.code === 'DE' ? 6000 :
                                   country.code === 'SE' ? 5800 :
                                   country.code === 'NL' ? 5600 :
                                   country.code === 'FR' ? 5200 :
                                   country.code === 'CA' ? 5100 :
                                   country.code === 'GB' ? 4500 :
                                   country.code === 'IT' ? 3500 :
                                   country.code === 'ES' ? 3200 :
                                   country.code === 'CZ' ? 2200 :
                                   country.code === 'PL' ? 1800 :
                                   country.code === 'MX' ? 1100 :
                                   3000;
    
    const baseGdpPerCapita = country.code === 'US' ? 48000 :
                            country.code === 'CH' ? 85000 :
                            country.code === 'NO' ? 75000 :
                            country.code === 'NL' ? 52000 :
                            country.code === 'SE' ? 51000 :
                            country.code === 'DE' ? 46000 :
                            country.code === 'CA' ? 45000 :
                            country.code === 'FR' ? 40000 :
                            country.code === 'GB' ? 41000 :
                            country.code === 'IT' ? 32000 :
                            country.code === 'ES' ? 29000 :
                            country.code === 'CZ' ? 23000 :
                            country.code === 'PL' ? 15000 :
                            country.code === 'MX' ? 9000 :
                            30000;
    
    for (let year = startYear; year <= endYear; year++) {
      const yearProgress = (year - startYear) / (endYear - startYear);
      
      // Population growth
      const population = Math.round(basePopulation * (1 + yearProgress * 0.10));
      
      // Life expectancy generally improving (except US had decline 2020-2021)
      let lifeExpectancy = baseLifeExpectancy + yearProgress * 1.5;
      if (country.code === 'US' && year >= 2020 && year <= 2021) {
        lifeExpectancy -= 2.0; // COVID impact
      }
      
      // Mortality rate improving slightly, with COVID spike
      let mortalityRate = baseMortalityRate * (1 - yearProgress * 0.10);
      if (year === 2020 || year === 2021) {
        mortalityRate *= 1.15; // COVID spike
      }
      
      const totalDeaths = Math.round((mortalityRate / 100000) * population);
      
      // Preventable deaths (25-45% depending on healthcare quality)
      const preventablePercentage = country.code === 'US' ? 0.38 :
                                   country.code === 'MX' ? 0.45 :
                                   country.code === 'RO' ? 0.42 :
                                   ['CH', 'NO', 'SE', 'NL'].includes(country.code) ? 0.25 :
                                   0.32;
      
      const preventableDeaths = Math.round(totalDeaths * preventablePercentage);
      
      // Healthcare spending and GDP growth
      const healthcareSpending = Math.round(baseHealthcareSpending * (1 + yearProgress * 0.25));
      const gdpPerCapita = Math.round(baseGdpPerCapita * (1 + yearProgress * 0.20));
      
      const causeBreakdown = generateCauseBreakdown(country.code, year);
      const ageGroups = generateAgeGroups(totalDeaths, country.code, year);
      
      data.push({
        country: country.name,
        countryCode: country.code,
        year,
        population,
        totalDeaths,
        mortalityRate: Math.round(mortalityRate * 10) / 10,
        lifeExpectancy: Math.round(lifeExpectancy * 10) / 10,
        causeBreakdown,
        preventableDeaths,
        preventablePercentage: Math.round(preventablePercentage * 1000) / 10,
        ageGroups,
        healthcareSpendingPerCapita: healthcareSpending,
        gdpPerCapita,
      });
    }
  }
  
  return data;
}

export const mortalityData = generateMortalityData();