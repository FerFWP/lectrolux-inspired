import React, { useState } from "react";
import { format } from "date-fns";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  BarChart3,
  Download,
  Eye,
  AlertCircle,
  Info,
  Calendar,
  Building2,
  Users,
  Banknote,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart
} from "recharts";

interface Project {
  id: string;
  name: string;
  budget: number;
  realized: number;
  committed: number;
  currency: string;
  start_date?: Date;
  deadline?: Date;
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  transaction_date: Date;
  transaction_type: string;
}

interface Baseline {
  id: string;
  version: string;
  budget: number;
  created_at: string;
  description?: string;
}

interface FinancialSummaryProps {
  project: Project;
  transactions: Transaction[];
  baselines: Baseline[];
  onDrillDown: (type: string, data: any) => void;
  onChartClick?: (filterType: string, filterValue: string) => void;
}

export function FinancialSummary({ 
  project, 
  transactions, 
  baselines, 
  onDrillDown,
  onChartClick
}: FinancialSummaryProps) {
  const [selectedChart, setSelectedChart] = useState("combined");
  const [selectedCurrency, setSelectedCurrency] = useState(project.currency);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Simulação de taxas de câmbio
  const exchangeRates = {
    "BRL": { rate: 1.0, label: "Moeda do cadastro (BRL)" },
    "USD": { rate: 1.0, label: "Moeda do cadastro (USD)" },
    "SEK": { rate: 1.0, label: "Moeda do cadastro (SEK)" },
    "EUR": { rate: 1.0, label: "Moeda do cadastro (EUR)" },
    "SEK_APPROVAL": { rate: 0.48, label: "SEK (taxa da aprovação)" },
    "SEK_BU": { rate: 0.52, label: "SEK BU (taxa anual)" },
    "SEK_AVG": { rate: 0.50, label: "SEK AVG (média mensal)" }
  };

  const getCurrentCurrencyInfo = () => {
    // Se selecionou moeda do cadastro, não há conversão
    if (selectedCurrency === project.currency) {
      return { rate: 1.0, label: `Moeda do cadastro (${project.currency})` };
    }
    
    // Para outras moedas, usar simulação baseada na moeda original
    const baseRate = project.currency === "BRL" ? 1.0 : 
                    project.currency === "USD" ? 5.40 : 
                    project.currency === "SEK" ? 0.48 : 5.85;
    
    return exchangeRates[selectedCurrency as keyof typeof exchangeRates] || { rate: 1.0, label: selectedCurrency };
  };

  const convertCurrency = (amount: number) => {
    const currencyInfo = getCurrentCurrencyInfo();
    
    // Simulação de conversão baseada no tipo de moeda selecionada
    if (selectedCurrency === "SEK_APPROVAL") {
      return amount * 0.48; // Taxa da aprovação
    } else if (selectedCurrency === "SEK_BU") {
      return amount * 0.52; // Taxa anual BU
    } else if (selectedCurrency === "SEK_AVG") {
      return amount * 0.50; // Média mensal
    }
    
    return amount; // Moeda do cadastro
  };

  const formatCurrency = (amount: number) => {
    const convertedAmount = convertCurrency(amount);
    
    let symbol = "R$";
    if (selectedCurrency.startsWith("SEK")) {
      symbol = "kr";
    } else if (selectedCurrency === "USD") {
      symbol = "$";
    } else if (selectedCurrency === "EUR") {
      symbol = "€";
    }
    
    return `${symbol} ${convertedAmount.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Cálculos financeiros
  const initialBudget = baselines.length > 0 ? baselines[0].budget : project.budget;
  const adjustedBudget = project.budget;
  const totalRealized = project.realized || 0;
  const committed = project.committed || 0;
  const balance = adjustedBudget - totalRealized - committed;
  
  // Simulação de BU Alocado baseado no ano selecionado
  const buAllocated = adjustedBudget * (selectedYear >= 2025 ? 0.85 : 0.80);
  
  // Desvio absoluto e percentual
  const absoluteDeviation = totalRealized - adjustedBudget;
  const percentualDeviation = ((totalRealized - adjustedBudget) / adjustedBudget) * 100;

  // Percentuais
  const executionPercent = (totalRealized / adjustedBudget) * 100;
  const commitmentPercent = (committed / adjustedBudget) * 100;

  // Dados para gráfico combinado com linha BU
  const monthlyBuValue = buAllocated / 12;
  const monthlyData = [
    { month: "Jan", planejado: 150000, realizado: 120000, bu: monthlyBuValue },
    { month: "Fev", planejado: 300000, realizado: 280000, bu: monthlyBuValue },
    { month: "Mar", planejado: 450000, realizado: 420000, bu: monthlyBuValue },
    { month: "Abr", planejado: 600000, realizado: 580000, bu: monthlyBuValue },
    { month: "Mai", planejado: 750000, realizado: 720000, bu: monthlyBuValue },
    { month: "Jun", planejado: 900000, realizado: 850000, bu: monthlyBuValue },
    { month: "Jul", planejado: 1050000, realizado: 1000000, bu: monthlyBuValue },
    { month: "Ago", planejado: 1200000, realizado: 1350000, bu: monthlyBuValue }
  ];

  // Dados para gráfico pizza (distribuição por categoria)
  const categoryData = [
    { name: "Software/Licenças", value: 450000, color: "#3B82F6" },
    { name: "Hardware", value: 320000, color: "#10B981" },
    { name: "Serviços/Consultoria", value: 280000, color: "#F59E0B" },
    { name: "Treinamento", value: 180000, color: "#EF4444" },
    { name: "Infraestrutura", value: 120000, color: "#8B5CF6" }
  ];

  // Dados para gráfico pizza (CAPEX vs OPEX)
  const capexOpexData = [
    { name: "CAPEX", value: 800000, color: "#3B82F6" },
    { name: "OPEX", value: 550000, color: "#10B981" }
  ];

  // Insights automáticos
  const getTopSpendingMonth = () => {
    const maxSpending = Math.max(...monthlyData.map(d => d.realizado));
    const topMonth = monthlyData.find(d => d.realizado === maxSpending);
    return { month: topMonth?.month, amount: maxSpending };
  };

  const getTopCategory = () => {
    const maxCategory = categoryData.reduce((prev, current) => 
      prev.value > current.value ? prev : current
    );
    return maxCategory;
  };

  const getTopSupplier = () => {
    return { name: "SAP Brasil", amount: 450000 };
  };

  const topSpendingMonth = getTopSpendingMonth();
  const topCategory = getTopCategory();
  const topSupplier = getTopSupplier();

  const handleExport = () => {
    const data = {
      project: project.name,
      currency: selectedCurrency,
      year: selectedYear,
      summary: {
        initialBudget,
        adjustedBudget,
        totalRealized,
        committed,
        balance,
        buAllocated,
        absoluteDeviation,
        percentualDeviation,
        executionPercent
      },
      date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumo-financeiro-${project.name}-${selectedYear}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Seletores de Moeda e Ano */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configurações de Visualização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Moeda:</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={project.currency}>
                      Moeda do cadastro ({project.currency})
                    </SelectItem>
                    <SelectItem value="SEK_APPROVAL">SEK (taxa da aprovação)</SelectItem>
                    <SelectItem value="SEK_BU">SEK BU (taxa anual)</SelectItem>
                    <SelectItem value="SEK_AVG">SEK AVG (média mensal)</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Selecione a moeda para exibir todos os valores</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Ano:</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Altere o ano para ver dados históricos</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">
                  Taxa atual: {getCurrentCurrencyInfo().rate.toFixed(4)}
                </span>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Moeda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Informações de Moeda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Moeda Selecionada */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Moeda Atual:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Moeda utilizada para exibir todos os valores na tela</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-lg font-bold text-primary">
                  {selectedCurrency.startsWith("SEK") ? "SEK" : selectedCurrency}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getCurrentCurrencyInfo().label}
                </div>
              </div>

              {/* Taxa de Conversão */}
              {selectedCurrency !== project.currency && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Taxa de Conversão:</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Taxa utilizada para converter valores de {project.currency} para {selectedCurrency.startsWith("SEK") ? "SEK" : selectedCurrency}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {getCurrentCurrencyInfo().rate.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCurrency === "SEK_APPROVAL" && "Taxa da aprovação"}
                    {selectedCurrency === "SEK_BU" && "Taxa anual BU"}
                    {selectedCurrency === "SEK_AVG" && "Taxa média mensal"}
                  </div>
                </div>
              )}

              {/* Ano de Referência */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Ano de Referência:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ano base para cálculos de câmbio e dados financeiros</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {selectedYear}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedCurrency !== project.currency && selectedCurrency.startsWith("SEK") && (
                    <>
                      {selectedCurrency === "SEK_BU" && "Atualizada anualmente"}
                      {selectedCurrency === "SEK_AVG" && "Atualizada mensalmente"}
                      {selectedCurrency === "SEK_APPROVAL" && "Fixa desde aprovação"}
                    </>
                  )}
                </div>
              </div>

              {/* Última Atualização */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Última Atualização:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data e hora da última atualização dos dados de câmbio</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {format(new Date(), "dd/MM/yyyy HH:mm")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedCurrency === "SEK_BU" && "Fonte: Sistema BU"}
                  {selectedCurrency === "SEK_AVG" && "Fonte: Banco Central"}
                  {selectedCurrency === "SEK_APPROVAL" && "Fonte: Aprovação original"}
                  {selectedCurrency === project.currency && "Moeda original"}
                </div>
              </div>
            </div>

            {/* Legenda das Moedas */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-muted-foreground">Legenda das Moedas:</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explicação dos tipos de moeda disponíveis</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span><strong>Moeda do cadastro:</strong> Moeda original do projeto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span><strong>SEK (aprovação):</strong> Taxa fixa da aprovação inicial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span><strong>SEK BU:</strong> Taxa anual da Business Unit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span><strong>SEK AVG:</strong> Taxa média mensal atualizada</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Analítico de Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo Analítico de Orçamento - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      Orçado Inicial
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor do orçamento original aprovado no baseline inicial</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-xl font-bold">{formatCurrency(initialBudget)}</div>
                <div className="text-xs text-muted-foreground">Baseline original</div>
              </div>
              
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      Orçado Ajustado
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor do orçamento após ajustes e revisões</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-xl font-bold">{formatCurrency(adjustedBudget)}</div>
                <div className="text-xs text-blue-600">
                  {((adjustedBudget - initialBudget) / initialBudget * 100).toFixed(1)}% vs inicial
                </div>
              </div>
              
              <div className="space-y-2 cursor-pointer" onClick={() => onDrillDown('realized', transactions)}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 cursor-help">
                      Realizado Total <Eye className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor total já executado e pago do projeto</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-xl font-bold text-blue-600">{formatCurrency(totalRealized)}</div>
                <div className="text-xs text-blue-600">
                  {executionPercent.toFixed(1)}% executado
                </div>
              </div>
              
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      Comprometido
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor já comprometido mas ainda não pago</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-xl font-bold text-orange-600">{formatCurrency(committed)}</div>
                <div className="text-xs text-orange-600">
                  {commitmentPercent.toFixed(1)}% do orçamento
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      Saldo Disponível
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor ainda disponível para uso no projeto</p>
                  </TooltipContent>
                </Tooltip>
                <div className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(balance))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {balance >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      BU Alocado
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor total alocado pela Business Unit para {selectedYear}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(buAllocated)}</div>
                <div className="text-xs text-purple-600">
                  {selectedYear} - Business Unit
                </div>
              </div>
              
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      Desvio Absoluto
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Diferença em valor entre realizado e orçado</p>
                  </TooltipContent>
                </Tooltip>
                <div className={`text-xl font-bold ${absoluteDeviation >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(absoluteDeviation))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {absoluteDeviation >= 0 ? 'Acima do orçamento' : 'Abaixo do orçamento'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground cursor-help">
                      Desvio Percentual
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Diferença percentual entre realizado e orçado</p>
                  </TooltipContent>
                </Tooltip>
                <div className={`text-xl font-bold ${percentualDeviation >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {percentualDeviation >= 0 ? '+' : ''}{percentualDeviation.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Variação orçamentária
                </div>
              </div>
            </div>

            {/* Barras de progresso */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Execução Orçamentária</span>
                  <span>{executionPercent.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(executionPercent, 100)} className="h-2" />
              </div>
              
              {percentualDeviation !== 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Desvio Orçamentário</span>
                    <span className={percentualDeviation > 0 ? 'text-red-600' : 'text-green-600'}>
                      {percentualDeviation > 0 ? '+' : ''}{percentualDeviation.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(percentualDeviation)} 
                    className={`h-2 ${percentualDeviation > 0 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} 
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gráficos Combinados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise Visual - {selectedYear}
            </CardTitle>
            <Tabs value={selectedChart} onValueChange={setSelectedChart}>
              <TabsList>
                <TabsTrigger value="combined">Realizado vs Planejado vs BU</TabsTrigger>
                <TabsTrigger value="category">Por Categoria</TabsTrigger>
                <TabsTrigger value="capex">CAPEX/OPEX</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {selectedChart === "combined" && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="planejado" fill="#94A3B8" name="Planejado" />
                    <Bar dataKey="realizado" fill="#3B82F6" name="Realizado" />
                    <Line 
                      type="monotone" 
                      dataKey="bu" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="BU"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
              
              {selectedChart === "category" && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      onClick={(data) => {
                        if (onChartClick) {
                          onChartClick('category', data.name);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
              
              {selectedChart === "capex" && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={capexOpexData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      onClick={(data) => {
                        if (onChartClick) {
                          onChartClick('capex_opex', data.name);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {capexOpexData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel de Insights Automáticos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Insights Automáticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Mês de Maior Gasto</div>
                  <div className="text-sm text-muted-foreground">
                    {topSpendingMonth.month} - {formatCurrency(topSpendingMonth.amount!)}
                  </div>
                </AlertDescription>
              </Alert>
              
              <Alert>
                <PieChart className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Categoria que Mais Consome</div>
                  <div className="text-sm text-muted-foreground">
                    {topCategory.name} - {formatCurrency(topCategory.value)} 
                    ({((topCategory.value / totalRealized) * 100).toFixed(1)}%)
                  </div>
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Fornecedor Mais Relevante</div>
                  <div className="text-sm text-muted-foreground">
                    {topSupplier.name} - {formatCurrency(topSupplier.amount)}
                  </div>
                </AlertDescription>
              </Alert>
              
              {/* Alerta crítico para desvios */}
              {Math.abs(percentualDeviation) > 10 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="font-medium text-red-800">Atenção: Desvio Crítico</div>
                    <div className="text-sm text-red-700">
                      Projeto com desvio de {percentualDeviation.toFixed(1)}% - requer atenção imediata
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Métricas de Acompanhamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas de Acompanhamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(executionPercent)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Execução</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(commitmentPercent)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Comprometimento</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <div className="text-lg font-medium text-muted-foreground">
                  Última atualização
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}