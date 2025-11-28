import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/dataUtils';

interface CausesOfDeathChartProps {
  data: MortalityData[];
  countryCode: string;
}

type CauseKey = 'cardiovascular' | 'cancer' | 'respiratory' | 'diabetes' | 'infectious' | 'accidents' | 'other';

const CAUSE_COLORS = {
  cardiovascular: 'hsl(var(--chart-5))',
  cancer: 'hsl(var(--chart-4))',
  respiratory: 'hsl(var(--chart-3))',
  diabetes: 'hsl(var(--chart-2))',
  infectious: 'hsl(var(--chart-1))',
  accidents: '#8b5cf6',
  other: '#64748b',
};

const CAUSE_LABELS = {
  cardiovascular: 'Cardiovascular',
  cancer: 'Cancer',
  respiratory: 'Respiratory',
  diabetes: 'Diabetes',
  infectious: 'Infectious',
  accidents: 'Accidents',
  other: 'Other',
};

export function CausesOfDeathChart({ data, countryCode }: CausesOfDeathChartProps) {
  const [highlightedCause, setHighlightedCause] = useState<CauseKey | null>(null);

  const chartData = useMemo(() => {
    const countryData = data
      .filter(d => d.countryCode === countryCode)
      .sort((a, b) => a.year - b.year);

    return countryData.map(d => ({
      year: d.year,
      cardiovascular: Math.round(d.totalDeaths * d.causeBreakdown.cardiovascular),
      cancer: Math.round(d.totalDeaths * d.causeBreakdown.cancer),
      respiratory: Math.round(d.totalDeaths * d.causeBreakdown.respiratory),
      diabetes: Math.round(d.totalDeaths * d.causeBreakdown.diabetes),
      infectious: Math.round(d.totalDeaths * d.causeBreakdown.infectious),
      accidents: Math.round(d.totalDeaths * d.causeBreakdown.accidents),
      other: Math.round(d.totalDeaths * d.causeBreakdown.other),
    }));
  }, [data, countryCode]);

  const countryName = data.find(d => d.countryCode === countryCode)?.country || countryCode;

  const handleLegendClick = (cause: CauseKey) => {
    setHighlightedCause(highlightedCause === cause ? null : cause);
  };

  const getAreaOpacity = (cause: CauseKey) => {
    if (highlightedCause === null) return 0.8;
    return highlightedCause === cause ? 0.8 : 0.2;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            {payload.reverse().map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{CAUSE_LABELS[entry.dataKey as keyof typeof CAUSE_LABELS]}:</span>
                </div>
                <span className="text-popover-foreground font-medium">
                  {formatNumber(entry.value)} ({Math.round(entry.value / total * 100)}%)
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-popover-foreground font-semibold">{formatNumber(total)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {payload.map((entry: any) => {
          const cause = entry.dataKey as CauseKey;
          const isHighlighted = highlightedCause === cause;
          const isDimmed = highlightedCause !== null && highlightedCause !== cause;
          
          return (
            <button
              key={cause}
              onClick={() => handleLegendClick(cause)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                isHighlighted 
                  ? 'bg-accent ring-2 ring-primary' 
                  : isDimmed 
                    ? 'opacity-40' 
                    : 'hover:bg-accent/50'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-foreground">
                {CAUSE_LABELS[cause]}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Causes of Death - {countryName}</CardTitle>
        <CardDescription>Distribution of deaths by cause over time (click legend items to highlight)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => `${value / 1000}k`}
              label={{ 
                value: 'Deaths', 
                angle: -90, 
                position: 'insideLeft',
                fill: 'hsl(var(--foreground))'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area 
              type="monotone" 
              dataKey="cardiovascular" 
              stackId="1" 
              stroke={CAUSE_COLORS.cardiovascular} 
              fill={CAUSE_COLORS.cardiovascular}
              fillOpacity={getAreaOpacity('cardiovascular')}
            />
            <Area 
              type="monotone" 
              dataKey="cancer" 
              stackId="1" 
              stroke={CAUSE_COLORS.cancer} 
              fill={CAUSE_COLORS.cancer}
              fillOpacity={getAreaOpacity('cancer')}
            />
            <Area 
              type="monotone" 
              dataKey="respiratory" 
              stackId="1" 
              stroke={CAUSE_COLORS.respiratory} 
              fill={CAUSE_COLORS.respiratory}
              fillOpacity={getAreaOpacity('respiratory')}
            />
            <Area 
              type="monotone" 
              dataKey="diabetes" 
              stackId="1" 
              stroke={CAUSE_COLORS.diabetes} 
              fill={CAUSE_COLORS.diabetes}
              fillOpacity={getAreaOpacity('diabetes')}
            />
            <Area 
              type="monotone" 
              dataKey="infectious" 
              stackId="1" 
              stroke={CAUSE_COLORS.infectious} 
              fill={CAUSE_COLORS.infectious}
              fillOpacity={getAreaOpacity('infectious')}
            />
            <Area 
              type="monotone" 
              dataKey="accidents" 
              stackId="1" 
              stroke={CAUSE_COLORS.accidents} 
              fill={CAUSE_COLORS.accidents}
              fillOpacity={getAreaOpacity('accidents')}
            />
            <Area 
              type="monotone" 
              dataKey="other" 
              stackId="1" 
              stroke={CAUSE_COLORS.other} 
              fill={CAUSE_COLORS.other}
              fillOpacity={getAreaOpacity('other')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}