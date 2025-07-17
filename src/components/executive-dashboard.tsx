import React from "react";
import { format, differenceInDays } from "date-fns";
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Clock, Target, CheckCircle, XCircle, AlertCircle, FileText, Users, Zap } from "lucide-react";
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
  selectedCurrency?: string;
  selectedYear?: string;
}
export function ExecutiveDashboard({
  project,
  baselines,
  selectedCurrency,
  selectedYear
}: ExecutiveDashboardProps) {
  const formatCurrency = (amount: number, currency?: string) => {
    const displayCurrency = currency || selectedCurrency || project.currency;
    const symbols = {
      BRL: "R$",
      USD: "$",
      SEK: "kr"
    };
    
    // Simple conversion rates (mock)
    const conversionRates = {
      BRL: { BRL: 1, USD: 5.5, SEK: 0.6 },
      USD: { BRL: 0.18, USD: 1, SEK: 0.11 },
      SEK: { BRL: 1.67, USD: 9.2, SEK: 1 }
    };
    
    const convertedAmount = amount * (conversionRates[project.currency as keyof typeof conversionRates]?.[displayCurrency as keyof typeof conversionRates.BRL] || 1);
    
    return `${symbols[displayCurrency as keyof typeof symbols]} ${convertedAmount.toLocaleString("pt-BR")}`;
  };

  // Cálculos de métricas
  const balance = project.budget - (project.realized || 0) - (project.committed || 0);
  const budgetUtilization = (project.realized || 0) / project.budget * 100;
  const daysToDeadline = project.deadline ? differenceInDays(new Date(project.deadline), new Date()) : null;

  // Baseline mais recente para comparação
  const latestBaseline = baselines.length > 0 ? baselines[0] : null;
  const budgetVariation = latestBaseline ? (project.budget - latestBaseline.budget) / latestBaseline.budget * 100 : 0;

  // Cálculo de SPI e CPI (simulado)
  const expectedProgress = project.start_date && project.deadline ? Math.min(100, Math.max(0, differenceInDays(new Date(), new Date(project.start_date)) / differenceInDays(new Date(project.deadline), new Date(project.start_date)) * 100)) : 50;
  const spi = expectedProgress > 0 ? project.progress / expectedProgress : 1;
  const cpi = project.budget > 0 ? project.budget / (project.realized + project.committed || project.budget) : 1;

  // Status financeiro
  const getFinancialStatus = () => {
    if (budgetUtilization > 100) return {
      status: "CRÍTICO",
      color: "red"
    };
    if (budgetUtilization > 85) return {
      status: "ALERTA",
      color: "orange"
    };
    return {
      status: "OK",
      color: "green"
    };
  };
  const financialStatus = getFinancialStatus();

  // Status de prazo
  const getScheduleStatus = () => {
    if (!daysToDeadline) return {
      status: "N/A",
      color: "gray",
      days: 0
    };
    if (daysToDeadline < 0) return {
      status: "ATRASADO",
      color: "red",
      days: Math.abs(daysToDeadline)
    };
    if (daysToDeadline < 30) return {
      status: "CRÍTICO",
      color: "orange",
      days: daysToDeadline
    };
    return {
      status: "NO PRAZO",
      color: "green",
      days: daysToDeadline
    };
  };
  const scheduleStatus = getScheduleStatus();

  // Pendências críticas (simuladas)
  const criticalPendencies = [{
    type: "Orçamentária",
    description: "Aprovação de verba adicional - R$ 150k",
    priority: "ALTA"
  }, {
    type: "Entrega",
    description: "Validação módulo financeiro pelo cliente",
    priority: "CRÍTICA"
  }, {
    type: "Compliance",
    description: "Aprovação auditoria de segurança",
    priority: "MÉDIA"
  }];

  // Timeline executiva (simulada)
  const executiveTimeline = [{
    date: "15/01/2025",
    event: "Aprovação baseline v1.2",
    type: "milestone"
  }, {
    date: "10/01/2025",
    event: "Alteração escopo - Módulo BI",
    type: "scope_change"
  }, {
    date: "05/01/2025",
    event: "Aprovação diretoria - Verba extra",
    type: "approval"
  }, {
    date: "20/12/2024",
    event: "Marco: Fase 1 concluída",
    type: "milestone"
  }];
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Painel Executivo / Visão Geral de Risco</h3>
      </div>

      {/* Resumo Executivo - Cards de Status */}
      

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
                {formatCurrency(Math.abs(balance))}
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
            {criticalPendencies.map((item, index) => <Alert key={index} className="border-l-4 border-l-orange-500">
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{item.type}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <Badge variant={item.priority === 'CRÍTICA' ? 'destructive' : item.priority === 'ALTA' ? 'secondary' : 'outline'} className="text-xs">
                      {item.priority}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>)}
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
              {executiveTimeline.map((item, index) => <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    {item.type === 'milestone' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {item.type === 'scope_change' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                    {item.type === 'approval' && <Users className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.event}</div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}