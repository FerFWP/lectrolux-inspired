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
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
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
}

export function FinancialSummary({ 
  project, 
  transactions, 
  baselines, 
  onDrillDown 
}: FinancialSummaryProps) {
  const [selectedChart, setSelectedChart] = useState("combined");

  const formatCurrency = (amount: number, currency: string = project.currency) => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Cálculos financeiros
  const initialBudget = baselines.length > 0 ? baselines[baselines.length - 1].budget : project.budget;
  const adjustedBudget = project.budget;
  const totalRealized = project.realized || 0;
  const committed = project.committed || 0;
  const balance = adjustedBudget - totalRealized - committed;
  const approvedValue = baselines.length > 0 ? baselines[0].budget : project.budget;
  const buBalance = approvedValue - totalRealized; // Business Unit balance

  // Percentuais
  const executionPercent = (totalRealized / adjustedBudget) * 100;
  const deviationPercent = ((totalRealized - adjustedBudget) / adjustedBudget) * 100;
  const commitmentPercent = (committed / adjustedBudget) * 100;

  // Dados para gráfico combinado (Realizado vs Planejado)
  const monthlyData = [
    { month: "Jan", planejado: 150000, realizado: 120000 },
    { month: "Fev", planejado: 300000, realizado: 280000 },
    { month: "Mar", planejado: 450000, realizado: 420000 },
    { month: "Abr", planejado: 600000, realizado: 580000 },
    { month: "Mai", planejado: 750000, realizado: 720000 },
    { month: "Jun", planejado: 900000, realizado: 850000 },
    { month: "Jul", planejado: 1050000, realizado: 1000000 },
    { month: "Ago", planejado: 1200000, realizado: 1350000 }
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
    // Simulado - em produção viria dos transactions
    return { name: "SAP Brasil", amount: 450000 };
  };

  const topSpendingMonth = getTopSpendingMonth();
  const topCategory = getTopCategory();
  const topSupplier = getTopSupplier();

  // Taxa de câmbio (simulada)
  const exchangeRate = {
    currency: "SEK/BRL",
    rate: 0.48,
    variation: +0.02,
    lastUpdate: new Date()
  };

  const handleExport = () => {
    // Implementar exportação
    const data = {
      project: project.name,
      summary: {
        initialBudget,
        adjustedBudget,
        totalRealized,
        committed,
        balance,
        executionPercent,
        deviationPercent
      },
      date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-summary-${project.name}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Visão Financeira Completa</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Análise
          </Button>
        </div>
      </div>

      {/* Resumo Analítico de Orçamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Analítico de Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Orçado Inicial</div>
              <div className="text-xl font-bold">{formatCurrency(initialBudget)}</div>
              <div className="text-xs text-muted-foreground">Baseline original</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Orçado Ajustado</div>
              <div className="text-xl font-bold">{formatCurrency(adjustedBudget)}</div>
              <div className="text-xs text-blue-600">
                {((adjustedBudget - initialBudget) / initialBudget * 100).toFixed(1)}% vs inicial
              </div>
            </div>
            
            <div className="space-y-2 cursor-pointer" onClick={() => onDrillDown('realized', transactions)}>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                Realizado Total <Eye className="h-3 w-3" />
              </div>
              <div className="text-xl font-bold text-blue-600">{formatCurrency(totalRealized)}</div>
              <div className="text-xs text-blue-600">
                {executionPercent.toFixed(1)}% executado
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Comprometido</div>
              <div className="text-xl font-bold text-orange-600">{formatCurrency(committed)}</div>
              <div className="text-xs text-orange-600">
                {commitmentPercent.toFixed(1)}% do orçamento
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Saldo Disponível</div>
              <div className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(balance))}
              </div>
              <div className="text-xs text-muted-foreground">
                {balance >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Valor Aprovado (Baseline)</div>
              <div className="text-xl font-bold">{formatCurrency(approvedValue)}</div>
              <div className="text-xs text-muted-foreground">
                Última aprovação
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Saldo BU</div>
              <div className={`text-xl font-bold ${buBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(buBalance))}
              </div>
              <div className="text-xs text-muted-foreground">
                Business Unit
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
            
            {deviationPercent !== 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Desvio Orçamentário</span>
                  <span className={deviationPercent > 0 ? 'text-red-600' : 'text-green-600'}>
                    {deviationPercent > 0 ? '+' : ''}{deviationPercent.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={Math.abs(deviationPercent)} 
                  className={`h-2 ${deviationPercent > 0 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} 
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
            Análise Visual
          </CardTitle>
          <Tabs value={selectedChart} onValueChange={setSelectedChart}>
            <TabsList>
              <TabsTrigger value="combined">Realizado vs Planejado</TabsTrigger>
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
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="planejado" fill="#94A3B8" name="Planejado" />
                  <Bar dataKey="realizado" fill="#3B82F6" name="Realizado" />
                  <Line 
                    type="monotone" 
                    dataKey="realizado" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Tendência"
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
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
                  >
                    {capexOpexData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
          </CardContent>
        </Card>

        {/* Moeda e Taxa de Câmbio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Moeda e Taxa de Câmbio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Moeda Principal</div>
                <div className="text-xl font-bold">{project.currency}</div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {project.currency}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{exchangeRate.currency}</div>
                <div className="text-right">
                  <div className="font-bold">{exchangeRate.rate.toFixed(4)}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    exchangeRate.variation >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {exchangeRate.variation >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {exchangeRate.variation >= 0 ? '+' : ''}{exchangeRate.variation.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Última atualização: {format(exchangeRate.lastUpdate, "dd/MM/yyyy HH:mm")}
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Taxa aplicada: Média do BU (Business Unit Average)
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}