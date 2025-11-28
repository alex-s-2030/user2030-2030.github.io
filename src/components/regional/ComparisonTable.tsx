import { useMemo, useState } from 'react';
import { MortalityData } from '@/types/mortality';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber, formatCurrency } from '@/utils/dataUtils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComparisonTableProps {
  data: MortalityData[];
  year: number;
}

type SortField = 'country' | 'lifeExpectancy' | 'mortalityRate' | 'preventablePercentage' | 'healthcareSpendingPerCapita';
type SortDirection = 'asc' | 'desc';

export function ComparisonTable({ data, year }: ComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>('country');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const yearData = useMemo(() => {
    return data.filter(d => d.year === year);
  }, [data, year]);

  const sortedData = useMemo(() => {
    return [...yearData].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle string comparison for country names
      if (sortField === 'country') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Handle numeric comparison
      const aNum = typeof aVal === 'number' ? aVal : 0;
      const bNum = typeof bVal === 'number' ? bVal : 0;
      
      return sortDirection === 'asc' 
        ? aNum - bNum
        : bNum - aNum;
    });
  }, [yearData, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    const Icon = isActive 
      ? (sortDirection === 'asc' ? ArrowUp : ArrowDown)
      : ArrowUpDown;

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(field)}
        className={isActive ? 'font-semibold' : ''}
      >
        {children}
        <Icon className="ml-2 h-4 w-4" />
      </Button>
    );
  };

  const getValueColor = (value: number, field: SortField) => {
    if (field === 'lifeExpectancy') {
      return value >= 80 ? 'text-green-600' : value >= 75 ? 'text-foreground' : 'text-orange-600';
    }
    if (field === 'mortalityRate') {
      return value <= 700 ? 'text-green-600' : value <= 900 ? 'text-foreground' : 'text-orange-600';
    }
    if (field === 'preventablePercentage') {
      return value <= 30 ? 'text-green-600' : value <= 35 ? 'text-foreground' : 'text-orange-600';
    }
    return 'text-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country Comparison ({year})</CardTitle>
        <CardDescription>
          Click column headers to sort • Color indicates performance level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <SortButton field="country">Country</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="lifeExpectancy">Life Expectancy</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="mortalityRate">Mortality Rate</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="preventablePercentage">Preventable Deaths</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="healthcareSpendingPerCapita">Healthcare Spending</SortButton>
                  </TableHead>
                  <TableHead className="text-right">Population</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((country) => (
                  <TableRow key={country.countryCode}>
                    <TableCell className="font-medium">{country.country}</TableCell>
                    <TableCell className={`text-right ${getValueColor(country.lifeExpectancy, 'lifeExpectancy')}`}>
                      {formatNumber(country.lifeExpectancy, 1)} years
                    </TableCell>
                    <TableCell className={`text-right ${getValueColor(country.mortalityRate, 'mortalityRate')}`}>
                      {formatNumber(country.mortalityRate, 0)} per 100k
                    </TableCell>
                    <TableCell className={`text-right ${getValueColor(country.preventablePercentage, 'preventablePercentage')}`}>
                      {formatNumber(country.preventablePercentage, 1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {country.healthcareSpendingPerCapita 
                        ? formatCurrency(country.healthcareSpendingPerCapita)
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatNumber(country.population)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span>Good performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600" />
            <span>Needs improvement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}