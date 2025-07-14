import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Info, History } from 'lucide-react';

interface ExchangeRateHistory {
  id: string;
  date: string;
  rate: number;
  user: string;
}

interface ProjectData {
  id: string;
  name: string;
  country: string;
  unit: string;
  originalCurrency: string;
  consolidatedCurrency: string;
  exchangeRate: number;
  source: string;
  lastUpdate: string;
  originalBudget: number;
  realizedBudget: number;
  deviation: number;
}

const VmoLatamMultiMoeda = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL');
  const [showRateModal, setShowRateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [rateDate, setRateDate] = useState('');

  // Mock data - in real app would come from API
  const exchangeHistory: ExchangeRateHistory[] = [
    { id: '1', date: '2024-01-15', rate: 0.52, user: 'João Silva' },
    { id: '2', date: '2023-08-22', rate: 0.48, user: 'Maria Santos' },
    { id: '3', date: '2023-03-10', rate: 0.51, user: 'Carlos Lima' },
    { id: '4', date: '2022-11-05', rate: 0.47, user: 'Ana Costa' },
  ];

  const projectsData: ProjectData[] = [
    {
      id: '1',
      name: 'Modernização Linha A',
      country: 'Brasil',
      unit: 'Curitiba PR 1',
      originalCurrency: 'BRL',
      consolidatedCurrency: 'SEK',
      exchangeRate: 0.52,
      source: 'Banco Central',
      lastUpdate: '15/01/2024',
      originalBudget: 2500000,
      realizedBudget: 2350000,
      deviation: -6.0
    },
    {
      id: '2',
      name: 'Eficiência Energética',
      country: 'Argentina',
      unit: 'Rosário',
      originalCurrency: 'ARS',
      consolidatedCurrency: 'SEK',
      exchangeRate: 0.0052,
      source: 'BCRA',
      lastUpdate: '15/01/2024',
      originalBudget: 150000000,
      realizedBudget: 165000000,
      deviation: 10.0
    },
    {
      id: '3',
      name: 'Automação Industrial',
      country: 'Chile',
      unit: 'Santiago',
      originalCurrency: 'CLP',
      consolidatedCurrency: 'SEK',
      exchangeRate: 0.00108,
      source: 'BCCh',
      lastUpdate: '15/01/2024',
      originalBudget: 890000000,
      realizedBudget: 820000000,
      deviation: -7.9
    },
    {
      id: '4',
      name: 'IoT Implementation',
      country: 'Brasil',
      unit: 'São Carlos SP',
      originalCurrency: 'USD',
      consolidatedCurrency: 'SEK',
      exchangeRate: 10.8,
      source: 'Fed Reserve',
      lastUpdate: '15/01/2024',
      originalBudget: 180000,
      realizedBudget: 195000,
      deviation: 8.3
    }
  ];

  const countries = ['Brasil', 'Argentina', 'Chile'];
  const units = ['Curitiba PR 1', 'Curitiba PR 2', 'São Carlos SP', 'Manaus AM', 'Rosário', 'Santiago'];
  const currencies = ['BRL', 'ARS', 'CLP', 'USD', 'SEK'];
  const years = ['2022', '2023', '2024'];

  const handleUpdateRate = () => {
    // In real app, would make API call
    console.log('Updating SEK rate:', newRate, 'for date:', rateDate);
    setShowRateModal(false);
    setNewRate('');
    setRateDate('');
  };

  const handleExport = () => {
    // In real app, would generate Excel/Power BI export
    console.log('Exporting data...');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'SEK' ? 'SEK' : 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return 'bg-destructive text-destructive-foreground';
    if (deviation < -5) return 'bg-destructive text-destructive-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multi-moeda & Câmbio</h1>
          <p className="text-muted-foreground">
            Análise de variações cambiais e orçamentos em moedas diferentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={showRateModal} onOpenChange={setShowRateModal}>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Câmbio SEK
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atualizar Taxa de Câmbio SEK</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rate">Nova Taxa</Label>
                  <Input
                    id="rate"
                    placeholder="Ex: 0.52"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Data de Referência</Label>
                  <Input
                    id="date"
                    type="date"
                    value={rateDate}
                    onChange={(e) => setRateDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdateRate}>Atualizar Taxa</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>País</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os países" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Unidade Fabril</Label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label>Moeda de Visualização</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Histórico SEK</Label>
              <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <History className="mr-2 h-4 w-4" />
                    Ver Histórico
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Histórico de Alterações - SEK</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Taxa</TableHead>
                          <TableHead>Usuário</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exchangeHistory.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{entry.rate}</TableCell>
                            <TableCell>{entry.user}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Multi-moeda por Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Moeda Original</TableHead>
                  <TableHead>Moeda Consolidada</TableHead>
                  <TableHead>Taxa de Câmbio</TableHead>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Realizado</TableHead>
                  <TableHead>Desvio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsData.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.country}</TableCell>
                    <TableCell>{project.unit}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.originalCurrency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.consolidatedCurrency}</Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                              <span>{project.exchangeRate}</span>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <p><strong>Fonte:</strong> {project.source}</p>
                              <p><strong>Última atualização:</strong> {project.lastUpdate}</p>
                              <p className="text-xs text-muted-foreground">
                                Clique no histórico para ver alterações anteriores
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{formatCurrency(project.originalBudget, project.originalCurrency)}</TableCell>
                    <TableCell>{formatCurrency(project.realizedBudget, project.originalCurrency)}</TableCell>
                    <TableCell>
                      <Badge className={getDeviationColor(project.deviation)}>
                        {project.deviation > 0 ? '+' : ''}{project.deviation.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VmoLatamMultiMoeda;