import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Download, 
  FileText, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  BarChart3,
  History,
  Plus,
  Filter,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - In real app, this would come from API
const mockProject = {
  id: "PRJ-002",
  name: "Sistema ERP Integrado",
  leader: "João Santos", 
  status: "Crítico" as const,
  area: "TI",
  budget: 1200000,
  realized: 1350000,
  committed: 200000,
  balance: -350000,
  currency: "BRL" as const,
  isCritical: true,
  progress: 85,
  deadline: "28/02/2025",
  description: "Implementação completa do novo sistema ERP para integração de todos os processos corporativos",
  startDate: "01/06/2024",
  lastUpdate: "15/01/2025",
  budgetUtilization: 112.5,
  monthlyPlan: [
    { month: "Jan/25", planned: 150000, realized: 180000 },
    { month: "Fev/25", planned: 200000, realized: 0 },
    { month: "Mar/25", planned: 180000, realized: 0 },
  ],
  transactions: [
    { id: 1, date: "15/01/2025", description: "Licenças Software SAP", amount: 450000, category: "Software", type: "manual" },
    { id: 2, date: "10/01/2025", description: "Consultoria Especializada", amount: 280000, category: "Serviços", type: "imported" },
    { id: 3, date: "05/01/2025", description: "Hardware Servidores", amount: 320000, category: "Hardware", type: "manual" },
  ],
  baselines: [
    { id: 1, version: "v1.0", date: "01/06/2024", budget: 1000000, description: "Baseline inicial aprovada" },
    { id: 2, version: "v1.1", date: "15/09/2024", budget: 1100000, description: "Ajuste por escopo adicional" },
    { id: 3, version: "v1.2", date: "01/12/2024", budget: 1200000, description: "Baseline atual - revisão Q4" },
  ]
};

