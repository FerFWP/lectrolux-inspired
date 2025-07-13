import { useState, useMemo } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  BarChart3, Download, Filter, Calendar, DollarSign, AlertTriangle, 
  TrendingUp, Target, PieChart, FileText, Eye, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

  // Enhanced analytics
  const analytics = useMemo(() => {
    const totalRealized = transactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = project.budget - totalRealized;
    const executionRate = (totalRealized / project.budget) * 100;
    
    // Category distribution
    const categoryData = transactions.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([name, value]: [string, any]) => ({
      name, value, percentage: (value / totalRealized * 100).toFixed(1)
    }));

    // Monthly evolution
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), 5 - i);
      const monthKey = format(month, 'yyyy-MM');
      const monthTransactions = transactions.filter(t => 
        format(new Date(t.transaction_date), 'yyyy-MM') === monthKey
      );
      const realized = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      const planned = project.budget / 12; // Simplified

      return {
        month: format(month, 'MMM', { locale: ptBR }),
        planned,
        realized,
        balance: project.budget - realized
      };
    });

    // Critical insights
    const maxExpenseMonth = monthlyData.reduce((max, current) => 
      current.realized > max.realized ? current : max
    );
    
    const criticalCategory = pieData.reduce((max, current) => 
      current.value > max.value ? current : max
    );

    return {
      totalRealized,
      balance,
      executionRate,
      pieData,
      monthlyData,
      insights: {
        maxExpenseMonth: maxExpenseMonth.month,
        maxExpenseAmount: maxExpenseMonth.realized,
        criticalCategory: criticalCategory.name,
        criticalAmount: criticalCategory.value,
        riskLevel: balance < 0 ? 'critical' : executionRate > 80 ? 'warning' : 'ok'
      }
    };
  }, [project, transactions]);

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
              <PieChart className="h-5 w-5" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie data={analytics.pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {analytics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RechartsPie>
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
            Insights Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💰 Maior Gasto Mensal</h4>
              <p className="text-sm text-blue-700">
                <strong>{analytics.insights.maxExpenseMonth}</strong> foi o mês com maior gasto: 
                <strong> {formatCurrency(analytics.insights.maxExpenseAmount)}</strong>
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">⚠️ Categoria de Risco</h4>
              <p className="text-sm text-orange-700">
                <strong>{analytics.insights.criticalCategory}</strong> representa o maior consumo: 
                <strong> {formatCurrency(analytics.insights.criticalAmount)}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}