import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/utils/dataUtils';
import { getCountryColor } from '@/utils/countryColors';

interface ComparativeScatterChartProps {
  data: MortalityData[];
  year: number;
}

export function ComparativeScatterChart({ data, year }: ComparativeScatterChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter(d => d.year === year && d.healthcareSpendingPerCapita && d.gdpPerCapita)
      .map(d => ({
        country: d.country,
        countryCode: d.countryCode,
        x: d.healthcareSpendingPerCapita,
        y: d.lifeExpectancy,
        z: d.population / 10000000, // Size based on population
        mortalityRate: d.mortalityRate,
        preventable: d.preventablePercentage,
      }));
  }, [data, year]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-popover-foreground mb-2">{data.country}</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              Healthcare Spending: <span className="text-popover-foreground font-medium">{formatCurrency(data.x)}</span>
            </p>
            <p className="text-muted-foreground">
              Life Expectancy: <span className="text-popover-foreground font-medium">{data.y} years</span>
            </p>
            <p className="text-muted-foreground">
              Mortality Rate: <span className="text-popover-foreground font-medium">{formatNumber(data.mortalityRate)} per 100k</span>
            </p>
            <p className="text-muted-foreground">
              Preventable Deaths: <span className="text-popover-foreground font-medium">{data.preventable}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Healthcare Spending vs. Life Expectancy ({year})</CardTitle>
        <CardDescription>
          Relationship between healthcare investment and population health outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="x"
              name="Healthcare Spending"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{
                value: 'Healthcare Spending per Capita (USD)',
                position: 'insideBottom',
                offset: -10,
                fill: 'hsl(var(--muted-foreground))',
                style: { fontSize: '12px' }
              }}
              tickFormatter={(value) => `$${value / 1000}k`}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Life Expectancy"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{
                value: 'Life Expectancy (Years)',
                angle: -90,
                position: 'insideLeft',
                fill: 'hsl(var(--muted-foreground))',
                style: { fontSize: '12px' }
              }}
              domain={[72, 85]}
              style={{ fontSize: '12px' }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={chartData} fill="hsl(var(--chart-1))">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getCountryColor(entry.countryCode)}
                  opacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-6 space-y-3">
          <div className="text-xs text-muted-foreground text-center">
            Circle size represents population size
          </div>
          
          {/* Country Color Legend */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-foreground mb-3 text-center">Country Legend</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
              {chartData.map((country) => (
                <div key={country.countryCode} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: getCountryColor(country.countryCode) }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{country.country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}