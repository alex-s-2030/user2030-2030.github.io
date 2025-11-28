import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency } from '@/utils/dataUtils';
import { getCountryColor } from '@/utils/countryColors';

interface CountryComparisonChartProps {
  data: MortalityData[];
  year: number;
  metric: 'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage' | 'healthcareSpendingPerCapita';
  selectedCountries: string[];
}

const METRIC_CONFIG = {
  lifeExpectancy: {
    title: 'Life Expectancy by Country',
    description: 'Average years of life expectancy at birth',
    yAxisLabel: 'Years',
    formatter: (value: number) => formatNumber(value, 1),
    color: '#d1d5db',
  },
  mortalityRate: {
    title: 'Mortality Rate by Country',
    description: 'Deaths per 100,000 population',
    yAxisLabel: 'Per 100k',
    formatter: (value: number) => formatNumber(value, 0),
    color: 'hsl(var(--muted-foreground))',
  },
  preventablePercentage: {
    title: 'Preventable Deaths by Country',
    description: 'Percentage of deaths that could be prevented',
    yAxisLabel: 'Percentage (%)',
    formatter: (value: number) => `${formatNumber(value, 1)}%`,
    color: 'hsl(var(--muted-foreground))',
  },
  healthcareSpendingPerCapita: {
    title: 'Healthcare Spending by Country',
    description: 'Per capita healthcare expenditure',
    yAxisLabel: 'USD',
    formatter: (value: number) => formatCurrency(value),
    color: 'hsl(var(--muted-foreground))',
  },
};

export function CountryComparisonChart({ data, year, metric, selectedCountries }: CountryComparisonChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter(d => d.year === year && selectedCountries.includes(d.countryCode))
      .map(d => ({
        country: d.country,
        countryCode: d.countryCode,
        value: d[metric] as number,
      }))
      .sort((a, b) => {
        // Sort descending for life expectancy and spending, ascending for mortality and preventable
        if (metric === 'lifeExpectancy' || metric === 'healthcareSpendingPerCapita') {
          return b.value - a.value;
        }
        return a.value - b.value;
      });
  }, [data, year, metric, selectedCountries]);

  const config = METRIC_CONFIG[metric];

  if (selectedCountries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{config.title} ({year})</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Select countries to compare</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-popover-foreground mb-1">{data.country}</p>
          <p className="text-sm text-muted-foreground">
            {config.formatter(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title} ({year})</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="country" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              angle={0}
              textAnchor="middle"
              height={60}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => {
                if (metric === 'healthcareSpendingPerCapita') {
                  return `$${value / 1000}k`;
                }
                return formatNumber(value, 0);
              }}
              label={{ 
                value: config.yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                fill: 'hsl(var(--foreground))'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell 
                  key={`cell-${entry.countryCode}`} 
                  fill={getCountryColor(entry.countryCode)} 
                  opacity={0.9} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}