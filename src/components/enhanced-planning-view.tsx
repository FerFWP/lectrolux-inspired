import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, addMonths, isBefore, isAfter, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  Edit3, 
  RotateCcw, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  Sparkles,
  MessageSquare,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BaselineDialog } from "@/components/baseline-dialog";

interface EnhancedPlanningViewProps {
  project: any;
  baselines: any[];
  transactions: any[];
  onUpdateForecast?: (data: any) => void;
  onSaveBaseline?: (data: any) => void;
  onRevertBaseline?: (baselineId: string) => void;
}

interface AIRecommendation {
  id: string;
  type: 'forecast' | 'baseline' | 'seasonality' | 'adjustment';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  suggestedValue?: number;
  reasoning: string;
  monthsAffected?: string[];
}

interface MonthlyForecast {
  month: string;
  planned: number;
  forecast: number;
  confidence: number;
  hasDeviation: boolean;
  deviationPercent: number;
  justification?: string;
  aiSuggestion?: AIRecommendation;
}

export function EnhancedPlanningView({ 
  project, 
  baselines, 
  transactions, 
  onUpdateForecast, 
  onSaveBaseline, 
  onRevertBaseline 
}: EnhancedPlanningViewProps) {
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<any>({});
  const [monthlyForecasts, setMonthlyForecasts] = useState<MonthlyForecast[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [justification, setJustification] = useState("");
  const [selectedBaseline, setSelectedBaseline] = useState(baselines[0]?.id || "");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Generate AI recommendations
  const generateAIRecommendations = async () => {
    setProcessingAI(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const recommendations: AIRecommendation[] = [
      {
        id: "1",
        type: "forecast",
        title: "Ajuste de Previsão - Março",
        description: "Baseado no histórico, sugere-se aumentar previsão de março em 15%",
        confidence: 0.87,
        impact: "medium",
        suggestedValue: 322000,
        reasoning: "Padrão histórico mostra aumento de gastos no trimestre. Similares projetos tiveram pico em março.",
        monthsAffected: ["2025-03"]
      },
      {
        id: "2",
        type: "seasonality",
        title: "Sazonalidade Detectada",
        description: "Padrão sazonal identificado nos meses de junho-agosto",
        confidence: 0.92,
        impact: "high",
        reasoning: "Análise de projetos similares mostra redução de 20% nos gastos durante período de férias.",
        monthsAffected: ["2025-06", "2025-07", "2025-08"]
      },
      {
        id: "3",
        type: "baseline",
        title: "Nova Baseline Recomendada",
        description: "Dados atuais sugerem criação de nova baseline com orçamento ajustado",
        confidence: 0.78,
        impact: "high",
        suggestedValue: 2650000,
        reasoning: "Desvios consistentes indicam necessidade de reajuste orçamentário para manter controle."
      },
      {
        id: "4",
        type: "adjustment",
        title: "Redistribuição Trimestral",
        description: "Sugestão de redistribuição de valores entre Q2 e Q3",
        confidence: 0.85,
        impact: "medium",
        reasoning: "Otimização do fluxo de caixa baseada em padrões de execução históricos.",
        monthsAffected: ["2025-04", "2025-05", "2025-06"]
      }
    ];
    
    setAiRecommendations(recommendations);
    setProcessingAI(false);
    
    toast({
      title: "Recomendações geradas",
      description: `${recommendations.length} sugestões de IA disponíveis`,
    });
  };

  // Generate monthly data with AI enhancements
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
      const planned = project.budget / months.length;
      const forecast = forecastData[monthKey] || planned;
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
      
      // AI confidence calculation
      const confidence = Math.max(0.6, 1 - (Math.abs(variationPercent) / 100));
      
      // Check for AI recommendations
      const aiSuggestion = aiRecommendations.find(rec => 
        rec.monthsAffected?.includes(monthKey)
      );
      
      const hasDeviation = Math.abs(forecast - planned) / planned > 0.15;
      
      return {
        month: monthKey,
        monthName: format(month, 'MMM yyyy', { locale: ptBR }),
        monthShort: format(month, 'MMM', { locale: ptBR }),
        planned,
        forecast,
        realized,
        variation,
        variationPercent,
        status,
        criticality,
        confidence,
        hasDeviation,
        deviationPercent: ((forecast - planned) / planned) * 100,
        aiSuggestion,
        executionRate: planned > 0 ? (realized / planned) * 100 : 0
      };
    });
  };

  const monthlyData = generateMonthlyData();

  const handleEditForecast = (monthKey: string) => {
    const monthData = monthlyData.find(m => m.month === monthKey);
    if (!monthData) return;
    
    setEditingMonth(monthKey);
    setForecastData(prev => ({ ...prev, [monthKey]: monthData.forecast }));
  };

  const handleSaveForecast = () => {
    if (!editingMonth) return;
    
    const monthData = monthlyData.find(m => m.month === editingMonth);
    if (!monthData) return;
    
    const newValue = forecastData[editingMonth];
    const changePercent = Math.abs((newValue - monthData.planned) / monthData.planned) * 100;
    
    // Require justification for changes > 15%
    if (changePercent > 15 && !justification.trim()) {
      toast({
        title: "Justificativa Necessária",
        description: "Alterações superiores a 15% requerem justificativa obrigatória.",
        variant: "destructive"
      });
      return;
    }
    
    onUpdateForecast?.(forecastData);
    setEditingMonth(null);
    setJustification("");
    
    toast({
      title: "Previsão Atualizada",
      description: `Previsão do mês ${monthData.monthName} atualizada com sucesso.`,
    });
  };

  const handleApplyAIRecommendation = (recommendation: AIRecommendation) => {
    if (recommendation.type === 'forecast' && recommendation.suggestedValue) {
      const monthKey = recommendation.monthsAffected?.[0];
      if (monthKey) {
        setForecastData(prev => ({
          ...prev,
          [monthKey]: recommendation.suggestedValue
        }));
        
        toast({
          title: "Recomendação aplicada",
          description: `Previsão ajustada conforme sugestão da IA`,
        });
      }
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header with AI Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold">Planejamento Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              Planejamento mensal com sugestões de IA e ajustes automáticos
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={generateAIRecommendations}
              disabled={processingAI}
              className="gap-2"
            >
              {processingAI ? (
                <>
                  <Bot className="h-4 w-4 animate-pulse" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar Recomendações IA
                </>
              )}
            </Button>
            <BaselineDialog 
              projectId={project.id} 
              onBaselineAdded={() => onSaveBaseline?.({
                project_id: project.id,
                version: `v${baselines.length + 1}.0`,
                budget: project.budget,
                description: "Nova baseline criada via IA"
              })}
            />
          </div>
        </div>

        {/* AI Recommendations Panel */}
        {aiRecommendations.length > 0 && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                Recomendações de IA ({aiRecommendations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(rec.impact)}>
                          {rec.impact === 'high' ? 'Alto' : rec.impact === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                        <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                      <strong>Justificativa:</strong> {rec.reasoning}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Tipo: {rec.type === 'forecast' ? 'Previsão' : 
                               rec.type === 'baseline' ? 'Baseline' : 
                               rec.type === 'seasonality' ? 'Sazonalidade' : 'Ajuste'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplyAIRecommendation(rec)}
                          disabled={!rec.suggestedValue}
                        >
                          Aplicar
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dispensar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Planning Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Planejamento Mensal Detalhado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Planejado</TableHead>
                    <TableHead>Previsão</TableHead>
                    <TableHead>Realizado</TableHead>
                    <TableHead>Confiança IA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">{month.monthName}</TableCell>
                      <TableCell>{formatCurrency(month.planned)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {editingMonth === month.month ? (
                            <Input
                              type="number"
                              value={forecastData[month.month] || month.forecast}
                              onChange={(e) => setForecastData(prev => ({
                                ...prev,
                                [month.month]: parseFloat(e.target.value) || 0
                              }))}
                              className="w-32"
                            />
                          ) : (
                            <span className={month.hasDeviation ? 'text-orange-600 font-medium' : ''}>
                              {formatCurrency(month.forecast)}
                            </span>
                          )}
                          {month.hasDeviation && (
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Desvio de {month.deviationPercent.toFixed(1)}%</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(month.realized)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={getConfidenceColor(month.confidence)}>
                            {(month.confidence * 100).toFixed(0)}%
                          </span>
                          {month.aiSuggestion && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Sparkles className="h-4 w-4 text-purple-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sugestão IA disponível</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={month.status === 'executed' ? 'default' : 
                                  month.status === 'current' ? 'secondary' : 'outline'}
                        >
                          {month.status === 'executed' ? 'Executado' : 
                           month.status === 'current' ? 'Atual' : 'Futuro'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {editingMonth === month.month ? (
                            <>
                              <Button 
                                size="sm" 
                                onClick={handleSaveForecast}
                                className="gap-1"
                              >
                                <Save className="h-3 w-3" />
                                Salvar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingMonth(null)}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditForecast(month.month)}
                              disabled={month.status === 'executed'}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Justification Dialog */}
        {editingMonth && (
          <Dialog open={!!editingMonth} onOpenChange={() => setEditingMonth(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Justificativa para Alteração</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Justificativa (obrigatória para desvios &gt; 15%)</Label>
                  <Textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Explique o motivo da alteração na previsão"
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingMonth(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveForecast}>
                    Salvar Alteração
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
}