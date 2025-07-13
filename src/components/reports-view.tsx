import { useState, useMemo } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  BarChart3, Download, Filter, Calendar, DollarSign, AlertTriangle, 
  TrendingUp, Target, PieChart as PieChartIcon, FileText, Eye, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface ReportsViewProps {
  project: any;
  transactions: any[];
  baselines: any[];
}

export function ReportsView({ project, transactions, baselines }: ReportsViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("financial_summary");
  const [filters, setFilters] = useState({
    period: "last_6_months",
    category: "all",
    status: "all"
  });
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString("pt-BR")}`;
  };

  // Enhanced analytics with filter-based simulation
  const analytics = useMemo(() => {
    // Simulate different data based on selected period
    let monthsBack = 6;
    let dataMultiplier = 1;
    let riskLevel = 'ok';
    
    switch (filters.period) {
      case 'last_3_months':
        monthsBack = 3;
        dataMultiplier = 0.6;
        riskLevel = 'ok';
        break;
      case 'last_6_months':
        monthsBack = 6;
        dataMultiplier = 1;
        riskLevel = 'warning';
        break;
      case 'last_12_months':
        monthsBack = 12;
        dataMultiplier = 1.8;
        riskLevel = 'critical';
        break;
      case 'ytd':
        monthsBack = new Date().getMonth() + 1;
        dataMultiplier = 1.4;
        riskLevel = 'warning';
        break;
    }

    // Simulate filtered transactions
    const filteredTransactions = transactions.slice(0, Math.floor(transactions.length * dataMultiplier));
    const totalRealized = filteredTransactions.reduce((sum, t) => sum + t.amount, 0) * dataMultiplier;
    const balance = project.budget - totalRealized;
    const executionRate = (totalRealized / project.budget) * 100;
    
    // Category distribution with variations
    const baseCategoryData = filteredTransactions.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount * dataMultiplier;
      return acc;
    }, {});

    // Add period-specific variations
    if (filters.period === 'last_12_months') {
      baseCategoryData['Consultoria'] = (baseCategoryData['Consultoria'] || 0) * 1.5;
      baseCategoryData['Infraestrutura'] = (baseCategoryData['Infraestrutura'] || 0) * 1.3;
    } else if (filters.period === 'last_3_months') {
      baseCategoryData['Software'] = (baseCategoryData['Software'] || 0) * 0.7;
      baseCategoryData['Hardware'] = (baseCategoryData['Hardware'] || 0) * 1.2;
    }

    const pieData = Object.entries(baseCategoryData).map(([name, value]: [string, any]) => ({
      name, 
      value: Math.round(value), 
      percentage: (value / totalRealized * 100).toFixed(1)
    })).filter(item => item.value > 0);

    // Monthly evolution with period-specific data
    const monthlyData = Array.from({ length: monthsBack }, (_, i) => {
      const month = subMonths(new Date(), monthsBack - 1 - i);
      const baseRealized = (project.budget / 12) * (0.8 + Math.random() * 0.4);
      
      // Apply period-specific patterns
      let realizedMultiplier = 1;
      if (filters.period === 'last_12_months') {
        realizedMultiplier = 1 + (i / monthsBack) * 0.5; // Crescimento ao longo do ano
      } else if (filters.period === 'last_3_months') {
        realizedMultiplier = 1.2 - (i * 0.1); // Redução nos últimos meses
      } else if (filters.period === 'ytd') {
        realizedMultiplier = 0.5 + (i / monthsBack) * 1.5; // Aceleração no ano
      }

      const realized = baseRealized * realizedMultiplier * dataMultiplier;
      const planned = project.budget / 12;

      return {
        month: format(month, 'MMM', { locale: ptBR }),
        planned,
        realized: Math.round(realized),
        balance: project.budget - realized,
        cumulative: realized * (i + 1)
      };
    });

    // Critical insights with period-specific analysis
    const maxExpenseMonth = monthlyData.reduce((max, current) => 
      current.realized > max.realized ? current : max
    );
    
    const criticalCategory = pieData.length > 0 ? pieData.reduce((max, current) => 
      current.value > max.value ? current : max
    ) : { name: 'N/A', value: 0 };

    // Generate period-specific insights
    let periodInsight = '';
    let trendInsight = '';
    
    switch (filters.period) {
      case 'last_3_months':
        periodInsight = 'Período recente mostra controle de gastos';
        trendInsight = 'Tendência decrescente identificada';
        break;
      case 'last_6_months':
        periodInsight = 'Semestre com alguns picos de gasto';
        trendInsight = 'Volatilidade moderada nos gastos';
        break;
      case 'last_12_months':
        periodInsight = 'Ano com crescimento acelerado de gastos';
        trendInsight = 'Necessária revisão orçamentária urgente';
        break;
      case 'ytd':
        periodInsight = 'Ano corrente com boa execução';
        trendInsight = 'Projeção indica necessidade de contenção';
        break;
    }

    return {
      totalRealized: Math.round(totalRealized),
      balance,
      executionRate,
      pieData,
      monthlyData,
      insights: {
        maxExpenseMonth: maxExpenseMonth.month,
        maxExpenseAmount: maxExpenseMonth.realized,
        criticalCategory: criticalCategory.name,
        criticalAmount: criticalCategory.value,
        riskLevel,
        periodInsight,
        trendInsight,
        totalTransactions: filteredTransactions.length,
        avgMonthlySpend: Math.round(totalRealized / monthsBack)
      }
    };
  }, [project, transactions, filters.period]);

  const templates = [
    { id: "financial_summary", name: "Resumo Financeiro", icon: DollarSign },
    { id: "deviation_analysis", name: "Análise de Desvios", icon: AlertTriangle },
    { id: "monthly_detail", name: "Detalhamento Mensal", icon: Calendar },
    { id: "projection_vs_actual", name: "Projeção vs Realizado", icon: TrendingUp }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const exportReport = (format: string) => {
    toast({
      title: `Exportando ${format.toUpperCase()}`,
      description: "Relatório será baixado em instantes.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Central de Relatórios</h3>
          <p className="text-muted-foreground">Análise completa e insights do projeto</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <template.icon className="h-4 w-4" />
                    {template.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
              <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
              <SelectItem value="last_12_months">Últimos 12 meses</SelectItem>
              <SelectItem value="ytd">Este ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Serviços">Serviços</SelectItem>
              <SelectItem value="Consultoria">Consultoria</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Critical Alert */}
      {analytics.insights.riskLevel === 'critical' && (
        <Alert className="border-red-200 bg-red-50 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Status Crítico:</strong> Orçamento ultrapassado em {formatCurrency(Math.abs(analytics.balance))}. 
            Ação imediata necessária.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Realizado</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalRealized)}</p>
                <p className="text-xs text-green-600">{analytics.executionRate.toFixed(1)}% executado</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${analytics.balance >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={`text-2xl font-bold ${analytics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(analytics.balance))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {analytics.balance >= 0 ? 'Disponível' : 'Déficit'}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${analytics.balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${
          analytics.insights.riskLevel === 'critical' ? 'border-l-red-500' : 
          analytics.insights.riskLevel === 'warning' ? 'border-l-orange-500' : 'border-l-green-500'
        }`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={
                  analytics.insights.riskLevel === 'critical' ? 'destructive' : 
                  analytics.insights.riskLevel === 'warning' ? 'outline' : 'outline'
                } className={
                  analytics.insights.riskLevel === 'warning' ? 'border-orange-500 text-orange-600' :
                  analytics.insights.riskLevel === 'ok' ? 'border-green-500 text-green-600' : ''
                }>
                  {analytics.insights.riskLevel === 'critical' ? 'CRÍTICO' : 
                   analytics.insights.riskLevel === 'warning' ? 'ATENÇÃO' : 'OK'}
                </Badge>
              </div>
              <AlertTriangle className={`h-8 w-8 ${
                analytics.insights.riskLevel === 'critical' ? 'text-red-500' : 
                analytics.insights.riskLevel === 'warning' ? 'text-orange-500' : 'text-green-500'
              }`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Bar dataKey="planned" fill="#3b82f6" name="Planejado" />
                  <Bar dataKey="realized" fill="#10b981" name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={analytics.pieData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    dataKey="value"
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {analytics.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: string) => [formatCurrency(value), name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analytics.pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}: {entry.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automated Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Insights Automáticos - {filters.period === 'last_3_months' ? 'Últimos 3 meses' : 
                                      filters.period === 'last_6_months' ? 'Últimos 6 meses' :
                                      filters.period === 'last_12_months' ? 'Últimos 12 meses' : 'Este ano'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">📊 Visão do Período</h4>
              <p className="text-sm text-blue-700">
                {analytics.insights.periodInsight}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {analytics.insights.totalTransactions} transações analisadas
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">💰 Maior Gasto Mensal</h4>
              <p className="text-sm text-green-700">
                <strong>{analytics.insights.maxExpenseMonth}</strong> foi o mês com maior gasto: 
                <strong> {formatCurrency(analytics.insights.maxExpenseAmount)}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Média mensal: {formatCurrency(analytics.insights.avgMonthlySpend)}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              analytics.insights.riskLevel === 'critical' ? 'bg-red-50 border-red-200' :
              analytics.insights.riskLevel === 'warning' ? 'bg-orange-50 border-orange-200' : 
              'bg-green-50 border-green-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                analytics.insights.riskLevel === 'critical' ? 'text-red-900' :
                analytics.insights.riskLevel === 'warning' ? 'text-orange-900' : 
                'text-green-900'
              }`}>
                {analytics.insights.riskLevel === 'critical' ? '⚠️ ' : 
                 analytics.insights.riskLevel === 'warning' ? '🔍 ' : '✅ '}
                {analytics.insights.riskLevel === 'critical' ? 'Status Crítico' :
                 analytics.insights.riskLevel === 'warning' ? 'Monitoramento' : 'Situação OK'}
              </h4>
              <p className={`text-sm ${
                analytics.insights.riskLevel === 'critical' ? 'text-red-700' :
                analytics.insights.riskLevel === 'warning' ? 'text-orange-700' : 
                'text-green-700'
              }`}>
                {analytics.insights.trendInsight}
              </p>
              <p className={`text-xs mt-1 ${
                analytics.insights.riskLevel === 'critical' ? 'text-red-600' :
                analytics.insights.riskLevel === 'warning' ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                Categoria prioritária: <strong>{analytics.insights.criticalCategory}</strong>
              </p>
            </div>
          </div>

          {/* Period-specific recommendations */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">💡 Recomendações para o Período</h4>
            <div className="text-sm text-gray-700 space-y-1">
              {filters.period === 'last_3_months' && (
                <>
                  <p>• Período recente mostra bom controle de gastos</p>
                  <p>• Manter tendência de redução identificada</p>
                  <p>• Considerar realocação do saldo não utilizado</p>
                </>
              )}
              {filters.period === 'last_6_months' && (
                <>
                  <p>• Identificados alguns picos de gasto no semestre</p>
                  <p>• Revisar processos de aprovação para grandes despesas</p>
                  <p>• Implementar controles mensais mais rigorosos</p>
                </>
              )}
              {filters.period === 'last_12_months' && (
                <>
                  <p>• Crescimento acelerado de gastos identificado</p>
                  <p>• Necessária revisão orçamentária para próximo período</p>
                  <p>• Considerar renegociação de contratos principais</p>
                </>
              )}
              {filters.period === 'ytd' && (
                <>
                  <p>• Boa execução orçamentária no ano corrente</p>
                  <p>• Projeção indica necessidade de contenção no último trimestre</p>
                  <p>• Avaliar possibilidade de antecipação de investimentos</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}