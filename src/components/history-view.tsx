import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  History, 
  Download, 
  Eye, 
  RotateCcw, 
  FileText, 
  User, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface HistoryViewProps {
  project: any;
  transactions: any[];
  baselines: any[];
  selectedCurrency?: string;
  selectedYear?: string;
}

export function HistoryView({ project, transactions, baselines, selectedCurrency, selectedYear }: HistoryViewProps) {
  const [selectedBaseline, setSelectedBaseline] = useState<any>(null);
  const { toast } = useToast();
  
  const handleRestoreBaseline = (baseline: any) => {
    console.log('Restore baseline:', baseline.id);
    toast({
      title: "Baseline Restaurada",
      description: `Projeto revertido para ${baseline.version}`,
    });
  };

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Mock data for decision log
  const decisionLog = [
    {
      id: "dec-1",
      date: new Date("2024-12-01"),
      type: "budget_increase",
      title: "Aumento de Orçamento - Escopo Adicional",
      description: "Aprovação para inclusão de módulo de BI no projeto",
      approved_by: "Maria Santos",
      amount_change: 200000,
      documents: ["Ata_Reuniao_001.pdf", "Proposta_BI.pdf"]
    },
    {
      id: "dec-2", 
      date: new Date("2024-09-15"),
      type: "scope_change",
      title: "Mudança de Escopo - Integração SAP",
      description: "Inclusão de integração com sistema legado SAP",
      approved_by: "João Silva",
      amount_change: 100000,
      documents: ["Analise_Tecnica_SAP.pdf"]
    },
    {
      id: "dec-3",
      date: new Date("2024-06-01"),
      type: "project_start",
      title: "Início do Projeto",
      description: "Aprovação inicial do projeto e baseline",
      approved_by: "Carlos Lima",
      amount_change: 1000000,
      documents: ["Contrato_Inicial.pdf", "Cronograma_V1.pdf"]
    }
  ];

  // Prepare chart data
  const chartData = baselines.map((baseline, index) => ({
    version: baseline.version,
    budget: baseline.budget,
    date: format(new Date(baseline.created_at), 'dd/MM'),
    fullDate: format(new Date(baseline.created_at), 'dd/MM/yyyy'),
    change: index > 0 ? baseline.budget - baselines[index - 1].budget : 0
  }));

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'budget_increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'budget_decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'scope_change':
        return <GitBranch className="h-4 w-4 text-blue-600" />;
      case 'project_start':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  const exportHistory = () => {
    const csvContent = baselines.map(b => 
      `${b.version},${format(new Date(b.created_at), 'dd/MM/yyyy')},${b.budget},${b.description}`
    ).join('\n');
    
    const blob = new Blob([`Versão,Data,Orçamento,Descrição\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-${project.project_code}.csv`;
    a.click();
    
    toast({
      title: "Exportação Concluída",
      description: "Histórico de baselines exportado com sucesso.",
    });
  };

  const BaselineDetailDialog = ({ baseline }: { baseline: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Baseline {baseline.version}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Versão</h4>
              <p className="text-lg font-bold">{baseline.version}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Orçamento</h4>
              <p className="text-lg font-bold text-green-600">{formatCurrency(baseline.budget)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Data de Criação</h4>
              <p>{format(new Date(baseline.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
              <Badge variant={baseline === baselines[0] ? "default" : "outline"}>
                {baseline === baselines[0] ? "Atual" : "Histórico"}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Descrição</h4>
            <p className="text-sm">{baseline.description || "Sem descrição disponível"}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Histórico de Mudanças</h4>
            <div className="text-sm space-y-1">
              <p>📝 Criada por: João Silva</p>
              <p>⏰ Data: {format(new Date(baseline.created_at), 'dd/MM/yyyy HH:mm')}</p>
              <p>🔄 Motivo: {baseline.description}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleRestoreBaseline(baseline)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Ver Documentos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (baselines.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Histórico do Projeto</h3>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum histórico disponível</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              O histórico do projeto aparecerá aqui conforme baselines forem criadas e decisões tomadas. 
              Baselines são marcos importantes que capturam o estado do orçamento e escopo em momentos específicos.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">O que são Baselines?</h4>
                  <p className="text-sm text-blue-700">
                    Baselines são versões aprovadas do seu projeto que servem como ponto de referência para 
                    acompanhar mudanças no orçamento, prazo e escopo ao longo do tempo.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Histórico do Projeto</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportHistory}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Histórico
          </Button>
        </div>
      </div>

      {/* Budget Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução do Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => `${formatCurrency(value).split(' ')[1]}`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Orçamento']}
                  labelFormatter={(label) => `Baseline ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Baseline Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Linha do Tempo - Baselines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {baselines.map((baseline, index) => (
              <div key={baseline.id} className="relative">
                {/* Timeline line */}
                {index < baselines.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-16 bg-border" />
                )}
                
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index === 0 ? <CheckCircle className="h-6 w-6" /> : <History className="h-6 w-6" />}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">Baseline {baseline.version}</h4>
                        {index === 0 && <Badge>Atual</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <BaselineDetailDialog baseline={baseline} />
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRestoreBaseline(baseline)}
                          disabled={index === 0}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(baseline.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(baseline.budget)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        João Silva
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {baseline.description || "Sem descrição disponível"}
                    </p>
                    
                    {index < baselines.length - 1 && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {chartData[index].change > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : chartData[index].change < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span className="text-sm">
                            Variação: {chartData[index].change > 0 ? '+' : ''}{formatCurrency(Math.abs(chartData[index].change))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decision Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Log de Decisões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisionLog.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getDecisionIcon(decision.type)}
                    <div>
                      <h4 className="font-medium">{decision.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(decision.date, 'dd/MM/yyyy', { locale: ptBR })} • Aprovado por {decision.approved_by}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {decision.amount_change > 0 ? '+' : ''}{formatCurrency(Math.abs(decision.amount_change))}
                  </Badge>
                </div>
                
                <p className="text-sm mb-3">{decision.description}</p>
                
                {decision.documents.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-2">
                      {decision.documents.map((doc, index) => (
                        <Button key={index} variant="link" size="sm" className="h-auto p-0 text-xs">
                          {doc}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}