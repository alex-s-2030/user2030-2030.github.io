# Understanding Mortality in the West

An interactive data visualization tool designed to help policymakers understand mortality patterns, risks, and policy implications across the West from 2010-2023.

## Project Overview

This application provides comprehensive insights into mortality trends, preventable deaths, and healthcare outcomes across 20 countries. It combines data visualization, gap analysis, and evidence-based policy recommendations to support informed public health decision-making.

## Features

### 📊 Overview Page
- Executive summary with key metrics (life expectancy, mortality rates, preventable deaths)
- Year-over-year trend indicators
- Regional disparities overview
- Leading causes of death summary

### 📈 Dashboard Page
- **Temporal Trends**: Multi-line charts showing mortality evolution over time
- **Comparative Analysis**: Scatter plots correlating healthcare spending with outcomes
- **Country Comparison**: Interactive bar charts across multiple metrics
- **Causes of Death**: Stacked area charts showing mortality by cause
- **Advanced Filters**: Country selection, year range, and metric toggles

### 🗺️ Regional Analysis Page
- **Country Selector**: Searchable list grouped by geographic region
- **Country Detail Cards**: Comprehensive metrics with year-over-year comparisons
- **Geographic Heat Maps**: Visual representation of mortality patterns
- **Comparison Table**: Sortable data table for all countries
- **Small Multiples**: Grid of trend sparklines for quick comparison

### 💡 Policy Insights Page
- **Intervention Simulator**: Model the impact of public health interventions with ROI calculations
- **Gap Analysis**: Identify improvement opportunities with potential lives saved
- **Best Practices Showcase**: Learn from successful interventions in leading countries
- **Policy Recommendations**: 6 evidence-based strategies with implementation guides

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: Wouter 3.7+
- **Styling**: TailwindCSS 4.0
- **UI Components**: Shadcn UI v4
- **Charts**: Recharts 2.15
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Data Structure

The application uses mock data based on public health research, covering:
- **20 Countries**: US, Canada, Mexico, and 17 European nations
- **14 Years**: 2010-2023 temporal data
- **Key Metrics**: 
  - Life expectancy
  - Mortality rates (per 100,000)
  - Preventable deaths percentage
  - Healthcare spending per capita
  - GDP per capita
  - Causes of death breakdown (7 categories)
  - Age group distributions

## Project Goals

1. **Increase Life Expectancy**: Support policies that extend healthy years of life
2. **Reduce Preventable Deaths**: Highlight opportunities for intervention
3. **Address Health Disparities**: Identify and quantify regional and socioeconomic gaps
4. **Support Aging Populations**: Provide insights for demographic shifts
5. **Increase Health System Resilience**: Guide resource allocation and crisis preparedness

## Design Philosophy

- **Professional & Accessible**: Clean interface optimized for policymaker workflows
- **Data-Driven**: Evidence-based insights with clear sourcing
- **Actionable**: Focus on implementable recommendations
- **Transparent**: Open methodology and clear data presentation
- **Responsive**: Works across desktop and tablet devices

## Key Features

### Accessibility
- Keyboard navigation support
- Color-blind safe palette
- WCAG AA compliant contrast ratios
- Screen reader friendly
- Semantic HTML structure

### User Experience
- Smooth page transitions with Framer Motion
- Sticky navigation for easy access
- Dark/light theme toggle
- Mobile-responsive design
- Interactive tooltips and legends
- Error boundary for graceful error handling

### Performance
- Optimized data calculations with useMemo
- Efficient rendering with React 19
- Lazy-loaded components where appropriate

## Data Sources & Methodology

**Note**: This is a demonstration project using mock data. In production, data would come from:
- WHO Global Health Observatory
- OECD Health Statistics
- National vital statistics registries
- Peer-reviewed epidemiological studies

## Future Enhancements

- Real-time data integration
- Advanced filtering by demographic subgroups
- Export functionality for charts and reports
- Multi-language support
- Enhanced mobile experience
- User accounts for saving custom views
- API for programmatic access

## License

This project is for demonstration purposes. All mock data is synthesized for educational use.

## Contact

For questions or collaboration opportunities, please reach out through the contact form in the application.

---

**Built with ❤️ for public health policymakers**