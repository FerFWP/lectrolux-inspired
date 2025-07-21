import React, { useState } from 'react';
import { 
  Building, 
  Calendar, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the analysis
const areaData = [
  {
    id: 'operacoes',
    name: 'Operações',
    planned: 12500000,
    realized: 11800000,
    target: 13000000,
    status: 'ok',
    lastUpdate: '2024-01-19'
  },
  {
    id: 'comercial',
    name: 'Comercial',
    planned: 8500000,
    realized: 9200000,
    target: 8200000,
    status: 'attention',
    lastUpdate: '2024-01-18'
  },
  {
    id: 'supply',
    name: 'Supply Chain',
    planned: 6200000,
    realized: 5800000,
    target: 6500000,
    status: 'critical',
    lastUpdate: '2024-01-19'
  },
  {
    id: 'rh',
    name: 'Recursos Humanos',
    planned: 3200000,
    realized: 2950000,
    target: 3100000,
    status: 'ok',
    lastUpdate: '2024-01-17'
  },
  {
    id: 'ti',
    name: 'Tecnologia',
    planned: 4800000,
    realized: 4200000,
    target: 4900000,
    status: 'attention',
    lastUpdate: '2024-01-18'
  }
];

const chartData = areaData.map(area => ({
  name: area.name,
  Planejado: area.planned / 1000000,
  Realizado: area.realized / 1000000,
  Meta: area.target / 1000000
}));

export default function VmoLatamAnaliseArea() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCurrency, setSelectedCurrency] = useState('SEK');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate KPIs
  const totalPlanned = areaData.reduce((sum, area) => sum + area.planned, 0);
  const totalRealized = areaData.reduce((sum, area) => sum + area.realized, 0);
  const totalTarget = areaData.reduce((sum, area) => sum + area.target, 0);
  const totalDeviation = totalRealized - totalPlanned;
  const deviationPercentage = ((totalDeviation / totalPlanned) * 100).toFixed(1);
  const remainingBudget = totalPlanned - totalRealized;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'attention': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">OK</Badge>;
      case 'attention': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Atenção</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Crítico</Badge>;
      default: return <Badge variant="secondary">N/A</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    const currencySymbols = {
      SEK: 'kr',
      BRL: 'R$',
      USD: '$',
      EUR: '€'
    };
    
    return `${currencySymbols[selectedCurrency as keyof typeof currencySymbols]} ${(value / 1000000).toFixed(1)}M`;
  };

  const exportReport = () => {
    // Mock export functionality
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto pb-32">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Análise por Área</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Atualizado 2 dias</span>
              </div>
            </div>
          </div>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>

        <p className="text-lg text-muted-foreground">
          Performance financeira segmentada por áreas de negócio
        </p>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros Principais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEK">SEK (kr)</SelectItem>
                  <SelectItem value="BRL">BRL (R$)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="capex">CAPEX</SelectItem>
                  <SelectItem value="opex">OPEX</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="attention">Atenção</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>

              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar projetos ou centro de custo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Total Planejado
                <EnhancedTooltip content="Soma total dos valores planejados para todas as áreas">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </EnhancedTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalPlanned)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Total Realizado
                <EnhancedTooltip content="Soma total dos valores realizados até o momento">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </EnhancedTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalRealized)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Desvio
                <EnhancedTooltip content="Diferença entre realizado e planejado (absoluto e percentual)">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </EnhancedTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${
                totalDeviation >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalDeviation >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {formatCurrency(Math.abs(totalDeviation))}
              </div>
              <div className={`text-sm ${
                totalDeviation >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalDeviation >= 0 ? '+' : ''}{deviationPercentage}%
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Saldo Disponível
                <EnhancedTooltip content="Valor restante do orçamento planejado">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </EnhancedTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {formatCurrency(remainingBudget)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Meta Total
                <EnhancedTooltip content="Soma das metas estabelecidas para todas as áreas">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </EnhancedTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalTarget)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análise Visual - Comparativo por Área
            </CardTitle>
            <CardDescription>
              Comparação entre valores planejados, realizados e metas para cada área de negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: `Valor (${selectedCurrency === 'SEK' ? 'kr' : selectedCurrency} M)`, angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}M`, '']} />
                  <Legend />
                  <Bar dataKey="Planejado" fill="#0ea5e9" name="Planejado" />
                  <Bar dataKey="Realizado" fill="#10b981" name="Realizado" />
                  <Bar dataKey="Meta" fill="#8b5cf6" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Analytical Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Tabela Analítica por Área</CardTitle>
            <CardDescription>
              Detalhamento financeiro por área de negócio com indicadores de performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-right">Planejado</TableHead>
                    <TableHead className="text-right">Realizado</TableHead>
                    <TableHead className="text-right">Desvio (abs)</TableHead>
                    <TableHead className="text-right">Desvio (%)</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead className="text-right">Meta</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaData.map((area) => {
                    const deviation = area.realized - area.planned;
                    const deviationPercent = ((deviation / area.planned) * 100).toFixed(1);
                    const balance = area.planned - area.realized;
                    
                    return (
                      <TableRow key={area.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{area.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(area.planned)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(area.realized)}</TableCell>
                        <TableCell className={`text-right ${deviation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(deviation))}
                        </TableCell>
                        <TableCell className={`text-right ${deviation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {deviation >= 0 ? '+' : ''}{deviationPercent}%
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(balance)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(area.target)}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(area.status)}</TableCell>
                        <TableCell>{area.lastUpdate}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {/* Table Footer with Totals */}
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Totais:</span>
                <div className="flex gap-8">
                  <span>Planejado: {formatCurrency(totalPlanned)}</span>
                  <span>Realizado: {formatCurrency(totalRealized)}</span>
                  <span>Meta: {formatCurrency(totalTarget)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Principais Insights Financeiros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-800">Maior Desvio</span>
                </div>
                <p className="text-sm text-red-700">
                  Supply Chain com desvio de -6.5% ({formatCurrency(400000)} abaixo do planejado)
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-800">Melhor Performance</span>
                </div>
                <p className="text-sm text-green-700">
                  Comercial superou meta em 12.2% ({formatCurrency(700000)} acima)
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-yellow-800">Atenção Requerida</span>
                </div>
                <p className="text-sm text-yellow-700">
                  TI e Supply precisam acelerar execução orçamentária
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}