import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Line, LineChart, ComposedChart, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, AlertTriangle, Calendar, Target, Info, ArrowLeft, Trophy, Activity, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Mock data para Assertividade SOP
const mockSopData = {
  kpis: {
    portfolioAccuracy: 87.3,
    totalPlanned: 45200000,
    totalRealized: 39450000,
    biggestDeviation: -5750000,
    biggestDeviationMonth: "Março",
    mostAccurateMonth: "Janeiro",
    mostAccurateAccuracy: 95.2
  },
  lastUpdated: "2024-01-15 16:45:23",
  projectRanking: [
    { name: "Modernização Linha A", accuracy: 94.5, status: "excellent" },
    { name: "Sistema Qualidade", accuracy: 88.7, status: "good" },
    { name: "Eficiência Energética", accuracy: 72.1, status: "attention" },
    { name: "Automação Fábrica", accuracy: 65.8, status: "critical" },
    { name: "Upgrade TI", accuracy: 91.3, status: "excellent" }
  ],
  monthlyData: [
    {
      month: "Jan",
      planned: 3800000,
      realized: 3615000,
      deviation: -185000,
      accuracy: 95.1,
      isHighlight: false
    },
    {
      month: "Fev",
      planned: 4200000,
      realized: 3890000,
      deviation: -310000,
      accuracy: 92.6,
      isHighlight: false
    },
    {
      month: "Mar",
      planned: 4500000,
      realized: 3750000,
      deviation: -750000,
      accuracy: 83.3,
      isHighlight: true // Maior desvio
    },
    {
      month: "Abr",
      planned: 3900000,
      realized: 3480000,
      deviation: -420000,
      accuracy: 89.2,
      isHighlight: false
    },
    {
      month: "Mai",
      planned: 4100000,
      realized: 3690000,
      deviation: -410000,
      accuracy: 90.0,
      isHighlight: false
    },
    {
      month: "Jun",
      planned: 3700000,
      realized: 3330000,
      deviation: -370000,
      accuracy: 90.0,
      isHighlight: false
    }
  ],
  projectsData: [
    {
      id: "P001",
      name: "Modernização Linha A",
      area: "Operações",
      category: "Infraestrutura",
      currency: "BRL",
      status: "Em Andamento",
      monthlyDetails: {
        Jan: { planned: 800000, realized: 760000, accuracy: 95.0 },
        Fev: { planned: 900000, realized: 855000, accuracy: 95.0 },
        Mar: { planned: 950000, realized: 890000, accuracy: 93.7 },
        Abr: { planned: 800000, realized: 740000, accuracy: 92.5 },
        Mai: { planned: 850000, realized: 780000, accuracy: 91.8 },
        Jun: { planned: 750000, realized: 695000, accuracy: 92.7 }
      }
    },
    {
      id: "P002",
      name: "Sistema Qualidade",
      area: "Qualidade",
      category: "Software",
      currency: "USD",
      status: "Em Andamento",
      monthlyDetails: {
        Jan: { planned: 600000, realized: 540000, accuracy: 90.0 },
        Fev: { planned: 700000, realized: 630000, accuracy: 90.0 },
        Mar: { planned: 750000, realized: 600000, accuracy: 80.0 },
        Abr: { planned: 650000, realized: 580000, accuracy: 89.2 },
        Mai: { planned: 680000, realized: 610000, accuracy: 89.7 },
        Jun: { planned: 620000, realized: 560000, accuracy: 90.3 }
      }
    },
    {
      id: "P003",
      name: "Eficiência Energética",
      area: "Sustentabilidade",
      category: "Infraestrutura",
      currency: "EUR",
      status: "Atrasado",
      monthlyDetails: {
        Jan: { planned: 900000, realized: 720000, accuracy: 80.0 },
        Fev: { planned: 1000000, realized: 750000, accuracy: 75.0 },
        Mar: { planned: 1100000, realized: 770000, accuracy: 70.0 },
        Abr: { planned: 950000, realized: 665000, accuracy: 70.0 },
        Mai: { planned: 1020000, realized: 714000, accuracy: 70.0 },
        Jun: { planned: 880000, realized: 616000, accuracy: 70.0 }
      }
    }
  ]
};

