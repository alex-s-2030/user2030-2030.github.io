import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Recommendation {
  id: string;
  title: string;
  category: 'Prevention' | 'Treatment' | 'Infrastructure' | 'Policy';
  timeframe: 'Short-term (1-2 years)' | 'Medium-term (3-5 years)' | 'Long-term (5+ years)';
  cost: 'Low' | 'Medium' | 'High';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  objectives: string[];
  actions: string[];
  metrics: string[];
  examples: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Expand Population-Based Cancer Screening',
    category: 'Prevention',
    timeframe: 'Short-term (1-2 years)',
    cost: 'Medium',
    impact: 'High',
    description: 'Implement organized screening programs for breast, colorectal, and cervical cancers with automated invitation systems and quality assurance.',
    objectives: [
      'Increase screening participation from current 45-55% to 75%',
      'Detect 65% of cancers at early stages',
      'Reduce cancer mortality by 12-15% over 10 years',
    ],
    actions: [
      'Establish centralized invitation and reminder systems',
      'Provide free screening to target populations',
      'Create fast-track diagnostic pathways for positive results',
      'Train and deploy community health workers for outreach',
      'Implement quality assurance protocols across screening sites',
    ],
    metrics: [
      'Screening participation rate by demographic group',
      'Stage at diagnosis distribution',
      'Time from positive screening to treatment initiation',
      'Cancer-specific mortality rates',
    ],
    examples: 'Norway achieved 78% participation with organized invitations and free screening, resulting in 20% improvement in 5-year survival rates.',
  },
  {
    id: 'rec-2',
    title: 'Cardiovascular Disease Prevention Programs',
    category: 'Prevention',
    timeframe: 'Medium-term (3-5 years)',
    cost: 'Medium',
    impact: 'High',
    description: 'Launch comprehensive programs targeting cardiovascular risk factors through lifestyle interventions, medication adherence, and community support.',
    objectives: [
      'Reduce cardiovascular mortality by 30-35%',
      'Achieve 75% population coverage for at-risk individuals',
      'Decrease smoking rates by 50%',
    ],
    actions: [
      'Offer free annual health screenings for at-risk populations',
      'Implement tobacco control policies and cessation programs',
      'Create community-based exercise and nutrition programs',
      'Deploy digital health tools for self-monitoring',
      'Train primary care providers in motivational interviewing',
    ],
    metrics: [
      'Cardiovascular mortality rate',
      'Prevalence of risk factors (smoking, obesity, hypertension)',
      'Program participation and completion rates',
      'Blood pressure and cholesterol control rates',
    ],
    examples: 'Sweden reduced cardiovascular deaths by 35% through integrated lifestyle interventions in primary care reaching 75% of the population.',
  },
  {
    id: 'rec-3',
    title: 'Integrated Chronic Disease Management',
    category: 'Treatment',
    timeframe: 'Medium-term (3-5 years)',
    cost: 'High',
    impact: 'High',
    description: 'Establish multidisciplinary care teams and bundled payment models for diabetes, cardiovascular disease, and COPD management.',
    objectives: [
      'Reduce diabetes-related complications by 25%',
      'Decrease hospital readmissions by 30%',
      'Achieve 85% disease control rates for managed conditions',
    ],
    actions: [
      'Form multidisciplinary teams (physicians, nurses, dietitians, social workers)',
      'Implement bundled payment systems incentivizing quality outcomes',
      'Deploy proactive monitoring and early intervention protocols',
      'Provide patient education and self-management tools',
      'Create care coordination infrastructure',
    ],
    metrics: [
      'Disease control rates (HbA1c, BP, cholesterol)',
      'Complication rates',
      'Hospital readmission rates',
      'Patient satisfaction scores',
      'Healthcare cost per patient',
    ],
    examples: 'Netherlands achieved 85% diabetes control and 30% reduction in readmissions through care coordination and bundled payments.',
  },
  {
    id: 'rec-4',
    title: 'Universal Primary Care Access',
    category: 'Infrastructure',
    timeframe: 'Long-term (5+ years)',
    cost: 'High',
    impact: 'High',
    description: 'Expand primary care infrastructure ensuring all citizens have access to a regular provider within 30 minutes travel time.',
    objectives: [
      'Achieve 99% population coverage for primary care access',
      'Reduce emergency department visits for primary care issues by 40%',
      'Decrease preventable hospitalizations by 25%',
    ],
    actions: [
      'Invest in rural and underserved area clinics',
      'Expand telehealth infrastructure',
      'Deploy mobile health clinics',
      'Provide financial incentives for providers in underserved areas',
      'Train and certify nurse practitioners and physician assistants',
    ],
    metrics: [
      'Population within 30 min of primary care facility',
      'Primary care utilization rates',
      'Emergency department usage for non-emergency conditions',
      'Preventable hospitalization rates',
    ],
    examples: 'Switzerland maintains universal coverage with strict quality standards, achieving 25% preventable death rate.',
  },
  {
    id: 'rec-5',
    title: 'Health Equity and Disparity Reduction',
    category: 'Policy',
    timeframe: 'Long-term (5+ years)',
    cost: 'Medium',
    impact: 'High',
    description: 'Implement targeted interventions to reduce mortality gaps between socioeconomic groups and geographic regions.',
    objectives: [
      'Reduce rural-urban mortality gap by 50%',
      'Eliminate disparities in preventable deaths across income groups',
      'Achieve equitable health outcomes regardless of race or ethnicity',
    ],
    actions: [
      'Conduct regular health equity audits',
      'Target resources to highest-need communities',
      'Address social determinants of health (housing, food security)',
      'Provide culturally competent care training',
      'Create community health worker programs',
    ],
    metrics: [
      'Mortality rates by socioeconomic status and geography',
      'Healthcare access measures by demographic group',
      'Health outcome disparities (preventable deaths, life expectancy)',
      'Social determinant indicators',
    ],
    examples: 'Canada reduced rural-urban mortality gap by 15% through telehealth expansion and mobile clinics.',
  },
  {
    id: 'rec-6',
    title: 'Data-Driven Performance Monitoring',
    category: 'Infrastructure',
    timeframe: 'Short-term (1-2 years)',
    cost: 'Low',
    impact: 'Medium',
    description: 'Establish national mortality surveillance systems with real-time data analytics to identify trends and guide interventions.',
    objectives: [
      'Achieve real-time mortality reporting within 30 days',
      'Identify emerging health threats within 90 days',
      'Enable data-driven resource allocation',
    ],
    actions: [
      'Standardize mortality data collection across regions',
      'Implement electronic death registration systems',
      'Create public dashboards for transparency',
      'Train analysts in epidemiological methods',
      'Establish rapid response protocols for anomalies',
    ],
    metrics: [
      'Data completeness and timeliness',
      'Time to detect emerging trends',
      'Policy decisions based on data insights',
      'Public access to health data',
    ],
    examples: 'Nordic countries use real-time health registries to rapidly identify issues and guide evidence-based policies.',
  },
];

