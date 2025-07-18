import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface ExchangeRateData {
  id: string;
  country: string;
  currency: string;
  year: string;
  period: 'Anual' | 'Mensal';
  annualRate?: number;
  monthlyRates: {
    jan?: number;
    fev?: number;
    mar?: number;
    abr?: number;
    mai?: number;
    jun?: number;
    jul?: number;
    ago?: number;
    set?: number;
    out?: number;
    nov?: number;
    dez?: number;
  };
  type: 'BU Rate' | 'AVG Rate';
}

const VmoLatamMultiMoeda = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showSekModal, setShowSekModal] = useState(false);
  const [newSekRate, setNewSekRate] = useState('');

  // Mock data - in real app would come from API
  const exchangeRatesData: ExchangeRateData[] = [
    // 2023 Data
    {
      id: '1-2023',
      country: 'Argentina',
      currency: 'ARS',
      year: '2023',
      period: 'Anual',
      annualRate: 0.0048,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '2-2023',
      country: 'Brasil',
      currency: 'BRL',
      year: '2023',
      period: 'Mensal',
      monthlyRates: {
        jan: 0.19, fev: 0.19, mar: 0.20, abr: 0.20, mai: 0.19,
        jun: 0.20, jul: 0.19, ago: 0.20, set: 0.20, out: 0.20, nov: 0.19, dez: 0.20
      },
      type: 'AVG Rate'
    },
    {
      id: '3-2023',
      country: 'Chile',
      currency: 'CLP',
      year: '2023',
      period: 'Anual',
      annualRate: 0.00125,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '4-2023',
      country: 'Colômbia',
      currency: 'COP',
      year: '2023',
      period: 'Mensal',
      monthlyRates: {
        jan: 0.00022, fev: 0.00021, mar: 0.00023, abr: 0.00021, mai: 0.00020,
        jun: 0.00019, jul: 0.00022, ago: 0.00024, set: 0.00021, out: 0.00020, nov: 0.00022, dez: 0.00023
      },
      type: 'AVG Rate'
    },

    // 2024 Data
    {
      id: '1-2024',
      country: 'Argentina',
      currency: 'ARS',
      year: '2024',
      period: 'Anual',
      annualRate: 0.0052,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '2-2024',
      country: 'Brasil',
      currency: 'BRL',
      year: '2024',
      period: 'Mensal',
      monthlyRates: {
        jan: 0.52, fev: 0.51, mar: 0.53, abr: 0.50, mai: 0.49,
        jun: 0.48, jul: 0.52, ago: 0.54, set: 0.51, out: 0.50, nov: 0.52, dez: 0.53
      },
      type: 'AVG Rate'
    },
    {
      id: '3-2024',
      country: 'Chile',
      currency: 'CLP',
      year: '2024',
      period: 'Anual',
      annualRate: 0.00108,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '4-2024',
      country: 'Colômbia',
      currency: 'COP',
      year: '2024',
      period: 'Mensal',
      monthlyRates: {
        jan: 0.00025, fev: 0.00024, mar: 0.00026, abr: 0.00023, mai: 0.00022,
        jun: 0.00021, jul: 0.00025, ago: 0.00027, set: 0.00024, out: 0.00023, nov: 0.00025, dez: 0.00026
      },
      type: 'AVG Rate'
    },
    {
      id: '5-2024',
      country: 'Equador',
      currency: 'USD',
      year: '2024',
      period: 'Anual',
      annualRate: 10.8,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '6-2024',
      country: 'USA',
      currency: 'USD',
      year: '2024',
      period: 'Mensal',
      monthlyRates: {
        jan: 10.8, fev: 10.7, mar: 10.9, abr: 10.6, mai: 10.5,
        jun: 10.4, jul: 10.8, ago: 11.0, set: 10.7, out: 10.6, nov: 10.8, dez: 10.9
      },
      type: 'AVG Rate'
    },
    {
      id: '7-2024',
      country: 'Peru',
      currency: 'PEN',
      year: '2024',
      period: 'Anual',
      annualRate: 2.95,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '8-2024',
      country: 'Porto Rico',
      currency: 'USD',
      year: '2024',
      period: 'Anual',
      annualRate: 10.8,
      monthlyRates: {},
      type: 'BU Rate'
    },

    // 2025 Data (até junho)
    {
      id: '1-2025',
      country: 'Argentina',
      currency: 'ARS',
      year: '2025',
      period: 'Anual',
      annualRate: 0.0055,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '2-2025',
      country: 'Brasil',
      currency: 'BRL',
      year: '2025',
      period: 'Mensal',
      monthlyRates: {
        jan: 0.17, fev: 0.17, mar: 0.18, abr: 0.17, mai: 0.16, jun: 0.17
      },
      type: 'AVG Rate'
    },
    {
      id: '3-2025',
      country: 'Chile',
      currency: 'CLP',
      year: '2025',
      period: 'Anual',
      annualRate: 0.00095,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '4-2025',
      country: 'Colômbia',
      currency: 'COP',
      year: '2025',
      period: 'Mensal',
      monthlyRates: {
        jan: 0.00028, fev: 0.00027, mar: 0.00029, abr: 0.00026, mai: 0.00025, jun: 0.00024
      },
      type: 'AVG Rate'
    }
  ];

  const years = ['2022', '2023', '2024', '2025'];
  const months = [
    { value: 'all', label: 'Todos os meses' },
    { value: 'jan', label: 'Janeiro' },
    { value: 'fev', label: 'Fevereiro' },
    { value: 'mar', label: 'Março' },
    { value: 'abr', label: 'Abril' },
    { value: 'mai', label: 'Maio' },
    { value: 'jun', label: 'Junho' },
    { value: 'jul', label: 'Julho' },
    { value: 'ago', label: 'Agosto' },
    { value: 'set', label: 'Setembro' },
    { value: 'out', label: 'Outubro' },
    { value: 'nov', label: 'Novembro' },
    { value: 'dez', label: 'Dezembro' }
  ];

  const periods = [
    { value: 'all', label: 'Todos os períodos' },
    { value: 'Anual', label: 'Anual' },
    { value: 'Mensal', label: 'Mensal' }
  ];

  const types = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'BU Rate', label: 'BU Rate' },
    { value: 'AVG Rate', label: 'AVG Rate' }
  ];

  // Filter data based on all selected filters
  const filteredData = exchangeRatesData.filter(rate => {
    const yearMatch = rate.year === selectedYear;
    const periodMatch = selectedPeriod === 'all' || rate.period === selectedPeriod;
    const typeMatch = selectedType === 'all' || rate.type === selectedType;
    return yearMatch && periodMatch && typeMatch;
  });
  const handleAddSekRate = () => {
    // In real app, would make API call to add new SEK BU rate
    console.log('Adding SEK BU rate:', newSekRate, 'for year:', selectedYear);
    setShowSekModal(false);
    setNewSekRate('');
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Taxa de Câmbio</h1>
          <p className="text-muted-foreground">
            Gestão e controle de taxas de câmbio por país e período
          </p>
        </div>
      </div>

      {/* Filtros e Ação */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Ano</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mês</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={showSekModal} onOpenChange={setShowSekModal}>
          <DialogTrigger asChild>
            <Button className="lg:mb-6">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar SEK BU
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar SEK BU Rate</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sek-rate">Taxa Anual SEK</Label>
                <Input
                  id="sek-rate"
                  placeholder="Ex: 10.52"
                  value={newSekRate}
                  onChange={(e) => setNewSekRate(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>País:</strong> Suécia</p>
                <p><strong>Moeda:</strong> SEK</p>
                <p><strong>Ano:</strong> {selectedYear}</p>
                <p><strong>Período:</strong> Anual</p>
                <p><strong>Tipo:</strong> BU Rate</p>
              </div>
              <Button onClick={handleAddSekRate}>Adicionar Taxa</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Taxas de Câmbio */}
      <Card>
        <CardHeader>
          <CardTitle>Taxas de Câmbio por País</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Desktop/Large Screens: Full table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>País</TableHead>
                    <TableHead>Moeda</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Taxa Anual</TableHead>
                    <TableHead className="text-center" colSpan={6}>Jan - Jun</TableHead>
                    <TableHead className="text-center" colSpan={6}>Jul - Dez</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-xs">Jan</TableHead>
                    <TableHead className="text-xs">Fev</TableHead>
                    <TableHead className="text-xs">Mar</TableHead>
                    <TableHead className="text-xs">Abr</TableHead>
                    <TableHead className="text-xs">Mai</TableHead>
                    <TableHead className="text-xs">Jun</TableHead>
                    <TableHead className="text-xs">Jul</TableHead>
                    <TableHead className="text-xs">Ago</TableHead>
                    <TableHead className="text-xs">Set</TableHead>
                    <TableHead className="text-xs">Out</TableHead>
                    <TableHead className="text-xs">Nov</TableHead>
                    <TableHead className="text-xs">Dez</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.country}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{rate.currency}</Badge>
                      </TableCell>
                      <TableCell>{rate.year}</TableCell>
                      <TableCell>{rate.period}</TableCell>
                      <TableCell>
                        {rate.annualRate ? rate.annualRate.toFixed(5) : '—'}
                      </TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.jan?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.fev?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.mar?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.abr?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.mai?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.jun?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.jul?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.ago?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.set?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.out?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.nov?.toFixed(5) || '—'}</TableCell>
                      <TableCell className="text-xs">{rate.monthlyRates.dez?.toFixed(5) || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={rate.type === 'BU Rate' ? 'default' : 'outline'}>
                          {rate.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile/Tablet: Compact cards */}
            <div className="lg:hidden space-y-4">
              {filteredData.map((rate) => (
                <Card key={rate.id} className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="font-semibold">{rate.country}</p>
                      <Badge variant="secondary" className="text-xs">{rate.currency}</Badge>
                    </div>
                    <div className="text-right">
                      <Badge variant={rate.type === 'BU Rate' ? 'default' : 'outline'} className="text-xs">
                        {rate.type}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{rate.period}</p>
                    </div>
                  </div>
                  
                  {rate.annualRate && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Taxa Anual: {rate.annualRate.toFixed(5)}</p>
                    </div>
                  )}

                  {Object.keys(rate.monthlyRates).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Taxas Mensais:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {selectedMonth === 'all' ? (
                          <>
                            <div>Jan: {rate.monthlyRates.jan?.toFixed(5) || '—'}</div>
                            <div>Fev: {rate.monthlyRates.fev?.toFixed(5) || '—'}</div>
                            <div>Mar: {rate.monthlyRates.mar?.toFixed(5) || '—'}</div>
                            <div>Abr: {rate.monthlyRates.abr?.toFixed(5) || '—'}</div>
                            <div>Mai: {rate.monthlyRates.mai?.toFixed(5) || '—'}</div>
                            <div>Jun: {rate.monthlyRates.jun?.toFixed(5) || '—'}</div>
                            <div>Jul: {rate.monthlyRates.jul?.toFixed(5) || '—'}</div>
                            <div>Ago: {rate.monthlyRates.ago?.toFixed(5) || '—'}</div>
                            <div>Set: {rate.monthlyRates.set?.toFixed(5) || '—'}</div>
                            <div>Out: {rate.monthlyRates.out?.toFixed(5) || '—'}</div>
                            <div>Nov: {rate.monthlyRates.nov?.toFixed(5) || '—'}</div>
                            <div>Dez: {rate.monthlyRates.dez?.toFixed(5) || '—'}</div>
                          </>
                        ) : (
                          <div className="col-span-3 text-center font-medium">
                            {months.find(m => m.value === selectedMonth)?.label}: {
                              rate.monthlyRates[selectedMonth as keyof typeof rate.monthlyRates]?.toFixed(5) || '—'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fonte */}
      <div className="flex justify-end">
        <p className="text-xs text-muted-foreground">Base sistema IGS</p>
      </div>
    </div>
  );
};

export default VmoLatamMultiMoeda;