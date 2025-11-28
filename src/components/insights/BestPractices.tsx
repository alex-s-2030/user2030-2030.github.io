import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingDown, Users, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BestPractice {
  country: string;
  countryCode: string;
  category: string;
  strategy: string;
  description: string;
  impact: string;
  metrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  keyFactors: string[];
}

const countryFlags: Record<string, string> = {
  CH: '🇨🇭',
  SE: '🇸🇪',
  NL: '🇳🇱',
  NO: '🇳🇴',
  CA: '🇨🇦',
};

const bestPractices: BestPractice[] = [
  {
    country: 'Switzerland',
    countryCode: 'CH',
    category: 'Healthcare Access',
    strategy: 'Universal Coverage with Quality Standards',
    description: 'Switzerland maintains the highest life expectancy through universal mandatory health insurance combined with strict quality standards and preventive care incentives.',
    impact: 'Lowest preventable death rate (25%) among studied countries',
    metrics: [
      { label: 'Life Expectancy', value: '83.0 years', improvement: '+1.5 since 2010' },
      { label: 'Preventable Deaths', value: '25%', improvement: '-3% reduction' },
      { label: 'Healthcare Access', value: '99%', improvement: 'Universal' },
    ],
    keyFactors: [
      'Mandatory health insurance with income-based subsidies',
      'Strong primary care network with preventive focus',
      'High-quality standards enforced across all providers',
      'Early intervention programs for chronic diseases',
    ],
  },
  {
    country: 'Sweden',
    countryCode: 'SE',
    category: 'Preventive Care',
    strategy: 'Integrated Prevention Programs',
    description: 'Sweden has successfully reduced cardiovascular mortality through comprehensive lifestyle intervention programs integrated into primary care.',
    impact: '35% reduction in cardiovascular deaths over 13 years',
    metrics: [
      { label: 'Cardiovascular Deaths', value: '28%', improvement: '-7% reduction' },
      { label: 'Program Coverage', value: '75%', improvement: 'Population reached' },
      { label: 'Smoking Rate', value: '8%', improvement: 'Lowest in Europe' },
    ],
    keyFactors: [
      'Free annual health screenings for at-risk populations',
      'Tobacco control policies and cessation support',
      'Community-based exercise and nutrition programs',
      'Digital health tools for self-management',
    ],
  },
  {
    country: 'Netherlands',
    countryCode: 'NL',
    category: 'Chronic Disease Management',
    strategy: 'Care Coordination Model',
    description: 'The Netherlands uses bundled payment systems and care teams to manage diabetes and cardiovascular disease, significantly improving outcomes.',
    impact: '25% reduction in diabetes-related complications',
    metrics: [
      { label: 'Diabetes Management', value: '85%', improvement: 'Well-controlled' },
      { label: 'Hospital Readmissions', value: '-30%', improvement: 'Reduction' },
      { label: 'Patient Satisfaction', value: '92%', improvement: 'High rating' },
    ],
    keyFactors: [
      'Multidisciplinary care teams for chronic conditions',
      'Bundled payments incentivizing quality outcomes',
      'Proactive monitoring and early intervention',
      'Patient education and self-management support',
    ],
  },
  {
    country: 'Norway',
    countryCode: 'NO',
    category: 'Cancer Screening',
    strategy: 'Population-Based Screening Programs',
    description: 'Norway\'s organized cancer screening programs with high participation rates have achieved some of the best early detection and survival rates.',
    impact: '20% improvement in 5-year cancer survival rates',
    metrics: [
      { label: 'Screening Participation', value: '78%', improvement: 'Target population' },
      { label: 'Early Stage Detection', value: '65%', improvement: '+15% improvement' },
      { label: 'Cancer Mortality', value: '-12%', improvement: '13-year decline' },
    ],
    keyFactors: [
      'Organized invitation systems with reminders',
      'Free screening for target populations',
      'Quality-assured diagnostic pathways',
      'Fast-track treatment for positive results',
    ],
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    category: 'Health Equity',
    strategy: 'Reducing Geographic Disparities',
    description: 'Canada has implemented targeted programs to reduce mortality disparities between urban and rural populations through telehealth and mobile clinics.',
    impact: '15% reduction in rural-urban mortality gap',
    metrics: [
      { label: 'Rural Coverage', value: '85%', improvement: 'Telehealth access' },
      { label: 'Wait Times', value: '-25%', improvement: 'For specialists' },
      { label: 'Geographic Gap', value: '-15%', improvement: 'In mortality' },
    ],
    keyFactors: [
      'Expanded telehealth infrastructure',
      'Mobile health clinics for remote areas',
      'Specialist support via telemedicine',
      'Community health worker programs',
    ],
  },
];

export function BestPractices() {
  const categories = Array.from(new Set(bestPractices.map(p => p.category)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Best Practices Showcase
            </CardTitle>
            <CardDescription>
              Learn from successful interventions in leading countries
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                {category.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => {
            const practices = bestPractices.filter(p => p.category === category);
            
            return (
              <TabsContent key={category} value={category} className="space-y-4">
                {practices.map(practice => (
                  <div key={practice.countryCode} className="border border-border rounded-lg p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{countryFlags[practice.countryCode]}</span>
                          <h3 className="text-lg font-semibold text-foreground">{practice.country}</h3>
                          <Badge variant="secondary">{practice.category}</Badge>
                        </div>
                        <h4 className="text-sm font-medium text-primary mb-2">{practice.strategy}</h4>
                      </div>
                      <Award className="h-6 w-6 text-amber-500" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{practice.description}</p>

                    {/* Impact Highlight */}
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{practice.impact}</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {practice.metrics.map((metric, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                          <p className="text-lg font-bold text-foreground mb-0.5">{metric.value}</p>
                          <p className="text-xs text-green-600">{metric.improvement}</p>
                        </div>
                      ))}
                    </div>

                    {/* Key Factors */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-foreground">Key Success Factors</h5>
                      <ul className="space-y-1.5">
                        {practice.keyFactors.map((factor, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Applicability */}
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <strong>Implementation Notes:</strong> This approach requires strong political commitment, 
                        adequate funding, and adaptation to local contexts. Consider piloting in select regions 
                        before nationwide rollout.
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}