const statusColors = {
  "Em Andamento": "bg-blue-100 text-blue-800 border-blue-200",
  "Concluído": "bg-green-100 text-green-800 border-green-200", 
  "Em Atraso": "bg-orange-100 text-orange-800 border-orange-200",
  "Planejado": "bg-gray-100 text-gray-800 border-gray-200",
  "Crítico": "bg-red-100 text-red-800 border-red-200"
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comando");
  const [transactionFilter, setTransactionFilter] = useState("all");

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", EUR: "€", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const filteredTransactions = mockProject.transactions.filter(t => 
    !transactionFilter || transactionFilter === "all" || t.category === transactionFilter
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            {/* Navegação superior */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/projetos")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar à Lista
                </Button>
                <div className="h-6 border-l border-border" />
                <h1 className="text-2xl font-bold text-foreground">Detalhes do Projeto</h1>
              </div>
              
              {/* Ações rápidas */}
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ver histórico de alterações</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar dados do projeto</TooltipContent>
                </Tooltip>
                
                <Button size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>

            {/* Informações do projeto */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">{mockProject.name}</h2>
                  {mockProject.isCritical && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{mockProject.id}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={statusColors[mockProject.status]}>
                  {mockProject.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Área</p>
                <p className="text-sm font-medium">{mockProject.area}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Líder</p>
                <p className="text-sm font-medium">{mockProject.leader}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Moeda</p>
                <p className="text-sm font-medium">{mockProject.currency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas críticos */}
        {mockProject.balance < 0 && (
          <div className="container mx-auto px-6 py-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Orçamento Crítico:</strong> O valor realizado ultrapassou o orçamento planejado em {formatCurrency(Math.abs(mockProject.balance), mockProject.currency)}. 
                Ação imediata necessária para controle financeiro do projeto.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Conteúdo principal com abas */}
        <div className="container mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="comando" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Comando</span>
              </TabsTrigger>
              <TabsTrigger value="resumo" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Resumo</span>
              </TabsTrigger>
              <TabsTrigger value="planejamento" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Planejamento</span>
              </TabsTrigger>
              <TabsTrigger value="realizados" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Realizados</span>
              </TabsTrigger>
              <TabsTrigger value="historico" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
            </TabsList>

            {/* Aba Painel de Comando Executivo */}
            <TabsContent value="comando" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Painel de Comando Executivo</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Comparar com Portfolio
                  </Button>
                  <Button size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalar Problema
                  </Button>
                </div>
              </div>

              {/* KPIs Críticos em destaque */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Risco Financeiro</div>
                    <div className="text-2xl font-bold text-red-600">CRÍTICO</div>
                    <div className="text-xs text-red-600">Ultrapassou 12.5%</div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-orange-500">  
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Prazo</div>
                    <div className="text-2xl font-bold text-orange-600">45 dias</div>
                    <div className="text-xs text-orange-600">Para deadline</div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Progresso</div>
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-xs text-blue-600">Execução física</div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">ROI Projetado</div>
                    <div className="text-2xl font-bold text-green-600">18%</div>
                    <div className="text-xs text-green-600">Meta: 15%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Próximas Ações Críticas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Ações Críticas - Próximos 7 dias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-red-800">Reunião emergencial com CFO</p>
                        <p className="text-sm text-red-600">Aprovar rebalanceamento orçamentário - Até 17/01</p>
                      </div>
                      <Button size="sm" variant="outline">Agendar</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="font-medium text-orange-800">Revisão de cronograma</p>
                        <p className="text-sm text-orange-600">Ajustar marcos para compensar atraso - Até 20/01</p>
                      </div>
                      <Button size="sm" variant="outline">Revisar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparação rápida com outros projetos da área */}
              <Card>
                <CardHeader>
                  <CardTitle>Benchmark - Projetos TI (Últimos 6 meses)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">Este Projeto</div>
                      <div className="text-sm text-muted-foreground">112.5% orçamento</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Média TI</div>
                      <div className="text-sm text-muted-foreground">98.2% orçamento</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">Melhor TI</div>
                      <div className="text-sm text-muted-foreground">91.8% orçamento</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Resumo Financeiro */}
            <TabsContent value="resumo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Orçamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(mockProject.budget, mockProject.currency)}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Realizado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(mockProject.realized, mockProject.currency)}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {((mockProject.realized / mockProject.budget) * 100).toFixed(1)}% do orçamento
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Comprometido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(mockProject.committed, mockProject.currency)}</div>
                  </CardContent>
                </Card>
                
                <Card className={mockProject.balance < 0 ? "border-red-200 bg-red-50" : ""}>
                  <CardHeader className="pb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm font-medium text-muted-foreground cursor-help">Saldo</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Valor restante do orçamento após descontar realizados e comprometidos</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${mockProject.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(mockProject.balance, mockProject.currency)}
                    </div>
                    {mockProject.balance < 0 && (
                      <div className="flex items-center text-sm text-red-600">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Sobre orçamento
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Progresso do projeto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Progresso do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Execução</span>
                    <span className="text-sm font-bold">{mockProject.progress}%</span>
                  </div>
                  <Progress value={mockProject.progress} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Início:</span> {mockProject.startDate}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prazo:</span> {mockProject.deadline}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de execução mensal melhorado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Execução Mensal
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded" />
                        <span>Planejado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span>Realizado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded" />
                        <span>Abaixo do planejado</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockProject.monthlyPlan.map((month, index) => {
                      const maxValue = Math.max(month.planned, month.realized, 200000);
                      const plannedPercentage = (month.planned / maxValue) * 100;
                      const realizedPercentage = (month.realized / maxValue) * 100;
                      const isBelowPlan = month.realized < month.planned && month.realized > 0;
                      const variance = month.realized - month.planned;
                      const variancePercentage = month.planned > 0 ? ((variance / month.planned) * 100) : 0;
                      
                      return (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-lg">{month.month}</span>
                              {isBelowPlan && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm text-red-600 font-medium">
                                    {variancePercentage.toFixed(1)}% abaixo
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-right text-sm space-y-1">
                              <div className="text-muted-foreground">
                                Planejado: <span className="font-medium">{formatCurrency(month.planned, mockProject.currency)}</span>
                              </div>
                              <div className="text-muted-foreground">
                                Realizado: <span className="font-medium">{formatCurrency(month.realized, mockProject.currency)}</span>
                              </div>
                              <div className={`font-medium ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Variação: {formatCurrency(variance, mockProject.currency)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Barras comparativas lado a lado */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Barra Planejado */}
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground">Planejado</div>
                              <div className="bg-blue-100 h-8 rounded-lg overflow-hidden relative group">
                                <div 
                                  className="bg-blue-500 h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2" 
                                  style={{ width: `${plannedPercentage}%` }}
                                >
                                  <span className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatCurrency(month.planned, mockProject.currency)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Barra Realizado */}
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground">Realizado</div>
                              <div className={`${isBelowPlan ? 'bg-red-100' : 'bg-green-100'} h-8 rounded-lg overflow-hidden relative group`}>
                                <div 
                                  className={`${isBelowPlan ? 'bg-red-500' : 'bg-green-500'} h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                                  style={{ width: `${realizedPercentage}%` }}
                                >
                                  <span className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatCurrency(month.realized, mockProject.currency)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Barra de progresso visual com comparação */}
                          <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="relative h-full">
                              {/* Referência do planejado (linha) */}
                              <div 
                                className="absolute top-0 w-0.5 h-full bg-blue-600 z-10"
                                style={{ left: `${plannedPercentage}%` }}
                              />
                              {/* Progresso realizado */}
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${isBelowPlan ? 'bg-red-400' : 'bg-green-400'}`}
                                style={{ width: `${realizedPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Resumo executivo */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(mockProject.monthlyPlan.reduce((acc, m) => acc + m.planned, 0), mockProject.currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Planejado</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(mockProject.monthlyPlan.reduce((acc, m) => acc + m.realized, 0), mockProject.currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Realizado</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${mockProject.monthlyPlan.reduce((acc, m) => acc + (m.realized - m.planned), 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(mockProject.monthlyPlan.reduce((acc, m) => acc + (m.realized - m.planned), 0), mockProject.currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">Variação Total</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Planejamento */}
            <TabsContent value="planejamento" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Previsões Mensais de Desembolso</h3>
                  <p className="text-sm text-muted-foreground">Acompanhe o planejamento vs realizado por período</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="text-xs text-muted-foreground">
                    Última baseline: <span className="font-medium">01/12/2024 - 14:30</span>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Salvar Baseline
                  </Button>
                </div>
              </div>

              {/* Legenda e resumo de alertas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">Dentro do planejado</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">1 mês</div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Desvio crítico</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">1 mês</div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Pendente execução</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">1 mês</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tabela melhorada com visualizações */}
              <Card>
                <CardContent className="p-0">
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Período</TableHead>
                          <TableHead className="text-right font-semibold">Planejado</TableHead>
                          <TableHead className="text-right font-semibold">Realizado</TableHead>
                          <TableHead className="text-right font-semibold">Variação</TableHead>
                          <TableHead className="font-semibold">Comparativo Visual</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProject.monthlyPlan.map((month, index) => {
                          const variance = month.realized - month.planned;
                          const variancePercentage = month.planned > 0 ? ((variance / month.planned) * 100) : 0;
                          const isCritical = Math.abs(variancePercentage) > 15;
                          const isOverBudget = variance > 0;
                          const isPending = month.realized === 0;
                          const maxValue = Math.max(month.planned, month.realized, 1);
                          const plannedWidth = (month.planned / maxValue) * 100;
                          const realizedWidth = (month.realized / maxValue) * 100;
                          
                          return (
                            <TableRow key={index} className={`hover:bg-muted/30 ${isCritical ? 'bg-red-50/50' : ''}`}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {month.month}
                                  {isCritical && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="space-y-1 text-xs">
                                          <p><strong>Desvio crítico detectado!</strong></p>
                                          <p>Variação: {Math.abs(variancePercentage).toFixed(1)}%</p>
                                          <p>Limite aceito: ±15%</p>
                                          {isOverBudget ? 
                                            <p className="text-red-600">⚠️ Ultrapassou o orçamento</p> : 
                                            <p className="text-orange-600">⚠️ Abaixo do planejado</p>
                                          }
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              
                              <TableCell className="text-right font-medium group">
                                <div className="flex items-center justify-end gap-1">
                                  <Input
                                    className="w-24 text-right text-sm border-0 bg-transparent p-1 focus:bg-background focus:border-input"
                                    defaultValue={month.planned.toString()}
                                    onBlur={(e) => {
                                      const newValue = parseInt(e.target.value.replace(/\D/g, ''));
                                      if (newValue && newValue !== month.planned) {
                                        // Validação instantânea
                                        if (newValue > month.planned * 1.5) {
                                          e.target.classList.add('border-red-500', 'bg-red-50');
                                        } else {
                                          e.target.classList.remove('border-red-500', 'bg-red-50');
                                        }
                                      }
                                    }}
                                  />
                                  <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </TableCell>
                              
                              <TableCell className="text-right font-medium">
                                <span className={isPending ? 'text-muted-foreground' : isOverBudget ? 'text-red-600' : 'text-green-600'}>
                                  {formatCurrency(month.realized, mockProject.currency)}
                                </span>
                              </TableCell>
                              
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <span className={`font-medium ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(variance, mockProject.currency)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1 text-xs">
                                        <p><strong>Cálculo da Variação:</strong></p>
                                        <p>Realizado - Planejado</p>
                                        <p>{formatCurrency(month.realized, mockProject.currency)} - {formatCurrency(month.planned, mockProject.currency)}</p>
                                        <p>= {formatCurrency(variance, mockProject.currency)}</p>
                                        <p className="border-t pt-1 mt-1">
                                          <strong>Percentual:</strong> {variancePercentage.toFixed(1)}%
                                        </p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  {!isPending && (
                                    <Badge variant={isCritical ? "destructive" : variance >= 0 ? "secondary" : "outline"} className="text-xs">
                                      {variancePercentage.toFixed(1)}%
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              
                              {/* Comparativo Visual - Sparkline */}
                              <TableCell>
                                <div className="w-32 space-y-1">
                                  {/* Barra Planejado */}
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <div className="flex-1 bg-blue-100 h-2 rounded-full overflow-hidden">
                                      <div 
                                        className="bg-blue-500 h-full transition-all duration-300"
                                        style={{ width: `${plannedWidth}%` }}
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Barra Realizado */}
                                  <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${isPending ? 'bg-gray-300' : isOverBudget && isCritical ? 'bg-red-500' : 'bg-green-500'}`} />
                                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isPending ? 'bg-gray-100' : isOverBudget && isCritical ? 'bg-red-100' : 'bg-green-100'}`}>
                                      <div 
                                        className={`h-full transition-all duration-500 ${isPending ? 'bg-gray-300' : isOverBudget && isCritical ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${realizedWidth}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              
                              {/* Status */}
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {isPending ? (
                                    <>
                                      <Clock className="h-4 w-4 text-blue-500" />
                                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                                        Pendente
                                      </Badge>
                                    </>
                                  ) : isCritical ? (
                                    <>
                                      <AlertTriangle className="h-4 w-4 text-red-500" />
                                      <Badge variant="destructive">
                                        Crítico
                                      </Badge>
                                    </>
                                  ) : (
                                    <>
                                      <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                                        <div className="h-2 w-2 bg-white rounded-full" />
                                      </div>
                                      <Badge variant="outline" className="text-green-600 border-green-200">
                                        Normal
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile View - Cards compactos */}
                  <div className="md:hidden space-y-4 p-4">
                    {mockProject.monthlyPlan.map((month, index) => {
                      const variance = month.realized - month.planned;
                      const variancePercentage = month.planned > 0 ? ((variance / month.planned) * 100) : 0;
                      const isCritical = Math.abs(variancePercentage) > 15;
                      const isOverBudget = variance > 0;
                      const isPending = month.realized === 0;
                      const maxValue = Math.max(month.planned, month.realized, 1);
                      const plannedWidth = (month.planned / maxValue) * 100;
                      const realizedWidth = (month.realized / maxValue) * 100;
                      
                      return (
                        <Card key={index} className={`${isCritical ? 'border-red-200 bg-red-50/30' : ''}`}>
                          <CardContent className="p-4 space-y-3">
                            {/* Header do card */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-lg">{month.month}</h4>
                                {isCritical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              </div>
                              <div className="flex items-center gap-2">
                                {isPending ? (
                                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendente
                                  </Badge>
                                ) : isCritical ? (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Crítico
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-green-600 border-green-200">
                                    Normal
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Valores */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Planejado</div>
                                <div className="font-semibold">{formatCurrency(month.planned, mockProject.currency)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Realizado</div>
                                <div className={`font-semibold ${isPending ? 'text-muted-foreground' : isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                                  {formatCurrency(month.realized, mockProject.currency)}
                                </div>
                              </div>
                            </div>

                            {/* Variação */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-muted-foreground text-sm">Variação</div>
                                <div className={`font-semibold ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {formatCurrency(variance, mockProject.currency)}
                                </div>
                              </div>
                              {!isPending && (
                                <Badge variant={isCritical ? "destructive" : variance >= 0 ? "secondary" : "outline"}>
                                  {variancePercentage.toFixed(1)}%
                                </Badge>
                              )}
                            </div>

                            {/* Visualização compacta */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span>Planejado</span>
                                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                                <span>Realizado</span>
                              </div>
                              
                              <div className="relative bg-gray-100 h-6 rounded-full overflow-hidden">
                                {/* Barra planejado (fundo) */}
                                <div 
                                  className="absolute top-0 bg-blue-200 h-full transition-all duration-300"
                                  style={{ width: `${plannedWidth}%` }}
                                />
                                
                                {/* Barra realizado (frente) */}
                                <div 
                                  className={`absolute top-0 h-full transition-all duration-500 ${isPending ? 'bg-gray-300' : isOverBudget && isCritical ? 'bg-red-500' : 'bg-green-500'}`}
                                  style={{ width: `${realizedWidth}%` }}
                                />
                                
                                {/* Linha de referência planejado */}
                                <div 
                                  className="absolute top-0 w-0.5 h-full bg-blue-700 z-10"
                                  style={{ left: `${plannedWidth}%` }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  {/* Resumo da tabela */}
                  <div className="border-t bg-muted/20 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(mockProject.monthlyPlan.reduce((acc, m) => acc + m.planned, 0), mockProject.currency)}
                        </div>
                        <div className="text-muted-foreground">Total Planejado</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(mockProject.monthlyPlan.reduce((acc, m) => acc + m.realized, 0), mockProject.currency)}
                        </div>
                        <div className="text-muted-foreground">Total Realizado</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${mockProject.monthlyPlan.reduce((acc, m) => acc + (m.realized - m.planned), 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(mockProject.monthlyPlan.reduce((acc, m) => acc + (m.realized - m.planned), 0), mockProject.currency)}
                        </div>
                        <div className="text-muted-foreground">Variação Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">
                          {(((mockProject.monthlyPlan.reduce((acc, m) => acc + m.realized, 0) / mockProject.monthlyPlan.reduce((acc, m) => acc + m.planned, 0)) * 100) || 0).toFixed(1)}%
                        </div>
                        <div className="text-muted-foreground">Execução</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Aba Realizados */}
            <TabsContent value="realizados" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Lançamentos</h3>
                <div className="flex gap-2">
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Lançamento
                  </Button>
                </div>
              </div>
              
              {/* Campo para novo lançamento */}
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ex: Licenças de software, equipamentos, consultoria..."
                      className="flex-1"
                    />
                    <Button size="sm">Adicionar</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "manual" ? "default" : "secondary"}>
                              {transaction.type === "manual" ? "Manual" : "Importado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(transaction.amount, mockProject.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Histórico */}
            <TabsContent value="historico" className="space-y-6">
              <h3 className="text-lg font-semibold">Histórico de Baselines</h3>
              
              {mockProject.baselines.length > 0 ? (
                <div className="space-y-4">
                  {mockProject.baselines.map((baseline) => (
                    <Card key={baseline.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{baseline.version}</Badge>
                              <span className="text-sm text-muted-foreground">{baseline.date}</span>
                            </div>
                            <p className="font-medium">{baseline.description}</p>
                            <p className="text-lg font-bold">{formatCurrency(baseline.budget, mockProject.currency)}</p>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Comparar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Nenhuma baseline salva</h4>
                    <p className="text-muted-foreground mb-4">
                      Salve versões do planejamento para acompanhar a evolução do projeto e facilitar comparações futuras.
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar primeira baseline
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Aba Relatórios */}
            <TabsContent value="relatorios" className="space-y-6">
              <h3 className="text-lg font-semibold">Relatórios do Projeto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Relatório Financeiro</h4>
                        <p className="text-sm text-muted-foreground">Análise completa dos gastos e orçamento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Análise de Performance</h4>
                        <p className="text-sm text-muted-foreground">Progresso e marcos do projeto</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cronograma</h4>
                        <p className="text-sm text-muted-foreground">Timeline e prazos do projeto</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Relatório de Equipe</h4>
                        <p className="text-sm text-muted-foreground">Responsáveis e atividades</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}