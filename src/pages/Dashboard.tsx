import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
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
  Filter
} from "lucide-react";

// Dados de exemplo para demonstração
const portfolioData = {
  budget: 2500000,
  realized: 1850000,
  committed: 400000,
  available: 250000,
  budgetUnit: 85
};

const chartData = [
  { month: "Jan", planejado: 180000, realizado: 165000, bu: 95 },
  { month: "Fev", planejado: 220000, realizado: 198000, bu: 90 },
  { month: "Mar", planejado: 280000, realizado: 245000, bu: 87 },
  { month: "Abr", planejado: 310000, realizado: 280000, bu: 90 },
  { month: "Mai", planejado: 350000, realizado: 320000, bu: 91 },
  { month: "Jun", planejado: 400000, realizado: 380000, bu: 95 }
];

const projectsByStatus = [
  { name: "Em Andamento", value: 45, color: "hsl(213, 67%, 35%)" },
  { name: "Planejado", value: 25, color: "hsl(213, 38%, 91%)" },
  { name: "Concluído", value: 20, color: "hsl(210, 100%, 18%)" },
  { name: "Em Atraso", value: 10, color: "hsl(351, 83%, 50%)" }
];

const criticalProjects = [
  { name: "Sistema ERP", budget: 450000, spent: 520000, status: "critical" },
  { name: "App Mobile", budget: 180000, spent: 195000, status: "warning" },
  { name: "Infraestrutura TI", budget: 320000, spent: 290000, status: "normal" }
];

const sidebarItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Projetos", icon: FolderOpen, href: "/projects" },
  { title: "Relatórios", icon: BarChart3, href: "/reports" },
  { title: "Planejamento", icon: Calendar, href: "/planning" },
  { title: "Administração", icon: Settings, href: "/admin" },
  { title: "Exportações", icon: Download, href: "/exports" }
];

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"graphs" | "cards">("cards");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2025");

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

          {/* Filters */}
          <div className="p-4 bg-card border-b border-border">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Área:</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="ti">Tecnologia</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Ano:</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button 
                  variant={viewMode === "cards" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  Cards
                </Button>
                <Button 
                  variant={viewMode === "graphs" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("graphs")}
                >
                  Gráficos
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 p-6 space-y-6">
            {viewMode === "cards" ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover-scale">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Orçado Total
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.budget)}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="hover-scale">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Realizado
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.realized)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        74% do orçamento
                      </p>
                    </CardHeader>
                  </Card>

                  <Card className="hover-scale">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Comprometido
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.committed)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        16% do orçamento
                      </p>
                    </CardHeader>
                  </Card>

                  <Card className="hover-scale">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Saldo Disponível
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-destructive" />
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(portfolioData.available)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">BU: {portfolioData.budgetUnit}%</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Realizado vs Planejado</CardTitle>
                      <CardDescription>Comparativo mensal dos últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="planejado" fill="hsl(213, 38%, 91%)" name="Planejado" />
                          <Bar dataKey="realizado" fill="hsl(210, 100%, 18%)" name="Realizado" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Status dos Projetos</CardTitle>
                      <CardDescription>Distribuição atual do portfólio</CardDescription>
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
                          >
                            {projectsByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Critical Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle>Projetos em Destaque</CardTitle>
                    <CardDescription>Projetos que requerem atenção</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {criticalProjects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-semibold text-primary">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Orçado: {formatCurrency(project.budget)} | Gasto: {formatCurrency(project.spent)}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(project.status)}>
                            {project.status === "critical" ? "Crítico" : 
                             project.status === "warning" ? "Atenção" : "Normal"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
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
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Bar dataKey="bu" fill="hsl(213, 67%, 35%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary Cards for Graphics Mode */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="text-center p-6">
                    <h3 className="text-4xl font-bold text-primary">{formatCurrency(portfolioData.budget)}</h3>
                    <p className="text-muted-foreground">Orçamento Total</p>
                  </Card>
                  <Card className="text-center p-6">
                    <h3 className="text-4xl font-bold text-green-600">{formatCurrency(portfolioData.realized)}</h3>
                    <p className="text-muted-foreground">Realizado</p>
                  </Card>
                  <Card className="text-center p-6">
                    <h3 className="text-4xl font-bold text-yellow-600">{formatCurrency(portfolioData.committed)}</h3>
                    <p className="text-muted-foreground">Comprometido</p>
                  </Card>
                  <Card className="text-center p-6">
                    <h3 className="text-4xl font-bold text-destructive">{formatCurrency(portfolioData.available)}</h3>
                    <p className="text-muted-foreground">Disponível</p>
                  </Card>
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