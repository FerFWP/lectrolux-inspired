import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Plus, FileText, LayoutDashboard, FolderOpen, BarChart3, Calendar, Settings, Download, Filter, HelpCircle, CheckCircle, AlertCircle, Info, Clock, Sparkles, Workflow } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AIInsightsPanel } from "@/components/ai-insights-panel";
import { SelfServiceDashboard } from "@/components/self-service-dashboard";
import { ApprovalWorkflow } from "@/components/approval-workflow";
import { PendingUpdatesCard } from "@/components/pending-updates-card";
import { ContextualNotifications } from "@/components/contextual-notifications";
import { MotivationalFeedback } from "@/components/motivational-feedback";
import { Portal } from "@/components/ui/portal";
import { useNavigate } from "react-router-dom";

// Função para gerar dados dinâmicos baseados nos filtros
const getFilteredData = (area: string, year: string, status: string) => {
  // Dados base diferenciados por área
  const areaMultipliers = {
    all: {
      budget: 1,
      realized: 0.74,
      committed: 0.16
    },
    ti: {
      budget: 0.6,
      realized: 0.85,
      committed: 0.12
    },
    marketing: {
      budget: 0.4,
      realized: 0.65,
      committed: 0.25
    },
    operacoes: {
      budget: 0.8,
      realized: 0.78,
      committed: 0.18
    }
  };

  // Ajustes por ano
  const yearMultipliers = {
    "2024": {
      budget: 0.9,
      realized: 0.95,
      committed: 0.8
    },
    "2025": {
      budget: 1.0,
      realized: 0.74,
      committed: 1.0
    },
    "2026": {
      budget: 1.2,
      realized: 0.45,
      committed: 0.6
    }
  };
  const areaData = areaMultipliers[area as keyof typeof areaMultipliers] || areaMultipliers.all;
  const yearData = yearMultipliers[year as keyof typeof yearMultipliers] || yearMultipliers["2025"];
  const baseBudget = 2500000;
  const budget = Math.round(baseBudget * areaData.budget * yearData.budget);
  const realized = Math.round(budget * areaData.realized * yearData.realized);
  const committed = Math.round(budget * areaData.committed * yearData.committed);
  const available = budget - realized - committed;

  // Dados do portfólio
  const portfolioData = {
    budget,
    realized,
    committed,
    available,
    budgetUnit: Math.round(budget * 0.85),
    // Linha BU - teto anual aprovado
    budgetUtilization: (realized + committed) / budget * 100
  };

  // Dados do gráfico (últimos 6 meses)
  const chartData = [{
    month: "Jan",
    planejado: Math.round(180000 * areaData.budget * yearData.budget),
    realizado: Math.round(165000 * areaData.realized * yearData.realized),
    comprometido: Math.round(50000 * areaData.committed * yearData.committed),
    bu: Math.round(95 * areaData.realized),
    underPerformed: areaData.realized < 0.8
  }, {
    month: "Fev",
    planejado: Math.round(220000 * areaData.budget * yearData.budget),
    realizado: Math.round(198000 * areaData.realized * yearData.realized),
    comprometido: Math.round(65000 * areaData.committed * yearData.committed),
    bu: Math.round(90 * areaData.realized),
    underPerformed: areaData.realized < 0.85
  }, {
    month: "Mar",
    planejado: Math.round(280000 * areaData.budget * yearData.budget),
    realizado: Math.round(245000 * areaData.realized * yearData.realized),
    comprometido: Math.round(85000 * areaData.committed * yearData.committed),
    bu: Math.round(87 * areaData.realized),
    underPerformed: areaData.realized < 0.87
  }, {
    month: "Abr",
    planejado: Math.round(310000 * areaData.budget * yearData.budget),
    realizado: Math.round(280000 * areaData.realized * yearData.realized),
    comprometido: Math.round(95000 * areaData.committed * yearData.committed),
    bu: Math.round(90 * areaData.realized),
    underPerformed: areaData.realized < 0.9
  }, {
    month: "Mai",
    planejado: Math.round(350000 * areaData.budget * yearData.budget),
    realizado: Math.round(320000 * areaData.realized * yearData.realized),
    comprometido: Math.round(110000 * areaData.committed * yearData.committed),
    bu: Math.round(91 * areaData.realized),
    underPerformed: areaData.realized < 0.91
  }, {
    month: "Jun",
    planejado: Math.round(400000 * areaData.budget * yearData.budget),
    realizado: Math.round(380000 * areaData.realized * yearData.realized),
    comprometido: Math.round(125000 * areaData.committed * yearData.committed),
    bu: Math.round(95 * areaData.realized),
    underPerformed: areaData.realized < 0.95
  }];

  // Distribuição por status (ajustada por filtros)
  const statusDistribution = {
    all: [{
      name: "Em Andamento",
      value: 45,
      color: "hsl(213, 67%, 35%)"
    }, {
      name: "Planejado",
      value: 25,
      color: "hsl(213, 38%, 91%)"
    }, {
      name: "Concluído",
      value: 20,
      color: "hsl(210, 100%, 18%)"
    }, {
      name: "Em Atraso",
      value: 10,
      color: "hsl(351, 83%, 50%)"
    }],
    ti: [{
      name: "Em Andamento",
      value: 55,
      color: "hsl(213, 67%, 35%)"
    }, {
      name: "Planejado",
      value: 20,
      color: "hsl(213, 38%, 91%)"
    }, {
      name: "Concluído",
      value: 20,
      color: "hsl(210, 100%, 18%)"
    }, {
      name: "Em Atraso",
      value: 5,
      color: "hsl(351, 83%, 50%)"
    }],
    marketing: [{
      name: "Em Andamento",
      value: 35,
      color: "hsl(213, 67%, 35%)"
    }, {
      name: "Planejado",
      value: 35,
      color: "hsl(213, 38%, 91%)"
    }, {
      name: "Concluído",
      value: 15,
      color: "hsl(210, 100%, 18%)"
    }, {
      name: "Em Atraso",
      value: 15,
      color: "hsl(351, 83%, 50%)"
    }],
    operacoes: [{
      name: "Em Andamento",
      value: 40,
      color: "hsl(213, 67%, 35%)"
    }, {
      name: "Planejado",
      value: 30,
      color: "hsl(213, 38%, 91%)"
    }, {
      name: "Concluído",
      value: 25,
      color: "hsl(210, 100%, 18%)"
    }, {
      name: "Em Atraso",
      value: 5,
      color: "hsl(351, 83%, 50%)"
    }]
  };

  // Projetos críticos por área
  const projectsByArea = {
    all: [{
      name: "Sistema ERP",
      budget: 450000,
      spent: 520000,
      status: "critical",
      delay: true,
      area: "TI"
    }, {
      name: "App Mobile",
      budget: 180000,
      spent: 195000,
      status: "warning",
      delay: false,
      area: "TI"
    }, {
      name: "Campanha Digital",
      budget: 320000,
      spent: 290000,
      status: "normal",
      delay: false,
      area: "Marketing"
    }, {
      name: "Portal Cliente",
      budget: 280000,
      spent: 295000,
      status: "critical",
      delay: true,
      area: "TI"
    }, {
      name: "Automação Fabril",
      budget: 150000,
      spent: 140000,
      status: "normal",
      delay: false,
      area: "Operações"
    }],
    ti: [{
      name: "Sistema ERP",
      budget: 450000,
      spent: 520000,
      status: "critical",
      delay: true,
      area: "TI"
    }, {
      name: "App Mobile",
      budget: 180000,
      spent: 195000,
      status: "warning",
      delay: false,
      area: "TI"
    }, {
      name: "Portal Cliente",
      budget: 280000,
      spent: 295000,
      status: "critical",
      delay: true,
      area: "TI"
    }, {
      name: "Sistema BI",
      budget: 220000,
      spent: 210000,
      status: "normal",
      delay: false,
      area: "TI"
    }, {
      name: "Infraestrutura Cloud",
      budget: 350000,
      spent: 330000,
      status: "normal",
      delay: false,
      area: "TI"
    }],
    marketing: [{
      name: "Campanha Digital",
      budget: 320000,
      spent: 290000,
      status: "normal",
      delay: false,
      area: "Marketing"
    }, {
      name: "Rebranding",
      budget: 180000,
      spent: 220000,
      status: "critical",
      delay: true,
      area: "Marketing"
    }, {
      name: "E-commerce",
      budget: 150000,
      spent: 165000,
      status: "warning",
      delay: false,
      area: "Marketing"
    }, {
      name: "CRM Marketing",
      budget: 120000,
      spent: 115000,
      status: "normal",
      delay: false,
      area: "Marketing"
    }],
    operacoes: [{
      name: "Automação Fabril",
      budget: 150000,
      spent: 140000,
      status: "normal",
      delay: false,
      area: "Operações"
    }, {
      name: "Logística 4.0",
      budget: 280000,
      spent: 320000,
      status: "critical",
      delay: true,
      area: "Operações"
    }, {
      name: "Qualidade ISO",
      budget: 95000,
      spent: 90000,
      status: "normal",
      delay: false,
      area: "Operações"
    }, {
      name: "Sustentabilidade",
      budget: 200000,
      spent: 185000,
      status: "normal",
      delay: false,
      area: "Operações"
    }]
  };
  return {
    portfolioData,
    chartData,
    projectsByStatus: statusDistribution[area as keyof typeof statusDistribution] || statusDistribution.all,
    criticalProjects: projectsByArea[area as keyof typeof projectsByArea] || projectsByArea.all
  };
};
const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"graphs" | "cards">("cards");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showSelfService, setShowSelfService] = useState(false);
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false);
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSelfService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSelfService]);

  // Dados dinâmicos baseados nos filtros
  const {
    portfolioData,
    chartData,
    projectsByStatus,
    criticalProjects
  } = getFilteredData(selectedArea, selectedYear, selectedStatus);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };
  const getStatusIcon = (value: number, budget: number, type: string) => {
    const percentage = value / budget * 100;
    if (type === "realized" && percentage >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type === "committed" && percentage >= 80) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    if (type === "available" && percentage <= 10) return <AlertTriangle className="h-5 w-5 text-destructive" />;
    return <Info className="h-5 w-5 text-primary" />;
  };
  const handleCardClick = (cardType: string) => {
    // Navegar para lista filtrada
    const filterMapping = {
      budget: {
        status: "all"
      },
      realized: {
        status: "Em Andamento"
      },
      committed: {
        status: "Planejado"
      },
      available: {
        status: "critical"
      }
    };
    const filter = filterMapping[cardType as keyof typeof filterMapping];
    if (filter) {
      const params = new URLSearchParams();
      Object.entries({
        area: selectedArea,
        year: selectedYear,
        ...filter
      }).forEach(([key, value]) => {
        if (value !== "all") params.set(key, value);
      });
      window.location.href = `/projetos?${params.toString()}`;
    }
  };

  // Gerenciar alertas dinâmicos
  const getPortfolioAlerts = () => {
    const alerts = [];
    if (portfolioData.budgetUtilization >= 90) {
      alerts.push({
        type: "critical",
        message: `⚠️ Portfólio atingiu ${portfolioData.budgetUtilization.toFixed(1)}% do orçamento`,
        action: "Ver detalhes",
        onClick: () => handleCardClick("budget")
      });
    }
    if (portfolioData.available <= portfolioData.budget * 0.1) {
      alerts.push({
        type: "warning",
        message: "💰 Saldo disponível baixo - considere reavaliação de prioridades",
        action: "Analisar",
        onClick: () => handleCardClick("available")
      });
    }
    return alerts;
  };
  const portfolioAlerts = getPortfolioAlerts();
  const getAreaLabel = (area: string) => {
    switch (area) {
      case "all":
        return "Todas";
      case "ti":
        return "TI";
      case "marketing":
        return "Marketing";
      case "operacoes":
        return "Operações";
      default:
        return area;
    }
  };
  return <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Dashboard Portfólio</h1>
            <p className="text-sm text-muted-foreground">Visão geral dos projetos financeiros</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAIInsights(!showAIInsights)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Insights IA
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSelfService(!showSelfService)}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard Personalizado
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/inteligencia/relatorios-dinamicos")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios IA
          </Button>
        </div>
      </header>

      {/* Barra de Filtros Fixa */}
      <div className="sticky top-0 z-10 p-4 bg-card border-b border-border shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Filtro Área */}
              <div className="flex items-center gap-2 min-w-[140px]">
                <label className="text-sm font-medium whitespace-nowrap">Área:</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="ti">TI</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filtro Ano */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <label className="text-sm font-medium whitespace-nowrap">Ano:</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Status */}
              <div className="flex items-center gap-2 min-w-[160px]">
                <label className="text-sm font-medium whitespace-nowrap">Status:</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32 h-9">
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

              {/* Controles de Visualização */}
              <div className="flex items-center gap-2 ml-auto">
                <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")} className="h-9">
                  Cards
                </Button>
                <Button variant={viewMode === "graphs" ? "default" : "outline"} size="sm" onClick={() => setViewMode("graphs")} className="h-9">
                  Gráficos
                </Button>
              </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
            {/* Alertas Dinâmicos */}
            {portfolioAlerts.length > 0 && <div className="space-y-2">
                {portfolioAlerts.map((alert, index) => <div key={index} className={`p-4 rounded-lg border flex items-center justify-between ${alert.type === "critical" ? "bg-destructive/10 border-destructive/20 text-destructive-foreground" : "bg-yellow-50 border-yellow-200 text-yellow-800"}`}>
                    <span className="text-sm font-medium">{alert.message}</span>
                    <Button size="sm" variant="outline" onClick={alert.onClick}>
                      {alert.action}
                    </Button>
                  </div>)}
              </div>}

            {viewMode === "cards" ? <TooltipProvider>
                {/* Cards Principais KPI */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg" onClick={() => handleCardClick("budget")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Orçamento Total
                          </CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Valor total aprovado no orçamento para todos os projetos selecionados.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.budget)}
                        </span>
                        <p className="text-xs text-muted-foreground">Base para todos os cálculos</p>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg" onClick={() => handleCardClick("realized")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Valor Realizado
                          </CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Valor total já investido nos projetos selecionados.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {getStatusIcon(portfolioData.realized, portfolioData.budget, "realized")}
                      </div>
                      <div className="space-y-1">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.realized)}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(portfolioData.realized / portfolioData.budget * 100)}% do orçamento
                        </p>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg" onClick={() => handleCardClick("committed")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Valor Comprometido
                          </CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Valor reservado para contratos assinados e pedidos de compra aprovados.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {getStatusIcon(portfolioData.committed, portfolioData.budget, "committed")}
                      </div>
                      <div className="space-y-1">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.committed)}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(portfolioData.committed / portfolioData.budget * 100)}% do orçamento
                        </p>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg" onClick={() => handleCardClick("available")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Saldo Disponível
                          </CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Valor restante do orçamento disponível para novos investimentos.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {getStatusIcon(portfolioData.available, portfolioData.budget, "available")}
                      </div>
                      <div className="space-y-1">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.available)}
                        </span>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {Math.round(portfolioData.available / portfolioData.budget * 100)}% restante
                          </p>
                          <Badge variant="outline" className="text-xs">
                            BU: {portfolioData.budgetUnit}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* Gráficos Principais */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>Realizado vs Planejado vs Comprometido</CardTitle>
                      <CardDescription>Comparativo mensal completo - valores planejados, realizados e comprometidos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip 
                            formatter={(value, name) => [formatCurrency(Number(value)), name === "planejado" ? "Planejado" : name === "realizado" ? "Realizado" : "Comprometido"]}
                            labelFormatter={(label) => `Mês: ${label}`}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                    <p className="font-semibold text-foreground mb-2">{`Mês: ${label}`}</p>
                                    {payload.map((entry, index) => (
                                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                                        {entry.name === "planejado" ? "Planejado" : entry.name === "realizado" ? "Realizado" : "Comprometido"}: {formatCurrency(Number(entry.value))}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="planejado" fill="hsl(213, 38%, 91%)" name="planejado" />
                          <Bar dataKey="realizado" fill="hsl(210, 100%, 18%)" name="realizado" />
                          <Bar dataKey="comprometido" fill="hsl(25, 95%, 53%)" name="comprometido" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-[hsl(213,38%,91%)] rounded-sm border border-border"></div>
                          <span>Planejado</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-[hsl(210,100%,18%)] rounded-sm"></div>
                          <span>Realizado</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-[hsl(25,95%,53%)] rounded-sm"></div>
                          <span>Comprometido</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>Status dos Projetos</CardTitle>
                      <CardDescription>Distribuição atual do portfólio - destaque para atrasos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie 
                            data={projectsByStatus} 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={100} 
                            dataKey="value"
                            stroke="hsl(var(--background))" 
                            strokeWidth={2}
                          >
                            {projectsByStatus.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                stroke={entry.name === "Em Atraso" ? "hsl(351, 83%, 50%)" : entry.color} 
                                strokeWidth={entry.name === "Em Atraso" ? 3 : 1} 
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                    <p className="font-semibold text-foreground mb-1">{data.name}</p>
                                    <p className="text-sm text-muted-foreground">{data.value}%</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                        {projectsByStatus.map((status, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: status.color }}
                            ></div>
                            <span className={status.name === "Em Atraso" ? "font-semibold text-destructive" : ""}>
                              {status.name}: {status.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Projetos em Destaque */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Projetos em Destaque</CardTitle>
                      <CardDescription>Projetos críticos que requerem atenção imediata</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      {criticalProjects.filter(p => p.status === "critical").length} Críticos
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {criticalProjects.slice(0, showAllProjects ? criticalProjects.length : 5).map((project, index) => <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => console.log(`Navigate to project: ${project.name}`)}>
                          <div className="flex items-center gap-4 flex-1">
                            {/* Nome do Projeto com ícone de delay */}
                            <div className="min-w-[180px]">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-primary">{project.name}</h4>
                                {project.delay && <Clock className="h-4 w-4 text-orange-500" />}
                              </div>
                            </div>
                            
                            {/* Informações Financeiras - Grid com tamanhos fixos */}
                            <div className="flex items-center gap-6 flex-1">
                              <div className="min-w-[120px]">
                                <span className="text-sm text-muted-foreground">Orçado: </span>
                                <span className="text-sm font-medium">{formatCurrency(project.budget)}</span>
                              </div>
                              
                              <div className="min-w-[120px]">
                                <span className="text-sm text-muted-foreground">Gasto: </span>
                                <span className="text-sm font-medium">{formatCurrency(project.spent)}</span>
                              </div>
                              
                              <div className="min-w-[130px]">
                                <span className="text-sm text-muted-foreground">Variação: </span>
                                <span className={`text-sm font-medium ${project.spent > project.budget ? "text-destructive" : "text-green-600"}`}>
                                  {formatCurrency(project.spent - project.budget)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Badges de Status */}
                          <div className="flex items-center gap-2 ml-4">
                            {project.delay && <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                Atrasado
                              </Badge>}
                            <Badge variant={getStatusColor(project.status)} className={project.status === "critical" ? "animate-pulse" : ""}>
                              {project.status === "critical" ? "Crítico" : project.status === "warning" ? "Atenção" : "Normal"}
                            </Badge>
                          </div>
                        </div>)}
                    </div>
                    
                    {criticalProjects.length > 5 && <div className="mt-4 text-center">
                        <Button variant="outline" size="sm" onClick={() => setShowAllProjects(!showAllProjects)} className="h-8">
                          {showAllProjects ? "Ver Menos" : `Ver Mais (${criticalProjects.length - 5} restantes)`}
                        </Button>
                      </div>}
                  </CardContent>
                </Card>
               </TooltipProvider> : <>
                {/* Graphics Mode */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução Financeira</CardTitle>
                      <CardDescription>Tendência de gastos vs orçamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip formatter={value => formatCurrency(Number(value))} />
                          <Line type="monotone" dataKey="planejado" stroke="hsl(213, 38%, 91%)" strokeWidth={3} />
                          <Line type="monotone" dataKey="realizado" stroke="hsl(210, 100%, 18%)" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Unit (%)</CardTitle>
                      <CardDescription>Utilização do BU por mês</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip formatter={value => `${value}%`} />
                          <Bar dataKey="bu" fill="hsl(213, 67%, 35%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary Cards for Graphics Mode */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <TooltipProvider>
                    <Card className="text-center p-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-4xl font-bold text-primary">{formatCurrency(portfolioData.budget)}</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Valor total aprovado no orçamento para todos os projetos selecionados.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-muted-foreground">Orçamento Total</p>
                    </Card>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Card className="text-center p-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-4xl font-bold text-green-600">{formatCurrency(portfolioData.realized)}</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Valor total já investido nos projetos selecionados.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-muted-foreground">Valor Realizado</p>
                    </Card>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Card className="text-center p-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-4xl font-bold text-yellow-600">{formatCurrency(portfolioData.committed)}</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Valor reservado para contratos assinados e pedidos de compra aprovados.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-muted-foreground">Valor Comprometido</p>
                    </Card>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Card className="text-center p-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-4xl font-bold text-destructive">{formatCurrency(portfolioData.available)}</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Valor restante do orçamento disponível para novos investimentos.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-muted-foreground">Saldo Disponível</p>
                    </Card>
                  </TooltipProvider>
                 </div>
               </>}
          </main>
          
          {/* AI Insights Panel */}
          {showAIInsights && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Insights de IA</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowAIInsights(false)}>
                      ×
                    </Button>
                  </div>
                  <AIInsightsPanel 
                    projectId="dashboard-portfolio" 
                    dashboardData={portfolioData}
                    onInsightAction={(action) => console.log(action)}
                  />
                </div>
              </div>
            </div>
          )}
          
      {/* Self-Service Dashboard - Portal */}
      {showSelfService && (
        <Portal>
          <div 
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-auto"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
            onClick={() => setShowSelfService(false)}
          >
            <div className="bg-card rounded-lg border border-border w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col mx-auto my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b bg-card sticky top-0 z-10">
                <h2 className="text-xl font-semibold">Dashboard Personalizado</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSelfService(false)} className="h-8 w-8 p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <SelfServiceDashboard 
                  onViewChange={(view) => console.log(view)}
                />
              </div>
            </div>
          </div>
        </Portal>
      )}
          
          {/* Approval Workflow */}
          {showApprovalWorkflow && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Fluxo de Aprovações</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowApprovalWorkflow(false)}>
                      ×
                    </Button>
                  </div>
                  <ApprovalWorkflow 
                    projectId="dashboard-portfolio" 
                    onApprovalChange={(approval) => console.log(approval)}
                  />
                </div>
              </div>
            </div>
          )}
      </div>;
};
export default Dashboard;