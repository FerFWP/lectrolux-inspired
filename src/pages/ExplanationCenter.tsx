import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Copy, Mail, RefreshCw, BookOpen } from "lucide-react";

const commonMetrics = [
  { id: "cpi", name: "CPI", description: "Cost Performance Index" },
  { id: "npv", name: "NPV", description: "Net Present Value" },
  { id: "roi", name: "ROI", description: "Return on Investment" },
  { id: "eva", name: "EVA", description: "Economic Value Added" },
  { id: "payback", name: "Payback", description: "Payback Period" },
  { id: "bu", name: "BU", description: "Budget Utilization" },
  { id: "capex", name: "Capex/Opex", description: "Capital/Operational Expenditure" }
];

export default function ExplanationCenter() {
  const [query, setQuery] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMetricSelect = (metric: typeof commonMetrics[0]) => {
    setQuery(`Explique o cálculo e conceito de ${metric.name} (${metric.description})`);
  };

  const handleGenerateExplanation = async () => {
    if (!query.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite ou selecione uma métrica para explicar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('explain-indicator', {
        body: { query: query.trim() }
      });

      if (error) throw error;

      setExplanation(data.explanation);
      toast({
        title: "Explicação gerada",
        description: "A explicação foi gerada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar explicação:', error);
      toast({
        title: "Erro ao gerar explicação",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyExplanation = () => {
    navigator.clipboard.writeText(explanation);
    toast({
      title: "Copiado!",
      description: "A explicação foi copiada para a área de transferência.",
    });
  };

  const handleShareByEmail = () => {
    const subject = "Explicação de Indicador - Sistema de Gestão Financeira";
    const body = `Consulta: ${query}\n\nExplicação:\n${explanation}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Explicações de Indicadores</h1>
          <p className="text-muted-foreground mt-1">
            Tire dúvidas sobre qualquer indicador, fórmula ou conceito do sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Consultar Indicador
              </CardTitle>
              <CardDescription>
                Digite sua dúvida ou selecione uma métrica comum abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="query">Métrica ou Conceito</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="query"
                        placeholder="Ex: 'Explique o cálculo do CPI deste projeto'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>As explicações são baseadas na documentação oficial do sistema e práticas de mercado.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Métricas Comuns</Label>
                <div className="flex flex-wrap gap-2">
                  {commonMetrics.map((metric) => (
                    <Badge
                      key={metric.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleMetricSelect(metric)}
                    >
                      {metric.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerateExplanation}
                disabled={isLoading || !query.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Gerando explicação...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Gerar Explicação
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Explicação</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyExplanation}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareByEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Consulta:</strong> {query}
                  </p>
                  <Textarea
                    value={explanation}
                    readOnly
                    className="min-h-[200px] bg-background"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas de Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <p>Use linguagem natural para suas perguntas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <p>Seja específico sobre qual projeto ou contexto</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <p>Clique nas métricas comuns para consulta rápida</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <p>Compartilhe explicações com sua equipe</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exemplos de Consultas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                   onClick={() => setQuery("Como calcular o CPI de um projeto específico?")}>
                "Como calcular o CPI de um projeto específico?"
              </div>
              <div className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                   onClick={() => setQuery("Qual a diferença entre Capex e Opex?")}>
                "Qual a diferença entre Capex e Opex?"
              </div>
              <div className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                   onClick={() => setQuery("Explique o conceito de EVA no contexto de projetos")}>
                "Explique o conceito de EVA no contexto de projetos"
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}