export function PolicyRecommendations() {
  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Policy brief download would be triggered here. This feature requires backend implementation.');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policy Recommendations
            </CardTitle>
            <CardDescription>
              Evidence-based strategies for reducing preventable mortality
            </CardDescription>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-sm text-foreground mb-2">
            Comprehensive Strategy Framework
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            These six evidence-based recommendations form a comprehensive strategy to reduce preventable 
            mortality. Prioritize based on your country's specific gaps and resources.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">2 Short-term</Badge>
            <Badge variant="outline">3 Medium-term</Badge>
            <Badge variant="outline">2 Long-term</Badge>
          </div>
        </div>

        {/* Recommendations Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {recommendations.map((rec) => (
            <AccordionItem key={rec.id} value={rec.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-start justify-between w-full pr-4 text-left">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
                      <Badge variant="outline" className="text-xs">{rec.timeframe}</Badge>
                      <Badge 
                        variant={rec.impact === 'High' ? 'default' : 'outline'} 
                        className="text-xs"
                      >
                        {rec.impact} Impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">{rec.cost} Cost</Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{rec.description}</p>

                  {/* Objectives */}
                  <div>
                    <h5 className="font-semibold text-sm text-foreground mb-2">Key Objectives</h5>
                    <ul className="space-y-1">
                      {rec.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h5 className="font-semibold text-sm text-foreground mb-2">Implementation Actions</h5>
                    <ol className="space-y-1.5">
                      {rec.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-medium flex-shrink-0">{idx + 1}.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Success Metrics */}
                  <div>
                    <h5 className="font-semibold text-sm text-foreground mb-2">Success Metrics</h5>
                    <div className="flex flex-wrap gap-2">
                      {rec.metrics.map((metric, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Real-World Example */}
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h5 className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Proven Success
                    </h5>
                    <p className="text-sm text-muted-foreground">{rec.examples}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Implementation Guidance */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="font-semibold text-sm text-foreground">Implementation Guidance</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Start with assessment:</strong> Use gap analysis to identify which recommendations address your greatest needs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Pilot before scaling:</strong> Test interventions in select regions before nationwide implementation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Monitor continuously:</strong> Track success metrics monthly and adjust strategies based on results.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Engage stakeholders:</strong> Include healthcare providers, patients, and communities in planning and implementation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Ensure sustainability:</strong> Build political consensus and secure multi-year funding commitments.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}