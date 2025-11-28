import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { countries } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterPanelProps {
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  minYear: number;
  maxYear: number;
}

export function FilterPanel({
  yearRange,
  onYearRangeChange,
  selectedCountries,
  onCountriesChange,
  minYear,
  maxYear,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const regions = {
    'North America': countries.filter(c => c.region === 'North America'),
    'Europe': countries.filter(c => c.region === 'Europe'),
  };

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      onCountriesChange(selectedCountries.filter(c => c !== code));
    } else {
      onCountriesChange([...selectedCountries, code]);
    }
  };

  const selectRegion = (region: 'North America' | 'Europe') => {
    const regionCodes = regions[region].map(c => c.code);
    const allSelected = regionCodes.every(code => selectedCountries.includes(code));
    
    if (allSelected) {
      onCountriesChange(selectedCountries.filter(c => !regionCodes.includes(c)));
    } else {
      const newSelection = [...new Set([...selectedCountries, ...regionCodes])];
      onCountriesChange(newSelection);
    }
  };

  const selectAll = () => {
    onCountriesChange(countries.map(c => c.code));
  };

  const clearAll = () => {
    onCountriesChange([]);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Customize your view</CardDescription>
          </div>
          <Filter className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Year Range Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Year Range</Label>
            <span className="text-sm font-medium text-muted-foreground">
              {yearRange[0]} - {yearRange[1]}
            </span>
          </div>
          <Slider
            value={yearRange}
            onValueChange={(value) => onYearRangeChange(value as [number, number])}
            min={minYear}
            max={maxYear}
            step={1}
            className="w-full"
          />
        </div>

        {/* Country Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Countries ({selectedCountries.length})</Label>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="h-7 text-xs"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 text-xs"
              >
                Clear
              </Button>
            </div>
          </div>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                {selectedCountries.length === 0
                  ? 'Select countries...'
                  : `${selectedCountries.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 border-b border-border">
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectRegion('North America')}
                    className="flex-1"
                  >
                    North America
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectRegion('Europe')}
                    className="flex-1"
                  >
                    Europe
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {Object.entries(regions).map(([region, regionCountries]) => (
                  <div key={region} className="p-4 border-b border-border last:border-0">
                    <div className="font-medium text-sm mb-2 text-muted-foreground">
                      {region}
                    </div>
                    <div className="space-y-2">
                      {regionCountries.map((country) => (
                        <div
                          key={country.code}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={country.code}
                            checked={selectedCountries.includes(country.code)}
                            onCheckedChange={() => toggleCountry(country.code)}
                          />
                          <label
                            htmlFor={country.code}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {country.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Selected Countries Display */}
          {selectedCountries.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedCountries.slice(0, 5).map((code) => {
                const country = countries.find(c => c.code === code);
                return (
                  <Badge
                    key={code}
                    variant="secondary"
                    className="text-xs pr-1"
                  >
                    {country?.name}
                    <button
                      onClick={() => toggleCountry(code)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              {selectedCountries.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedCountries.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}