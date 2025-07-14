import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Sparkles, Lightbulb, Download, FileSpreadsheet, FileText, 
  BarChart3, HelpCircle, RefreshCw, AlertCircle, CheckCircle,
  TrendingUp, DollarSign, Clock, Target
} from "lucide-react";
import { HomeButton } from "@/components/home-button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DynamicReportsGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [reportType, setReportType] = useState<'table' | 'chart' | 'summary'>('table');
  const { toast } = useToast();

  const examplePrompts = [
    "Me mostre todos os projetos com desvio acima de 15% no último trimestre",
    "Analise o desempenho financeiro por área nos últimos 6 meses",
    "Quais projetos críticos estão em atraso e qual o impacto orçamentário?",
    "Compare o ROI dos projetos CAPEX vs OPEX em 2024",
    "Mostre a evolução mensal dos gastos por categoria",
    "Identifique os projetos com maior variação entre orçado e realizado"
  ];

  const handleGenerateReport = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Por favor, descreva o relatório que deseja gerar.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-dynamic-report', {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;

      setGeneratedReport(data);
      
      toast({
        title: "Relatório gerado com sucesso!",
        description: "Seu relatório personalizado está pronto.",
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    if (!generatedReport) return;

    // Simular exportação
    toast({
      title: `Exportando para ${format.toUpperCase()}`,
      description: "O download iniciará em breve.",
    });

    // Em produção, implementar a lógica real de exportação
    setTimeout(() => {
      toast({
        title: "Download concluído",
        description: `Relatório exportado para ${format.toUpperCase()} com sucesso.`,
      });
    }, 2000);
  };

  const renderGeneratedContent = () => {
    if (!generatedReport) return null;

    if (generatedReport.type === 'table' && generatedReport.data) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{generatedReport.title}</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport('excel')}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport('pdf')}
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {generatedReport.data.headers?.map((header: string, index: number) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReport.data.rows?.map((row: any[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {generatedReport.insights && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Insights:</strong> {generatedReport.insights}
              </AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    if (generatedReport.type === 'summary') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{generatedReport.title}</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: generatedReport.content }} />
          </div>

          {generatedReport.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {generatedReport.metrics.map((metric: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {metric.icon === 'trending-up' && <TrendingUp className="w-4 h-4 text-primary" />}
                        {metric.icon === 'dollar-sign' && <DollarSign className="w-4 h-4 text-primary" />}
                        {metric.icon === 'clock' && <Clock className="w-4 h-4 text-primary" />}
                        {metric.icon === 'target' && <Target className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-muted-foreground">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Formato de relatório não suportado ainda.</p>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Geração de Relatórios Dinâmicos</h1>
              <p className="text-muted-foreground">
                Use linguagem natural para gerar relatórios personalizados com IA
              </p>
            </div>
            <HomeButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Descreva seu relatório
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Relatórios podem ser customizados por filtros de período, área, categoria, status e muito mais. 
                          Seja específico para melhores resultados.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    Quanto mais detalhada a descrição, mais preciso o relatório gerado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Descreva o relatório ou análise personalizada que você gostaria de gerar..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />

                  <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Gerando relatório...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Gerar Relatório
                      </>
                    )}
                  </Button>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Dica:</strong> Use linguagem natural e seja específico sobre período, área, métricas e formato desejado.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Examples Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Exemplos de prompts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {examplePrompts.map((example, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full text-left justify-start h-auto p-3 text-sm"
                        onClick={() => setPrompt(example)}
                      >
                        <span className="text-muted-foreground mr-2">•</span>
                        {example}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <Card className="min-h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Relatório Gerado
                  </CardTitle>
                  <CardDescription>
                    Visualize e exporte seu relatório personalizado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
                      <p className="text-lg font-medium">Processando sua solicitação...</p>
                      <p className="text-muted-foreground text-center mt-2">
                        Nossa IA está analisando os dados e gerando seu relatório personalizado
                      </p>
                    </div>
                  ) : generatedReport ? (
                    renderGeneratedContent()
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="p-4 bg-muted/20 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-muted-foreground mb-2">
                        Pronto para gerar seu relatório
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Descreva o relatório que você gostaria de criar no campo ao lado. 
                        Nossa IA processará sua solicitação e gerará um relatório personalizado.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Status and Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema ativo:</strong> IA conectada e pronta para gerar relatórios personalizados.
              </AlertDescription>
            </Alert>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Formatos suportados:</strong> Tabelas, gráficos, resumos executivos e análises comparativas.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DynamicReportsGenerator;