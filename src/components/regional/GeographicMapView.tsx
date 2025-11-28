import { useMemo } from 'react';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/dataUtils';
import { COUNTRY_COORDINATES } from '@/utils/countryCoordinates';
import { getCountryColor } from '@/utils/countryColors';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import westernMap from '@/assets/images/western-outline-map.png';

interface GeographicMapViewProps {
  data: MortalityData[];
  year: number;
  metric: 'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage';
  onCountryClick?: (countryCode: string) => void;
}

const METRIC_CONFIG = {
  lifeExpectancy: {
    title: 'Life Expectancy by Country',
    description: 'Geographic distribution of life expectancy',
    formatter: (value: number) => `${formatNumber(value, 1)} years`,
    getScale: (value: number) => {
      return 8 + ((value - 74) / 9) * 12;
    },
    getOpacity: (value: number) => {
      return 0.5 + ((value - 74) / 9) * 0.4;
    }
  },
  mortalityRate: {
    title: 'Mortality Rate by Country',
    description: 'Geographic distribution of mortality rates',
    formatter: (value: number) => `${formatNumber(value, 0)} per 100k`,
    getScale: (value: number) => {
      return 20 - ((value - 620) / 730) * 12;
    },
    getOpacity: (value: number) => {
      return 0.9 - ((value - 620) / 730) * 0.4;
    }
  },
  preventablePercentage: {
    title: 'Preventable Deaths by Country',
    description: 'Geographic distribution of preventable death rates',
    formatter: (value: number) => `${formatNumber(value, 1)}%`,
    getScale: (value: number) => {
      return 20 - ((value - 25) / 20) * 12;
    },
    getOpacity: (value: number) => {
      return 0.9 - ((value - 25) / 20) * 0.4;
    }
  }
};

export function GeographicMapView({ data, year, metric, onCountryClick }: GeographicMapViewProps) {
  const config = METRIC_CONFIG[metric];

  const countryData = useMemo(() => {
    return data
      .filter(d => d.year === year)
      .map(d => ({
        countryCode: d.countryCode,
        country: d.country,
        value: d[metric] as number,
        coords: COUNTRY_COORDINATES[d.countryCode],
      }))
      .filter(d => d.coords);
  }, [data, year, metric]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title} ({year})</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full rounded-lg overflow-hidden border border-border bg-background">
          {/* Western countries map - North America and Europe only */}
          <img 
            src={westernMap} 
            alt="Map - Western Countries (North America and Europe)"
            className="absolute opacity-40 dark:opacity-25"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
          
          {/* Data overlay */}
          <svg viewBox="0 0 1000 500" className="relative w-full h-auto">
            {/* Region labels */}
            <text x="250" y="40" fill="hsl(var(--foreground))" fontSize="20" fontWeight="700" textAnchor="middle" opacity="0.9">
              North America
            </text>
            <text x="650" y="40" fill="hsl(var(--foreground))" fontSize="20" fontWeight="700" textAnchor="middle" opacity="0.9">
              Europe
            </text>

            {/* Country markers */}
            <TooltipProvider>
              {countryData.map((country) => {
                const radius = config.getScale(country.value);
                const opacity = config.getOpacity(country.value);
                const color = getCountryColor(country.countryCode);

                return (
                  <Tooltip key={country.countryCode}>
                    <TooltipTrigger asChild>
                      <g
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => onCountryClick?.(country.countryCode)}
                      >
                        <circle
                          cx={country.coords.x}
                          cy={country.coords.y}
                          r={radius + 6}
                          fill={color}
                          opacity="0.15"
                        />
                        <circle
                          cx={country.coords.x}
                          cy={country.coords.y}
                          r={radius + 3}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.4"
                        />
                        <circle
                          cx={country.coords.x}
                          cy={country.coords.y}
                          r={radius}
                          fill={color}
                          opacity={opacity}
                          stroke="white"
                          strokeWidth="2"
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                          }}
                        />
                        <circle
                          cx={country.coords.x}
                          cy={country.coords.y}
                          r={radius * 0.3}
                          fill="white"
                          opacity="0.8"
                        />
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">{country.country}</p>
                        <p className="text-muted-foreground">
                          {config.formatter(country.value)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1 opacity-50" />
            <span>Lower values</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-chart-1 opacity-90" />
            <span>Higher values</span>
          </div>
          <div className="text-xs">
            Circle size and opacity represent metric values
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Click on any country to view detailed information
        </p>
      </CardContent>
    </Card>
  );
}