import { useMemo, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { countries } from '@/data/mockData';
import { LineChartIcon, BarChartIcon, AreaChartIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCountryColor } from '@/utils/countryColors';

interface LifeExpectancyVisualizationProps {
  data: MortalityData[];
  selectedCountries: string[];
}

type ChartType = 'line' | 'bar' | 'area' | 'stacked-area';

const CHART_TYPES = [
  { type: 'line' as ChartType, label: 'Line Chart', icon: LineChartIcon },
  { type: 'bar' as ChartType, label: 'Bar Chart', icon: BarChartIcon },
  { type: 'area' as ChartType, label: 'Area Chart', icon: AreaChartIcon },
  { type: 'stacked-area' as ChartType, label: 'Stacked Area', icon: TrendingUp },
];

export function LifeExpectancyVisualization({ data, selectedCountries }: LifeExpectancyVisualizationProps) {
  const [chartType, setChartType] = useState<ChartType>('line');

  const chartData = useMemo(() => {
    if (selectedCountries.length === 0) return [];

    const years = Array.from(new Set(data.map(d => d.year))).sort();
    
    return years.map(year => {
      const dataPoint: any = { year };
      
      selectedCountries.forEach(countryCode => {
        const countryData = data.find(d => d.countryCode === countryCode && d.year === year);
        if (countryData) {
          dataPoint[countryCode] = countryData.lifeExpectancy;
        }
      });
      
      return dataPoint;
    });
  }, [data, selectedCountries]);

  if (selectedCountries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Life Expectancy Over Time</CardTitle>
          <CardDescription>Select countries to view trends</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Select countries to view trends</p>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const commonAxisProps = {
      xAxis: (
        <XAxis 
          dataKey="year" 
          stroke="hsl(var(--foreground))"
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
      ),
      yAxis: (
        <YAxis 
          stroke="hsl(var(--foreground))"
          tick={{ fill: 'hsl(var(--foreground))' }}
          label={{ 
            value: 'Life Expectancy (Years)', 
            angle: -90, 
            position: 'insideLeft',
            fill: 'hsl(var(--foreground))'
          }}
          domain={[70, 85]}
        />
      ),
      grid: <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />,
      tooltip: (
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
        />
      ),
      legend: (
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => {
            const country = countries.find(c => c.code === value);
            return country?.name || value;
          }}
        />
      )
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {selectedCountries.map((countryCode) => (
              <Line
                key={countryCode}
                type="monotone"
                dataKey={countryCode}
                stroke={getCountryColor(countryCode)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {selectedCountries.map((countryCode) => (
              <Bar
                key={countryCode}
                dataKey={countryCode}
                fill={getCountryColor(countryCode)}
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {selectedCountries.map((countryCode) => (
              <Area
                key={countryCode}
                type="monotone"
                dataKey={countryCode}
                stroke={getCountryColor(countryCode)}
                fill={getCountryColor(countryCode)}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'stacked-area':
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {selectedCountries.map((countryCode) => (
              <Area
                key={countryCode}
                type="monotone"
                dataKey={countryCode}
                stackId="1"
                stroke={getCountryColor(countryCode)}
                fill={getCountryColor(countryCode)}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Life Expectancy Over Time</CardTitle>
            <CardDescription>
              Compare life expectancy trends across countries using different visualization styles
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 flex-wrap">
          {CHART_TYPES.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={chartType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType(type)}
              className={cn(
                'gap-2',
                chartType === type && 'bg-primary text-primary-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}