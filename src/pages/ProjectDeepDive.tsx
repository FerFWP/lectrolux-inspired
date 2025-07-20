import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Heart, Star, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Target, Building, DollarSign,
  Calendar, Users, Activity, Zap, FileText, BarChart3, Calendar as CalendarIcon,
  MessageSquare, Eye, ExternalLink, Flag, Lightbulb, MapPin,
  User, Mail, Phone, Copy, Share2, ChevronRight, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, AreaChart, Area, BarChart, Bar } from 'recharts';

interface ProjectDetail {
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
  balance: number;
  plannedSavings: number;
  realizedSavings: number;
  buStatus: 'green' | 'yellow' | 'red';
  irStatus: 'green' | 'yellow' | 'red';
  timingStatus: 'green' | 'yellow' | 'red';
  savingStatus: 'green' | 'yellow' | 'red';
  startDate: string;
  endDate: string;
  lastUpdate: string;
  achievements: string[];
  problems: string[];
  decisions: string[];
  learnings: string[];
  currentRisks: string[];
  deviationCauses: string[];
  potentialImpacts: string[];
  nextSteps: { task: string; responsible: string; deadline: string }[];
  phases: { name: string; status: 'completed' | 'in-progress' | 'pending' | 'delayed'; startDate: string; endDate: string; progress: number }[];
  kpiHistory: { month: string; budget: number; realized: number; committed: number; plannedSavings: number; realizedSavings: number }[];
  projectHistory: { date: string; event: string; type: 'milestone' | 'meeting' | 'approval' | 'issue' | 'change'; description: string }[];
  isFavorite: boolean;
}

// Mock data baseado no ID do projeto
const getProjectMockData = (projectId: string): ProjectDetail => {
  const baseProjects = {
    '1': {
      id: '1',
      name: 'Sistema IoT Inteligente',
      code: 'IOT-2024-001',
      area: 'Inovação',
      status: 'attention' as const,
      category: 'Tecnologia',
      site: 'São Paulo',
      type: 'Estratégico',
      leader: 'Ana Silva',
      leaderEmail: 'ana.silva@electrolux.com',
      leaderPhone: '+55 11 99999-9999',
      completion: 65,
      budget: 2500000,
      committed: 1800000,
      realized: 1625000,
      balance: 875000,
      plannedSavings: 800000,
      realizedSavings: 520000,
      buStatus: 'yellow' as const,
      irStatus: 'green' as const,
      timingStatus: 'red' as const,
      savingStatus: 'yellow' as const,
      achievements: [
        'Implementação bem-sucedida do módulo de sensores IoT',
        'Integração completa com sistemas legados',
        'Redução de 15% no consumo energético nos testes piloto'
      ],
      problems: [
        'Atraso na entrega de componentes críticos',
        'Necessidade de ajustes na arquitetura de dados'
      ],
      currentRisks: [
        'Possível atraso adicional por dependências externas',
        'Orçamento sob pressão devido a mudanças de escopo'
      ]
    },
    '2': {
      id: '2',
      name: 'Eficiência Energética',
      code: 'EE-002',
      area: 'Sustentabilidade',
      status: 'critical' as const,
      category: 'Energia',
      site: 'São Paulo',
      type: 'Opex',
      leader: 'João Santos',
      leaderEmail: 'joao.santos@electrolux.com',
      leaderPhone: '+55 11 99999-0002',
      completion: 35,
      budget: 1800000,
      committed: 1600000,
      realized: 630000,
      balance: 1170000,
      plannedSavings: 1200000,
      realizedSavings: 420000,
      buStatus: 'red' as const,
      irStatus: 'yellow' as const,
      timingStatus: 'red' as const,
      savingStatus: 'red' as const,
      achievements: [
        'Redução de 15% no consumo energético nas áreas piloto',
        'Certificação ambiental obtida'
      ],
      problems: [
        'Orçamento insuficiente para implementação completa',
        'Resistência interna das equipes operacionais'
      ],
      currentRisks: [
        'Não cumprimento das metas de economia',
        'Necessidade de investimentos adicionais'
      ]
    }
  };

  const defaultProject = baseProjects['1'];
  const selectedProject = baseProjects[projectId as keyof typeof baseProjects] || defaultProject;

  return {
    ...selectedProject,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    lastUpdate: '2024-01-15',
    decisions: [
      'Migração para arquitetura de microserviços aprovada',
      'Contratação de especialista autorizada'
    ],
    learnings: [
      'Importância de testes mais rigorosos na fase inicial',
      'Necessidade de maior envolvimento das equipes operacionais'
    ],
    deviationCauses: [
      'Mudanças nos requisitos durante desenvolvimento',
      'Complexidade técnica subestimada'
    ],
    potentialImpacts: [
      'Atraso em projetos dependentes',
      'Necessidade de recursos adicionais'
    ],
    nextSteps: [
      { task: 'Finalizar testes de integração', responsible: 'Carlos Santos', deadline: '2024-02-15' },
      { task: 'Treinar equipe operacional', responsible: 'Maria Oliveira', deadline: '2024-02-28' }
    ],
    phases: [
      { name: 'Planejamento', status: 'completed' as const, startDate: '2024-01-15', endDate: '2024-02-15', progress: 100 },
      { name: 'Desenvolvimento', status: 'in-progress' as const, startDate: '2024-02-16', endDate: '2024-08-31', progress: selectedProject.completion },
      { name: 'Testes', status: 'in-progress' as const, startDate: '2024-07-01', endDate: '2024-10-31', progress: 45 },
      { name: 'Implementação', status: 'pending' as const, startDate: '2024-11-01', endDate: '2024-12-31', progress: 0 }
    ],
    kpiHistory: [
      { month: 'Ago/23', budget: selectedProject.budget, realized: selectedProject.budget * 0.1, committed: selectedProject.budget * 0.12, plannedSavings: selectedProject.plannedSavings, realizedSavings: selectedProject.plannedSavings * 0.1 },
      { month: 'Set/23', budget: selectedProject.budget, realized: selectedProject.budget * 0.21, committed: selectedProject.budget * 0.24, plannedSavings: selectedProject.plannedSavings, realizedSavings: selectedProject.plannedSavings * 0.2 },
      { month: 'Out/23', budget: selectedProject.budget, realized: selectedProject.budget * 0.31, committed: selectedProject.budget * 0.36, plannedSavings: selectedProject.plannedSavings, realizedSavings: selectedProject.plannedSavings * 0.3 },
      { month: 'Nov/23', budget: selectedProject.budget, realized: selectedProject.budget * 0.42, committed: selectedProject.budget * 0.48, plannedSavings: selectedProject.plannedSavings, realizedSavings: selectedProject.plannedSavings * 0.4 },
      { month: 'Dez/23', budget: selectedProject.budget, realized: selectedProject.budget * 0.52, committed: selectedProject.budget * 0.6, plannedSavings: selectedProject.plannedSavings, realizedSavings: selectedProject.plannedSavings * 0.5 },
      { month: 'Jan/24', budget: selectedProject.budget, realized: selectedProject.realized, committed: selectedProject.committed, plannedSavings: selectedProject.plannedSavings, realizedSavings: selectedProject.realizedSavings }
    ],
    projectHistory: [
      { date: '2024-01-15', event: 'Início do Projeto', type: 'milestone' as const, description: 'Kickoff oficial com todas as equipes' },
      { date: '2024-01-22', event: 'Revisão de Arquitetura', type: 'meeting' as const, description: 'Definição da arquitetura técnica final' },
      { date: '2024-02-10', event: 'Aprovação de Orçamento', type: 'approval' as const, description: 'Orçamento adicional aprovado' }
    ],
    isFavorite: false
  };
};

