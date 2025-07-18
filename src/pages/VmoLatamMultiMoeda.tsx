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
  const [showSekModal, setShowSekModal] = useState(false);
  const [newSekRate, setNewSekRate] = useState('');

  // Mock data - in real app would come from API
  const exchangeRatesData: ExchangeRateData[] = [
    {
      id: '1',
      country: 'Argentina',
      currency: 'ARS',
      year: '2024',
      period: 'Anual',
      annualRate: 0.0052,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '2',
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
      id: '3',
      country: 'Chile',
      currency: 'CLP',
      year: '2024',
      period: 'Anual',
      annualRate: 0.00108,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '4',
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
      id: '5',
      country: 'Equador',
      currency: 'USD',
      year: '2024',
      period: 'Anual',
      annualRate: 10.8,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '6',
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
      id: '7',
      country: 'Peru',
      currency: 'PEN',
      year: '2024',
      period: 'Anual',
      annualRate: 2.95,
      monthlyRates: {},
      type: 'BU Rate'
    },
    {
      id: '8',
      country: 'Porto Rico',
      currency: 'USD',
      year: '2024',
      period: 'Anual',
      annualRate: 10.8,
      monthlyRates: {},
      type: 'BU Rate'
    }
  ];

  const years = ['2022', '2023', '2024', '2025'];

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>País</TableHead>
                  <TableHead>Moeda</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Taxa Anual</TableHead>
                  <TableHead>Jan</TableHead>
                  <TableHead>Fev</TableHead>
                  <TableHead>Mar</TableHead>
                  <TableHead>Abr</TableHead>
                  <TableHead>Mai</TableHead>
                  <TableHead>Jun</TableHead>
                  <TableHead>Jul</TableHead>
                  <TableHead>Ago</TableHead>
                  <TableHead>Set</TableHead>
                  <TableHead>Out</TableHead>
                  <TableHead>Nov</TableHead>
                  <TableHead>Dez</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRatesData
                  .filter(rate => rate.year === selectedYear)
                  .map((rate) => (
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
                    <TableCell>{rate.monthlyRates.jan?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.fev?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.mar?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.abr?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.mai?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.jun?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.jul?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.ago?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.set?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.out?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.nov?.toFixed(5) || '—'}</TableCell>
                    <TableCell>{rate.monthlyRates.dez?.toFixed(5) || '—'}</TableCell>
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