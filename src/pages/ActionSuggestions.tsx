import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Lightbulb, RefreshCw, HelpCircle, AlertTriangle, CheckCircle,
  TrendingUp, DollarSign, Clock, Target, Eye, ChevronRight,
  Brain, Zap, Activity, ArrowRight, Info
} from "lucide-react";
import { HomeButton } from "@/components/home-button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'financial' | 'timeline' | 'risk' | 'opportunity' | 'governance';
  action: string;
  impact: string;
  data_source: string[];
  created_at: string;
}

const ActionSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const loadSuggestions = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-action-suggestions', {
        body: {}
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
      setLastUpdate(new Date());
      
      toast({
        title: "Sugestões atualizadas",
        description: `${data.suggestions?.length || 0} recomendações geradas com base nos dados atuais.`,
      });

    } catch (error) {
      console.error('Error loading suggestions:', error);
      toast({
        title: "Erro ao carregar sugestões",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { 
          badge: 'destructive', 
          icon: AlertTriangle, 
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
          label: 'Crítico'
        };
      case 'high':
        return { 
          badge: 'default', 
          icon: TrendingUp, 
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
          label: 'Alto'
        };
      case 'medium':
        return { 
          badge: 'secondary', 
          icon: Eye, 
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
          label: 'Médio'
        };
      default:
        return { 
          badge: 'outline', 
          icon: Info, 
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800',
          label: 'Baixo'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'financial':
        return { icon: DollarSign, label: 'Financeiro', color: 'text-green-600' };
      case 'timeline':
        return { icon: Clock, label: 'Cronograma', color: 'text-blue-600' };
      case 'risk':
        return { icon: AlertTriangle, label: 'Risco', color: 'text-red-600' };
      case 'opportunity':
        return { icon: TrendingUp, label: 'Oportunidade', color: 'text-emerald-600' };
      case 'governance':
        return { icon: Target, label: 'Governança', color: 'text-purple-600' };
      default:
        return { icon: Activity, label: 'Geral', color: 'text-gray-600' };
    }
  };

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedSuggestions = suggestions.sort((a, b) => 
    priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
  );

  const criticalCount = suggestions.filter(s => s.priority === 'critical').length;
  const highCount = suggestions.filter(s => s.priority === 'high').length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sugestão de Ações</h1>
              <p className="text-muted-foreground">
                Painel com recomendações e alertas automáticos baseados em IA
              </p>
            </div>
            <HomeButton />
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{suggestions.length}</p>
                    <p className="text-sm text-muted-foreground">Sugestões Ativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                    <p className="text-sm text-muted-foreground">Críticas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-orange-600">{highCount}</p>
                    <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <RefreshCw className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium">Última Atualização</p>
                    <p className="text-xs text-muted-foreground">
                      {lastUpdate ? lastUpdate.toLocaleString('pt-BR') : 'Nunca'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Inteligência Artificial de Portfólio
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          As recomendações são baseadas em dados atuais e perguntas frequentes. 
                          A IA monitora tendências, alertas e oportunidades de ajuste no portfólio.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    A IA monitora tendências, alertas e oportunidades de ajuste no portfólio.
                  </CardDescription>
                </div>
                <Button 
                  onClick={loadSuggestions}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar Sugestões
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-lg font-medium">Analisando dados do portfólio...</p>
                    <p className="text-muted-foreground text-center mt-2">
                      Nossa IA está processando projetos, transações e métricas para gerar recomendações personalizadas
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : suggestions.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Portfólio em boa forma!</h3>
                    <p className="text-muted-foreground">
                      Não foram identificadas ações críticas no momento. Continue monitorando.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              sortedSuggestions.map((suggestion) => {
                const priorityConfig = getPriorityConfig(suggestion.priority);
                const categoryConfig = getCategoryConfig(suggestion.category);
                const PriorityIcon = priorityConfig.icon;
                const CategoryIcon = categoryConfig.icon;

                return (
                  <Card key={suggestion.id} className={`${priorityConfig.bg} border-l-4`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-background ${priorityConfig.color}`}>
                            <PriorityIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={priorityConfig.badge as any} className="text-xs">
                                {priorityConfig.label}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CategoryIcon className={`w-3 h-3 ${categoryConfig.color}`} />
                                {categoryConfig.label}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {suggestion.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Ação Recomendada:</p>
                            <p className="text-sm text-muted-foreground">{suggestion.action}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Impacto Esperado:</p>
                            <p className="text-sm text-muted-foreground">{suggestion.impact}</p>
                          </div>
                        </div>

                        {suggestion.data_source && suggestion.data_source.length > 0 && (
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <Activity className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Baseado em: {suggestion.data_source.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Como funciona:</strong> A IA analisa continuamente dados de projetos, transações, 
              baselines e métricas de desempenho para identificar padrões, riscos e oportunidades de melhoria no portfólio.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ActionSuggestions;