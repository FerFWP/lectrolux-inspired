import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Pause, Target, 
  Building, DollarSign, Calendar, Users, ArrowRight,
  BarChart3, PieChart, Activity, Zap, FileText, Heart,
  Star, MessageSquare, X, ChevronRight, Flag, Lightbulb,
  MapPin, User, Mail, Phone, ExternalLink, Copy, Share2,
  ChevronDown, ChevronUp, Clock3
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  leaderEmail: string;
  leaderPhone: string;
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
  opportunities: string[];
  highlights: string[];
  nextSteps: string[];
  nextMilestones: string[];
  phases: Phase[];
  comments: Comment[];
  isFavorite?: boolean;
  isFollowing?: boolean;
  savingsTarget: number;
  kpiHistory: KPIHistory[];
}

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  completion: number;
}

interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
  type: 'update' | 'risk' | 'milestone' | 'comment';
}

interface KPIHistory {
  month: string;
  budget: number;
  realized: number;
  committed: number;
  plannedSavings: number;
  realizedSavings: number;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1', name: 'Automação Linha A', code: 'AUTO-001', area: 'Produção', 
    status: 'ok', category: 'Automação', site: 'Curitiba', type: 'Capex',
    leader: 'Maria Silva', leaderEmail: 'maria.silva@electrolux.com', leaderPhone: '+55 41 99999-0001',
    completion: 85, budget: 2500000, committed: 2400000, realized: 2100000, 
    plannedSavings: 800000, realizedSavings: 680000, savingsTarget: 850000,
    buStatus: 'green', irStatus: 'green', timingStatus: 'yellow', savingStatus: 'green',
    startDate: '2024-01-15', endDate: '2024-12-30', lastUpdate: '2024-07-20',
    risks: ['Atraso na entrega de equipamentos'],
    opportunities: ['Otimização adicional identificada', 'Possível aplicação em outras linhas'],
    highlights: ['Redução de 40% no tempo de setup', 'Melhoria na qualidade do produto'],
    nextSteps: ['Finalizar instalação dos sensores', 'Treinamento da equipe de operação'],
    nextMilestones: ['Instalação final - Ago 2024', 'Testes - Set 2024'],
    isFavorite: true,
    isFollowing: false,
    phases: [
      { id: '1', name: 'Planejamento', startDate: '2024-01-15', endDate: '2024-02-28', status: 'completed', completion: 100 },
      { id: '2', name: 'Aquisição', startDate: '2024-03-01', endDate: '2024-05-31', status: 'completed', completion: 100 },
      { id: '3', name: 'Instalação', startDate: '2024-06-01', endDate: '2024-09-30', status: 'in-progress', completion: 75 },
      { id: '4', name: 'Testes', startDate: '2024-10-01', endDate: '2024-11-30', status: 'pending', completion: 0 },
      { id: '5', name: 'Go-live', startDate: '2024-12-01', endDate: '2024-12-30', status: 'pending', completion: 0 }
    ],
    comments: [
      { id: '1', author: 'Maria Silva', date: '2024-07-20', text: 'Instalação dos equipamentos principais concluída com sucesso', type: 'update' },
      { id: '2', author: 'João Técnico', date: '2024-07-19', text: 'Identificado atraso na entrega dos sensores - impacto de 1 semana', type: 'risk' },
      { id: '3', author: 'Ana Gerente', date: '2024-07-18', text: 'Milestone de aquisição atingido antes do prazo', type: 'milestone' }
    ],
    kpiHistory: [
      { month: 'Jan', budget: 2500000, realized: 125000, committed: 2400000, plannedSavings: 800000, realizedSavings: 0 },
      { month: 'Fev', budget: 2500000, realized: 350000, committed: 2400000, plannedSavings: 800000, realizedSavings: 0 },
      { month: 'Mar', budget: 2500000, realized: 650000, committed: 2400000, plannedSavings: 800000, realizedSavings: 120000 },
      { month: 'Abr', budget: 2500000, realized: 980000, committed: 2400000, plannedSavings: 800000, realizedSavings: 250000 },
      { month: 'Mai', budget: 2500000, realized: 1350000, committed: 2400000, plannedSavings: 800000, realizedSavings: 380000 },
      { month: 'Jun', budget: 2500000, realized: 1720000, committed: 2400000, plannedSavings: 800000, realizedSavings: 520000 },
      { month: 'Jul', budget: 2500000, realized: 2100000, committed: 2400000, plannedSavings: 800000, realizedSavings: 680000 }
    ]
  },
  {
    id: '2', name: 'Eficiência Energética', code: 'EE-002', area: 'Sustentabilidade',
    status: 'critical', category: 'Energia', site: 'São Paulo', type: 'Opex',
    leader: 'João Santos', leaderEmail: 'joao.santos@electrolux.com', leaderPhone: '+55 11 99999-0002',
    completion: 35, budget: 1800000, committed: 1600000, realized: 630000, 
    plannedSavings: 1200000, realizedSavings: 420000, savingsTarget: 1300000,
    buStatus: 'red', irStatus: 'yellow', timingStatus: 'red', savingStatus: 'red',
    startDate: '2024-03-01', endDate: '2024-11-15', lastUpdate: '2024-07-19',
    risks: ['Orçamento insuficiente', 'Resistência interna', 'Dependência de aprovações externas'],
    opportunities: ['Incentivos fiscais disponíveis', 'Parceria com fornecedor'],
    highlights: ['Redução de 15% no consumo energético', 'Certificação ambiental'],
    nextSteps: ['Revisar escopo do projeto', 'Reunião com stakeholders'],
    nextMilestones: ['Revisão de escopo - Ago 2024'],
    isFavorite: false,
    isFollowing: true,
    phases: [
      { id: '1', name: 'Diagnóstico', startDate: '2024-03-01', endDate: '2024-04-30', status: 'completed', completion: 100 },
      { id: '2', name: 'Planejamento', startDate: '2024-05-01', endDate: '2024-06-30', status: 'delayed', completion: 80 },
      { id: '3', name: 'Implementação', startDate: '2024-07-01', endDate: '2024-10-31', status: 'in-progress', completion: 20 },
      { id: '4', name: 'Validação', startDate: '2024-11-01', endDate: '2024-11-15', status: 'pending', completion: 0 }
    ],
    comments: [
      { id: '1', author: 'João Santos', date: '2024-07-19', text: 'Necessário revisão do orçamento devido a custos adicionais', type: 'risk' },
      { id: '2', author: 'Carlos CFO', date: '2024-07-18', text: 'Aprovação de budget adicional em análise', type: 'update' }
    ],
    kpiHistory: [
      { month: 'Mar', budget: 1800000, realized: 90000, committed: 1600000, plannedSavings: 1200000, realizedSavings: 0 },
      { month: 'Abr', budget: 1800000, realized: 180000, committed: 1600000, plannedSavings: 1200000, realizedSavings: 50000 },
      { month: 'Mai', budget: 1800000, realized: 320000, committed: 1600000, plannedSavings: 1200000, realizedSavings: 150000 },
      { month: 'Jun', budget: 1800000, realized: 480000, committed: 1600000, plannedSavings: 1200000, realizedSavings: 280000 },
      { month: 'Jul', budget: 1800000, realized: 630000, committed: 1600000, plannedSavings: 1200000, realizedSavings: 420000 }
    ]
  },
  {
    id: '3', name: 'Melhoria Qualidade', code: 'QUA-003', area: 'Qualidade',
    status: 'attention', category: 'Processo', site: 'Manaus', type: 'Capex',
    leader: 'Ana Costa', leaderEmail: 'ana.costa@electrolux.com', leaderPhone: '+55 92 99999-0003',
    completion: 60, budget: 950000, committed: 850000, realized: 570000, 
    plannedSavings: 400000, realizedSavings: 240000, savingsTarget: 450000,
    buStatus: 'yellow', irStatus: 'green', timingStatus: 'yellow', savingStatus: 'yellow',
    startDate: '2024-02-01', endDate: '2024-10-31', lastUpdate: '2024-07-18',
    risks: ['Dependência de fornecedor único'],
    opportunities: ['Melhoria contínua identificada', 'Aplicação em outros processos'],
    highlights: ['Redução de 30% nos defeitos', 'Melhoria na satisfação do cliente'],
    nextSteps: ['Validação dos resultados', 'Documentação de processos'],
    nextMilestones: ['Fase 2 implementação - Set 2024'],
    isFavorite: false,
    isFollowing: false,
    phases: [
      { id: '1', name: 'Análise', startDate: '2024-02-01', endDate: '2024-03-31', status: 'completed', completion: 100 },
      { id: '2', name: 'Implementação Fase 1', startDate: '2024-04-01', endDate: '2024-07-31', status: 'in-progress', completion: 85 },
      { id: '3', name: 'Implementação Fase 2', startDate: '2024-08-01', endDate: '2024-10-31', status: 'pending', completion: 0 }
    ],
    comments: [
      { id: '1', author: 'Ana Costa', date: '2024-07-18', text: 'Fase 1 quase concluída, resultados promissores', type: 'update' },
      { id: '2', author: 'Pedro Qualidade', date: '2024-07-17', text: 'Indicadores de qualidade melhoraram significativamente', type: 'milestone' }
    ],
    kpiHistory: [
      { month: 'Fev', budget: 950000, realized: 47500, committed: 850000, plannedSavings: 400000, realizedSavings: 0 },
      { month: 'Mar', budget: 950000, realized: 142500, committed: 850000, plannedSavings: 400000, realizedSavings: 40000 },
      { month: 'Abr', budget: 950000, realized: 237500, committed: 850000, plannedSavings: 400000, realizedSavings: 80000 },
      { month: 'Mai', budget: 950000, realized: 332500, committed: 850000, plannedSavings: 400000, realizedSavings: 120000 },
      { month: 'Jun', budget: 950000, realized: 427500, committed: 850000, plannedSavings: 400000, realizedSavings: 160000 },
      { month: 'Jul', budget: 950000, realized: 570000, committed: 850000, plannedSavings: 400000, realizedSavings: 240000 }
    ]
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
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
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

  const toggleFavorite = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
    ));
    toast({
      title: "Favorito atualizado",
      description: "Projeto adicionado/removido dos favoritos",
    });
  };

  const toggleFollowing = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, isFollowing: !p.isFollowing } : p
    ));
    toast({
      title: "Acompanhamento atualizado",
      description: "Você está agora acompanhando/não acompanhando este projeto",
    });
  };

  const exportProject = (project: Project) => {
    toast({
      title: "Exportando projeto",
      description: `Dados do projeto ${project.code} serão exportados...`,
    });
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const ProjectDetailModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
    if (!project) return null;

    return (
      <Dialog open={!!project} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <DialogTitle className="text-2xl font-bold">{project.name}</DialogTitle>
                  <Badge className={`${getStatusColor(project.status)} border`}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Atualizado {new Date(project.lastUpdate).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">{project.code}</span>
                  <span>•</span>
                  <span>{project.area}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{project.leader}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(project.id)}
                  className={project.isFavorite ? "text-red-500" : "text-muted-foreground"}
                >
                  <Heart className={`w-4 h-4 ${project.isFavorite ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFollowing(project.id)}
                  className={project.isFollowing ? "text-blue-500" : "text-muted-foreground"}
                >
                  <Star className={`w-4 h-4 ${project.isFollowing ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportProject(project)}>
                  <Download className="w-4 h-4 mr-1" />
                  Exportar
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Próximos Passos - Destaque no topo */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Semáforos */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'BU (Business)', status: project.buStatus, tooltip: 'Business Unit - Viabilidade financeira' },
                  { label: 'IR (Investment)', status: project.irStatus, tooltip: 'Investment Return - Retorno do investimento' },
                  { label: 'Timing', status: project.timingStatus, tooltip: 'Cronograma e prazo de entrega' },
                  { label: 'Saving', status: project.savingStatus, tooltip: 'Economia/savings realizados vs. planejados' }
                ].map((item) => (
                  <Card key={item.label}>
                    <CardContent className="p-4 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-2">
                            <div className={`w-8 h-8 rounded-full mx-auto ${getRadarColor(item.status)}`} />
                            <div className="text-sm font-medium">{item.label}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Orçamento</div>
                    <div className="text-lg font-bold">{formatCurrency(project.budget)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Realizado*</div>
                    <div className="text-lg font-bold">{formatCurrency(project.realized)}</div>
                    <div className="text-xs text-muted-foreground">*Inclui compromissos</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Comprometido</div>
                    <div className="text-lg font-bold">{formatCurrency(project.committed)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Savings</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(project.realizedSavings)}</div>
                    <div className="text-xs text-muted-foreground">
                      Meta: {formatCurrency(project.savingsTarget)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="logs">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Destaques Executivos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-green-600" />
                          Highlights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {project.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          Riscos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {project.risks.map((risk, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{risk}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          Oportunidades
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {project.opportunities.map((opportunity, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Target className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{opportunity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Informações de Contato */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{project.leader}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${project.leaderEmail}`} className="text-blue-600 hover:underline">
                            {project.leaderEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{project.leaderPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{project.site}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock3 className="w-5 h-5" />
                        Timeline de Fases - Mini Gantt
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.phases.map((phase) => (
                          <div key={phase.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${getPhaseStatusColor(phase.status)}`} />
                                <span className="font-medium">{phase.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {new Date(phase.startDate).toLocaleDateString('pt-BR')} - {new Date(phase.endDate).toLocaleDateString('pt-BR')}
                                </Badge>
                              </div>
                              <div className="text-sm font-medium">
                                {phase.completion}%
                              </div>
                            </div>
                            <Progress value={phase.completion} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Próximos Marcos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {project.nextMilestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">{milestone}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Variação de KPIs (Últimos 6 Meses)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                          <p>Gráfico de variação de KPIs</p>
                          <p className="text-sm">Orçamento vs Realizado vs Savings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Histórico de Comentários e Atualizações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.comments.map((comment) => (
                          <div key={comment.id} className="border-l-2 border-muted pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <Badge variant="outline" className="text-xs">
                                {comment.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
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
                      onClick={() => navigate(`/project-deep-dive/${project.id}`)}
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