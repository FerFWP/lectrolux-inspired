import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Target,
  AlertTriangle,
  Calendar,
  BarChart3,
  GitCompare,
  Scale,
  FileText,
  Edit3,
  HelpCircle
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  realized: number;
  committed: number;
  progress: number;
  deadline: string;
  start_date: string;
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
  onComparePortfolio?: () => void;
  onScaleProblem?: () => void;
  onEditPlanning?: () => void;
}

export function EnhancedExecutiveDashboard({ 
  project, 
  baselines,
  selectedCurrency,
  selectedYear, 
  onComparePortfolio, 
  onScaleProblem,
  onEditPlanning 
}: ExecutiveDashboardProps) {
  const [editingPlanning, setEditingPlanning] = useState(false);
  const [monthlyPlanning, setMonthlyPlanning] = useState("450000");

  const formatCurrency = (amount: number, currency?: string) => {
    const displayCurrency = currency || selectedCurrency || project.currency;
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    
    // Simple conversion rates (mock)
    const conversionRates = {
      BRL: { BRL: 1, USD: 5.5, SEK: 0.6 },
      USD: { BRL: 0.18, USD: 1, SEK: 0.11 },
      SEK: { BRL: 1.67, USD: 9.2, SEK: 1 }
    };
    
    const convertedAmount = amount * (conversionRates[project.currency as keyof typeof conversionRates]?.[displayCurrency as keyof typeof conversionRates.BRL] || 1);
    
    return `${symbols[displayCurrency as keyof typeof symbols]} ${convertedAmount?.toLocaleString("pt-BR") || 0}`;
  };

  // Cálculos de métricas
  const balance = project.budget - project.realized - project.committed;
  const budgetUtilization = ((project.realized + project.committed) / project.budget) * 100;
  const daysToDeadline = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  // Métricas de performance
  const expectedProgress = 75; // Mock - seria calculado baseado na data
  const spi = project.progress / expectedProgress; // Schedule Performance Index
  const cpi = project.budget / (project.realized || 1); // Cost Performance Index

  const getFinancialStatus = () => {
    if (budgetUtilization >= 100) return { status: "Excedido", color: "destructive" };
    if (budgetUtilization >= 90) return { status: "Crítico", color: "destructive" };
    if (budgetUtilization >= 80) return { status: "Atenção", color: "secondary" };
    return { status: "Normal", color: "default" };
  };

  const getScheduleStatus = () => {
    if (daysToDeadline < 0) return { status: "Atrasado", color: "destructive", days: Math.abs(daysToDeadline) };
    if (daysToDeadline <= 30) return { status: "Urgente", color: "secondary", days: daysToDeadline };
    return { status: "No Prazo", color: "default", days: daysToDeadline };
  };

  // Timeline de eventos-chave
  const executiveTimeline = [
    {
      date: "15/01/2025",
      event: "Baseline Inicial Aprovada",
      type: "milestone",
      description: "Orçamento de R$ 1.2M aprovado pelo comitê"
    },
    {
      date: "28/01/2025", 
      event: "Contrato Principal Assinado",
      type: "contract",
      description: "Contrato com fornecedor principal - R$ 850K"
    },
    {
      date: "10/02/2025",
      event: "Revisão de Baseline",
      type: "revision",
      description: "Ajuste de escopo - orçamento aumentado para R$ 1.35M"
    },
    {
      date: "hoje",
      event: "Situação Atual",
      type: "current",
      description: `${project.progress}% concluído, ${formatCurrency(project.realized)} realizados`
    }
  ];

  const financialStatus = getFinancialStatus();
  const scheduleStatus = getScheduleStatus();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header com ações rápidas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
            <p className="text-muted-foreground">Painel Executivo • Líder: {project.leader}</p>
          </div>
          
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={onComparePortfolio}>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Comparar Portfólio
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compare este projeto com a média da área e do portfólio</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={onScaleProblem}>
                  <Scale className="h-4 w-4 mr-2" />
                  Escalar Problema
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Escalar questões críticas para o comitê executivo</p>
              </TooltipContent>
            </Tooltip>
            
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Relatórios Críticos
            </Button>
          </div>
        </div>

        {/* Cards de Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Status Financeiro</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status baseado na utilização orçamentária: Normal (&lt;80%), Atenção (80-90%), Crítico (&gt;90%)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={financialStatus.color as any}>{financialStatus.status}</Badge>
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{budgetUtilization.toFixed(1)}% utilizado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Status Cronograma</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dias até o prazo final: No Prazo (&gt;30 dias), Urgente (&le;30 dias), Atrasado (&lt;0 dias)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={scheduleStatus.color as any}>{scheduleStatus.status}</Badge>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{scheduleStatus.days} dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Progresso</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{project.progress}%</span>
                  <span className="text-muted-foreground">Esperado: {expectedProgress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      SPI
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Schedule Performance Index: Progresso real vs esperado. &gt;1.0 = adiantado, &lt;1.0 = atrasado</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                {spi >= 1 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spi.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      CPI
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cost Performance Index: Orçamento vs gasto real. &gt;1.0 = economia, &lt;1.0 = excesso</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                {cpi >= 1 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cpi.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Custo</p>
            </CardContent>
          </Card>
        </div>

        {/* Planejamento Editável */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Planejamento do Mês</CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setEditingPlanning(!editingPlanning)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {editingPlanning ? "Salvar" : "Editar"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingPlanning ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Previsão de Gasto (R$)</label>
                  <input 
                    type="text" 
                    value={monthlyPlanning}
                    onChange={(e) => setMonthlyPlanning(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  💡 Dica: Baseie-se no histórico e nas atividades planejadas para o próximo mês
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold">{formatCurrency(parseInt(monthlyPlanning))}</p>
                <p className="text-sm text-muted-foreground">Planejado para próximo mês</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline Executiva */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline Executiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executiveTimeline.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">
                    {item.date}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{item.event}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.type === "milestone" && "📍"}
                        {item.type === "contract" && "📄"}
                        {item.type === "revision" && "🔄"}
                        {item.type === "current" && "📊"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
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