import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCountryTimeSeries } from '@/utils/dataUtils';
import { formatNumber } from '@/utils/dataUtils';

interface SmallMultiplesProps {
  data: MortalityData[];
  countries: string[];
  metric: 'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage';
}

const METRIC_CONFIG = {
  lifeExpectancy: {
    title: 'Life Expectancy Trends',
    unit: 'years',
    color: 'hsl(var(--chart-1))',
    domain: [72, 85],
  },
  mortalityRate: {
    title: 'Mortality Rate Trends',
    unit: 'per 100k',
    color: 'hsl(var(--chart-5))',
    domain: [500, 1400],
  },
  preventablePercentage: {
    title: 'Preventable Deaths Trends',
    unit: '%',
    color: 'hsl(var(--chart-4))',
    domain: [20, 50],
  },
};

export function SmallMultiples({ data, countries: selectedCountries, metric }: SmallMultiplesProps) {
  const config = METRIC_CONFIG[metric];

  const countriesData = useMemo(() => {
    return selectedCountries.map(countryCode => {
      const timeSeries = getCountryTimeSeries(data, countryCode);
      const country = timeSeries[0];
      
      return {
        countryCode,
        countryName: country?.country || countryCode,
        data: timeSeries.map(d => ({
          year: d.year,
          value: d[metric] as number,
        })),
        latest: timeSeries[timeSeries.length - 1]?.[metric] as number,
        change: timeSeries.length > 1 
          ? (timeSeries[timeSeries.length - 1]?.[metric] as number) - (timeSeries[0]?.[metric] as number)
          : 0,
      };
    });
  }, [data, selectedCountries, metric]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded px-2 py-1 text-xs">
          <p className="font-medium">{payload[0].payload.year}</p>
          <p className="text-muted-foreground">
            {formatNumber(payload[0].value, 1)} {config.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  if (selectedCountries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>Small multiples for easy comparison</CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Select countries to view trends</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>Compare trends across selected countries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countriesData.map((country) => {
            const isImproving = metric === 'lifeExpectancy' 
              ? country.change > 0 
              : country.change < 0;

            return (
              <div
                key={country.countryCode}
                className="p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="mb-2">
                  <h4 className="font-medium text-sm truncate" title={country.countryName}>
                    {country.countryName}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold">
                      {formatNumber(country.latest, 1)}
                    </span>
                    <span className="text-xs text-muted-foreground">{config.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={isImproving ? 'text-green-600' : 'text-destructive'}>
                      {country.change > 0 ? '+' : ''}{formatNumber(country.change, 1)}
                    </span>
                    <span className="text-muted-foreground">since 2010</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={country.data}>
                    <XAxis dataKey="year" hide />
                    <YAxis domain={config.domain} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={config.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}