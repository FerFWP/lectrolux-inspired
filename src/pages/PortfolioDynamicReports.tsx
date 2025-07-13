import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, Activity,
  BarChart3, PieChart as PieIcon, Table as TableIcon, Download, Filter,
  HelpCircle, RefreshCw, X, Eye, ExternalLink, ArrowUpDown, Search,
  Calendar, Users, Building, CreditCard, AlertCircle, CheckCircle,
  Lightbulb, ChevronRight, FileBarChart, FileSpreadsheet, Image as ImageIcon
} from "lucide-react";
import { HomeButton } from "@/components/home-button";

const PortfolioDynamicReports = () => {
  // Filter states
  const [filters, setFilters] = useState({
    areas: ['all'],
    status: ['all'],
    period: 'last_6_months',
    category: 'all',
    leaders: ['all'],
    currency: 'BRL'
  });

  const [viewMode, setViewMode] = useState<'executive' | 'analytical'>('analytical');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for portfolio analysis
  const portfolioData = useMemo(() => {
    const projects = [
      {
        id: 1,
        name: "Sistema ERP Corporativo",
        area: "TI",
        status: "Em Andamento",
        leader: "Ana Silva",
        budget: 850000,
        realized: 720000,
        progress: 78,
        category: "Software",
        deadline: "2024-12-30",
        critical: true
      },
      {
        id: 2,
        name: "Campanha Digital Q4",
        area: "Marketing",
        status: "Planejado",
        leader: "Carlos Santos",
        budget: 320000,
        realized: 45000,
        progress: 15,
        category: "Marketing",
        deadline: "2024-11-15",
        critical: false
      },
      {
        id: 3,
        name: "Automação Industrial",
        area: "Operações",
        status: "Em Andamento",
        leader: "Maria Oliveira",
        budget: 480000,
        realized: 380000,
        progress: 82,
        category: "Infraestrutura",
        deadline: "2024-10-20",
        critical: false
      },
      {
        id: 4,
        name: "Portal do Cliente",
        area: "TI",
        status: "Em Atraso",
        leader: "João Costa",
        budget: 290000,
        realized: 340000,
        progress: 95,
        category: "Software",
        deadline: "2024-09-30",
        critical: true
      },
      {
        id: 5,
        name: "Expansão Logística",
        area: "Operações",
        status: "Concluído",
        leader: "Pedro Lima",
        budget: 650000,
        realized: 615000,
        progress: 100,
        category: "Infraestrutura",
        deadline: "2024-08-15",
        critical: false
      }
    ];

    const monthlyEvolution = [
      { month: 'Jan', budget: 2800000, realized: 2150000, variance: -650000 },
      { month: 'Fev', budget: 2950000, realized: 2480000, variance: -470000 },
      { month: 'Mar', budget: 3100000, realized: 2890000, variance: -210000 },
      { month: 'Abr', budget: 3250000, realized: 3320000, variance: 70000 },
      { month: 'Mai', budget: 3400000, realized: 3680000, variance: 280000 },
      { month: 'Jun', budget: 3550000, realized: 3420000, variance: -130000 }
    ];

    const categoryDistribution = [
      { name: 'Software', value: 1140000, color: '#0088FE', projects: 2 },
      { name: 'Infraestrutura', value: 995000, color: '#00C49F', projects: 2 },
      { name: 'Marketing', value: 45000, color: '#FFBB28', projects: 1 },
      { name: 'Consultoria', value: 320000, color: '#FF8042', projects: 0 }
    ];

    const areaDistribution = [
      { name: 'TI', budget: 1140000, realized: 1060000, projects: 2 },
      { name: 'Marketing', budget: 320000, realized: 45000, projects: 1 },
      { name: 'Operações', budget: 1130000, realized: 995000, projects: 2 }
    ];

    return {
      projects,
      monthlyEvolution,
      categoryDistribution,
      areaDistribution,
      totals: {
        projects: projects.length,
        budget: projects.reduce((sum, p) => sum + p.budget, 0),
        realized: projects.reduce((sum, p) => sum + p.realized, 0),
        critical: projects.filter(p => p.critical).length
      }
    };
  }, [filters]);

  const insights = useMemo(() => {
    const { projects, totals } = portfolioData;
    const balance = totals.budget - totals.realized;
    const executionRate = (totals.realized / totals.budget) * 100;
    
    const criticalProjects = projects.filter(p => p.critical);
    const overdueProjects = projects.filter(p => p.status === "Em Atraso");
    const highestSpender = projects.reduce((max, p) => p.realized > max.realized ? p : max);
    
    return {
      balance,
      executionRate,
      criticalProjects: criticalProjects.length,
      overdueProjects: overdueProjects.length,
      highestSpender: highestSpender.name,
      trend: executionRate > 85 ? 'high' : executionRate > 70 ? 'medium' : 'low',
      recommendations: [
        {
          type: 'critical',
          title: 'Projetos Críticos Requerem Atenção',
          description: `${criticalProjects.length} projetos críticos identificados`
        },
        {
          type: 'warning',
          title: 'Desvio Orçamentário Detectado',
          description: `Variação de ${((executionRate - 100) * -1).toFixed(1)}% no orçamento`
        },
        {
          type: 'info',
          title: 'Oportunidade de Otimização',
          description: 'Revisar categoria "Software" - maior consumo'
        }
      ]
    };
  }, [portfolioData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Em Andamento': { variant: 'default' as const, color: 'bg-blue-500' },
      'Planejado': { variant: 'secondary' as const, color: 'bg-gray-500' },
      'Concluído': { variant: 'outline' as const, color: 'bg-green-500' },
      'Em Atraso': { variant: 'destructive' as const, color: 'bg-red-500' }
    };
    
    const config = variants[status as keyof typeof variants] || variants['Planejado'];
    return (
      <Badge variant={config.variant} className="gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {status}
      </Badge>
    );
  };

  const exportData = (format: 'pdf' | 'excel' | 'image') => {
    console.log(`Exporting as ${format}`);
    // Implementar exportação
  };

  const clearFilters = () => {
    setFilters({
      areas: ['all'],
      status: ['all'],
      period: 'last_6_months',
      category: 'all',
      leaders: ['all'],
      currency: 'BRL'
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <HomeButton />
          </TooltipProvider>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Relatórios Dinâmicos do Portfólio
            </h1>
            <p className="text-muted-foreground">
              Análise completa e comparativa do desempenho financeiro de todos os projetos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'executive' ? 'default' : 'outline'}
            onClick={() => setViewMode('executive')}
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Executiva
          </Button>
          <Button 
            variant={viewMode === 'analytical' ? 'default' : 'outline'}
            onClick={() => setViewMode('analytical')}
            size="sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analítica
          </Button>
        </div>
      </div>

      {/* Advanced Filters Bar - Fixed */}
      <Card className="sticky top-4 z-20 shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Área Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Área
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Selecione uma ou múltiplas áreas organizacionais</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                  <SelectItem value="ti">TI</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operacoes">Operações</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Status
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtre projetos por status de execução</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="progress">Em Andamento</SelectItem>
                  <SelectItem value="planned">Planejado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="delayed">Em Atraso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Período
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Defina o período de análise personalizado</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select defaultValue="last_6_months">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                  <SelectItem value="last_12_months">Últimos 12 meses</SelectItem>
                  <SelectItem value="ytd">Este ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="infrastructure">Infraestrutura</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leader Filter */}
            <div className="space-y-2">
              <Label>Líder</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ana">Ana Silva</SelectItem>
                  <SelectItem value="carlos">Carlos Santos</SelectItem>
                  <SelectItem value="maria">Maria Oliveira</SelectItem>
                  <SelectItem value="joao">João Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency Filter */}
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select defaultValue="BRL">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Indicators Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground cursor-help">Total de Projetos</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Número total de projetos ativos no portfólio atual</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-3xl font-bold text-primary">{portfolioData.totals.projects}</p>
                <p className="text-xs text-muted-foreground">Portfolio ativo</p>
              </div>
              <Target className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground cursor-help">Orçamento Consolidado</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma total dos orçamentos aprovados para todos os projetos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(portfolioData.totals.budget)}
                </p>
                <p className="text-xs text-muted-foreground">Total aprovado</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground cursor-help">Realizado Consolidado</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total de gastos já executados em todos os projetos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(portfolioData.totals.realized)}
                </p>
                <p className="text-xs text-green-600">
                  {((portfolioData.totals.realized / portfolioData.totals.budget) * 100).toFixed(1)}% executado
                </p>
              </div>
              <Activity className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${insights.balance >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground cursor-help">Saldo Total</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Diferença entre orçamento total aprovado e valores já executados. <strong>Verde</strong> = saldo positivo disponível, <strong>Vermelho</strong> = déficit que exige contenção de gastos.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className={`text-2xl font-bold ${insights.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(insights.balance))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insights.balance >= 0 ? 'Disponível' : 'Déficit'}
                </p>
              </div>
              <TrendingUp className={`h-10 w-10 ${insights.balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground cursor-help">Projetos Críticos</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Projetos <strong>críticos</strong> apresentam pelo menos uma dessas condições: desvio &gt;20%, atraso &gt;30 dias ou saldo negativo. Requer atenção prioritária da liderança.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-red-600">{insights.criticalProjects}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="animate-pulse cursor-help">
                          ALERTA
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Projetos com orçamento ultrapassado ou em atraso crítico</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">Requerem atenção</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Evolution with Drill-down */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Evolução Mensal do Portfólio
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Drill-down
              </Button>
            </div>
            <CardDescription>
              Orçamento vs Realizado com indicadores de variação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portfolioData.monthlyEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
                   <RechartsTooltip 
                     formatter={(value: any, name) => [
                       formatCurrency(value), 
                       name === 'budget' ? 'Orçamento' : 
                       name === 'realized' ? 'Realizado' : 'Variação'
                     ]}
                     labelStyle={{ color: 'hsl(var(--foreground))' }}
                     contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                     labelFormatter={(label) => `Mês: ${label}`}
                   />
                  <Bar dataKey="budget" fill="hsl(var(--primary))" name="Orçamento" />
                  <Bar dataKey="realized" fill="hsl(var(--chart-2))" name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieIcon className="h-5 w-5" />
                Distribuição por Categoria
              </CardTitle>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Detalhar
              </Button>
            </div>
            <CardDescription>
              Gastos distribuídos por categoria com destaque para fatias críticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  >
                    {portfolioData.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => formatCurrency(value as number)}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    labelFormatter={(name) => `Categoria: ${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Table and Insights */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="h-5 w-5" />
                Tabela Dinâmica de Projetos
              </CardTitle>
              <CardDescription>
                Visão detalhada com opções de ordenação e filtros
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => exportData('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-1">
                      Nome do Projeto
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Orçamento</TableHead>
                  <TableHead className="text-right">Realizado</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-center">% Execução</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.projects.map((project) => {
                  const balance = project.budget - project.realized;
                  return (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Button variant="link" className="p-0 h-auto text-primary">
                            {project.name}
                          </Button>
                          {project.critical && (
                            <Badge variant="destructive" className="h-5">
                              CRÍTICO
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.area}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(project.budget)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(project.realized)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(Math.abs(balance))}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                project.progress >= 90 ? 'bg-green-500' :
                                project.progress >= 70 ? 'bg-blue-500' :
                                project.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{project.leader}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Automatic Insights Panel */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights Automáticos
          </CardTitle>
          <CardDescription>
            Alertas e recomendações baseados na análise do portfólio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-orange-800">⚠️ Atenção: Maior Desvio</p>
              <p className="text-orange-700">O projeto 'Portal do Cliente' registrou desvio de +€50.000 (17%) em Janeiro. Recomenda-se análise urgente dos custos de consultoria.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-800">🚨 Saldo Crítico</p>
              <p className="text-red-700">2 projetos apresentam saldo negativo totalizando -€50.000. Ação imediata necessária para contenção de custos.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">📈 Pico Identificado</p>
              <p className="text-blue-700">Março concentrou 38% dos gastos do portfólio (R$ 1.2M). Principal causa: finalização de 3 projetos críticos simultaneamente.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">📊 Tendência Crescente</p>
              <p className="text-yellow-700">Gastos aumentaram 15% nos últimos 3 meses consecutivos. Projeção indica necessidade de revisão orçamentária para Q2.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800">🎯 Concentração de Gasto</p>
              <p className="text-green-700">A área 'TI' representa 67% dos gastos totais. Considere redistribuir investimentos para outras áreas estratégicas.</p>
            </div>
          </div>
          
          {/* Trend Analysis */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análise de Tendências
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Baseado nos últimos 6 meses de execução do portfólio
            </p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Categoria "Infraestrutura" apresenta melhor controle orçamentário
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Projetos de "TI" têm tendência de estouro orçamentário
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                Área "Marketing" precisa acelerar execução para cumprir prazo
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Export Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportação Avançada
          </CardTitle>
          <CardDescription>
            Exporte dados, gráficos e relatórios personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => exportData('pdf')}
            >
              <FileBarChart className="h-6 w-6" />
              Relatório PDF
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => exportData('excel')}
            >
              <FileSpreadsheet className="h-6 w-6" />
              Dados Excel
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => exportData('image')}
            >
              <ImageIcon className="h-6 w-6" />
              Gráficos PNG
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Incluir filtros aplicados na exportação</p>
              <p className="text-xs text-muted-foreground">
                Exportará apenas os dados visíveis com os filtros atuais
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Loading Animation (Hidden by default) */}
      <div className="hidden animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDynamicReports;