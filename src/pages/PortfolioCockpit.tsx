import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Pause, Target, 
  Building, DollarSign, Calendar, Users, ArrowRight,
  BarChart3, PieChart, Activity, Zap, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  code: string;
  area: string;
  status: 'critical' | 'attention' | 'ok' | 'on-hold' | 'completed';
  category: string;
  site: string;
  type: string;
  leader: string;
  completion: number;
  budget: number;
  committed: number;
  realized: number;
  plannedSavings: number;
  realizedSavings: number;
  buStatus: 'green' | 'yellow' | 'red';
  irStatus: 'green' | 'yellow' | 'red';
  timingStatus: 'green' | 'yellow' | 'red';
  savingStatus: 'green' | 'yellow' | 'red';
  startDate: string;
  endDate: string;
  lastUpdate: string;
  risks: string[];
  nextMilestones: string[];
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1', name: 'Automação Linha A', code: 'AUTO-001', area: 'Produção', 
    status: 'ok', category: 'Automação', site: 'Curitiba', type: 'Capex',
    leader: 'Maria Silva', completion: 85, budget: 2500000, committed: 2400000, 
    realized: 2100000, plannedSavings: 800000, realizedSavings: 680000,
    buStatus: 'green', irStatus: 'green', timingStatus: 'yellow', savingStatus: 'green',
    startDate: '2024-01-15', endDate: '2024-12-30', lastUpdate: '2024-07-20',
    risks: ['Atraso na entrega de equipamentos'], 
    nextMilestones: ['Instalação final - Ago 2024', 'Testes - Set 2024']
  },
  {
    id: '2', name: 'Eficiência Energética', code: 'EE-002', area: 'Sustentabilidade',
    status: 'critical', category: 'Energia', site: 'São Paulo', type: 'Opex',
    leader: 'João Santos', completion: 35, budget: 1800000, committed: 1600000,
    realized: 630000, plannedSavings: 1200000, realizedSavings: 420000,
    buStatus: 'red', irStatus: 'yellow', timingStatus: 'red', savingStatus: 'red',
    startDate: '2024-03-01', endDate: '2024-11-15', lastUpdate: '2024-07-19',
    risks: ['Orçamento insuficiente', 'Resistência interna'], 
    nextMilestones: ['Revisão de escopo - Ago 2024']
  },
  {
    id: '3', name: 'Melhoria Qualidade', code: 'QUA-003', area: 'Qualidade',
    status: 'attention', category: 'Processo', site: 'Manaus', type: 'Capex',
    leader: 'Ana Costa', completion: 60, budget: 950000, committed: 850000,
    realized: 570000, plannedSavings: 400000, realizedSavings: 240000,
    buStatus: 'yellow', irStatus: 'green', timingStatus: 'yellow', savingStatus: 'yellow',
    startDate: '2024-02-01', endDate: '2024-10-31', lastUpdate: '2024-07-18',
    risks: ['Dependência de fornecedor único'],
    nextMilestones: ['Fase 2 implementação - Set 2024']
  }
];

const exchangeRates = {
  BRL: 0.168, // 1 BRL = 0.168 SEK
  USD: 10.85, // 1 USD = 10.85 SEK
  EUR: 11.75  // 1 EUR = 11.75 SEK
};

const formatCurrency = (value: number, fromCurrency: string = 'BRL'): string => {
  const sekValue = value * (exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1);
  return `${(sekValue / 1000).toFixed(1)}k kr`;
};

export default function PortfolioCockpit() {
  const [projects] = useState<Project[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '2024',
    site: 'all',
    area: 'all', 
    category: 'all',
    status: 'all',
    type: 'all'
  });

  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSite = filters.site === 'all' || project.site === filters.site;
      const matchesArea = filters.area === 'all' || project.area === filters.area;
      const matchesCategory = filters.category === 'all' || project.category === filters.category;
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesType = filters.type === 'all' || project.type === filters.type;
      
      return matchesSearch && matchesSite && matchesArea && matchesCategory && matchesStatus && matchesType;
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ok': return 'text-green-600 bg-green-50 border-green-200';
      case 'on-hold': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'attention': return <Clock className="w-4 h-4" />;
      case 'ok': return <CheckCircle className="w-4 h-4" />;
      case 'on-hold': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getRadarColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateKPIs = () => {
    const total = filteredProjects.length;
    const completed = filteredProjects.filter(p => p.status === 'completed').length;
    const critical = filteredProjects.filter(p => p.status === 'critical').length;
    const totalInvestment = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalCommitted = filteredProjects.reduce((sum, p) => sum + p.committed, 0);
    const plannedSavings = filteredProjects.reduce((sum, p) => sum + p.plannedSavings, 0);
    const realizedSavings = filteredProjects.reduce((sum, p) => sum + p.realizedSavings, 0);

    return {
      total,
      completedPerc: total > 0 ? (completed / total * 100).toFixed(1) : '0',
      criticalPerc: total > 0 ? (critical / total * 100).toFixed(1) : '0',
      totalInvestment: formatCurrency(totalInvestment),
      totalCommitted: formatCurrency(totalCommitted),
      plannedSavings: formatCurrency(plannedSavings),
      realizedSavings: formatCurrency(realizedSavings)
    };
  };

  const kpis = calculateKPIs();

  const getRisksAndOpportunities = () => {
    const criticalProjects = filteredProjects.filter(p => p.status === 'critical');
    const delayedProjects = filteredProjects.filter(p => p.timingStatus === 'red');
    const overPerformers = filteredProjects.filter(p => p.realizedSavings > p.plannedSavings * 0.8);
    const biggestGaps = filteredProjects
      .map(p => ({ ...p, gap: p.budget - p.realized }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 3);

    return { criticalProjects, delayedProjects, overPerformers, biggestGaps };
  };

  const { criticalProjects, delayedProjects, overPerformers, biggestGaps } = getRisksAndOpportunities();

  const exportReport = () => {
    toast({
      title: "Exportando relatório",
      description: "O arquivo será baixado em instantes...",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Portfolio Cockpit</h1>
            <p className="text-muted-foreground">
              Visão executiva completa do portfólio de projetos e investimentos
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Última atualização: 20 Jul 2024, 14:30 • Valores em SEK (kr)
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar projetos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.site} onValueChange={(value) => setFilters({...filters, site: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Curitiba">Curitiba</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Manaus">Manaus</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.area} onValueChange={(value) => setFilters({...filters, area: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Produção">Produção</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Sustentabilidade">Sustentabilidade</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="attention">Atenção</SelectItem>
                    <SelectItem value="ok">OK</SelectItem>
                    <SelectItem value="on-hold">Em espera</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Capex">Capex</SelectItem>
                    <SelectItem value="Opex">Opex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Projetos</span>
                </div>
                <div className="text-2xl font-bold">{kpis.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">% Concluídos</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{kpis.completedPerc}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">% Críticos</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{kpis.criticalPerc}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Investimento</span>
                </div>
                <div className="text-lg font-bold">{kpis.totalInvestment}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Comprometido</span>
                </div>
                <div className="text-lg font-bold">{kpis.totalCommitted}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Savings Prev.</span>
                </div>
                <div className="text-lg font-bold">{kpis.plannedSavings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Savings Real.</span>
                </div>
                <div className="text-lg font-bold">{kpis.realizedSavings}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Visual Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Mapa Visual do Portfólio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => (
                    <Card 
                      key={project.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow border ${getStatusColor(project.status)}`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-sm">{project.code}</div>
                            <div className="text-xs text-muted-foreground">{project.name}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(project.status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs">{project.area}</span>
                          <span className="text-xs font-medium">{project.completion}%</span>
                        </div>
                        
                        <Progress value={project.completion} className="h-1 mb-2" />
                        
                        {/* Radar semáforo */}
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`w-2 h-2 rounded-full ${getRadarColor(project.buStatus)}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>BU Status: {project.buStatus.toUpperCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`w-2 h-2 rounded-full ${getRadarColor(project.irStatus)}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>IR Status: {project.irStatus.toUpperCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`w-2 h-2 rounded-full ${getRadarColor(project.timingStatus)}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Timing: {project.timingStatus.toUpperCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`w-2 h-2 rounded-full ${getRadarColor(project.savingStatus)}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Saving: {project.savingStatus.toUpperCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <div className="ml-auto">
                            <Eye className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts and Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas e Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-red-600">Projetos em Risco</h4>
                  {criticalProjects.slice(0, 2).map(project => (
                    <div key={project.id} className="text-xs p-2 bg-red-50 rounded border-l-2 border-red-500 mb-2">
                      <div className="font-medium">{project.code}</div>
                      <div className="text-muted-foreground">{project.risks[0]}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-600">Economia Acima da Meta</h4>
                  {overPerformers.slice(0, 2).map(project => (
                    <div key={project.id} className="text-xs p-2 bg-green-50 rounded border-l-2 border-green-500 mb-2">
                      <div className="font-medium">{project.code}</div>
                      <div className="text-muted-foreground">
                        {formatCurrency(project.realizedSavings)} realizados
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2 text-orange-600">Maiores Gaps</h4>
                  {biggestGaps.slice(0, 2).map(project => (
                    <div key={project.id} className="text-xs p-2 bg-orange-50 rounded border-l-2 border-orange-500 mb-2">
                      <div className="font-medium">{project.code}</div>
                      <div className="text-muted-foreground">
                        Gap: {formatCurrency(project.gap)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Table */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Resumo de Projetos
              </CardTitle>
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Projeto</th>
                      <th className="text-left p-2">Área</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-center p-2">Radar</th>
                      <th className="text-center p-2">% Conclusão</th>
                      <th className="text-right p-2">Orçamento</th>
                      <th className="text-right p-2">Realizado</th>
                      <th className="text-center p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{project.code}</div>
                            <div className="text-xs text-muted-foreground">{project.name}</div>
                          </div>
                        </td>
                        <td className="p-2">{project.area}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getRadarColor(project.buStatus)}`} />
                            <div className={`w-2 h-2 rounded-full ${getRadarColor(project.irStatus)}`} />
                            <div className={`w-2 h-2 rounded-full ${getRadarColor(project.timingStatus)}`} />
                            <div className={`w-2 h-2 rounded-full ${getRadarColor(project.savingStatus)}`} />
                          </div>
                        </td>
                        <td className="p-2 text-center">{project.completion}%</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(project.budget)}</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(project.realized)}</td>
                        <td className="p-2 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedProject(project)}
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

          {/* Project Detail Modal */}
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {selectedProject.code} - {selectedProject.name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Informações Gerais</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Líder:</span>
                          <span className="font-medium">{selectedProject.leader}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Área:</span>
                          <span>{selectedProject.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Site:</span>
                          <span>{selectedProject.site}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Categoria:</span>
                          <span>{selectedProject.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tipo:</span>
                          <span>{selectedProject.type}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Status e Progresso</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedProject.status)}>
                            {selectedProject.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Conclusão:</span>
                          <span className="font-medium">{selectedProject.completion}%</span>
                        </div>
                        <div>
                          <Progress value={selectedProject.completion} className="h-2" />
                        </div>
                        <div className="flex justify-between">
                          <span>Início:</span>
                          <span>{new Date(selectedProject.startDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Previsão:</span>
                          <span>{new Date(selectedProject.endDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Situação Financeira (SEK)</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-blue-50 rounded border">
                        <div className="text-blue-600 font-medium">Orçamento</div>
                        <div className="text-lg font-bold">{formatCurrency(selectedProject.budget)}</div>
                        <div className="text-xs text-muted-foreground">
                          Original: BRL {(selectedProject.budget / 1000).toFixed(1)}k
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded border">
                        <div className="text-orange-600 font-medium">Comprometido</div>
                        <div className="text-lg font-bold">{formatCurrency(selectedProject.committed)}</div>
                        <div className="text-xs text-muted-foreground">
                          {((selectedProject.committed / selectedProject.budget) * 100).toFixed(1)}% do orçamento
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded border">
                        <div className="text-green-600 font-medium">Realizado</div>
                        <div className="text-lg font-bold">{formatCurrency(selectedProject.realized)}</div>
                        <div className="text-xs text-muted-foreground">
                          {((selectedProject.realized / selectedProject.budget) * 100).toFixed(1)}% do orçamento
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Radar de Status</h4>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${getRadarColor(selectedProject.buStatus)}`} />
                        <div className="font-medium">BU</div>
                        <div className="text-xs text-muted-foreground">{selectedProject.buStatus.toUpperCase()}</div>
                      </div>
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${getRadarColor(selectedProject.irStatus)}`} />
                        <div className="font-medium">IR</div>
                        <div className="text-xs text-muted-foreground">{selectedProject.irStatus.toUpperCase()}</div>
                      </div>
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${getRadarColor(selectedProject.timingStatus)}`} />
                        <div className="font-medium">Timing</div>
                        <div className="text-xs text-muted-foreground">{selectedProject.timingStatus.toUpperCase()}</div>
                      </div>
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${getRadarColor(selectedProject.savingStatus)}`} />
                        <div className="font-medium">Saving</div>
                        <div className="text-xs text-muted-foreground">{selectedProject.savingStatus.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Riscos Identificados</h4>
                      <ul className="space-y-1 text-sm">
                        {selectedProject.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">Próximos Marcos</h4>
                      <ul className="space-y-1 text-sm">
                        {selectedProject.nextMilestones.map((milestone, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Calendar className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setSelectedProject(null)}>
                      Fechar
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Navegando para projeto",
                        description: `Abrindo detalhes completos do projeto ${selectedProject.code}`,
                      });
                    }}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Ver Detalhes Completos
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}