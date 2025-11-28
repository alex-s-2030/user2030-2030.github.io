import { useMemo } from 'react';
import { mortalityData } from '@/data/mockData';
import { calculateMetricSummary, getLatestYear, formatNumber } from '@/utils/dataUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Users, Heart, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Overview() {
  const latestYear = getLatestYear(mortalityData);
  
  const lifeExpectancySummary = useMemo(
    () => calculateMetricSummary(mortalityData, 'lifeExpectancy'),
    []
  );
  
  const mortalityRateSummary = useMemo(
    () => calculateMetricSummary(mortalityData, 'mortalityRate'),
    []
  );
  
  const preventableDeathsSummary = useMemo(
    () => calculateMetricSummary(mortalityData, 'preventablePercentage'),
    []
  );

  const metrics = [
    {
      title: 'Average Life Expectancy',
      value: `${formatNumber(lifeExpectancySummary.current, 1)} years`,
      change: lifeExpectancySummary.change,
      changeText: `${lifeExpectancySummary.change > 0 ? '+' : ''}${formatNumber(lifeExpectancySummary.change, 1)} from ${latestYear - 1}`,
      icon: Users,
      positive: lifeExpectancySummary.change > 0,
      description: 'Across North America and Europe',
    },
    {
      title: 'Mortality Rate',
      value: `${formatNumber(mortalityRateSummary.current, 0)} per 100k`,
      change: mortalityRateSummary.change,
      changeText: `${mortalityRateSummary.change > 0 ? '+' : ''}${formatNumber(mortalityRateSummary.change, 0)} from ${latestYear - 1}`,
      icon: Heart,
      positive: mortalityRateSummary.change < 0,
      description: 'Deaths per 100,000 population',
    },
    {
      title: 'Preventable Deaths',
      value: `${formatNumber(preventableDeathsSummary.current, 1)}%`,
      change: preventableDeathsSummary.change,
      changeText: `${preventableDeathsSummary.change > 0 ? '+' : ''}${formatNumber(preventableDeathsSummary.change, 1)}% from ${latestYear - 1}`,
      icon: AlertTriangle,
      positive: preventableDeathsSummary.change < 0,
      description: 'Could be avoided with interventions',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Understanding Mortality in the West
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Interactive data visualization exploring patterns, risks, and policy implications
              of mortality trends from 2010-2023
            </p>
            <div className="flex items-center justify-center gap-8 text-xl text-muted-foreground">
              <span className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-chart-1" />
                <span className="font-semibold">20 Countries</span>
              </span>
              <span className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-chart-2" />
                <span className="font-semibold">14 Years of Data</span>
              </span>
              <span className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-chart-3" />
                <span className="font-semibold">Multiple Health Metrics</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Key Metrics ({latestYear})</h2>
          <p className="text-muted-foreground">
            High-level overview of current mortality patterns and recent trends
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.positive ? TrendingDown : TrendingUp;
            
            return (
              <Card key={metric.title} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-foreground">
                      {metric.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <TrendIcon 
                        className={cn(
                          'h-4 w-4',
                          metric.positive ? 'text-green-600' : 'text-destructive'
                        )}
                      />
                      <span 
                        className={cn(
                          'text-sm font-medium',
                          metric.positive ? 'text-green-600' : 'text-destructive'
                        )}
                      >
                        {metric.changeText}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Findings */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Regional Disparities</CardTitle>
              <CardDescription>
                Significant variations exist in mortality outcomes across regions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Life Expectancy Range</span>
                  <span className="font-medium">74.0 - 83.0 years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mortality Rate Range</span>
                  <span className="font-medium">620 - 1,350 per 100k</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preventable Deaths Range</span>
                  <span className="font-medium">25% - 45%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                Countries with higher healthcare spending and better preventive care show
                significantly lower preventable death rates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leading Causes of Death</CardTitle>
              <CardDescription>
                Chronic diseases dominate mortality across all regions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cardiovascular Disease</span>
                  <span className="font-medium">~30%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cancer</span>
                  <span className="font-medium">~24%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Respiratory Disease</span>
                  <span className="font-medium">~9%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                Over 60% of deaths are attributed to chronic conditions that can be 
                prevented or managed through lifestyle changes and early intervention.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-muted/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Explore the Data
            </h2>
            <p className="text-muted-foreground mb-8">
              Dive deeper into temporal trends, regional comparisons, and policy insights
              to understand what drives mortality patterns and how interventions can save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View Dashboard
                <TrendingUp className="h-4 w-4" />
              </a>
              <a 
                href="/insights"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
              >
                Policy Insights
                <Lightbulb className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}