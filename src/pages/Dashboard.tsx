import { useState, useMemo } from 'react';
import { mortalityData, countries } from '@/data/mockData';
import { getLatestYear, getEarliestYear } from '@/utils/dataUtils';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { TemporalTrendsChart } from '@/components/charts/TemporalTrendsChart';
import { LifeExpectancyVisualization } from '@/components/charts/LifeExpectancyVisualization';
import { ComparativeScatterChart } from '@/components/charts/ComparativeScatterChart';
import { CausesOfDeathChart } from '@/components/charts/CausesOfDeathChart';
import { CountryComparisonChart } from '@/components/charts/CountryComparisonChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function Dashboard() {
  const minYear = getEarliestYear(mortalityData);
  const maxYear = getLatestYear(mortalityData);

  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'GB', 'DE', 'FR', 'CA']);
  const [selectedYear, setSelectedYear] = useState<number>(maxYear);
  const [comparisonMetric, setComparisonMetric] = useState<'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage' | 'healthcareSpendingPerCapita'>('lifeExpectancy');
  const [causeCountry, setCauseCountry] = useState<string>('US');

  const filteredData = useMemo(() => {
    return mortalityData.filter(
      d => d.year >= yearRange[0] && d.year <= yearRange[1]
    );
  }, [yearRange]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(filteredData.map(d => d.year))).sort((a, b) => b - a);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Exploratory Dashboard</h1>
          <p className="text-muted-foreground">
            Interactive visualizations for temporal trends, comparative analysis, and demographic breakdowns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filter Panel - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <FilterPanel
                yearRange={yearRange}
                onYearRangeChange={setYearRange}
                selectedCountries={selectedCountries}
                onCountriesChange={setSelectedCountries}
                minYear={minYear}
                maxYear={maxYear}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Life Expectancy Visualization Options */}
            <LifeExpectancyVisualization
              data={filteredData}
              selectedCountries={selectedCountries}
            />

            {/* Temporal Analysis Section */}
            <Tabs defaultValue="mortalityRate" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Additional Temporal Trends</h2>
                <TabsList>
                  <TabsTrigger value="mortalityRate">Mortality Rate</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="mortalityRate">
                <TemporalTrendsChart
                  data={mortalityData}
                  selectedCountries={selectedCountries}
                  metric="mortalityRate"
                />
              </TabsContent>
            </Tabs>

            {/* Comparative Analysis Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-foreground">Comparative Analysis</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="space-y-2 sm:min-w-40">
                    <Label className="text-sm">Year</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:min-w-52">
                    <Label className="text-sm">Metric</Label>
                    <Select
                      value={comparisonMetric}
                      onValueChange={(value: any) => setComparisonMetric(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lifeExpectancy">Life Expectancy</SelectItem>
                        <SelectItem value="mortalityRate">Mortality Rate</SelectItem>
                        <SelectItem value="preventablePercentage">Preventable Deaths</SelectItem>
                        <SelectItem value="healthcareSpendingPerCapita">Healthcare Spending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <CountryComparisonChart
                  data={filteredData}
                  year={selectedYear}
                  metric={comparisonMetric}
                  selectedCountries={selectedCountries}
                />
                <ComparativeScatterChart
                  data={filteredData}
                  year={selectedYear}
                />
              </div>
            </div>

            {/* Demographic Breakdown Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-foreground">Causes of Death Analysis</h2>
                <div className="space-y-2 sm:min-w-52">
                  <Label className="text-sm">Country</Label>
                  <Select
                    value={causeCountry}
                    onValueChange={setCauseCountry}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <CausesOfDeathChart
                data={filteredData}
                countryCode={causeCountry}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}