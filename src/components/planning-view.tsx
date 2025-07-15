import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, addMonths, isBefore, isAfter, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  Edit3, 
  Save, 
  RotateCcw, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  HelpCircle,
  Plus,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanningViewProps {
  project: any;
  baselines: any[];
  transactions: any[];
  onUpdateForecast?: (data: any) => void;
  onSaveBaseline?: (data: any) => void;
  onRevertBaseline?: (baselineId: string) => void;
}

export function PlanningView({ 
  project, 
  baselines, 
  transactions, 
  onUpdateForecast, 
  onSaveBaseline, 
  onRevertBaseline 
}: PlanningViewProps) {
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<any>({});
  const [justification, setJustification] = useState("");
  const [selectedBaseline, setSelectedBaseline] = useState(baselines[0]?.id || "");
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Generate monthly data with enhanced analytics
  const generateMonthlyData = () => {
    const startDate = project.start_date ? new Date(project.start_date) : subMonths(new Date(), 6);
    const endDate = project.deadline ? new Date(project.deadline) : addMonths(new Date(), 6);
    const currentDate = new Date();
    
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return months.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      const monthTransactions = transactions.filter(t => 
        format(new Date(t.transaction_date), 'yyyy-MM') === monthKey
      );
      
      const realized = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      const planned = project.budget / months.length; // Simplified planning
      const variation = realized - planned;
      const variationPercent = planned > 0 ? (variation / planned) * 100 : 0;
      
      // Enhanced status logic
      const isExecuted = isBefore(month, startOfMonth(currentDate));
      const isCurrent = isSameMonth(month, currentDate);
      const isFuture = isAfter(month, endOfMonth(currentDate));
      
      let status: 'executed' | 'current' | 'future' = 'future';
      if (isExecuted) status = 'executed';
      else if (isCurrent) status = 'current';
      
      // Enhanced criticality assessment
      let criticality: 'ok' | 'watch' | 'critical' = 'ok';
      if (Math.abs(variationPercent) > 20) criticality = 'critical';
      else if (Math.abs(variationPercent) > 10) criticality = 'watch';
      
      // Trend calculation
      const previousRealized = months.indexOf(month) > 0 ? 
        transactions.filter(t => 
          format(new Date(t.transaction_date), 'yyyy-MM') === format(months[months.indexOf(month) - 1], 'yyyy-MM')
        ).reduce((sum, t) => sum + t.amount, 0) : 0;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (realized > previousRealized * 1.1) trend = 'up';
      else if (realized < previousRealized * 0.9) trend = 'down';
      
      return {
        month: monthKey,
        monthName: format(month, 'MMM yyyy', { locale: ptBR }),
        monthShort: format(month, 'MMM', { locale: ptBR }),
        planned,
        realized,
        variation,
        variationPercent,
        status,
        criticality,
        trend,
        executionRate: planned > 0 ? (realized / planned) * 100 : 0
      };
    });
  };

  const monthlyData = generateMonthlyData();

  // Analytics summary
  const analytics = useMemo(() => {
    const executedMonths = monthlyData.filter(m => m.status === 'executed');
    const criticalMonths = monthlyData.filter(m => m.criticality === 'critical');
    const watchMonths = monthlyData.filter(m => m.criticality === 'watch');
    
    const avgDeviation = executedMonths.length > 0 
      ? executedMonths.reduce((sum, m) => sum + Math.abs(m.variationPercent), 0) / executedMonths.length 
      : 0;
      
    const executionRate = executedMonths.length > 0
      ? executedMonths.reduce((sum, m) => sum + m.executionRate, 0) / executedMonths.length
      : 0;
      
    const nextRisk = monthlyData.find(m => m.status === 'future' && m.criticality !== 'ok');
    
    return {
      criticalCount: criticalMonths.length,
      watchCount: watchMonths.length,
      avgDeviation: Math.round(avgDeviation * 10) / 10,
      executionRate: Math.round(executionRate * 10) / 10,
      nextRisk: nextRisk?.monthName || 'Nenhum risco identificado',
      totalExecuted: executedMonths.length,
      totalPlanned: monthlyData.length
    };
  }, [monthlyData]);

  // Group data by status
  const groupedData = useMemo(() => ({
    executed: monthlyData.filter(m => m.status === 'executed'),
    current: monthlyData.filter(m => m.status === 'current'),
    future: monthlyData.filter(m => m.status === 'future')
  }), [monthlyData]);

  const getStatusBadge = (criticality: string, variationPercent: number) => {
    if (criticality === 'critical') {
      return <Badge variant="destructive" className="text-xs">Crítico</Badge>;
    }
    if (criticality === 'watch') {
      return <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">Em Observação</Badge>;
    }
    return <Badge variant="outline" className="text-xs border-green-500 text-green-600">OK</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendTooltip = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Gastos crescentes - Atenção necessária';
      case 'down':
        return 'Gastos decrescentes - Situação controlada';
      default:
        return 'Gastos estáveis - Dentro do esperado';
    }
  };

  const MiniChart = ({ data }: { data: any }) => {
    const chartData = [
      { name: 'Planejado', value: data.planned, fill: '#3b82f6' },
      { name: 'Realizado', value: data.realized, fill: data.realized > data.planned ? '#ef4444' : '#10b981' }
    ];

    return (
      <div className="w-16 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Enhanced Evolution Chart Component
  const EvolutionChart = () => {
    const chartData = monthlyData.map(m => ({
      month: m.monthShort,
      planned: m.planned,
      realized: m.realized
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${formatCurrency(value).split(' ')[1]}`} />
            <Line 
              type="monotone" 
              dataKey="planned" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Planejado"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="realized" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Realizado"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const handleEditForecast = (monthKey: string) => {
    const monthData = monthlyData.find(m => m.month === monthKey);
    const currentChange = Math.abs((forecastData[monthKey] || monthData?.planned || 0) - (monthData?.planned || 0));
    const changePercent = monthData?.planned ? (currentChange / monthData.planned) * 100 : 0;
    
    // Require justification for changes > 15%
    if (changePercent > 15 && !justification.trim()) {
      toast({
        title: "Justificativa Necessária",
        description: "Alterações superiores a 15% requerem justificativa.",
        variant: "destructive"
      });
      return;
    }
    
    setEditingMonth(monthKey);
    setForecastData({ [monthKey]: monthData?.planned || 0 });
  };

  const handleSaveForecast = () => {
    if (!editingMonth) return;
    
    onUpdateForecast?.(forecastData);
    setEditingMonth(null);
    setJustification("");
    
    // Microinteraction: success animation
    toast({
      title: "Previsão Atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleSaveBaseline = () => {
    const baselineData = {
      version: `v${baselines.length + 1}.0`,
      budget: project.budget,
      description: justification || "Nova baseline salva",
      project_id: project.id
    };
    
    onSaveBaseline?.(baselineData);
    setJustification("");
    toast({
      title: "Baseline Salva",
      description: "Nova baseline criada com sucesso.",
    });
  };

  const handleRevertBaseline = () => {
    if (selectedBaseline) {
      onRevertBaseline?.(selectedBaseline);
      toast({
        title: "Baseline Revertida",
        description: "Projeto revertido para baseline selecionada.",
      });
    }
  };

  const exportPlanning = () => {
    const csvContent = monthlyData.map(row => 
      `${row.monthName},${row.planned},${row.realized},${row.variation},${row.variationPercent.toFixed(1)}%`
    ).join('\n');
    
    const blob = new Blob([`Mês,Planejado,Realizado,Variação,Variação %\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planejamento-${project.project_code}.csv`;
    a.click();
    
    toast({
      title: "Exportação Concluída",
      description: "Arquivo de planejamento baixado com sucesso.",
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold">Planejamento Mensal</h3>
            <p className="text-sm text-muted-foreground">Análise detalhada do desempenho financeiro mensal</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportPlanning}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Baseline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Salvar Nova Baseline</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Justificativa para mudança:</label>
                    <Textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Explique o motivo desta alteração de baseline..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSaveBaseline} className="w-full">
                    Confirmar Baseline
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Execução</p>
                  <p className="text-2xl font-bold">{analytics.executionRate}%</p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.totalExecuted}/{analytics.totalPlanned} meses
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border-l-4 ${analytics.criticalCount > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Meses Críticos</p>
                  <p className="text-2xl font-bold">{analytics.criticalCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.watchCount} em observação
                  </p>
                </div>
                {analytics.criticalCount > 0 ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Desvio Médio</p>
                  <p className="text-2xl font-bold">{analytics.avgDeviation}%</p>
                  <p className="text-xs text-muted-foreground">Meses executados</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximo Risco</p>
                  <p className="text-sm font-medium">{analytics.nextRisk}</p>
                  <p className="text-xs text-muted-foreground">Monitoramento</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Months Alert */}
        {analytics.criticalCount > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> {analytics.criticalCount} mês(es) com desvio crítico detectado(s). 
              Recomenda-se revisão do planejamento e implementação de ações corretivas.
            </AlertDescription>
          </Alert>
        )}

        {/* Baseline History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Histórico de Baselines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Select value={selectedBaseline} onValueChange={setSelectedBaseline}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecionar baseline" />
                </SelectTrigger>
                <SelectContent>
                  {baselines.map((baseline) => (
                    <SelectItem key={baseline.id} value={baseline.id}>
                      {baseline.version} - {formatCurrency(baseline.budget)} 
                      ({format(new Date(baseline.created_at), 'dd/MM/yyyy')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={handleRevertBaseline}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reverter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {baselines.slice(0, 3).map((baseline, index) => (
                <Card key={baseline.id} className={index === 0 ? "border-primary" : ""}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{baseline.version}</span>
                      {index === 0 && <Badge>Atual</Badge>}
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(baseline.budget)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(baseline.created_at), 'dd/MM/yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {baseline.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Planning Tables by Status */}
        <div className="space-y-6">
          {/* Executed Months */}
          {groupedData.executed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Meses Executados ({groupedData.executed.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            Planejado
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Valor originalmente planejado para o mês
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            Realizado
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Valor efetivamente gasto no mês
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            Variação
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Diferença entre realizado e planejado (absoluta e %)
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Tendência
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                               <TooltipContent>
                                 <div className="space-y-1">
                                   <p>↑ Gastos crescentes ({'>'}10% vs mês anterior)</p>
                                   <p>↓ Gastos decrescentes ({'<'}10% vs mês anterior)</p>
                                   <p>- Gastos estáveis (±10% vs mês anterior)</p>
                                 </div>
                               </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                        <TableHead>Gráfico</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedData.executed.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.monthName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.planned)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(row.realized)}</TableCell>
                          <TableCell className="text-right">
                            <div className="text-right">
                              <div className={row.variation >= 0 ? "text-red-600" : "text-green-600"}>
                                {formatCurrency(Math.abs(row.variation))}
                              </div>
                              <div className={`text-sm ${row.variation >= 0 ? "text-red-600" : "text-green-600"}`}>
                                {row.variation >= 0 ? "+" : "-"}{Math.abs(row.variationPercent).toFixed(1)}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(row.criticality, row.variationPercent)}</TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                {getTrendIcon(row.trend)}
                              </TooltipTrigger>
                              <TooltipContent>
                                {getTrendTooltip(row.trend)}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell><MiniChart data={row} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Month */}
          {groupedData.current.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Mês Atual ({groupedData.current.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead className="text-right">Planejado</TableHead>
                        <TableHead className="text-right">Realizado</TableHead>
                        <TableHead className="text-right">Variação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tendência</TableHead>
                        <TableHead>Gráfico</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedData.current.map((row) => (
                        <TableRow key={row.month} className="bg-blue-50">
                          <TableCell className="font-medium">{row.monthName}</TableCell>
                          <TableCell className="text-right">
                            {editingMonth === row.month ? (
                              <Input
                                type="number"
                                value={forecastData[row.month] || row.planned}
                                onChange={(e) => setForecastData(prev => ({
                                  ...prev,
                                  [row.month]: parseFloat(e.target.value) || 0
                                }))}
                                className="w-32 text-right bg-white border-blue-300"
                              />
                            ) : (
                              formatCurrency(row.planned)
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(row.realized)}</TableCell>
                          <TableCell className="text-right">
                            <div className="text-right">
                              <div className={row.variation >= 0 ? "text-red-600" : "text-green-600"}>
                                {formatCurrency(Math.abs(row.variation))}
                              </div>
                              <div className={`text-sm ${row.variation >= 0 ? "text-red-600" : "text-green-600"}`}>
                                {row.variation >= 0 ? "+" : "-"}{Math.abs(row.variationPercent).toFixed(1)}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(row.criticality, row.variationPercent)}</TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                {getTrendIcon(row.trend)}
                              </TooltipTrigger>
                              <TooltipContent>
                                {getTrendTooltip(row.trend)}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell><MiniChart data={row} /></TableCell>
                          <TableCell>
                            {editingMonth === row.month ? (
                              <div className="flex gap-1">
                                <Button size="sm" onClick={handleSaveForecast}>
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingMonth(null)}>
                                  ×
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => handleEditForecast(row.month)}>
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Future Months */}
          {groupedData.future.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Meses Futuros ({groupedData.future.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead className="text-right">Planejado</TableHead>
                        <TableHead className="text-right">Realizado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedData.future.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.monthName}</TableCell>
                          <TableCell className="text-right">
                            {editingMonth === row.month ? (
                              <Input
                                type="number"
                                value={forecastData[row.month] || row.planned}
                                onChange={(e) => setForecastData(prev => ({
                                  ...prev,
                                  [row.month]: parseFloat(e.target.value) || 0
                                }))}
                                className="w-32 text-right"
                              />
                            ) : (
                              formatCurrency(row.planned)
                            )}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">-</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">Planejado</Badge>
                          </TableCell>
                          <TableCell>
                            {editingMonth === row.month ? (
                              <div className="flex gap-1">
                                <Button size="sm" onClick={handleSaveForecast}>
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingMonth(null)}>
                                  ×
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => handleEditForecast(row.month)}>
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal - Planejado vs Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <EvolutionChart />
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500 border border-blue-500" style={{borderStyle: 'dashed'}}></div>
                <span>Planejado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                <span>Realizado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Justification for Large Changes */}
        {editingMonth && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Justificativa de Ajuste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Explique o motivo da alteração no planejamento..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="min-h-20"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Esta justificativa será registrada no log de alterações do projeto.
                 {Math.abs((forecastData[editingMonth] || 0) - (monthlyData.find(m => m.month === editingMonth)?.planned || 0)) / (monthlyData.find(m => m.month === editingMonth)?.planned || 1) * 100 > 15 && (
                   <span className="text-orange-600 font-medium"> Justificativa obrigatória para alterações {'>'}15%.</span>
                 )}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}