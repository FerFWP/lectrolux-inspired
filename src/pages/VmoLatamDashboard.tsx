import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Eye, AlertTriangle, TrendingUp, DollarSign, Target } from "lucide-react";
import { ContextualNotifications } from "@/components/contextual-notifications";

// Mock data
const mockData = {
  metrics: {
    totalBudget: 45800000,
    totalRealized: 38950000,
    averageROI: 18.5,
    budgetDeviation: -12.3,
    latamBalance: 6850000
  },
  barChartData: [
    { unit: "Curitiba PR 1", budgeted: 8500000, realized: 7200000 },
    { unit: "Curitiba PR 2", budgeted: 6800000, realized: 6100000 },
    { unit: "São Carlos SP", budgeted: 9200000, realized: 8500000 },
    { unit: "Manaus AM", budgeted: 7500000, realized: 6800000 },
    { unit: "Rosário AR", budgeted: 8200000, realized: 7100000 },
    { unit: "Santiago CL", budgeted: 5600000, realized: 5250000 }
  ],
  heatmapData: [
    { country: "Brasil", unit: "Curitiba PR 1", status: "attention", projects: 3 },
    { country: "Brasil", unit: "Curitiba PR 2", status: "ok", projects: 2 },
    { country: "Brasil", unit: "São Carlos SP", status: "ok", projects: 2 },
    { country: "Brasil", unit: "Manaus AM", status: "critical", projects: 2 },
    { country: "Argentina", unit: "Rosário AR", status: "attention", projects: 2 },
    { country: "Chile", unit: "Santiago CL", status: "critical", projects: 1 }
  ],
  criticalProjects: [
    { id: "P001", name: "Modernização Linha A", unit: "Manaus AM", budget: 2500000, deviation: -25.8, status: "critical" },
    { id: "P002", name: "Eficiência Energética", unit: "Santiago CL", budget: 1800000, deviation: -18.2, status: "critical" },
    { id: "P003", name: "Automação Industrial", unit: "Curitiba PR 1", budget: 3200000, deviation: -15.5, status: "attention" },
    { id: "P004", name: "Sistema Qualidade", unit: "Rosário AR", budget: 2100000, deviation: -12.3, status: "attention" }
  ]
};

const formatCurrency = (value: number, currency = "BRL") => {
  const symbols = { BRL: "R$", USD: "$", ARS: "$", CLP: "$" };
  return `${symbols[currency as keyof typeof symbols] || "R$"} ${(value / 1000000).toFixed(1)}M`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ok": return "bg-green-500";
    case "attention": return "bg-yellow-500";
    case "critical": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "ok": return "default";
    case "attention": return "secondary";
    case "critical": return "destructive";
    default: return "outline";
  }
};

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
        <p className="font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="font-medium text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function VmoLatamDashboard() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedBU, setSelectedBU] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedCurrency, setSelectedCurrency] = useState("BRL");

  const exportData = () => {
    // Simulate data export
    console.log("Exporting dashboard data...");
  };

  const handleUnitClick = (unit: string, status: string) => {
    // Navegar para a lista de projetos com filtros aplicados
    const statusFilter = status === "ok" ? "Em andamento" : status === "attention" ? "Atenção" : "Crítico";
    const unitFilter = unit.toLowerCase().replace(/ /g, "-");
    
    navigate(`/projetos?unit=${unitFilter}&status=${statusFilter}`);
  };

  const handleProjectDetailClick = (projectId: string) => {
    // Navegar para o detalhe do projeto
    navigate(`/projetos/${projectId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notificações Contextuais */}
      <ContextualNotifications position="inline" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Consolidado VMO LATAM</h1>
          <p className="text-muted-foreground">Visão regional dos KPIs financeiros e status dos projetos</p>
        </div>
        <Button onClick={exportData} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">País</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Países</SelectItem>
                  <SelectItem value="brazil">Brasil</SelectItem>
                  <SelectItem value="argentina">Argentina</SelectItem>
                  <SelectItem value="chile">Chile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Unidade Fabril</label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Unidades</SelectItem>
                  <SelectItem value="curitiba-pr-1">Curitiba PR 1</SelectItem>
                  <SelectItem value="curitiba-pr-2">Curitiba PR 2</SelectItem>
                  <SelectItem value="sao-carlos-sp">São Carlos SP</SelectItem>
                  <SelectItem value="manaus-am">Manaus AM</SelectItem>
                  <SelectItem value="rosario-ar">Rosário AR</SelectItem>
                  <SelectItem value="santiago-cl">Santiago CL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">BU</label>
              <Select value={selectedBU} onValueChange={setSelectedBU}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os BUs</SelectItem>
                  <SelectItem value="operations">Operações</SelectItem>
                  <SelectItem value="innovation">Inovação</SelectItem>
                  <SelectItem value="sustainability">Sustentabilidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Moeda</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL - Real</SelectItem>
                  <SelectItem value="USD">USD - Dólar</SelectItem>
                  <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                  <SelectItem value="CLP">CLP - Peso Chileno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.metrics.totalBudget, selectedCurrency)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizado Consolidado</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.metrics.totalRealized, selectedCurrency)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.metrics.averageROI}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Desvio Orçamentário</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${mockData.metrics.budgetDeviation < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {mockData.metrics.budgetDeviation}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo LATAM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.metrics.latamBalance, selectedCurrency)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle>Orçado vs Realizado por Unidade Fabril</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={mockData.barChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="unit" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                interval={0}
                fontSize={12}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, selectedCurrency)}
                width={80}
                fontSize={12}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value) => formatCurrency(value as number, selectedCurrency)}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="rect"
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              <Bar 
                dataKey="budgeted" 
                fill="hsl(var(--primary-medium))" 
                name="Orçado"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="realized" 
                fill="hsl(var(--primary))" 
                name="Realizado"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Projetos por Unidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.heatmapData.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleUnitClick(item.unit, item.status)}
                >
                  <div>
                    <div className="font-medium">{item.unit}</div>
                    <div className="text-sm text-muted-foreground">{item.country}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.projects} projetos</span>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>OK</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Atenção</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Crítico</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projetos Críticos */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos Críticos na Região</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.criticalProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.unit}</div>
                    <div className="text-sm">
                      {formatCurrency(project.budget, selectedCurrency)} 
                      <span className={`ml-2 ${project.deviation < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ({project.deviation}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status === "critical" ? "Crítico" : "Atenção"}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleProjectDetailClick(project.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}