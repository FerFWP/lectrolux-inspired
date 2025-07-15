import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Calendar, 
  DollarSign,
  Activity,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3,
  Zap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  timestamp: Date;
  data?: any;
  actionable: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface AIInsightsPanelProps {
  projectId?: string;
  dashboardData?: any;
  onInsightAction?: (insight: AIInsight, action: string) => void;
}

export function AIInsightsPanel({ projectId, dashboardData, onInsightAction }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    generateInsights();
  }, [projectId, dashboardData]);

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockInsights: AIInsight[] = [
      {
        id: "1",
        type: "trend",
        title: "Tendência de Aumento de Gastos",
        description: "Detectado aumento consistente de 15% nos gastos mensais nos últimos 3 meses. Padrão pode indicar necessidade de revisão orçamentária.",
        confidence: 0.87,
        impact: "high",
        category: "Financeiro",
        timestamp: new Date(),
        actionable: true,
        actions: [
          { label: "Ver Detalhes", action: () => console.log("View details") },
          { label: "Alertar Gestor", action: () => console.log("Alert manager") }
        ]
      },
      {
        id: "2",
        type: "anomaly",
        title: "Anomalia em Projeto TI",
        description: "Projeto 'Sistema ERP' apresenta desvio atípico de 35% acima do orçado. Requer atenção imediata.",
        confidence: 0.94,
        impact: "high",
        category: "Risco",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actionable: true,
        actions: [
          { label: "Investigar", action: () => console.log("Investigate") },
          { label: "Criar Alerta", action: () => console.log("Create alert") }
        ]
      },
      {
        id: "3",
        type: "prediction",
        title: "Previsão de Orçamento",
        description: "Com base no padrão atual, há 78% de probabilidade de estourar o orçamento em 2 meses. Recomenda-se ação preventiva.",
        confidence: 0.78,
        impact: "medium",
        category: "Planejamento",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        actionable: true,
        actions: [
          { label: "Ajustar Previsão", action: () => console.log("Adjust forecast") },
          { label: "Revisar Orçamento", action: () => console.log("Review budget") }
        ]
      },
      {
        id: "4",
        type: "recommendation",
        title: "Oportunidade de Economia",
        description: "Identificadas 3 categorias de gastos com potencial de redução de 12% sem impacto na qualidade.",
        confidence: 0.82,
        impact: "medium",
        category: "Otimização",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        actionable: true,
        actions: [
          { label: "Ver Oportunidades", action: () => console.log("View opportunities") },
          { label: "Implementar", action: () => console.log("Implement") }
        ]
      },
      {
        id: "5",
        type: "alert",
        title: "Variação Cambial Crítica",
        description: "Taxa USD/BRL variou 8% esta semana, impactando projetos internacionais. Necessário hedge ou revisão de contratos.",
        confidence: 0.96,
        impact: "high",
        category: "Câmbio",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        actionable: true,
        actions: [
          { label: "Analisar Impacto", action: () => console.log("Analyze impact") },
          { label: "Revisar Contratos", action: () => console.log("Review contracts") }
        ]
      }
    ];

    setInsights(mockInsights);
    setLoading(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      case 'prediction': return <Target className="h-4 w-4" />;
      case 'recommendation': return <Sparkles className="h-4 w-4" />;
      case 'alert': return <Zap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-50';
      case 'anomaly': return 'text-red-600 bg-red-50';
      case 'prediction': return 'text-purple-600 bg-purple-50';
      case 'recommendation': return 'text-green-600 bg-green-50';
      case 'alert': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleInsightFeedback = (insightId: string, feedback: 'positive' | 'negative') => {
    console.log(`Feedback for insight ${insightId}: ${feedback}`);
    // In real app, send feedback to AI system
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold">Insights de IA</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateInsights}
          disabled={loading}
          className="gap-2"
        >
          <Activity className="h-4 w-4" />
          {loading ? 'Analisando...' : 'Atualizar'}
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
                <div>
                  <p className="font-medium">IA analisando dados...</p>
                  <p className="text-sm text-muted-foreground">
                    Detectando tendências e anomalias
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{insight.category}</Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'} impacto
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(insight.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {(insight.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">confiança</div>
                    </div>
                    <Progress 
                      value={insight.confidence * 100} 
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{insight.description}</p>
                
                {insight.actionable && insight.actions && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {insight.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={action.action}
                            className="gap-2"
                          >
                            <Eye className="h-3 w-3" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground mr-2">
                          Útil?
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInsightFeedback(insight.id, 'positive')}
                          className="h-8 w-8 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInsightFeedback(insight.id, 'negative')}
                          className="h-8 w-8 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Resumo de Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {insights.filter(i => i.type === 'alert').length}
              </div>
              <div className="text-sm text-muted-foreground">Alertas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {insights.filter(i => i.type === 'trend').length}
              </div>
              <div className="text-sm text-muted-foreground">Tendências</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {insights.filter(i => i.type === 'recommendation').length}
              </div>
              <div className="text-sm text-muted-foreground">Recomendações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {insights.filter(i => i.impact === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Alto Impacto</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}