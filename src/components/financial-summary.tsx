import React, { useState } from "react";
import { format } from "date-fns";
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Eye, AlertCircle, Info, Calendar, Building2, Users, Banknote, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, ComposedChart } from "recharts";
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
  selectedCurrency?: string;
  selectedYear?: string;
  onBaselineCreate: () => void;
}
export function FinancialSummary({
  project,
  transactions,
  baselines,
  selectedCurrency,
  selectedYear,
  onBaselineCreate
}: FinancialSummaryProps) {
  const [selectedChart, setSelectedChart] = useState("combined");
  // Use global currency and year from props, fallback to project defaults
  const currentCurrency = selectedCurrency || project.currency;
  const currentYear = parseInt(selectedYear || new Date().getFullYear().toString());

  // Simulação de taxas de câmbio
  const exchangeRates = {
    "BRL": {
      rate: 1.0,
      label: "Moeda do cadastro (BRL)"
    },
    "USD": {
      rate: 1.0,
      label: "Moeda do cadastro (USD)"
    },
    "SEK": {
      rate: 1.0,
      label: "Moeda do cadastro (SEK)"
    },
    "EUR": {
      rate: 1.0,
      label: "Moeda do cadastro (EUR)"
    },
    "SEK_APPROVAL": {
      rate: 0.48,
      label: "SEK (taxa da aprovação)"
    },
    "SEK_BU": {
      rate: 0.52,
      label: "SEK BU (taxa anual)"
    },
    "SEK_AVG": {
      rate: 0.50,
      label: "SEK AVG (média mensal)"
    }
  };
  const getCurrentCurrencyInfo = () => {
    // Se selecionou moeda do cadastro, não há conversão
    if (currentCurrency === project.currency) {
      return {
        rate: 1.0,
        label: `Moeda do cadastro (${project.currency})`
      };
    }

    // Para outras moedas, usar simulação baseada na moeda original
    const baseRate = project.currency === "BRL" ? 1.0 : project.currency === "USD" ? 5.40 : project.currency === "SEK" ? 0.48 : 5.85;
    return exchangeRates[currentCurrency as keyof typeof exchangeRates] || {
      rate: 1.0,
      label: currentCurrency
    };
  };
  const convertCurrency = (amount: number) => {
    const currencyInfo = getCurrentCurrencyInfo();

    // Simulação de conversão baseada no tipo de moeda selecionada
    if (currentCurrency === "SEK_APPROVAL") {
      return amount * 0.48; // Taxa da aprovação
    } else if (currentCurrency === "SEK_BU") {
      return amount * 0.52; // Taxa anual BU
    } else if (currentCurrency === "SEK_AVG") {
      return amount * 0.50; // Média mensal
    }
    return amount; // Moeda do cadastro
  };
  const formatCurrency = (amount: number) => {
    const convertedAmount = convertCurrency(amount);
    let symbol = "R$";
    if (currentCurrency.startsWith("SEK")) {
      symbol = "kr";
    } else if (currentCurrency === "USD") {
      symbol = "$";
    } else if (currentCurrency === "EUR") {
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
  const buAllocated = adjustedBudget * (currentYear >= 2025 ? 0.85 : 0.80);

  // Desvio absoluto e percentual
  const absoluteDeviation = totalRealized - adjustedBudget;
  const percentualDeviation = (totalRealized - adjustedBudget) / adjustedBudget * 100;

  // Percentuais
  const executionPercent = totalRealized / adjustedBudget * 100;
  const commitmentPercent = committed / adjustedBudget * 100;

  // Dados para gráfico combinado com linha BU
  const monthlyBuValue = buAllocated / 12;
  const monthlyData = [{
    month: "Jan",
    planejado: 150000,
    realizado: 120000,
    bu: monthlyBuValue
  }, {
    month: "Fev",
    planejado: 300000,
    realizado: 280000,
    bu: monthlyBuValue
  }, {
    month: "Mar",
    planejado: 450000,
    realizado: 420000,
    bu: monthlyBuValue
  }, {
    month: "Abr",
    planejado: 600000,
    realizado: 580000,
    bu: monthlyBuValue
  }, {
    month: "Mai",
    planejado: 750000,
    realizado: 720000,
    bu: monthlyBuValue
  }, {
    month: "Jun",
    planejado: 900000,
    realizado: 850000,
    bu: monthlyBuValue
  }, {
    month: "Jul",
    planejado: 1050000,
    realizado: 1000000,
    bu: monthlyBuValue
  }, {
    month: "Ago",
    planejado: 1200000,
    realizado: 1350000,
    bu: monthlyBuValue
  }];

  // Dados para gráfico pizza (distribuição por categoria)
  const categoryData = [{
    name: "Software/Licenças",
    value: 450000,
    color: "#3B82F6"
  }, {
    name: "Hardware",
    value: 320000,
    color: "#10B981"
  }, {
    name: "Serviços/Consultoria",
    value: 280000,
    color: "#F59E0B"
  }, {
    name: "Treinamento",
    value: 180000,
    color: "#EF4444"
  }, {
    name: "Infraestrutura",
    value: 120000,
    color: "#8B5CF6"
  }];

  // Dados para gráfico pizza (CAPEX vs OPEX)
  const capexOpexData = [{
    name: "CAPEX",
    value: 800000,
    color: "#3B82F6"
  }, {
    name: "OPEX",
    value: 550000,
    color: "#10B981"
  }];

  // Insights automáticos
  const getTopSpendingMonth = () => {
    const maxSpending = Math.max(...monthlyData.map(d => d.realizado));
    const topMonth = monthlyData.find(d => d.realizado === maxSpending);
    return {
      month: topMonth?.month,
      amount: maxSpending
    };
  };
  const getTopCategory = () => {
    const maxCategory = categoryData.reduce((prev, current) => prev.value > current.value ? prev : current);
    return maxCategory;
  };
  const topSpendingMonth = getTopSpendingMonth();
  const topCategory = getTopCategory();
  const handleExport = () => {
    const data = {
      project: project.name,
      currency: currentCurrency,
      year: currentYear,
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
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumo-financeiro-${project.name}-${currentYear}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <TooltipProvider>
      <div className="space-y-6">

        {/* Resumo Analítico de Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo Analítico de Orçamento - {currentYear}
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
              
              <div className="space-y-2">{/* cursor-pointer" onClick={() => onDrillDown('realized', transactions)} */}
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
                    <p>Valor total alocado pela Business Unit para {currentYear}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(buAllocated)}</div>
                <div className="text-xs text-purple-600">
                  {currentYear} - Business Unit
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
              
              {percentualDeviation !== 0 && <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Desvio Orçamentário</span>
                    <span className={percentualDeviation > 0 ? 'text-red-600' : 'text-green-600'}>
                      {percentualDeviation > 0 ? '+' : ''}{percentualDeviation.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.abs(percentualDeviation)} className={`h-2 ${percentualDeviation > 0 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} />
                </div>}
            </div>
          </CardContent>
        </Card>

        {/* Gráficos Combinados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise Visual - {currentYear}
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
              {selectedChart === "combined" && <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={value => `${value / 1000}k`} />
                    <RechartsTooltip formatter={value => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="planejado" fill="#94A3B8" name="Planejado" />
                    <Bar dataKey="realizado" fill="#3B82F6" name="Realizado" />
                    <Line type="monotone" dataKey="bu" stroke="#8B5CF6" strokeWidth={3} name="BU" />
                  </ComposedChart>
                </ResponsiveContainer>}
              
              {selectedChart === "category" && <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie dataKey="value" data={categoryData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={value => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>}
              
              {selectedChart === "capex" && <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie dataKey="value" data={capexOpexData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={120} fill="#8884d8">
                      {capexOpexData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={value => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>}
            </div>
          </CardContent>
        </Card>

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
                  ({(topCategory.value / totalRealized * 100).toFixed(1)}%)
                </div>
              </AlertDescription>
            </Alert>
            
            
            {/* Alerta crítico para desvios */}
            {Math.abs(percentualDeviation) > 10 && <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="font-medium text-red-800">Atenção: Desvio Crítico</div>
                  <div className="text-sm text-red-700">
                    Projeto com desvio de {percentualDeviation.toFixed(1)}% - requer atenção imediata
                  </div>
                </AlertDescription>
              </Alert>}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>;
}