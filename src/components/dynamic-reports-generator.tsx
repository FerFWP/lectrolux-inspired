import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  FileText, 
  Download, 
  BarChart3, 
  Sparkles, 
  Send,
  Clock,
  CheckCircle,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  PieChart,
  Table
} from "lucide-react";
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

interface GeneratedReport {
  id: string;
  title: string;
  prompt: string;
  type: 'table' | 'chart' | 'summary' | 'analysis';
  data: any;
  generatedAt: Date;
  exportFormats: string[];
}

interface DynamicReportsGeneratorProps {
  projectId?: string;
  onReportGenerated?: (report: GeneratedReport) => void;
}

export function DynamicReportsGenerator({ projectId, onReportGenerated }: DynamicReportsGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [reportType, setReportType] = useState<'auto' | 'table' | 'chart' | 'summary'>('auto');
  const [savedReports, setSavedReports] = useState<GeneratedReport[]>([]);
  const { toast } = useToast();

  const examplePrompts = [
    "Mostre o top 5 projetos com maior desvio orçamentário",
    "Crie um gráfico com a evolução mensal dos gastos por categoria",
    "Analise quais áreas estão mais acima do orçamento",
    "Gere um resumo dos projetos críticos e suas justificativas",
    "Compare o desempenho financeiro entre diferentes departamentos"
  ];

  const handleGenerateReport = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Por favor, descreva o relatório que deseja gerar",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock report based on prompt
      const mockReport = generateMockReport(prompt);
      
      setGeneratedReport(mockReport);
      setSavedReports(prev => [mockReport, ...prev]);
      
      toast({
        title: "Relatório gerado",
        description: "Relatório criado com sucesso via IA",
      });
      
      onReportGenerated?.(mockReport);
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReport = (prompt: string): GeneratedReport => {
    const reportId = `report-${Date.now()}`;
    
    // Determine report type based on prompt
    let type: 'table' | 'chart' | 'summary' | 'analysis' = 'summary';
    if (prompt.toLowerCase().includes('gráfico') || prompt.toLowerCase().includes('evolução')) {
      type = 'chart';
    } else if (prompt.toLowerCase().includes('top') || prompt.toLowerCase().includes('lista')) {
      type = 'table';
    } else if (prompt.toLowerCase().includes('analise') || prompt.toLowerCase().includes('compare')) {
      type = 'analysis';
    }

    let data: any = {};
    
    switch (type) {
      case 'table':
        data = {
          columns: ['Projeto', 'Orçamento', 'Realizado', 'Desvio', 'Status'],
          rows: [
            ['Sistema ERP', 'R$ 450.000', 'R$ 520.000', '+15.5%', 'Crítico'],
            ['App Mobile', 'R$ 180.000', 'R$ 195.000', '+8.3%', 'Atenção'],
            ['Portal Cliente', 'R$ 280.000', 'R$ 295.000', '+5.4%', 'OK'],
            ['Automação', 'R$ 150.000', 'R$ 140.000', '-6.7%', 'OK'],
            ['CRM', 'R$ 220.000', 'R$ 235.000', '+6.8%', 'Atenção']
          ]
        };
        break;
        
      case 'chart':
        data = {
          chartType: 'bar',
          data: [
            { name: 'Jan', valor: 180000 },
            { name: 'Fev', valor: 220000 },
            { name: 'Mar', valor: 280000 },
            { name: 'Abr', valor: 310000 },
            { name: 'Mai', valor: 350000 },
            { name: 'Jun', valor: 400000 }
          ]
        };
        break;
        
      case 'summary':
        data = {
          insights: [
            'Total de 12 projetos analisados',
            '3 projetos com desvio crítico (>15%)',
            'Área de TI concentra 60% dos desvios',
            'Economia potencial identificada: R$ 45.000'
          ],
          metrics: {
            totalProjects: 12,
            criticalProjects: 3,
            totalBudget: 2500000,
            totalRealized: 2180000,
            deviation: 12.8
          }
        };
        break;
        
      case 'analysis':
        data = {
          analysis: `Análise detalhada baseada no prompt: "${prompt}"\n\n` +
                   `1. Situação Atual:\n` +
                   `- Portfólio com 12 projetos ativos\n` +
                   `- Orçamento total: R$ 2.5M\n` +
                   `- Realizado: R$ 2.18M (87%)\n\n` +
                   `2. Principais Achados:\n` +
                   `- Desvio médio de 12.8%\n` +
                   `- 3 projetos em situação crítica\n` +
                   `- Área de TI com maior concentração de problemas\n\n` +
                   `3. Recomendações:\n` +
                   `- Revisar orçamento dos projetos críticos\n` +
                   `- Implementar controles mais rigorosos\n` +
                   `- Considerar realocação de recursos`,
          recommendations: [
            'Revisar processo de aprovação orçamentária',
            'Implementar checkpoints mensais',
            'Criar alertas automáticos para desvios >10%'
          ]
        };
        break;
    }

    return {
      id: reportId,
      title: generateReportTitle(prompt),
      prompt,
      type,
      data,
      generatedAt: new Date(),
      exportFormats: ['pdf', 'excel', 'csv']
    };
  };

  const generateReportTitle = (prompt: string): string => {
    if (prompt.toLowerCase().includes('top')) return 'Ranking de Projetos';
    if (prompt.toLowerCase().includes('gráfico')) return 'Análise Gráfica';
    if (prompt.toLowerCase().includes('compare')) return 'Análise Comparativa';
    if (prompt.toLowerCase().includes('resumo')) return 'Resumo Executivo';
    return 'Relatório Personalizado';
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast({
      title: "Exportando relatório",
      description: `Gerando arquivo ${format.toUpperCase()}...`,
    });
    
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: `Relatório exportado para ${format.toUpperCase()}`,
      });
    }, 2000);
  };

  const renderGeneratedContent = () => {
    if (!generatedReport) return null;

    switch (generatedReport.type) {
      case 'table':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Dados Tabulares</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleExport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
            <TableComponent>
              <TableHeader>
                <TableRow>
                  {generatedReport.data.columns.map((col: string, index: number) => (
                    <TableHead key={index}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReport.data.rows.map((row: string[], index: number) => (
                  <TableRow key={index}>
                    {row.map((cell: string, cellIndex: number) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </TableComponent>
          </div>
        );

      case 'chart':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Visualização Gráfica</h4>
              <Button size="sm" variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generatedReport.data.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="valor" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Resumo Executivo</h4>
              <Button size="sm" variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{generatedReport.data.metrics.totalProjects}</div>
                  <div className="text-sm text-muted-foreground">Total Projetos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-red-600">{generatedReport.data.metrics.criticalProjects}</div>
                  <div className="text-sm text-muted-foreground">Críticos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    {generatedReport.data.metrics.deviation}%
                  </div>
                  <div className="text-sm text-muted-foreground">Desvio Médio</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">
                    R$ {(generatedReport.data.metrics.totalBudget / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Orçamento Total</div>
                </CardContent>
              </Card>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h5 className="font-medium mb-2">Principais Insights:</h5>
              <ul className="list-disc list-inside space-y-1">
                {generatedReport.data.insights.map((insight: string, index: number) => (
                  <li key={index} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Análise Detalhada</h4>
              <Button size="sm" variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{generatedReport.data.analysis}</pre>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2 text-blue-900">Recomendações:</h5>
              <ul className="list-disc list-inside space-y-1">
                {generatedReport.data.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-blue-800">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-semibold">Relatórios Dinâmicos</h3>
      </div>

      {/* Prompt Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Gerador de Relatórios via IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Descreva o relatório que deseja gerar</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Mostre um gráfico com a evolução mensal dos gastos por categoria"
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Exemplos:</span>
            {examplePrompts.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => setPrompt(example)}
              >
                {example}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (IA decide)</SelectItem>
                  <SelectItem value="table">Tabela</SelectItem>
                  <SelectItem value="chart">Gráfico</SelectItem>
                  <SelectItem value="summary">Resumo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || !prompt.trim()}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              {generatedReport.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{generatedReport.type}</Badge>
              <span>Gerado em {generatedReport.generatedAt.toLocaleString('pt-BR')}</span>
            </div>
          </CardHeader>
          <CardContent>
            {renderGeneratedContent()}
          </CardContent>
        </Card>
      )}

      {/* Saved Reports */}
      {savedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Relatórios Salvos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.prompt}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.generatedAt.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}