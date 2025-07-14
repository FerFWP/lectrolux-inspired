import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Download, 
  History, 
  GitBranch, 
  RotateCcw, 
  Edit3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Save,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface HistoryViewProps {
  project: any;
  baselines: any[];
  onRestoreBaseline?: (baselineId: string) => void;
}

export function EnhancedHistoryView({ project, baselines, onRestoreBaseline }: HistoryViewProps) {
  const [selectedBaseline, setSelectedBaseline] = useState<any>(null);
  const [newBaselineName, setNewBaselineName] = useState("");
  const [newBaselineJustification, setNewBaselineJustification] = useState("");
  const [showNewBaselineDialog, setShowNewBaselineDialog] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    const symbols = { BRL: "R$", USD: "$", EUR: "€", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount?.toLocaleString("pt-BR") || 0}`;
  };

  // Enhanced baselines with more details
  const enhancedBaselines = baselines.map((baseline, index) => ({
    ...baseline,
    name: baseline.name || `Baseline ${baseline.version}`,
    author: "João Silva",
    changes: {
      budget: index > 0 ? baseline.budget - baselines[index - 1].budget : 0,
      scope_changes: ["Inclusão módulo de relatórios", "Ajuste na arquitetura"][Math.floor(Math.random() * 2)],
      timeline_impact: index > 0 ? Math.floor(Math.random() * 30) - 15 : 0
    },
    approval_status: Math.random() > 0.2 ? "approved" : "pending",
    risk_assessment: ["Baixo", "Médio", "Alto"][Math.floor(Math.random() * 3)]
  }));

  // Dados para gráfico evolutivo
  const evolutionData = enhancedBaselines.map(baseline => ({
    version: baseline.version,
    budget: baseline.budget,
    date: format(new Date(baseline.created_at), 'dd/MM'),
    changes: baseline.changes?.budget || 0
  }));

  const exportHistory = () => {
    const csvContent = enhancedBaselines.map(b => 
      `${b.version},${format(new Date(b.created_at), 'dd/MM/yyyy')},${b.name},${b.budget},${b.changes?.budget || 0},${b.author}`
    ).join('\n');
    
    const blob = new Blob([`Versão,Data,Nome,Orçamento,Variação,Autor\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-baselines-${project.project_code}.csv`;
    a.click();
    
    toast({
      title: "Histórico Exportado",
      description: "Arquivo CSV baixado com sucesso.",
    });
  };

  const handleCreateBaseline = () => {
    if (!newBaselineName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para a baseline.",
        variant: "destructive"
      });
      return;
    }

    // Mock create baseline
    toast({
      title: "Baseline Criada",
      description: `Nova baseline "${newBaselineName}" foi salva com sucesso.`,
    });
    
    setShowNewBaselineDialog(false);
    setNewBaselineName("");
    setNewBaselineJustification("");
  };

  const handleRestoreBaseline = (baseline: any) => {
    const confirmMessage = `
    ⚠️ ATENÇÃO: Restaurar Baseline
    
    Esta ação irá:
    • Reverter o orçamento para ${formatCurrency(baseline.budget)}
    • Restaurar as configurações salvas em ${format(new Date(baseline.created_at), 'dd/MM/yyyy')}
    • Criar um novo ponto de restauração automático
    
    Esta operação NÃO pode ser desfeita automaticamente.
    `;

    if (window.confirm(confirmMessage)) {
      onRestoreBaseline?.(baseline.id);
      toast({
        title: "Baseline Restaurada",
        description: `Projeto revertido para baseline "${baseline.name || baseline.version}".`,
      });
    }
  };

  const BaselineDetailDialog = ({ baseline }: { baseline: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Baseline: {baseline.name || baseline.version}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Informações Gerais */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Informações Gerais</Label>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versão:</span>
                  <span className="font-medium">{baseline.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data:</span>
                  <span>{format(new Date(baseline.created_at), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Autor:</span>
                  <span>{baseline.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={baseline.approval_status === 'approved' ? 'default' : 'secondary'}>
                    {baseline.approval_status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Variações Financeiras</Label>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orçamento:</span>
                  <span className="font-medium">{formatCurrency(baseline.budget)}</span>
                </div>
                {baseline.changes?.budget !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variação:</span>
                    <span className={baseline.changes.budget > 0 ? 'text-red-600' : 'text-green-600'}>
                      {baseline.changes.budget > 0 ? '+' : ''}{formatCurrency(baseline.changes.budget)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alterações e Justificativas */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Alterações de Escopo</Label>
              <div className="mt-2 p-3 bg-muted rounded text-sm">
                {baseline.changes?.scope_changes || baseline.description || "Nenhuma alteração documentada"}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Análise de Risco</Label>
              <div className="mt-2">
                <Badge variant={
                  baseline.risk_assessment === 'Alto' ? 'destructive' : 
                  baseline.risk_assessment === 'Médio' ? 'secondary' : 'default'
                }>
                  Risco {baseline.risk_assessment}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Impacto no Cronograma</Label>
              <div className="mt-2 text-sm">
                {baseline.changes?.timeline_impact ? (
                  <span className={baseline.changes.timeline_impact > 0 ? 'text-red-600' : 'text-green-600'}>
                    {baseline.changes.timeline_impact > 0 ? '+' : ''}{baseline.changes.timeline_impact} dias
                  </span>
                ) : (
                  <span className="text-muted-foreground">Sem impacto</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Detalhes
            </Button>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleRestoreBaseline(baseline)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar Esta Versão
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium text-destructive">⚠️ Ação Irreversível</p>
                <p className="text-sm">Restaurar irá reverter todas as alterações feitas após esta baseline.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico do Projeto
          </h3>
          <div className="flex gap-2">
            <Dialog open={showNewBaselineDialog} onOpenChange={setShowNewBaselineDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Baseline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Baseline</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="baseline-name">Nome da Baseline *</Label>
                    <Input
                      id="baseline-name"
                      value={newBaselineName}
                      onChange={(e) => setNewBaselineName(e.target.value)}
                      placeholder="Ex: Ajuste Escopo Q1, Revisão Orçamento..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="justification">Justificativa da Alteração</Label>
                    <Textarea
                      id="justification"
                      value={newBaselineJustification}
                      onChange={(e) => setNewBaselineJustification(e.target.value)}
                      placeholder="Descreva as razões para criar esta nova baseline..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewBaselineDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateBaseline}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Baseline
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" variant="outline" onClick={exportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Histórico
            </Button>
          </div>
        </div>

        {/* Gráfico Evolutivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução Orçamentária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="version" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <RechartsTooltip 
                    formatter={(value: any) => [formatCurrency(value), "Orçamento"]}
                    labelFormatter={(label) => `Versão ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Timeline de Baselines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Timeline de Baselines ({enhancedBaselines.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enhancedBaselines.map((baseline, index) => (
                <div key={baseline.id} className="flex gap-4 p-4 rounded-lg border">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {baseline.version}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(baseline.created_at), 'dd/MM')}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{baseline.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {baseline.author}
                          <Calendar className="h-3 w-3 ml-2" />
                          {format(new Date(baseline.created_at), 'dd/MM/yyyy HH:mm')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={baseline.approval_status === 'approved' ? 'default' : 'secondary'}>
                          {baseline.approval_status === 'approved' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Aprovado
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pendente
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Orçamento:</span>
                        <div className="font-medium">{formatCurrency(baseline.budget)}</div>
                      </div>
                      
                      {baseline.changes?.budget !== 0 && (
                        <div>
                          <span className="text-muted-foreground">Variação:</span>
                          <div className={`font-medium flex items-center gap-1 ${
                            baseline.changes.budget > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {baseline.changes.budget > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {baseline.changes.budget > 0 ? '+' : ''}{formatCurrency(baseline.changes.budget)}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-muted-foreground">Risco:</span>
                        <Badge variant={
                          baseline.risk_assessment === 'Alto' ? 'destructive' : 
                          baseline.risk_assessment === 'Médio' ? 'secondary' : 'default'
                        } className="ml-1">
                          {baseline.risk_assessment}
                        </Badge>
                      </div>
                    </div>

                    {baseline.description && (
                      <div className="text-sm text-muted-foreground italic">
                        "{baseline.description}"
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex gap-1">
                    <BaselineDetailDialog baseline={baseline} />
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRestoreBaseline(baseline)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium">Restaurar Baseline</p>
                          <p className="text-xs text-muted-foreground">Reverter projeto para esta versão</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}