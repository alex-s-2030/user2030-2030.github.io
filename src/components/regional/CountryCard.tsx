import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency } from '@/utils/dataUtils';
import { TrendingUp, TrendingDown, Users, Heart, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountryCardProps {
  data: MortalityData;
  previousYearData?: MortalityData;
}

export function CountryCard({ data, previousYearData }: CountryCardProps) {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  const lifeExpectancyChange = calculateChange(data.lifeExpectancy, previousYearData?.lifeExpectancy);
  const mortalityRateChange = calculateChange(data.mortalityRate, previousYearData?.mortalityRate);

  const metrics = [
    {
      label: 'Life Expectancy',
      value: `${formatNumber(data.lifeExpectancy, 1)} years`,
      change: lifeExpectancyChange,
      icon: Users,
      positive: lifeExpectancyChange ? lifeExpectancyChange.change > 0 : null,
    },
    {
      label: 'Mortality Rate',
      value: `${formatNumber(data.mortalityRate, 0)} per 100k`,
      change: mortalityRateChange,
      icon: Heart,
      positive: mortalityRateChange ? mortalityRateChange.change < 0 : null,
    },
    {
      label: 'Preventable Deaths',
      value: `${formatNumber(data.preventablePercentage, 1)}%`,
      subValue: `${formatNumber(data.preventableDeaths)} deaths`,
      icon: AlertTriangle,
    },
    {
      label: 'Healthcare Spending',
      value: data.healthcareSpendingPerCapita ? formatCurrency(data.healthcareSpendingPerCapita) : 'N/A',
      icon: DollarSign,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-1">{data.country}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Year: {data.year}</span>
              <span>•</span>
              <span>Population: {formatNumber(data.population)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.positive === true ? TrendingUp : metric.positive === false ? TrendingDown : null;
            
            return (
              <div key={metric.label} className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-foreground">{metric.value}</p>
                  {metric.subValue && (
                    <p className="text-xs text-muted-foreground">{metric.subValue}</p>
                  )}
                  {metric.change && TrendIcon && (
                    <div className="flex items-center gap-1">
                      <TrendIcon 
                        className={cn(
                          'h-3 w-3',
                          metric.positive ? 'text-green-600' : 'text-destructive'
                        )}
                      />
                      <span 
                        className={cn(
                          'text-xs font-medium',
                          metric.positive ? 'text-green-600' : 'text-destructive'
                        )}
                      >
                        {metric.change.change > 0 ? '+' : ''}{formatNumber(metric.change.change, 1)} ({metric.change.percentage > 0 ? '+' : ''}{formatNumber(metric.change.percentage, 1)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}