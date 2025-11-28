import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatNumber, formatCurrency } from '@/utils/dataUtils';
import { ArrowRight, TrendingDown, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function InterventionSimulator() {
  const [preventionInvestment, setPreventionInvestment] = useState([30]); // % increase
  const [lifestylePrograms, setLifestylePrograms] = useState([50]); // % coverage
  const [earlyDetection, setEarlyDetection] = useState([40]); // % improvement

  // Baseline metrics (example country)
  const baseline = {
    preventableDeaths: 350000,
    preventablePercentage: 35,
    healthcareSpending: 5000,
    mortalityRate: 850,
  };

  // Calculate projected outcomes
  const projected = useMemo(() => {
    // Prevention investment reduces preventable deaths
    const preventionImpact = (preventionInvestment[0] / 100) * 0.15; // 15% max reduction
    
    // Lifestyle programs reduce cardiovascular and diabetes deaths
    const lifestyleImpact = (lifestylePrograms[0] / 100) * 0.12; // 12% max reduction
    
    // Early detection reduces cancer and chronic disease deaths
    const earlyDetectionImpact = (earlyDetection[0] / 100) * 0.10; // 10% max reduction
    
    const totalReduction = preventionImpact + lifestyleImpact + earlyDetectionImpact;
    
    const newPreventableDeaths = Math.round(baseline.preventableDeaths * (1 - totalReduction));
    const deathsAvoided = baseline.preventableDeaths - newPreventableDeaths;
    const newPercentage = baseline.preventablePercentage * (1 - totalReduction);
    
    // Healthcare spending increases with investment but has ROI
    const costIncrease = (preventionInvestment[0] / 100) * 500; // $500 max increase per capita
    const newSpending = baseline.healthcareSpending + costIncrease;
    
    // Long-term savings from avoided care
    const savingsPerDeath = 50000; // Average healthcare cost per preventable death
    const totalSavings = deathsAvoided * savingsPerDeath;
    const populationSize = 100000000; // 100M example population
    const savingsPerCapita = totalSavings / populationSize;
    
    const roi = ((savingsPerCapita - costIncrease) / costIncrease) * 100;
    
    return {
      preventableDeaths: newPreventableDeaths,
      deathsAvoided,
      preventablePercentage: newPercentage,
      healthcareSpending: newSpending,
      totalSavings,
      savingsPerCapita,
      roi,
      totalReduction: totalReduction * 100,
    };
  }, [preventionInvestment, lifestylePrograms, earlyDetection]);

  const handleReset = () => {
    setPreventionInvestment([30]);
    setLifestylePrograms([50]);
    setEarlyDetection([40]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Impact Simulator</CardTitle>
        <CardDescription>
          Model the potential impact of public health interventions on mortality rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Prevention Investment Increase</Label>
              <Badge variant="secondary">{preventionInvestment[0]}%</Badge>
            </div>
            <Slider
              value={preventionInvestment}
              onValueChange={setPreventionInvestment}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Increased funding for preventive care and screenings
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Lifestyle Program Coverage</Label>
              <Badge variant="secondary">{lifestylePrograms[0]}%</Badge>
            </div>
            <Slider
              value={lifestylePrograms}
              onValueChange={setLifestylePrograms}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Population reached by smoking cessation, nutrition, and exercise programs
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Early Detection Improvement</Label>
              <Badge variant="secondary">{earlyDetection[0]}%</Badge>
            </div>
            <Slider
              value={earlyDetection}
              onValueChange={setEarlyDetection}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Improvement in cancer and chronic disease early detection rates
            </p>
          </div>

          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset to Defaults
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Projected Outcomes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lives Saved */}
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-muted-foreground">Lives Saved Annually</span>
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600 mb-1">
                {formatNumber(projected.deathsAvoided)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground font-medium">
                  {formatNumber(baseline.preventableDeaths)}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-green-600 font-medium">
                  {formatNumber(projected.preventableDeaths)}
                </span>
              </div>
            </div>

            {/* Reduction Rate */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Reduction</span>
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {formatNumber(projected.totalReduction, 1)}%
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Preventable deaths percentage:</span>
                <span className="text-blue-600 font-medium">
                  {formatNumber(projected.preventablePercentage, 1)}%
                </span>
              </div>
            </div>

            {/* Economic Impact */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Savings</span>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {formatCurrency(projected.totalSavings / 1000000000)}B
              </p>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(projected.savingsPerCapita)} per capita
              </div>
            </div>

            {/* ROI */}
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-muted-foreground">Return on Investment</span>
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600 mb-1">
                {projected.roi > 0 ? '+' : ''}{formatNumber(projected.roi, 0)}%
              </p>
              <div className="text-sm text-muted-foreground">
                Healthcare spending: {formatCurrency(projected.healthcareSpending)} per capita
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These projections are based on evidence from successful public health interventions. 
              Actual results depend on implementation quality, population characteristics, and sustained commitment. 
              ROI estimates include direct healthcare savings but exclude broader economic benefits from increased productivity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}