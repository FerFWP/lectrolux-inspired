import React from "react";
import { format, differenceInDays } from "date-fns";
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  realized: number;
  committed: number;
  progress: number;
  deadline?: Date;
  start_date?: Date;
  currency: string;
  is_critical: boolean;
  area: string;
  leader: string;
}

interface ExecutiveDashboardProps {
  project: Project;
  baselines: any[];
  onComparePortfolio: () => void;
  onScaleProblem: () => void;
}

export function ExecutiveDashboard({ 
  project, 
  baselines, 
  onComparePortfolio, 
  onScaleProblem 
}: ExecutiveDashboardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Cálculos de métricas
  const balance = project.budget - (project.realized || 0) - (project.committed || 0);
  const budgetUtilization = (((project.realized || 0) / project.budget) * 100);
  const daysToDeadline = project.deadline ? differenceInDays(new Date(project.deadline), new Date()) : null;
  
  // Baseline mais recente para comparação
  const latestBaseline = baselines.length > 0 ? baselines[0] : null;
  const budgetVariation = latestBaseline ? ((project.budget - latestBaseline.budget) / latestBaseline.budget * 100) : 0;
  
  // Cálculo de SPI e CPI (simulado)
  const expectedProgress = project.start_date && project.deadline ? 
    Math.min(100, Math.max(0, (differenceInDays(new Date(), new Date(project.start_date)) / 
    differenceInDays(new Date(project.deadline), new Date(project.start_date))) * 100)) : 50;
  
  const spi = expectedProgress > 0 ? (project.progress / expectedProgress) : 1;
  const cpi = project.budget > 0 ? (project.budget / (project.realized + project.committed || project.budget)) : 1;

  // Status financeiro
  const getFinancialStatus = () => {
    if (budgetUtilization > 100) return { status: "CRÍTICO", color: "red" };
    if (budgetUtilization > 85) return { status: "ALERTA", color: "orange" };
    return { status: "OK", color: "green" };
  };

  const financialStatus = getFinancialStatus();

  // Status de prazo
  const getScheduleStatus = () => {
    if (!daysToDeadline) return { status: "N/A", color: "gray", days: 0 };
    if (daysToDeadline < 0) return { status: "ATRASADO", color: "red", days: Math.abs(daysToDeadline) };
    if (daysToDeadline < 30) return { status: "CRÍTICO", color: "orange", days: daysToDeadline };
    return { status: "NO PRAZO", color: "green", days: daysToDeadline };
  };

  const scheduleStatus = getScheduleStatus();

  // Pendências críticas (simuladas)
  const criticalPendencies = [
    { type: "Orçamentária", description: "Aprovação de verba adicional - R$ 150k", priority: "ALTA" },
    { type: "Entrega", description: "Validação módulo financeiro pelo cliente", priority: "CRÍTICA" },
    { type: "Compliance", description: "Aprovação auditoria de segurança", priority: "MÉDIA" }
  ];

  // Timeline executiva (simulada)
  const executiveTimeline = [
    { date: "15/01/2025", event: "Aprovação baseline v1.2", type: "milestone" },
    { date: "10/01/2025", event: "Alteração escopo - Módulo BI", type: "scope_change" },
    { date: "05/01/2025", event: "Aprovação diretoria - Verba extra", type: "approval" },
    { date: "20/12/2024", event: "Marco: Fase 1 concluída", type: "milestone" }
  ];

  return (
    <div className="space-y-6">
      {/* Header com ações rápidas */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Painel Executivo / Visão Geral de Risco</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onComparePortfolio}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparar com Portfólio
          </Button>
          <Button size="sm" variant="destructive" onClick={onScaleProblem}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Escalar Problema
          </Button>
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Relatórios Críticos
          </Button>
        </div>
      </div>

      {/* Resumo Executivo - Cards de Status */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div className="text-sm text-muted-foreground">Status Financeiro</div>
            </div>
            <div className="text-xl font-bold text-red-600">
              {financialStatus.status}
            </div>
            <div className="text-xs text-red-600">
              {budgetUtilization.toFixed(1)}% utilizado
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="text-sm text-muted-foreground">Prazo</div>
            </div>
            <div className="text-xl font-bold text-orange-600">
              {scheduleStatus.days > 0 ? `${scheduleStatus.days} dias` : scheduleStatus.status}
            </div>
            <div className="text-xs text-orange-600">
              {scheduleStatus.status}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div className="text-sm text-muted-foreground">Progresso Físico</div>
            </div>
            <div className="text-xl font-bold text-blue-600">{project.progress}%</div>
            <div className="text-xs text-blue-600">Execução concluída</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-sm text-muted-foreground">ROI Projetado</div>
            </div>
            <div className="text-xl font-bold text-green-600">18%</div>
            <div className="text-xs text-green-600">Meta: 15%</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div className="text-sm text-muted-foreground">Variação Escopo</div>
            </div>
            <div className="text-xl font-bold text-purple-600">
              {budgetVariation > 0 ? '+' : ''}{budgetVariation.toFixed(1)}%
            </div>
            <div className="text-xs text-purple-600">vs baseline inicial</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">SPI (Índice de Prazo)</div>
              <div className={`text-3xl font-bold ${spi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {spi.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {spi >= 1 ? 'Adiantado' : 'Atrasado'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">CPI (Índice de Custo)</div>
              <div className={`text-3xl font-bold ${cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {cpi.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {cpi >= 1 ? 'Abaixo do orçamento' : 'Acima do orçamento'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Principais Desvios</div>
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(Math.abs(balance), project.currency)}
              </div>
              <div className="text-xs text-muted-foreground">
                {balance < 0 ? 'Acima do orçamento' : 'Abaixo do orçamento'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Contextualizados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pendências Críticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalPendencies.map((item, index) => (
              <Alert key={index} className="border-l-4 border-l-orange-500">
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{item.type}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <Badge 
                      variant={item.priority === 'CRÍTICA' ? 'destructive' : 
                              item.priority === 'ALTA' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* Timeline Executiva */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Timeline Executiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executiveTimeline.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    {item.type === 'milestone' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {item.type === 'scope_change' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                    {item.type === 'approval' && <Users className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.event}</div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}