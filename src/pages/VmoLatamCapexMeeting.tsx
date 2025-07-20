import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Line, LineChart, ComposedChart } from 'recharts';
import { Download, TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Info, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { getMockData } from "@/lib/mock-data";

// Mock data específico para BU Analysis
const mockBUData = {
  kpis: {
    ytdPlan: 28500000,
    ytdRealized: 24200000,
    deviation: -15.1,
    deviationAbs: 4300000,
    buValue: 31200000,
    availableBalance: 7000000,
    target: 30000000
  },
  exchangeRate: {
    rate: 5.42,
    currency: "USD/BRL",
    lastUpdated: "2024-01-15 14:30:15"
  },
  highlights: [
    {
      id: 1,
      type: "delay",
      title: "Maior Atraso",
      project: "Modernização Linha C",
      value: "-8.5 meses",
      status: "critical"
    },
    {
      id: 2,
      type: "saving",
      title: "Maior Saving",
      project: "Eficiência Energética Plus",
      value: "R$ 2.1M",
      status: "success"
    },
    {
      id: 3,
      type: "deviation",
      title: "Maior Desvio",
      project: "Automação Avançada",
      value: "-22.3%",
      status: "critical"
    }
  ],
  projects: [
    {
      id: "P001",
      name: "Modernização Linha A",
      area: "Operações",
      ytdPlan: 3200000,
      ytdAC: 2850000,
      deltaYTD: -350000,
      bu: 3500000,
      sop: 3800000,
      fy: 4200000,
      fyBU: 4000000,
      status: "attention",
      expandable: true,
      subProjects: [
        { name: "Fase 1 - Preparação", ytdPlan: 1200000, ytdAC: 1100000, deltaYTD: -100000, status: "ok" },
        { name: "Fase 2 - Implementação", ytdPlan: 2000000, ytdAC: 1750000, deltaYTD: -250000, status: "attention" }
      ]
    },
    {
      id: "P002",
      name: "Sistema Qualidade",
      area: "Qualidade",
      ytdPlan: 1800000,
      ytdAC: 1650000,
      deltaYTD: -150000,
      bu: 2100000,
      sop: 2200000,
      fy: 2400000,
      fyBU: 2300000,
      status: "ok",
      expandable: false
    },
    {
      id: "P003",
      name: "Eficiência Energética",
      area: "Sustentabilidade",
      ytdPlan: 2500000,
      ytdAC: 1900000,
      deltaYTD: -600000,
      bu: 2800000,
      sop: 3000000,
      fy: 3200000,
      fyBU: 3100000,
      status: "critical",
      expandable: true,
      subProjects: [
        { name: "Solar Panels", ytdPlan: 1500000, ytdAC: 1200000, deltaYTD: -300000, status: "attention" },
        { name: "LED Conversion", ytdPlan: 1000000, ytdAC: 700000, deltaYTD: -300000, status: "critical" }
      ]
    }
  ],
  monthlyData: [
    { month: "Jan", planned: 2800000, realized: 2650000, bu: 3100000 },
    { month: "Fev", planned: 2900000, realized: 2750000, bu: 3200000 },
    { month: "Mar", planned: 3100000, realized: 2850000, bu: 3400000 },
    { month: "Abr", planned: 3200000, realized: 2900000, bu: 3500000 },
    { month: "Mai", planned: 3300000, realized: 3100000, bu: 3600000 },
    { month: "Jun", planned: 3400000, realized: 3200000, bu: 3700000 },
    { month: "Jul", planned: 3500000, realized: 3300000, bu: 3800000 },
    { month: "Ago", planned: 3600000, realized: 3400000, bu: 3900000 },
    { month: "Set", planned: 3700000, realized: 3500000, bu: 4000000 },
    { month: "Out", planned: 3800000, realized: 3600000, bu: 4100000 },
    { month: "Nov", planned: 3900000, realized: 3700000, bu: 4200000 },
    { month: "Dez", planned: 4000000, realized: 3800000, bu: 4300000 }
  ]
};

const formatCurrency = (value: number, currency = "BRL") => {
  if (value === null || value === undefined) return "—";
  const symbols = { BRL: "R$", USD: "$", SEK: "SEK", "SEK BU": "SEK", "SEK AVG": "SEK" };
  return `${symbols[currency as keyof typeof symbols] || "R$"} ${(value / 1000000).toFixed(1)}M`;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ok": return <div className="w-3 h-3 rounded-full bg-green-500" />;
    case "attention": return <div className="w-3 h-3 rounded-full bg-yellow-500" />;
    case "critical": return <div className="w-3 h-3 rounded-full bg-red-500" />;
    default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
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

const getHighlightIcon = (type: string) => {
  switch (type) {
    case "delay": return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "saving": return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "deviation": return <TrendingDown className="h-4 w-4 text-red-500" />;
    default: return <Info className="h-4 w-4 text-blue-500" />;
  }
};

// Custom tooltip component
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
              <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function VmoLatamCapexMeeting() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("BRL");
  const [selectedFinancialStatus, setSelectedFinancialStatus] = useState("all");
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [showMoreHighlights, setShowMoreHighlights] = useState(false);

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const exportReport = () => {
    console.log("Exportando relatório BU Analysis...");
  };

  const calculateTotal = (field: string) => {
    return mockBUData.projects.reduce((sum, project) => {
      const value = project[field as keyof typeof project];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">BU Analysis / Capex Monthly Meeting</h1>
            <p className="text-muted-foreground">Análise detalhada do CAPEX e performance mensal por BU</p>
          </div>
          <Button onClick={exportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
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
                <label className="text-sm font-medium mb-2 block">Área</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Áreas</SelectItem>
                    <SelectItem value="operations">Operações</SelectItem>
                    <SelectItem value="quality">Qualidade</SelectItem>
                    <SelectItem value="sustainability">Sustentabilidade</SelectItem>
                    <SelectItem value="it">Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="capex">CAPEX</SelectItem>
                    <SelectItem value="opex">OPEX</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
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
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="SEK">SEK</SelectItem>
                    <SelectItem value="SEK BU">SEK BU</SelectItem>
                    <SelectItem value="SEK AVG">SEK AVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status Financeiro</label>
                <Select value={selectedFinancialStatus} onValueChange={setSelectedFinancialStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ok">Dentro do Orçamento</SelectItem>
                    <SelectItem value="attention">Atenção</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    YTD Plan <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Year-to-Date Planejado (acumulado)</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockBUData.kpis.ytdPlan, selectedCurrency)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    YTD Realizado <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Year-to-Date Realizado (AC)</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockBUData.kpis.ytdRealized, selectedCurrency)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    Desvio <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Desvio percentual e absoluto</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockBUData.kpis.deviation < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {mockBUData.kpis.deviation}%
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(mockBUData.kpis.deviationAbs, selectedCurrency)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor BU</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockBUData.kpis.buValue, selectedCurrency)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockBUData.kpis.availableBalance, selectedCurrency)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target/Meta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockBUData.kpis.target, selectedCurrency)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Taxa de Câmbio */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Taxa de Câmbio Aplicada:</span>
                <span className="text-sm">{mockBUData.exchangeRate.rate} {mockBUData.exchangeRate.currency}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Última atualização: {mockBUData.exchangeRate.lastUpdated}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Destaques */}
          <Card>
            <CardHeader>
              <CardTitle>Destaques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBUData.highlights.slice(0, showMoreHighlights ? mockBUData.highlights.length : 3).map((highlight) => (
                  <div key={highlight.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getHighlightIcon(highlight.type)}
                      <div>
                        <div className="font-medium text-sm">{highlight.title}</div>
                        <div className="text-sm text-muted-foreground">{highlight.project}</div>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${
                      highlight.status === 'critical' ? 'text-red-600' : 
                      highlight.status === 'success' ? 'text-green-600' : 'text-foreground'
                    }`}>
                      {highlight.value}
                    </div>
                  </div>
                ))}
                {mockBUData.highlights.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowMoreHighlights(!showMoreHighlights)}
                    className="w-full"
                  >
                    {showMoreHighlights ? "Ver menos" : "Ver mais"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico Mensal */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={mockBUData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value, selectedCurrency)}
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="planned" 
                    fill="hsl(var(--primary-medium))" 
                    name="Planejado"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="realized" 
                    fill="hsl(var(--primary))" 
                    name="Realizado"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bu" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    name="BU"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Central (Drill-down) */}
        <Card>
          <CardHeader>
            <CardTitle>Drill-down por Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto/Área</TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger>YTD Plan</TooltipTrigger>
                      <TooltipContent>
                        <p>Year-to-Date Planejado</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger>YTD AC</TooltipTrigger>
                      <TooltipContent>
                        <p>Year-to-Date Actual</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger>ΔYTD</TooltipTrigger>
                      <TooltipContent>
                        <p>Delta Year-to-Date</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">BU</TableHead>
                  <TableHead className="text-right">SOP</TableHead>
                  <TableHead className="text-right">FY</TableHead>
                  <TableHead className="text-right">FY-BU</TableHead>
                  <TableHead className="text-center">
                    <Tooltip>
                      <TooltipTrigger>Status</TooltipTrigger>
                      <TooltipContent>
                        <p>Status do projeto: Verde (OK), Amarelo (Atenção), Vermelho (Crítico)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBUData.projects.map((project) => (
                  <>
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {project.expandable && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleProjectExpansion(project.id)}
                              className="h-6 w-6 p-0"
                            >
                              {expandedProjects.includes(project.id) ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </Button>
                          )}
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.area}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(project.ytdPlan, selectedCurrency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.ytdAC, selectedCurrency)}</TableCell>
                      <TableCell className={`text-right ${project.deltaYTD < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(project.deltaYTD, selectedCurrency)}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(project.bu, selectedCurrency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.sop, selectedCurrency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.fy, selectedCurrency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.fyBU, selectedCurrency)}</TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger>
                            {getStatusIcon(project.status)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{project.status === "ok" ? "OK" : project.status === "attention" ? "Atenção" : "Crítico"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Sub-projetos expandíveis */}
                    {project.expandable && expandedProjects.includes(project.id) && project.subProjects?.map((subProject, index) => (
                      <TableRow key={`${project.id}-sub-${index}`} className="bg-muted/20">
                        <TableCell className="pl-12">
                          <div className="text-sm">{subProject.name}</div>
                        </TableCell>
                        <TableCell className="text-right text-sm">{formatCurrency(subProject.ytdPlan, selectedCurrency)}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrency(subProject.ytdAC, selectedCurrency)}</TableCell>
                        <TableCell className={`text-right text-sm ${subProject.deltaYTD < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(subProject.deltaYTD, selectedCurrency)}
                        </TableCell>
                        <TableCell className="text-right text-sm">—</TableCell>
                        <TableCell className="text-right text-sm">—</TableCell>
                        <TableCell className="text-right text-sm">—</TableCell>
                        <TableCell className="text-right text-sm">—</TableCell>
                        <TableCell className="text-center">
                          {getStatusIcon(subProject.status)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
                
                {/* Linha de Total */}
                <TableRow className="border-t-2 font-bold bg-muted/30">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal('ytdPlan'), selectedCurrency)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal('ytdAC'), selectedCurrency)}</TableCell>
                  <TableCell className={`text-right ${calculateTotal('deltaYTD') < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(calculateTotal('deltaYTD'), selectedCurrency)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal('bu'), selectedCurrency)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal('sop'), selectedCurrency)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal('fy'), selectedCurrency)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal('fyBU'), selectedCurrency)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Legenda dos Status */}
        <Card>
          <CardHeader>
            <CardTitle>Legenda dos Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>OK - Projeto dentro do orçamento e cronograma</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Atenção - Desvios menores, monitoramento necessário</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Crítico - Desvios significativos, ação imediata necessária</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}