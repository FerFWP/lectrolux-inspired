import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Pause, Target, 
  Building, DollarSign, Calendar, Users, ArrowRight,
  BarChart3, PieChart, Activity, Zap, FileText, 
  ArrowUpDown, ArrowUp, ArrowDown, Info, HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface MatrixProject {
  id: string;
  name: string;
  code: string;
  area: string;
  program: string;
  category: string;
  type: string;
  status: 'on-track' | 'up-to-5-gap' | 'over-5-gap' | 'on-hold' | 'cancelled' | 'completed';
  completion: number;
  capexIR: 'green' | 'yellow' | 'red';
  timing: 'green' | 'yellow' | 'red';
  saving: 'green' | 'yellow' | 'red';
  buFY: 'green' | 'yellow' | 'red';
  acFY: 'green' | 'yellow' | 'red';
  expFY: 'green' | 'yellow' | 'red';
  savingsBU: 'green' | 'yellow' | 'red';
  savingsAC: 'green' | 'yellow' | 'red';
  savingsEXP: 'green' | 'yellow' | 'red';
  budget: number;
  realized: number;
  plannedSavings: number;
  realizedSavings: number;
  lastUpdate: string;
  site: string;
  year: string;
  statusReason: string;
  timingReason: string;
  savingReason: string;
  capexReason: string;
}

// Mock data para a matriz
const mockMatrixProjects: MatrixProject[] = [
  {
    id: '1',
    name: 'Sistema IoT Inteligente',
    code: 'IOT-2024-001',
    area: 'Inovação',
    program: 'Transformação Digital',
    category: 'Tecnologia',
    type: 'Estratégico',
    status: 'up-to-5-gap',
    completion: 65,
    capexIR: 'yellow',
    timing: 'red',
    saving: 'yellow',
    buFY: 'green',
    acFY: 'yellow',
    expFY: 'green',
    savingsBU: 'yellow',
    savingsAC: 'green',
    savingsEXP: 'yellow',
    budget: 2500000,
    realized: 1625000,
    plannedSavings: 800000,
    realizedSavings: 520000,
    lastUpdate: '2024-07-20',
    site: 'São Paulo',
    year: '2024',
    statusReason: 'Pequeno atraso no cronograma',
    timingReason: 'Atraso de 2 semanas na entrega de componentes',
    savingReason: '65% da meta de savings atingida',
    capexReason: 'Investimento dentro do planejado'
  },
  {
    id: '2',
    name: 'Eficiência Energética',
    code: 'EE-002',
    area: 'Sustentabilidade',
    program: 'Green Initiative',
    category: 'Energia',
    type: 'Opex',
    status: 'over-5-gap',
    completion: 35,
    capexIR: 'red',
    timing: 'red',
    saving: 'red',
    buFY: 'red',
    acFY: 'red',
    expFY: 'yellow',
    savingsBU: 'red',
    savingsAC: 'red',
    savingsEXP: 'yellow',
    budget: 1800000,
    realized: 630000,
    plannedSavings: 1200000,
    realizedSavings: 420000,
    lastUpdate: '2024-07-19',
    site: 'São Paulo',
    year: '2024',
    statusReason: 'Orçamento insuficiente, atraso significativo',
    timingReason: 'Atraso de 6 semanas por aprovações pendentes',
    savingReason: 'Apenas 35% da meta de savings alcançada',
    capexReason: 'Necessidade de 30% mais investimento'
  },
  {
    id: '3',
    name: 'Automação Linha Produção',
    code: 'AUTO-2024-003',
    area: 'Operações',
    program: 'Industry 4.0',
    category: 'Automação',
    type: 'Capex',
    status: 'on-track',
    completion: 80,
    capexIR: 'green',
    timing: 'green',
    saving: 'green',
    buFY: 'green',
    acFY: 'green',
    expFY: 'green',
    savingsBU: 'green',
    savingsAC: 'green',
    savingsEXP: 'green',
    budget: 3200000,
    realized: 2560000,
    plannedSavings: 1500000,
    realizedSavings: 1200000,
    lastUpdate: '2024-07-20',
    site: 'Curitiba',
    year: '2024',
    statusReason: 'Projeto seguindo cronograma perfeitamente',
    timingReason: 'Dentro do prazo estabelecido',
    savingReason: '80% da meta de savings já atingida',
    capexReason: 'Orçamento controlado'
  },
  {
    id: '4',
    name: 'Sistema CRM Avançado',
    code: 'CRM-2024-004',
    area: 'Comercial',
    program: 'Customer Experience',
    category: 'Software',
    type: 'Opex',
    status: 'on-hold',
    completion: 45,
    capexIR: 'yellow',
    timing: 'red',
    saving: 'yellow',
    buFY: 'yellow',
    acFY: 'yellow',
    expFY: 'red',
    savingsBU: 'yellow',
    savingsAC: 'yellow',
    savingsEXP: 'red',
    budget: 1200000,
    realized: 540000,
    plannedSavings: 600000,
    realizedSavings: 270000,
    lastUpdate: '2024-07-18',
    site: 'São Paulo',
    year: '2024',
    statusReason: 'Projeto pausado para reavaliação de escopo',
    timingReason: 'Parado há 3 semanas',
    savingReason: '45% da meta atingida antes da pausa',
    capexReason: 'Orçamento em reavaliação'
  },
  {
    id: '5',
    name: 'Renovação Layout Fábrica',
    code: 'LAY-2024-005',
    area: 'Operações',
    program: 'Lean Manufacturing',
    category: 'Infraestrutura',
    type: 'Capex',
    status: 'completed',
    completion: 100,
    capexIR: 'green',
    timing: 'green',
    saving: 'green',
    buFY: 'green',
    acFY: 'green',
    expFY: 'green',
    savingsBU: 'green',
    savingsAC: 'green',
    savingsEXP: 'green',
    budget: 2800000,
    realized: 2750000,
    plannedSavings: 1100000,
    realizedSavings: 1150000,
    lastUpdate: '2024-07-15',
    site: 'Curitiba',
    year: '2024',
    statusReason: 'Projeto concluído com sucesso',
    timingReason: 'Finalizado dentro do prazo',
    savingReason: 'Meta de savings superada em 5%',
    capexReason: 'Finalizado 2% abaixo do orçamento'
  }
];

