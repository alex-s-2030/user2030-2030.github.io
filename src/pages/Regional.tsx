import { useState, useMemo } from 'react';
import { mortalityData, countries } from '@/data/mockData';
import { getLatestYear, getCountryDataByYear } from '@/utils/dataUtils';
import { CountryCard } from '@/components/regional/CountryCard';
import { ComparisonTable } from '@/components/regional/ComparisonTable';
import { GeographicHeatMap } from '@/components/regional/GeographicHeatMap';
import { GeographicMapView } from '@/components/regional/GeographicMapView';
import { SmallMultiples } from '@/components/regional/SmallMultiples';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Regional() {
  const latestYear = getLatestYear(mortalityData);
  const [selectedYear, setSelectedYear] = useState(latestYear);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [searchQuery, setSearchQuery] = useState('');
  const [heatMapMetric, setHeatMapMetric] = useState<'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage'>('lifeExpectancy');
  const [smallMultiplesMetric, setSmallMultiplesMetric] = useState<'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage'>('lifeExpectancy');
  const [comparisonCountries, setComparisonCountries] = useState<string[]>(['US', 'GB', 'DE', 'FR', 'CA', 'IT', 'ES', 'SE']);

  const availableYears = useMemo(() => {
    return Array.from(new Set(mortalityData.map(d => d.year))).sort((a, b) => b - a);
  }, []);

  const currentCountryData = useMemo(() => {
    return getCountryDataByYear(mortalityData, selectedCountry, selectedYear);
  }, [selectedCountry, selectedYear]);

  const previousYearData = useMemo(() => {
    return getCountryDataByYear(mortalityData, selectedCountry, selectedYear - 1);
  }, [selectedCountry, selectedYear]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    return countries.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const regionGroups = useMemo(() => {
    const groups: Record<string, typeof countries> = {
      'North America': [],
      'Western Europe': [],
      'Northern Europe': [],
      'Eastern Europe': [],
    };

    filteredCountries.forEach(country => {
      if (['US', 'CA', 'MX'].includes(country.code)) {
        groups['North America'].push(country);
      } else if (['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH'].includes(country.code)) {
        groups['Western Europe'].push(country);
      } else if (['SE', 'NO', 'DK', 'FI'].includes(country.code)) {
        groups['Northern Europe'].push(country);
      } else {
        groups['Eastern Europe'].push(country);
      }
    });

    return groups;
  }, [filteredCountries]);

  const toggleComparisonCountry = (code: string) => {
    if (comparisonCountries.includes(code)) {
      setComparisonCountries(comparisonCountries.filter(c => c !== code));
    } else {
      setComparisonCountries([...comparisonCountries, code]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Regional Deep-Dive</h1>
          <p className="text-muted-foreground">
            Detailed country and regional analysis with interactive visualizations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Country Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Country Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Year Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm">Year</Label>
                    <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
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

                  {/* Search */}
                  <div className="space-y-2">
                    <Label className="text-sm">Search Country</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Country List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(regionGroups).map(([region, regionCountries]) => {
                      if (regionCountries.length === 0) return null;
                      
                      return (
                        <div key={region} className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                            {region}
                          </p>
                          {regionCountries.map(country => (
                            <button
                              key={country.code}
                              onClick={() => setSelectedCountry(country.code)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedCountry === country.code
                                  ? 'bg-primary text-primary-foreground font-medium'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              {country.name}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Country Detail Card */}
            {currentCountryData && (
              <CountryCard data={currentCountryData} previousYearData={previousYearData} />
            )}

            {/* Tabs for different views */}
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map">Geographic View</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Geographic Map View</h2>
                  <Select
                    value={heatMapMetric}
                    onValueChange={(v: any) => setHeatMapMetric(v)}
                  >
                    <SelectTrigger className="w-52">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lifeExpectancy">Life Expectancy</SelectItem>
                      <SelectItem value="mortalityRate">Mortality Rate</SelectItem>
                      <SelectItem value="preventablePercentage">Preventable Deaths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <GeographicMapView
                  data={mortalityData}
                  year={selectedYear}
                  metric={heatMapMetric}
                  onCountryClick={(code) => setSelectedCountry(code)}
                />
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Country Comparison</h2>
                      <p className="text-sm text-muted-foreground">
                        Sortable table with all countries and key metrics
                      </p>
                    </div>
                  </div>
                  <ComparisonTable data={mortalityData} year={selectedYear} />
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Trend Comparison</h2>
                      <p className="text-sm text-muted-foreground">
                        Small multiples showing trends for selected countries
                      </p>
                    </div>
                    <Select
                      value={smallMultiplesMetric}
                      onValueChange={(v: any) => setSmallMultiplesMetric(v)}
                    >
                      <SelectTrigger className="w-52">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lifeExpectancy">Life Expectancy</SelectItem>
                        <SelectItem value="mortalityRate">Mortality Rate</SelectItem>
                        <SelectItem value="preventablePercentage">Preventable Deaths</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Country selection for small multiples */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Select Countries to Compare</CardTitle>
                      <CardDescription>
                        Click countries to add or remove from comparison
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {countries.map(country => (
                          <Badge
                            key={country.code}
                            variant={comparisonCountries.includes(country.code) ? 'default' : 'outline'}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => toggleComparisonCountry(country.code)}
                          >
                            {country.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <SmallMultiples
                    data={mortalityData}
                    countries={comparisonCountries}
                    metric={smallMultiplesMetric}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}