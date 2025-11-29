import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCountryTimeSeries } from '@/utils/dataUtils';
import { countries } from '@/data/mockData';
import { getCountryColor } from '@/utils/countryColors';

interface TemporalTrendsChartProps {
  data: MortalityData[];
  selectedCountries: string[];
  metric: 'lifeExpectancy' | 'mortalityRate';
}

export function TemporalTrendsChart({ data, selectedCountries, metric }: TemporalTrendsChartProps) {
  const chartData = useMemo(() => {
    if (selectedCountries.length === 0) return [];

    // Get all unique years from ALL data (not just filtered)
    const allYears = Array.from(new Set(data.map(d => d.year))).sort();
    
    // Build data structure for Recharts
    return allYears.map(year => {
      const dataPoint: any = { year };
      
      // For each selected country, get the data for this year
      selectedCountries.forEach(countryCode => {
        const countryData = data.find(d => d.countryCode === countryCode && d.year === year);
        // Always set the value - even if undefined - to ensure line is drawn
        dataPoint[countryCode] = countryData ? countryData[metric] : undefined;
      });
      
      return dataPoint;
    });
  }, [data, selectedCountries, metric]);

  const title = metric === 'lifeExpectancy' ? 'Life Expectancy Over Time' : 'Mortality Rate Over Time';
  const description = metric === 'lifeExpectancy' 
    ? 'Average years of life expectancy at birth'
    : 'Deaths per 100,000 population';
  const yAxisLabel = metric === 'lifeExpectancy' ? 'Years' : 'Per 100k';

  if (selectedCountries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Select countries to view trends</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', style: { fontSize: '12px' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const country = countries.find(c => c.code === value);
                return country?.name || value;
              }}
            />
            {selectedCountries.map((countryCode) => (
              <Line
                key={countryCode}
                type="monotone"
                dataKey={countryCode}
                stroke={getCountryColor(countryCode)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}