const StatusMatrix: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<MatrixProject[]>(mockMatrixProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState({
    year: 'all',
    site: 'all',
    area: 'all',
    program: 'all',
    category: 'all',
    type: 'all',
    status: 'all'
  });

  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200';
      case 'up-to-5-gap': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'over-5-gap': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-hold': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track': return 'On Track';
      case 'up-to-5-gap': return 'Até 5% Gap';
      case 'over-5-gap': return '>5% Gap';
      case 'on-hold': return 'On Hold';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        (filters.year === 'all' || project.year === filters.year) &&
        (filters.site === 'all' || project.site === filters.site) &&
        (filters.area === 'all' || project.area === filters.area) &&
        (filters.program === 'all' || project.program === filters.program) &&
        (filters.category === 'all' || project.category === filters.category) &&
        (filters.type === 'all' || project.type === filters.type) &&
        (filters.status === 'all' || project.status === filters.status);

      return matchesSearch && matchesFilters;
    });
  }, [projects, searchTerm, filters]);

  const sortedProjects = useMemo(() => {
    if (!sortConfig) return filteredProjects;

    return [...filteredProjects].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof MatrixProject];
      const bValue = b[sortConfig.key as keyof MatrixProject];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="w-3 h-3" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const calculateSummary = () => {
    const total = filteredProjects.length;
    const onTrack = filteredProjects.filter(p => p.status === 'on-track').length;
    const upTo5Gap = filteredProjects.filter(p => p.status === 'up-to-5-gap').length;
    const over5Gap = filteredProjects.filter(p => p.status === 'over-5-gap').length;
    const onHold = filteredProjects.filter(p => p.status === 'on-hold').length;
    const completed = filteredProjects.filter(p => p.status === 'completed').length;
    const cancelled = filteredProjects.filter(p => p.status === 'cancelled').length;

    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalRealized = filteredProjects.reduce((sum, p) => sum + p.realized, 0);
    const totalPlannedSavings = filteredProjects.reduce((sum, p) => sum + p.plannedSavings, 0);
    const totalRealizedSavings = filteredProjects.reduce((sum, p) => sum + p.realizedSavings, 0);

    return {
      total, onTrack, upTo5Gap, over5Gap, onHold, completed, cancelled,
      totalBudget, totalRealized, totalPlannedSavings, totalRealizedSavings
    };
  };

  const summary = calculateSummary();

  const exportToExcel = () => {
    toast({
      title: "Exportando para Excel",
      description: "O arquivo será baixado em instantes...",
    });
  };

  const exportToPDF = () => {
    toast({
      title: "Exportando para PDF",
      description: "O arquivo será baixado em instantes...",
    });
  };

  const StatusCell: React.FC<{ status: 'green' | 'yellow' | 'red'; reason: string; type: string }> = ({ status, reason, type }) => (
    <Tooltip>
      <TooltipTrigger>
        <div className={`w-6 h-6 rounded-full ${getStatusColor(status)} mx-auto cursor-help`} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-xs">
          <p className="font-semibold">{type}</p>
          <p className="text-sm">{reason}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-4 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Status Matrix</h1>
              <p className="text-muted-foreground">
                Visão consolidada matricial dos status de todos os projetos do portfólio
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={exportToExcel} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button onClick={exportToPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
            <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Anos</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.site} onValueChange={(value) => setFilters(prev => ({ ...prev, site: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Sites</SelectItem>
                <SelectItem value="São Paulo">São Paulo</SelectItem>
                <SelectItem value="Curitiba">Curitiba</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({ ...prev, area: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Áreas</SelectItem>
                <SelectItem value="Inovação">Inovação</SelectItem>
                <SelectItem value="Operações">Operações</SelectItem>
                <SelectItem value="Sustentabilidade">Sustentabilidade</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.program} onValueChange={(value) => setFilters(prev => ({ ...prev, program: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Programas</SelectItem>
                <SelectItem value="Transformação Digital">Transformação Digital</SelectItem>
                <SelectItem value="Green Initiative">Green Initiative</SelectItem>
                <SelectItem value="Industry 4.0">Industry 4.0</SelectItem>
                <SelectItem value="Customer Experience">Customer Experience</SelectItem>
                <SelectItem value="Lean Manufacturing">Lean Manufacturing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                <SelectItem value="Energia">Energia</SelectItem>
                <SelectItem value="Automação">Automação</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Estratégico">Estratégico</SelectItem>
                <SelectItem value="Opex">Opex</SelectItem>
                <SelectItem value="Capex">Capex</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="up-to-5-gap">Até 5% Gap</SelectItem>
                <SelectItem value="over-5-gap">&gt;5% Gap</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar projeto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Legenda */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Legenda de Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Verde: OK / Meta atingida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Amarelo: Atenção / Monitoramento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Vermelho: Crítico / Ação requerida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Projetos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{summary.onTrack}</div>
              <div className="text-sm text-muted-foreground">On Track</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.upTo5Gap}</div>
              <div className="text-sm text-muted-foreground">Até 5% Gap</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{summary.over5Gap}</div>
              <div className="text-sm text-muted-foreground">&gt;5% Gap</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{summary.onHold}</div>
              <div className="text-sm text-muted-foreground">On Hold</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.completed}</div>
              <div className="text-sm text-muted-foreground">Concluído</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-foreground">{formatCurrency(summary.totalBudget)}</div>
              <div className="text-sm text-muted-foreground">Investimento Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Matrix Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Matriz de Status ({filteredProjects.length} projetos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-3 text-left font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('code')}>
                      <div className="flex items-center gap-1">
                        Projeto {getSortIcon('code')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('capexIR')}>
                      <div className="flex items-center justify-center gap-1">
                        Capex IR {getSortIcon('capexIR')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('timing')}>
                      <div className="flex items-center justify-center gap-1">
                        Timing {getSortIcon('timing')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('saving')}>
                      <div className="flex items-center justify-center gap-1">
                        Saving {getSortIcon('saving')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('completion')}>
                      <div className="flex items-center justify-center gap-1">
                        % Conclusão {getSortIcon('completion')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('buFY')}>
                      <div className="flex items-center justify-center gap-1">
                        BU (FY) {getSortIcon('buFY')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('acFY')}>
                      <div className="flex items-center justify-center gap-1">
                        AC (FY) {getSortIcon('acFY')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('expFY')}>
                      <div className="flex items-center justify-center gap-1">
                        EXP (FY) {getSortIcon('expFY')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('savingsBU')}>
                      <div className="flex items-center justify-center gap-1">
                        Savings BU {getSortIcon('savingsBU')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('savingsAC')}>
                      <div className="flex items-center justify-center gap-1">
                        Savings AC {getSortIcon('savingsAC')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('savingsEXP')}>
                      <div className="flex items-center justify-center gap-1">
                        Savings EXP {getSortIcon('savingsEXP')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                      <div className="flex items-center justify-center gap-1">
                        Status Geral {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="p-3 text-center font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <div>
                          <div className="font-medium cursor-pointer text-primary hover:underline" onClick={() => navigate(`/project-deep-dive/${project.id}`)}>
                            {project.code}
                          </div>
                          <div className="text-xs text-muted-foreground">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.area} • {project.type}</div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.capexIR} reason={project.capexReason} type="Capex IR" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.timing} reason={project.timingReason} type="Timing" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.saving} reason={project.savingReason} type="Saving" />
                      </td>
                      <td className="p-3 text-center">
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="font-medium">{project.completion}%</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Última atualização: {new Date(project.lastUpdate).toLocaleDateString('pt-BR')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.buFY} reason="Status BU para o ano fiscal" type="BU (FY)" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.acFY} reason="Status AC para o ano fiscal" type="AC (FY)" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.expFY} reason="Status EXP para o ano fiscal" type="EXP (FY)" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.savingsBU} reason="Status savings BU" type="Savings BU" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.savingsAC} reason="Status savings AC" type="Savings AC" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusCell status={project.savingsEXP} reason="Status savings EXP" type="Savings EXP" />
                      </td>
                      <td className="p-3 text-center">
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge className={`${getProjectStatusColor(project.status)}`}>
                              {getProjectStatusLabel(project.status)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{project.statusReason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="p-3 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/project-deep-dive/${project.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default StatusMatrix;