import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MortalityData } from '@/types/mortality';
import { formatNumber, formatCurrency } from '@/utils/dataUtils';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface GapAnalysisProps {
  data: MortalityData[];
  year: number;
}

interface Gap {
  country: string;
  countryCode: string;
  metric: string;
  current: number;
  benchmark: number;
  gap: number;
  gapPercentage: number;
  potentialLivesSaved: number;
  priority: 'High' | 'Medium' | 'Low';
}

export function GapAnalysis({ data, year }: GapAnalysisProps) {
  const yearData = useMemo(() => {
    return data.filter(d => d.year === year);
  }, [data, year]);

  const gaps = useMemo(() => {
    if (yearData.length === 0) return [];

    // Calculate benchmarks (best performers)
    const benchmarks = {
      lifeExpectancy: Math.max(...yearData.map(d => d.lifeExpectancy)),
      preventablePercentage: Math.min(...yearData.map(d => d.preventablePercentage)),
      mortalityRate: Math.min(...yearData.map(d => d.mortalityRate)),
    };

    const allGaps: Gap[] = [];

    yearData.forEach(country => {
      // Life Expectancy Gap
      const leGap = benchmarks.lifeExpectancy - country.lifeExpectancy;
      if (leGap > 1) {
        allGaps.push({
          country: country.country,
          countryCode: country.countryCode,
          metric: 'Life Expectancy',
          current: country.lifeExpectancy,
          benchmark: benchmarks.lifeExpectancy,
          gap: leGap,
          gapPercentage: (leGap / benchmarks.lifeExpectancy) * 100,
          potentialLivesSaved: Math.round((country.population / 100000) * leGap * 10),
          priority: leGap > 5 ? 'High' : leGap > 3 ? 'Medium' : 'Low',
        });
      }

      // Preventable Deaths Gap
      const pdGap = country.preventablePercentage - benchmarks.preventablePercentage;
      if (pdGap > 3) {
        const livesSaved = Math.round(country.totalDeaths * (pdGap / 100));
        allGaps.push({
          country: country.country,
          countryCode: country.countryCode,
          metric: 'Preventable Deaths',
          current: country.preventablePercentage,
          benchmark: benchmarks.preventablePercentage,
          gap: pdGap,
          gapPercentage: (pdGap / country.preventablePercentage) * 100,
          potentialLivesSaved: livesSaved,
          priority: pdGap > 10 ? 'High' : pdGap > 5 ? 'Medium' : 'Low',
        });
      }

      // Mortality Rate Gap
      const mrGap = country.mortalityRate - benchmarks.mortalityRate;
      if (mrGap > 100) {
        allGaps.push({
          country: country.country,
          countryCode: country.countryCode,
          metric: 'Mortality Rate',
          current: country.mortalityRate,
          benchmark: benchmarks.mortalityRate,
          gap: mrGap,
          gapPercentage: (mrGap / country.mortalityRate) * 100,
          potentialLivesSaved: Math.round((country.population / 100000) * mrGap),
          priority: mrGap > 300 ? 'High' : mrGap > 150 ? 'Medium' : 'Low',
        });
      }
    });

    // Sort by potential lives saved
    return allGaps.sort((a, b) => b.potentialLivesSaved - a.potentialLivesSaved);
  }, [yearData]);

  const topGaps = gaps.slice(0, 10);
  const totalPotentialLives = gaps.reduce((sum, gap) => sum + gap.potentialLivesSaved, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Gap Analysis
            </CardTitle>
            <CardDescription>
              Identify areas with greatest potential for improvement
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {formatNumber(totalPotentialLives)} lives
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-foreground mb-1">
                Total Opportunity
              </h4>
              <p className="text-sm text-muted-foreground">
                Closing the gap to best-performer benchmarks could save approximately{' '}
                <span className="font-semibold text-foreground">{formatNumber(totalPotentialLives)} lives</span>{' '}
                annually across all identified gaps. Focus on high-priority areas for maximum impact.
              </p>
            </div>
          </div>
        </div>

        {/* Top Gaps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Top Improvement Opportunities</h3>
          
          <div className="space-y-3">
            {topGaps.map((gap, index) => (
              <div 
                key={`${gap.countryCode}-${gap.metric}`}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{gap.country}</span>
                      <Badge variant="outline" className="text-xs">{gap.metric}</Badge>
                      <Badge variant={getPriorityColor(gap.priority)} className="text-xs">
                        {gap.priority} Priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Current: <span className="font-medium text-foreground">
                        {formatNumber(gap.current, 1)}
                        {gap.metric === 'Preventable Deaths' ? '%' : gap.metric === 'Mortality Rate' ? ' per 100k' : ' years'}
                      </span></span>
                      <span>•</span>
                      <span>Benchmark: <span className="font-medium text-foreground">
                        {formatNumber(gap.benchmark, 1)}
                        {gap.metric === 'Preventable Deaths' ? '%' : gap.metric === 'Mortality Rate' ? ' per 100k' : ' years'}
                      </span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Potential Impact</p>
                    <p className="text-lg font-bold text-primary">
                      {formatNumber(gap.potentialLivesSaved)}
                    </p>
                    <p className="text-xs text-muted-foreground">lives saved</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Gap to Close</span>
                    <span>{formatNumber(gap.gapPercentage, 1)}%</span>
                  </div>
                  <Progress value={gap.gapPercentage} className="h-2" />
                </div>

                {/* Recommendations */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Recommended Focus:</strong>{' '}
                    {gap.metric === 'Life Expectancy' && 
                      'Invest in preventive care, early intervention programs, and lifestyle modification support.'}
                    {gap.metric === 'Preventable Deaths' && 
                      'Strengthen primary care access, screening programs, and chronic disease management.'}
                    {gap.metric === 'Mortality Rate' && 
                      'Enhance emergency care systems, reduce wait times, and improve treatment quality.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Strategic Recommendations
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>Prioritize countries with high preventable death percentages - these offer quickest wins through existing intervention models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>Focus on cardiovascular and cancer prevention programs, which account for over 50% of preventable mortality.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>Learn from best performers: Switzerland, Norway, and Sweden have successful models that can be adapted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>Consider phased implementation starting with regions showing greatest disparities within countries.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}