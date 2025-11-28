import { useMemo } from 'react';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { countries } from '@/data/mockData';
import { formatNumber } from '@/utils/dataUtils';

interface GeographicHeatMapProps {
  data: MortalityData[];
  year: number;
  metric: 'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage';
}

const METRIC_CONFIG = {
  lifeExpectancy: {
    title: 'Life Expectancy',
    unit: 'years',
    colorScale: (value: number, min: number, max: number) => {
      const normalized = (value - min) / (max - min);
      // Green for high life expectancy
      return `oklch(${0.5 + normalized * 0.3} ${0.15 - normalized * 0.1} ${120 - normalized * 30})`;
    },
  },
  mortalityRate: {
    title: 'Mortality Rate',
    unit: 'per 100k',
    colorScale: (value: number, min: number, max: number) => {
      const normalized = (value - min) / (max - min);
      // Red for high mortality
      return `oklch(${0.7 - normalized * 0.2} ${0.1 + normalized * 0.15} ${25 + normalized * 5})`;
    },
  },
  preventablePercentage: {
    title: 'Preventable Deaths',
    unit: '%',
    colorScale: (value: number, min: number, max: number) => {
      const normalized = (value - min) / (max - min);
      // Red for high preventable deaths
      return `oklch(${0.7 - normalized * 0.2} ${0.1 + normalized * 0.15} ${50 - normalized * 25})`;
    },
  },
};

export function GeographicHeatMap({ data, year, metric }: GeographicHeatMapProps) {
  const yearData = useMemo(() => {
    return data.filter(d => d.year === year);
  }, [data, year]);

  const { min, max } = useMemo(() => {
    const values = yearData.map(d => d[metric] as number);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [yearData, metric]);

  const config = METRIC_CONFIG[metric];

  // Group countries by region
  const regions = useMemo(() => {
    const northAmerica = yearData.filter(d => ['US', 'CA', 'MX'].includes(d.countryCode));
    const europe = yearData.filter(d => !['US', 'CA', 'MX'].includes(d.countryCode));
    return { northAmerica, europe };
  }, [yearData]);

  const CountryCircle = ({ country, index, total }: { country: MortalityData; index: number; total: number }) => {
    const value = country[metric] as number;
    const color = config.colorScale(value, min, max);
    
    // Arrange in a circular pattern
    const angle = (index / total) * 2 * Math.PI;
    const radius = 80;
    const cx = 150 + radius * Math.cos(angle);
    const cy = 150 + radius * Math.sin(angle);

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={20}
          fill={color}
          stroke="hsl(var(--border))"
          strokeWidth={2}
          className="transition-all hover:stroke-primary hover:stroke-[3px] cursor-pointer"
        />
        <title>{`${country.country}: ${formatNumber(value, 1)} ${config.unit}`}</title>
        <text
          x={cx}
          y={cy + 35}
          textAnchor="middle"
          className="text-xs fill-muted-foreground pointer-events-none"
          fontSize="10"
        >
          {country.countryCode}
        </text>
      </g>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution - {config.title} ({year})</CardTitle>
        <CardDescription>
          Visual representation of {config.title.toLowerCase()} across regions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* North America */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-center">North America</h3>
            <svg viewBox="0 0 300 300" className="w-full">
              <circle cx="150" cy="150" r="90" fill="hsl(var(--muted))" opacity="0.1" />
              {regions.northAmerica.map((country, i) => (
                <CountryCircle
                  key={country.countryCode}
                  country={country}
                  index={i}
                  total={regions.northAmerica.length}
                />
              ))}
            </svg>
          </div>

          {/* Europe */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-center">Europe</h3>
            <svg viewBox="0 0 300 300" className="w-full">
              <circle cx="150" cy="150" r="90" fill="hsl(var(--muted))" opacity="0.1" />
              {regions.europe.map((country, i) => (
                <CountryCircle
                  key={country.countryCode}
                  country={country}
                  index={i}
                  total={regions.europe.length}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Color Scale</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-8 rounded-lg" style={{
              background: `linear-gradient(to right, ${config.colorScale(min, min, max)}, ${config.colorScale((min + max) / 2, min, max)}, ${config.colorScale(max, min, max)})`
            }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatNumber(min, 1)} {config.unit}</span>
            <span>{formatNumber((min + max) / 2, 1)} {config.unit}</span>
            <span>{formatNumber(max, 1)} {config.unit}</span>
          </div>
        </div>

        {/* Top/Bottom Performers */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">
              {metric === 'lifeExpectancy' ? 'Highest' : 'Lowest'}
            </p>
            <p className="font-medium text-sm">
              {yearData.sort((a, b) => 
                metric === 'lifeExpectancy' 
                  ? (b[metric] as number) - (a[metric] as number)
                  : (a[metric] as number) - (b[metric] as number)
              )[0]?.country}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(yearData.sort((a, b) => 
                metric === 'lifeExpectancy' 
                  ? (b[metric] as number) - (a[metric] as number)
                  : (a[metric] as number) - (b[metric] as number)
              )[0]?.[metric] as number, 1)} {config.unit}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-muted-foreground mb-1">
              {metric === 'lifeExpectancy' ? 'Lowest' : 'Highest'}
            </p>
            <p className="font-medium text-sm">
              {yearData.sort((a, b) => 
                metric === 'lifeExpectancy' 
                  ? (a[metric] as number) - (b[metric] as number)
                  : (b[metric] as number) - (a[metric] as number)
              )[0]?.country}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(yearData.sort((a, b) => 
                metric === 'lifeExpectancy' 
                  ? (a[metric] as number) - (b[metric] as number)
                  : (b[metric] as number) - (a[metric] as number)
              )[0]?.[metric] as number, 1)} {config.unit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}