const formatCurrency = (amount: number) => {
  const exchangeRates = { BRL: 1.85, USD: 10.50, EUR: 11.20, SEK: 1.00 };
  const convertedAmount = amount * 1.85; // Assumindo origem em BRL para simplificar
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedAmount);
};

const getAccuracyStatus = (accuracy: number) => {
  if (accuracy >= 90) return { color: 'text-green-600', icon: CheckCircle, label: 'Excelente' };
  if (accuracy >= 80) return { color: 'text-blue-600', icon: Activity, label: 'Bom' };
  if (accuracy >= 70) return { color: 'text-yellow-600', icon: AlertTriangle, label: 'Atenção' };
  return { color: 'text-red-600', icon: XCircle, label: 'Crítico' };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isHighlight = data.isHighlight;
    
    return (
      <div className={`border border-border rounded-lg shadow-lg p-3 min-w-[250px] ${isHighlight ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
        <p className="font-medium text-foreground mb-2">
          {label} {isHighlight && <span className="text-red-600 text-xs">(Maior Desvio)</span>}
        </p>
        <div className="space-y-2">
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
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Assertividade:</span>
              <span className="font-medium text-foreground">{data.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function VmoLatamAssertividadeSop() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("SEK");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const exportReport = () => {
    console.log("Exportando relatório de Assertividade SOP...");
  };

  const calculateMonthTotal = (field: 'planned' | 'realized', month: string) => {
    return mockSopData.projectsData.reduce((total, project) => {
      const monthData = project.monthlyDetails[month as keyof typeof project.monthlyDetails];
      return total + (monthData ? monthData[field] : 0);
    }, 0);
  };

  const calculateAccuracy = (planned: number, realized: number) => {
    return planned > 0 ? ((realized / planned) * 100) : 0;
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/relatorios">Relatórios</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assertividade e Desvios SOP</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/relatorios')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Relatórios
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Assertividade e Desvios SOP</h1>
              <p className="text-muted-foreground">Comparativo Sales & Operations Planning vs Realizado</p>
            </div>
          </div>
          <Button onClick={exportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ano</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Projeto</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {mockSopData.projectsData.map(project => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
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
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Sustentabilidade">Sustentabilidade</SelectItem>
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
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
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
                    <SelectItem value="SEK">SEK - Coroa Sueca (padrão)</SelectItem>
                    <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Última atualização */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Última atualização:</span>
                <span className="text-sm">{mockSopData.lastUpdated}</span>
                <span className="text-xs text-green-600 ml-2">✓ Dados em SEK convertidos automaticamente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* % Assertividade do Portfólio */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        Assertividade <Info className="h-3 w-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentual médio de assertividade do portfólio (Realizado/Planejado)</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-2xl font-bold text-blue-600">{mockSopData.kpis.portfolioAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Média geral</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Planejado */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        Total Planejado <Info className="h-3 w-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma de todos os valores planejados (SOP) em SEK</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-2xl font-bold">{formatCurrency(mockSopData.kpis.totalPlanned)}</p>
                  <p className="text-xs text-muted-foreground">YTD Planejado</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Total Realizado */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        Total Realizado <Info className="h-3 w-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma de todos os valores realizados (AC) em SEK</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-2xl font-bold">{formatCurrency(mockSopData.kpis.totalRealized)}</p>
                  <p className="text-xs text-muted-foreground">YTD Realizado</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Maior Desvio */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        Maior Desvio <Info className="h-3 w-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maior desvio absoluto registrado no período</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(Math.abs(mockSopData.kpis.biggestDeviation))}</p>
                  <p className="text-xs text-muted-foreground">{mockSopData.kpis.biggestDeviationMonth}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          {/* Mês Mais Assertivo */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        Melhor Mês <Info className="h-3 w-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mês com maior assertividade média</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-2xl font-bold text-green-600">{mockSopData.kpis.mostAccurateAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">{mockSopData.kpis.mostAccurateMonth}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking de Projetos */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Assertividade por Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSopData.projectRanking.map((project, index) => {
                const status = getAccuracyStatus(project.accuracy);
                const StatusIcon = status.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{status.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${status.color}`}>{project.accuracy}%</span>
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabela Dinâmica */}
        <Card>
          <CardHeader>
            <CardTitle>Planejado vs Realizado por Projeto e Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Projeto/Área</TableHead>
                    {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map(month => (
                      <TableHead key={month} className="text-center min-w-[120px]">{month}</TableHead>
                    ))}
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSopData.projectsData.map((project) => (
                    <>
                      {/* Linha do Projeto */}
                      <TableRow key={project.id} className="border-b-2">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.area}</div>
                          </div>
                        </TableCell>
                        {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map(month => {
                          const data = project.monthlyDetails[month as keyof typeof project.monthlyDetails];
                          const deviation = data ? data.realized - data.planned : 0;
                          const accuracy = data ? calculateAccuracy(data.planned, data.realized) : 0;
                          return (
                            <TableCell key={month} className="text-center">
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">P: {formatCurrency(data?.planned || 0)}</div>
                                    <div className="text-xs font-medium">R: {formatCurrency(data?.realized || 0)}</div>
                                    <div className={`text-xs font-bold ${deviation < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                      {accuracy.toFixed(1)}%
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <p>Planejado: {formatCurrency(data?.planned || 0)}</p>
                                    <p>Realizado: {formatCurrency(data?.realized || 0)}</p>
                                    <p>Desvio: {formatCurrency(deviation)}</p>
                                    <p>Assertividade: {accuracy.toFixed(1)}%</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center font-medium">
                          {/* Total do projeto */}
                          <div className="space-y-1">
                            <div className="text-sm">P: {formatCurrency(Object.values(project.monthlyDetails).reduce((sum, data) => sum + data.planned, 0))}</div>
                            <div className="text-sm font-medium">R: {formatCurrency(Object.values(project.monthlyDetails).reduce((sum, data) => sum + data.realized, 0))}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                  
                  {/* Linha de Total */}
                  <TableRow className="border-t-2 font-bold bg-muted/30">
                    <TableCell>Total Geral</TableCell>
                    {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map(month => {
                      const totalPlanned = calculateMonthTotal('planned', month);
                      const totalRealized = calculateMonthTotal('realized', month);
                      const accuracy = calculateAccuracy(totalPlanned, totalRealized);
                      return (
                        <TableCell key={month} className="text-center">
                          <div className="space-y-1">
                            <div className="text-xs">P: {formatCurrency(totalPlanned)}</div>
                            <div className="text-xs font-medium">R: {formatCurrency(totalRealized)}</div>
                            <div className="text-xs font-bold text-blue-600">{accuracy.toFixed(1)}%</div>
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="text-sm">P: {formatCurrency(mockSopData.kpis.totalPlanned)}</div>
                        <div className="text-sm font-medium">R: {formatCurrency(mockSopData.kpis.totalRealized)}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Mensal: Planejado vs Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockSopData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value/1000000).toFixed(1)}M kr`} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="planned" fill="#3b82f6" name="Planejado (SOP)" />
                  <Bar dataKey="realized" fill="#10b981" name="Realizado (AC)" />
                  <Line type="monotone" dataKey="accuracy" stroke="#f59e0b" strokeWidth={3} name="Assertividade %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Destaques Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle>Destaques e Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Maior Desvio</h4>
                    <p className="text-sm text-red-700">
                      {mockSopData.kpis.biggestDeviationMonth}: {formatCurrency(Math.abs(mockSopData.kpis.biggestDeviation))} abaixo do planejado
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Trophy className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Melhor Performance</h4>
                    <p className="text-sm text-green-700">
                      {mockSopData.kpis.mostAccurateMonth}: {mockSopData.kpis.mostAccurateAccuracy}% de assertividade
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Assertividade Geral</h4>
                    <p className="text-sm text-blue-700">
                      Portfólio com {mockSopData.kpis.portfolioAccuracy}% de assertividade média
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}