const ProjectDeepDive: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail>(getProjectMockData(projectId || '1'));
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'attention': return 'bg-yellow-500';
      case 'ok': return 'bg-green-500';
      case 'on-hold': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'attention': return <Clock className="h-4 w-4" />;
      case 'ok': return <CheckCircle className="h-4 w-4" />;
      case 'on-hold': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSemaphoreColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-400';
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

  const handleExportProject = (format: string) => {
    toast({
      title: "Exportando Relatório",
      description: `Gerando relatório em formato ${format.toUpperCase()}...`,
    });
  };

  const toggleFavorite = () => {
    setProject(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    toast({
      title: project.isFavorite ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
      description: project.isFavorite ? "Projeto removido da lista de favoritos." : "Projeto adicionado à lista de favoritos.",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-4 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                className={project.isFavorite ? "text-yellow-500" : ""}
              >
                {project.isFavorite ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                {project.isFavorite ? "Favorito" : "Favoritar"}
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => handleExportProject('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => handleExportProject('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => handleExportProject('ppt')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PPT
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(project.status)}`}></div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Código: {project.code}</span>
                    <span>•</span>
                    <span>Área: {project.area}</span>
                    <span>•</span>
                    <span>Responsável: {project.leader}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(project.status)} text-white`}
                >
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status}</span>
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Atualizado em {new Date(project.lastUpdate).toLocaleDateString('pt-BR')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="sao-paulo">São Paulo</SelectItem>
                    <SelectItem value="curitiba">Curitiba</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="inovacao">Inovação</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Status Semáforo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">BU Status</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getSemaphoreColor(project.buStatus)}`}></div>
                        <span className="text-lg font-semibold capitalize">{project.buStatus}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Business Unit Status - Indica o desempenho geral da unidade de negócio</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IR Status</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getSemaphoreColor(project.irStatus)}`}></div>
                        <span className="text-lg font-semibold capitalize">{project.irStatus}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Implementation Rate - Taxa de implementação do projeto</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timing</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getSemaphoreColor(project.timingStatus)}`}></div>
                        <span className="text-lg font-semibold capitalize">{project.timingStatus}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Status do cronograma - Indica se o projeto está dentro do prazo</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saving</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getSemaphoreColor(project.savingStatus)}`}></div>
                        <span className="text-lg font-semibold capitalize">{project.savingStatus}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Status das economias - Indica se as metas de savings estão sendo atingidas</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPIs Financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Orçamento Total</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(project.budget)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Realizado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(project.realized)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Comprometido</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(project.committed)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(project.balance)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Savings Previsto</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(project.plannedSavings)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Savings Realizado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(project.realizedSavings)}</p>
                <p className="text-xs text-muted-foreground">
                  {((project.realizedSavings / project.plannedSavings) * 100).toFixed(1)}% da meta
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para o conteúdo principal */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="risks">Riscos</TabsTrigger>
            <TabsTrigger value="next-steps">Próximos Passos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Destaques Executivos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Destaques Executivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Principais Conquistas</h4>
                    <ul className="space-y-1">
                      {project.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Principais Problemas</h4>
                    <ul className="space-y-1">
                      {project.problems.map((problem, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {problem}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Decisões Importantes</h4>
                    <ul className="space-y-1">
                      {project.decisions.map((decision, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Flag className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Principais Aprendizados</h4>
                    <ul className="space-y-1">
                      {project.learnings.map((learning, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          {learning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Progresso Geral */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Progresso do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso Geral</span>
                      <span>{project.completion}%</span>
                    </div>
                    <Progress value={project.completion} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Data de Início</p>
                      <p className="text-lg font-semibold">{new Date(project.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <Flag className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Data de Término</p>
                      <p className="text-lg font-semibold">{new Date(project.endDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <h4 className="font-semibold">Informações do Responsável</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{project.leader}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{project.leaderEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{project.leaderPhone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Timeline do Projeto (Mini-Gantt)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.phases.map((phase, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPhaseStatusColor(phase.status)}`}></div>
                          <h4 className="font-semibold">{phase.name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {phase.status === 'in-progress' ? 'Em Andamento' : 
                             phase.status === 'completed' ? 'Concluída' : 
                             phase.status === 'delayed' ? 'Atrasada' : 'Pendente'}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {phase.progress}%
                        </span>
                      </div>
                      <div className="mb-3">
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Início: {new Date(phase.startDate).toLocaleDateString('pt-BR')}</span>
                        <span>Fim: {new Date(phase.endDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Investimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={project.kpiHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <ChartTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="realized" stackId="1" stroke="#10b981" fill="#10b981" name="Realizado" />
                      <Area type="monotone" dataKey="committed" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Comprometido" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Savings Acumulados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={project.kpiHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <ChartTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="plannedSavings" stroke="#f97316" name="Previsto" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="realizedSavings" stroke="#10b981" name="Realizado" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Pontos de Atenção/Risco
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Riscos Atuais</h4>
                    <ul className="space-y-2">
                      {project.currentRisks.map((risk, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Causas de Desvios</h4>
                    <ul className="space-y-2">
                      {project.deviationCauses.map((cause, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <TrendingDown className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Impactos Potenciais</h4>
                    <ul className="space-y-2">
                      {project.potentialImpacts.map((impact, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Target className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="next-steps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChevronRight className="h-5 w-5" />
                  Próximos Passos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.nextSteps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{step.task}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{step.responsible}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Prazo: {new Date(step.deadline).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Histórico do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {project.projectHistory.map((entry, index) => (
                      <div key={index} className="border-l-2 border-muted pl-4 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{entry.event}</h4>
                          <Badge 
                            variant="outline"
                            className={
                              entry.type === 'milestone' ? 'border-green-500 text-green-700' :
                              entry.type === 'meeting' ? 'border-blue-500 text-blue-700' :
                              entry.type === 'approval' ? 'border-purple-500 text-purple-700' :
                              entry.type === 'issue' ? 'border-red-500 text-red-700' :
                              'border-orange-500 text-orange-700'
                            }
                          >
                            {entry.type === 'milestone' ? 'Marco' :
                             entry.type === 'meeting' ? 'Reunião' :
                             entry.type === 'approval' ? 'Aprovação' :
                             entry.type === 'issue' ? 'Problema' : 'Mudança'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default ProjectDeepDive;