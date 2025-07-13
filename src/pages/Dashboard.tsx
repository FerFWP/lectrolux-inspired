import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  FileText,
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Calendar,
  Settings,
  Download,
  Filter,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Clock
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Função para gerar dados dinâmicos baseados nos filtros
const getFilteredData = (area: string, year: string, status: string) => {
  // Dados base diferenciados por área
  const areaMultipliers = {
    all: { budget: 1, realized: 0.74, committed: 0.16 },
    ti: { budget: 0.6, realized: 0.85, committed: 0.12 },
    marketing: { budget: 0.4, realized: 0.65, committed: 0.25 },
    operacoes: { budget: 0.8, realized: 0.78, committed: 0.18 }
  };

  // Ajustes por ano
  const yearMultipliers = {
    "2024": { budget: 0.9, realized: 0.95, committed: 0.8 },
    "2025": { budget: 1.0, realized: 0.74, committed: 1.0 },
    "2026": { budget: 1.2, realized: 0.45, committed: 0.6 }
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
    budgetUnit: Math.round(85 * areaData.realized * yearData.realized)
  };

  // Dados do gráfico (últimos 6 meses)
  const chartData = [
    { 
      month: "Jan", 
      planejado: Math.round(180000 * areaData.budget * yearData.budget), 
      realizado: Math.round(165000 * areaData.realized * yearData.realized), 
      bu: Math.round(95 * areaData.realized), 
      underPerformed: areaData.realized < 0.8 
    },
    { 
      month: "Fev", 
      planejado: Math.round(220000 * areaData.budget * yearData.budget), 
      realizado: Math.round(198000 * areaData.realized * yearData.realized), 
      bu: Math.round(90 * areaData.realized), 
      underPerformed: areaData.realized < 0.85 
    },
    { 
      month: "Mar", 
      planejado: Math.round(280000 * areaData.budget * yearData.budget), 
      realizado: Math.round(245000 * areaData.realized * yearData.realized), 
      bu: Math.round(87 * areaData.realized), 
      underPerformed: areaData.realized < 0.87 
    },
    { 
      month: "Abr", 
      planejado: Math.round(310000 * areaData.budget * yearData.budget), 
      realizado: Math.round(280000 * areaData.realized * yearData.realized), 
      bu: Math.round(90 * areaData.realized), 
      underPerformed: areaData.realized < 0.9 
    },
    { 
      month: "Mai", 
      planejado: Math.round(350000 * areaData.budget * yearData.budget), 
      realizado: Math.round(320000 * areaData.realized * yearData.realized), 
      bu: Math.round(91 * areaData.realized), 
      underPerformed: areaData.realized < 0.91 
    },
    { 
      month: "Jun", 
      planejado: Math.round(400000 * areaData.budget * yearData.budget), 
      realizado: Math.round(380000 * areaData.realized * yearData.realized), 
      bu: Math.round(95 * areaData.realized), 
      underPerformed: areaData.realized < 0.95 
    }
  ];

  // Distribuição por status (ajustada por filtros)
  const statusDistribution = {
    all: [
      { name: "Em Andamento", value: 45, color: "hsl(213, 67%, 35%)" },
      { name: "Planejado", value: 25, color: "hsl(213, 38%, 91%)" },
      { name: "Concluído", value: 20, color: "hsl(210, 100%, 18%)" },
      { name: "Em Atraso", value: 10, color: "hsl(351, 83%, 50%)" }
    ],
    ti: [
      { name: "Em Andamento", value: 55, color: "hsl(213, 67%, 35%)" },
      { name: "Planejado", value: 20, color: "hsl(213, 38%, 91%)" },
      { name: "Concluído", value: 20, color: "hsl(210, 100%, 18%)" },
      { name: "Em Atraso", value: 5, color: "hsl(351, 83%, 50%)" }
    ],
    marketing: [
      { name: "Em Andamento", value: 35, color: "hsl(213, 67%, 35%)" },
      { name: "Planejado", value: 35, color: "hsl(213, 38%, 91%)" },
      { name: "Concluído", value: 15, color: "hsl(210, 100%, 18%)" },
      { name: "Em Atraso", value: 15, color: "hsl(351, 83%, 50%)" }
    ],
    operacoes: [
      { name: "Em Andamento", value: 40, color: "hsl(213, 67%, 35%)" },
      { name: "Planejado", value: 30, color: "hsl(213, 38%, 91%)" },
      { name: "Concluído", value: 25, color: "hsl(210, 100%, 18%)" },
      { name: "Em Atraso", value: 5, color: "hsl(351, 83%, 50%)" }
    ]
  };

  // Projetos críticos por área
  const projectsByArea = {
    all: [
      { name: "Sistema ERP", budget: 450000, spent: 520000, status: "critical", delay: true, area: "TI" },
      { name: "App Mobile", budget: 180000, spent: 195000, status: "warning", delay: false, area: "TI" },
      { name: "Campanha Digital", budget: 320000, spent: 290000, status: "normal", delay: false, area: "Marketing" },
      { name: "Portal Cliente", budget: 280000, spent: 295000, status: "critical", delay: true, area: "TI" },
      { name: "Automação Fabril", budget: 150000, spent: 140000, status: "normal", delay: false, area: "Operações" }
    ],
    ti: [
      { name: "Sistema ERP", budget: 450000, spent: 520000, status: "critical", delay: true, area: "TI" },
      { name: "App Mobile", budget: 180000, spent: 195000, status: "warning", delay: false, area: "TI" },
      { name: "Portal Cliente", budget: 280000, spent: 295000, status: "critical", delay: true, area: "TI" },
      { name: "Sistema BI", budget: 220000, spent: 210000, status: "normal", delay: false, area: "TI" },
      { name: "Infraestrutura Cloud", budget: 350000, spent: 330000, status: "normal", delay: false, area: "TI" }
    ],
    marketing: [
      { name: "Campanha Digital", budget: 320000, spent: 290000, status: "normal", delay: false, area: "Marketing" },
      { name: "Rebranding", budget: 180000, spent: 220000, status: "critical", delay: true, area: "Marketing" },
      { name: "E-commerce", budget: 150000, spent: 165000, status: "warning", delay: false, area: "Marketing" },
      { name: "CRM Marketing", budget: 120000, spent: 115000, status: "normal", delay: false, area: "Marketing" }
    ],
    operacoes: [
      { name: "Automação Fabril", budget: 150000, spent: 140000, status: "normal", delay: false, area: "Operações" },
      { name: "Logística 4.0", budget: 280000, spent: 320000, status: "critical", delay: true, area: "Operações" },
      { name: "Qualidade ISO", budget: 95000, spent: 90000, status: "normal", delay: false, area: "Operações" },
      { name: "Sustentabilidade", budget: 200000, spent: 185000, status: "normal", delay: false, area: "Operações" }
    ]
  };

  return {
    portfolioData,
    chartData,
    projectsByStatus: statusDistribution[area as keyof typeof statusDistribution] || statusDistribution.all,
    criticalProjects: projectsByArea[area as keyof typeof projectsByArea] || projectsByArea.all
  };
};

const sidebarItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Projetos", icon: FolderOpen, href: "/projetos" },
  { title: "Relatórios", icon: BarChart3, href: "/reports" },
  { title: "Relatórios Dinâmicos", icon: FileText, href: "/relatorios-dinamicos" },
  { title: "Planejamento", icon: Calendar, href: "/planning" },
  { title: "Administração", icon: Settings, href: "/admin" },
  { title: "Exportações", icon: Download, href: "/exports" }
];

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"graphs" | "cards">("cards");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAllProjects, setShowAllProjects] = useState(false);

  // Dados dinâmicos baseados nos filtros
  const { portfolioData, chartData, projectsByStatus, criticalProjects } = getFilteredData(
    selectedArea, 
    selectedYear, 
    selectedStatus
  );

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
      case "critical": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (value: number, budget: number, type: string) => {
    const percentage = (value / budget) * 100;
    if (type === "realized" && percentage >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type === "committed" && percentage >= 80) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    if (type === "available" && percentage <= 10) return <AlertTriangle className="h-5 w-5 text-destructive" />;
    return <Info className="h-5 w-5 text-primary" />;
  };

  const handleCardClick = (cardType: string) => {
    console.log(`Navigating to ${cardType} details`);
    // Aqui seria implementada a navegação para drill-down
  };

  const getAreaLabel = (area: string) => {
    switch (area) {
      case "all": return "Todas";
      case "ti": return "TI";
      case "marketing": return "Marketing";
      case "operacoes": return "Operações";
      default: return area;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarContent>
            <div className="p-6 border-b border-sidebar-border">
              <h2 className="text-lg font-bold text-sidebar-foreground">Electrolux</h2>
              <p className="text-sm text-sidebar-foreground/80">Gestão Financeira</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-primary">Dashboard Portfólio</h1>
                <p className="text-sm text-muted-foreground">Visão geral dos projetos financeiros</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Relatório
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
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
                <Button 
                  variant={viewMode === "cards" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-9"
                >
                  Cards
                </Button>
                <Button 
                  variant={viewMode === "graphs" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("graphs")}
                  className="h-9"
                >
                  Gráficos
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 p-6 space-y-6">
            {viewMode === "cards" ? (
              <TooltipProvider>
                {/* Cards Principais KPI */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card 
                    className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg"
                    onClick={() => handleCardClick("budget")}
                  >
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

                  <Card 
                    className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg"
                    onClick={() => handleCardClick("realized")}
                  >
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
                          {Math.round((portfolioData.realized / portfolioData.budget) * 100)}% do orçamento
                        </p>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card 
                    className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg"
                    onClick={() => handleCardClick("committed")}
                  >
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
                          {Math.round((portfolioData.committed / portfolioData.budget) * 100)}% do orçamento
                        </p>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card 
                    className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg"
                    onClick={() => handleCardClick("available")}
                  >
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
                            {Math.round((portfolioData.available / portfolioData.budget) * 100)}% restante
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
                      <CardTitle>Realizado vs Planejado</CardTitle>
                      <CardDescription>Comparativo mensal - destaque para meses com underperformance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip 
                            formatter={(value, name) => [
                              formatCurrency(Number(value)), 
                              name === "planejado" ? "Planejado" : "Realizado"
                            ]} 
                          />
                          <Bar dataKey="planejado" fill="hsl(213, 38%, 91%)" name="Planejado" />
                          <Bar dataKey="realizado" name="Realizado">
                            {chartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.underPerformed ? "hsl(351, 83%, 50%)" : "hsl(210, 100%, 18%)"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-[hsl(210,100%,18%)] rounded-sm"></div>
                          <span>Performance Normal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-[hsl(351,83%,50%)] rounded-sm"></div>
                          <span>Abaixo do Planejado</span>
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
                            label={({ name, value }) => `${name}: ${value}%`}
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
                          <RechartsTooltip />
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
                      {criticalProjects
                        .slice(0, showAllProjects ? criticalProjects.length : 5)
                        .map((project, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => console.log(`Navigate to project: ${project.name}`)}
                        >
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
                                <span className={`text-sm font-medium ${
                                  project.spent > project.budget ? "text-destructive" : "text-green-600"
                                }`}>
                                  {formatCurrency(project.spent - project.budget)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Badges de Status */}
                          <div className="flex items-center gap-2 ml-4">
                            {project.delay && (
                              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                Atrasado
                              </Badge>
                            )}
                            <Badge 
                              variant={getStatusColor(project.status)}
                              className={project.status === "critical" ? "animate-pulse" : ""}
                            >
                              {project.status === "critical" ? "Crítico" : 
                               project.status === "warning" ? "Atenção" : "Normal"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {criticalProjects.length > 5 && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAllProjects(!showAllProjects)}
                          className="h-8"
                        >
                          {showAllProjects ? "Ver Menos" : `Ver Mais (${criticalProjects.length - 5} restantes)`}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
               </TooltipProvider>
             ) : (
              <>
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
                          <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
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
                          <RechartsTooltip formatter={(value) => `${value}%`} />
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
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;