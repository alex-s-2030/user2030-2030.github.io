import { useState, useMemo } from 'react';
import { mortalityData } from '@/data/mockData';
import { getLatestYear } from '@/utils/dataUtils';
import { InterventionSimulator } from '@/components/insights/InterventionSimulator';
import { BestPractices } from '@/components/insights/BestPractices';
import { GapAnalysis } from '@/components/insights/GapAnalysis';
import { PolicyRecommendations } from '@/components/insights/PolicyRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, Award, FileText, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function Insights() {
  const latestYear = getLatestYear(mortalityData);
  const [selectedYear, setSelectedYear] = useState(latestYear);

  const availableYears = useMemo(() => {
    return Array.from(new Set(mortalityData.map(d => d.year))).sort((a, b) => b - a);
  }, []);

  const summaryStats = useMemo(() => {
    const yearData = mortalityData.filter(d => d.year === selectedYear);
    
    const totalPreventableDeaths = yearData.reduce((sum, d) => sum + d.preventableDeaths, 0);
    const avgPreventablePercentage = yearData.reduce((sum, d) => sum + d.preventablePercentage, 0) / yearData.length;
    const totalPopulation = yearData.reduce((sum, d) => sum + d.population, 0);
    
    return {
      totalPreventableDeaths,
      avgPreventablePercentage,
      totalPopulation,
      countriesAnalyzed: yearData.length,
    };
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Policy Insights</h1>
              <p className="text-muted-foreground">
                Evidence-based recommendations and tools for reducing preventable mortality
              </p>
            </div>
            <div className="space-y-2 min-w-40">
              <Label className="text-sm">Analysis Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Countries Analyzed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{summaryStats.countriesAnalyzed}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Total Population</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {(summaryStats.totalPopulation / 1000000).toFixed(0)}M
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Preventable Deaths</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {(summaryStats.totalPreventableDeaths / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground">annually</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Avg Preventable %</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {summaryStats.avgPreventablePercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">of all deaths</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Gaps</span>
            </TabsTrigger>
            <TabsTrigger value="practices" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Best Practices</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulator" className="space-y-6">
            <InterventionSimulator />
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  How to Use This Tool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Adjust the sliders to model different intervention scenarios. The calculator shows projected 
                  outcomes based on evidence from successful public health programs worldwide.
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Lives Saved:</strong> Estimated annual reduction in preventable deaths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>ROI:</strong> Return on investment considering direct healthcare savings (excludes productivity gains)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Note:</strong> Results are estimates based on peer-reviewed studies. Actual outcomes vary by implementation quality and local context.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <GapAnalysis data={mortalityData} year={selectedYear} />
          </TabsContent>

          <TabsContent value="practices" className="space-y-6">
            <BestPractices />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <PolicyRecommendations />
            
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  Next Steps for Policymakers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground flex-shrink-0">1.</span>
                    <div>
                      <strong className="text-foreground">Assess Current State:</strong> Use the Gap Analysis 
                      tab to identify your country's specific challenges and opportunities.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground flex-shrink-0">2.</span>
                    <div>
                      <strong className="text-foreground">Learn from Success:</strong> Review Best Practices 
                      from countries with similar challenges who achieved significant improvements.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground flex-shrink-0">3.</span>
                    <div>
                      <strong className="text-foreground">Model Interventions:</strong> Use the Simulator 
                      to estimate the impact and ROI of proposed interventions.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground flex-shrink-0">4.</span>
                    <div>
                      <strong className="text-foreground">Develop Action Plan:</strong> Select priority 
                      recommendations and create a phased implementation roadmap.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground flex-shrink-0">5.</span>
                    <div>
                      <strong className="text-foreground">Monitor and Adjust:</strong> Track key metrics 
                      monthly and refine strategies based on results and emerging evidence.
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}