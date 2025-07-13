import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, addMonths } from "date-fns";
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
  Plus
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useToast } from "@/components/ui/use-toast";

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
    const symbols = { BRL: "R$", USD: "$", EUR: "€", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Generate monthly data
  const generateMonthlyData = () => {
    const startDate = project.start_date ? new Date(project.start_date) : subMonths(new Date(), 6);
    const endDate = project.deadline ? new Date(project.deadline) : addMonths(new Date(), 6);
    
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
      
      return {
        month: monthKey,
        monthName: format(month, 'MMM yyyy', { locale: ptBR }),
        planned,
        realized,
        variation,
        variationPercent,
        status: Math.abs(variationPercent) > 20 ? 'critical' : Math.abs(variationPercent) > 10 ? 'warning' : 'ok'
      };
    });
  };

  const monthlyData = generateMonthlyData();

  const getStatusBadge = (status: string, variationPercent: number) => {
    if (status === 'critical') {
      return <Badge variant="destructive" className="text-xs">Crítico</Badge>;
    }
    if (status === 'warning') {
      return <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">Alerta</Badge>;
    }
    return <Badge variant="outline" className="text-xs border-green-500 text-green-600">OK</Badge>;
  };

  const MiniChart = ({ data }: { data: any }) => {
    const chartData = [
      { name: 'Planejado', value: data.planned, fill: '#3b82f6' },
      { name: 'Realizado', value: data.realized, fill: data.realized > data.planned ? '#ef4444' : '#10b981' }
    ];

    return (
      <div className="w-24 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const handleEditForecast = (monthKey: string) => {
    setEditingMonth(monthKey);
    const monthData = monthlyData.find(m => m.month === monthKey);
    setForecastData({ [monthKey]: monthData?.planned || 0 });
  };

  const handleSaveForecast = () => {
    onUpdateForecast?.(forecastData);
    setEditingMonth(null);
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
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Planejamento e Forecast</h3>
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

        {/* Monthly Planning Table */}
        <Card>
          <CardHeader>
            <CardTitle>Planejamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Mês
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Período de referência para o planejamento
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        Planejado
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Valor planejado para desembolso no mês
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
                    <TableHead>Tendência</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map((row) => (
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
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.realized)}
                      </TableCell>
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
                      <TableCell>
                        {getStatusBadge(row.status, row.variationPercent)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MiniChart data={row} />
                          {row.variation > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : row.variation < 0 ? (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          ) : null}
                        </div>
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

        {/* Adjustment Justification */}
        {editingMonth && (
          <Card>
            <CardHeader>
              <CardTitle>Justificativa de Ajuste</CardTitle>
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
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}