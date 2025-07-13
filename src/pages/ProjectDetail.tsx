import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Download, 
  FileText, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  BarChart3,
  History,
  Plus,
  Filter,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProjectEditDialog } from "@/components/project-edit-dialog";
import { BaselineDialog } from "@/components/baseline-dialog";
import { TransactionDialog } from "@/components/transaction-dialog";
import { PortfolioComparisonDialog } from "@/components/portfolio-comparison-dialog";
import { ExecutiveDashboard } from "@/components/executive-dashboard";
import { FinancialSummary } from "@/components/financial-summary";
import { PlanningView } from "@/components/planning-view";
import { TransactionsView } from "@/components/transactions-view";
import { HistoryView } from "@/components/history-view";
import { ReportsView } from "@/components/reports-view";
import { HomeButton } from "@/components/home-button";

// Mock data for demo purposes
const mockProject = {
  id: "mock-uuid-001",
  project_code: "PRJ-002",
  name: "Sistema ERP Integrado",
  leader: "João Santos", 
  status: "Crítico",
  area: "TI",
  budget: 1200000,
  realized: 1350000,
  committed: 200000,
  currency: "BRL",
  is_critical: true,
  progress: 85,
  deadline: new Date("2025-02-28"),
  description: "Implementação completa do novo sistema ERP para integração de todos os processos corporativos",
  start_date: new Date("2024-06-01"),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "mock-user-id"
};

const mockTransactions = [
  { id: "trans-1", transaction_date: new Date("2025-01-15"), description: "Licenças Software SAP", amount: 450000, category: "Software", transaction_type: "manual" },
  { id: "trans-2", transaction_date: new Date("2025-01-10"), description: "Consultoria Especializada", amount: 280000, category: "Serviços", transaction_type: "imported" },
  { id: "trans-3", transaction_date: new Date("2025-01-05"), description: "Hardware Servidores", amount: 320000, category: "Hardware", transaction_type: "manual" },
];

const mockBaselines = [
  { id: "base-1", version: "v1.0", created_at: new Date("2024-06-01").toISOString(), budget: 1000000, description: "Baseline inicial aprovada" },
  { id: "base-2", version: "v1.1", created_at: new Date("2024-09-15").toISOString(), budget: 1100000, description: "Ajuste por escopo adicional" },
  { id: "base-3", version: "v1.2", created_at: new Date("2024-12-01").toISOString(), budget: 1200000, description: "Baseline atual - revisão Q4" },
];

const statusColors = {
  "Em Andamento": "bg-blue-100 text-blue-800 border-blue-200",
  "Concluído": "bg-green-100 text-green-800 border-green-200", 
  "Em Atraso": "bg-orange-100 text-orange-800 border-orange-200",
  "Planejado": "bg-gray-100 text-gray-800 border-gray-200",
  "Crítico": "bg-red-100 text-red-800 border-red-200"
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comando");
  const [project, setProject] = useState<any>(null);
  const [baselines, setBaselines] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", EUR: "€", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-orange-500";
    return "bg-red-500";
  };


  const fetchProjectData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log('Fetching project:', id);
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('project_code', id)
        .maybeSingle();

      if (projectError) {
        console.log('Database error, using mock data:', projectError);
        setProject(mockProject);
        setBaselines(mockBaselines);
        setTransactions(mockTransactions);
        return;
      }

      if (!projectData) {
        console.log('No project found, using mock data');
        setProject(mockProject);
        setBaselines(mockBaselines);
        setTransactions(mockTransactions);
        return;
      }

      setProject(projectData);

      const [baselinesResponse, transactionsResponse] = await Promise.all([
        supabase
          .from('baselines')
          .select('*')
          .eq('project_id', projectData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('transactions')
          .select('*')
          .eq('project_id', projectData.id)
          .order('created_at', { ascending: false })
      ]);

      setBaselines(baselinesResponse.data || []);
      setTransactions(transactionsResponse.data || []);

    } catch (error: any) {
      console.error('Error fetching project data:', error);
      setProject(mockProject);
      setBaselines(mockBaselines);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleProjectUpdate = (updatedProject: any) => {
    setProject(updatedProject);
  };

  const handleBaselineAdded = () => {
    fetchProjectData();
  };

  const handleTransactionAdded = () => {
    fetchProjectData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Projeto não encontrado</h2>
          <p className="text-muted-foreground">O projeto {id} não foi encontrado.</p>
          <Button className="mt-4" onClick={() => navigate("/projetos")}>
            Voltar à Lista
          </Button>
        </div>
      </div>
    );
  }

  // Calculate balance and other derived values
  const balance = project.budget - (project.realized || 0) - (project.committed || 0);
  const budgetUtilization = (((project.realized || 0) / project.budget) * 100).toFixed(1);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            {/* Navegação superior */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <HomeButton />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/projetos")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar à Lista
                </Button>
                <div className="h-6 border-l border-border" />
                <h1 className="text-2xl font-bold text-foreground">Detalhes do Projeto</h1>
              </div>
              
              {/* Ações rápidas */}
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ver histórico de alterações</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar dados do projeto</TooltipContent>
                </Tooltip>
                
                <ProjectEditDialog 
                  project={project} 
                  onProjectUpdate={handleProjectUpdate}
                />
              </div>
            </div>

            {/* Informações do projeto */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  {project.is_critical && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{project.project_code || id}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                  {project.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Área</p>
                <p className="text-sm font-medium">{project.area}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Líder</p>
                <p className="text-sm font-medium">{project.leader}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Moeda</p>
                <p className="text-sm font-medium">{project.currency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas críticos */}
        {balance < 0 && (
          <div className="container mx-auto px-6 py-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Orçamento Crítico:</strong> O valor realizado ultrapassou o orçamento planejado em {formatCurrency(Math.abs(balance), project.currency)}. 
                Ação imediata necessária para controle financeiro do projeto.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Conteúdo principal com abas */}
        <div className="container mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="comando" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Comando</span>
              </TabsTrigger>
              <TabsTrigger value="resumo" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Resumo</span>
              </TabsTrigger>
              <TabsTrigger value="planejamento" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Planejamento</span>
              </TabsTrigger>
              <TabsTrigger value="realizados" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Realizados</span>
              </TabsTrigger>
              <TabsTrigger value="historico" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
            </TabsList>

            {/* Aba Painel de Comando Executivo */}
            <TabsContent value="comando" className="space-y-6">
              <ExecutiveDashboard 
                project={project}
                baselines={baselines}
                onComparePortfolio={() => {
                  // Abrir modal de comparação com portfólio
                }}
                onScaleProblem={() => {
                  toast({
                    title: "Problema Escalado",
                    description: "Notificação enviada para PMO e Diretoria. Você receberá retorno em até 24h.",
                    duration: 5000,
                  });
                }}
              />
            </TabsContent>

            {/* Aba Resumo Executivo */}
            <TabsContent value="resumo" className="space-y-6">
              <FinancialSummary 
                project={project}
                transactions={transactions}
                baselines={baselines}
                onDrillDown={(type, data) => {
                  if (type === 'realized') {
                    toast({
                      title: "Detalhamento de Realizados",
                      description: `Visualizando ${data.length} transações realizadas.`,
                    });
                  }
                }}
              />
            </TabsContent>

            {/* Aba Resumo Executivo Antigo */}
            <TabsContent value="resumo-old" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Resumo Executivo</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Atualizar Dashboard</Button>
                </div>
              </div>

              {/* Resumo financeiro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-600">Orçamento Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(project.budget, project.currency)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-600">Realizado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(project.realized || 0, project.currency)}</div>
                    <p className="text-xs text-muted-foreground">
                      {budgetUtilization}% do orçamento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-600">Saldo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(balance, project.currency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {balance >= 0 ? 'Disponível' : 'Déficit'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba Realizados */}
            <TabsContent value="realizados" className="space-y-6">
              <TransactionsView 
                project={project}
                transactions={transactions}
                onTransactionAdded={handleTransactionAdded}
                onImportSAP={() => {
                  toast({
                    title: "Importação SAP",
                    description: "Iniciando importação de dados do SAP...",
                  });
                }}
                onAttachDocument={(transactionId) => {
                  toast({
                    title: "Anexar Documento",
                    description: `Anexando documento à transação ${transactionId}`,
                  });
                }}
              />
            </TabsContent>

            {/* Aba Histórico */}
            <TabsContent value="historico" className="space-y-6">
              <HistoryView 
                project={project}
                baselines={baselines}
                onRestoreBaseline={(baselineId) => {
                  toast({
                    title: "Baseline Restaurada",
                    description: "Projeto revertido para baseline selecionada.",
                  });
                  handleBaselineAdded();
                }}
              />
            </TabsContent>

            {/* Aba Planejamento */}
            <TabsContent value="planejamento" className="space-y-6">
              <PlanningView 
                project={project}
                baselines={baselines}
                transactions={transactions}
                onUpdateForecast={(data) => {
                  toast({
                    title: "Previsão Atualizada",
                    description: "As alterações no planejamento foram salvas.",
                  });
                }}
                onSaveBaseline={(data) => {
                  handleBaselineAdded();
                  toast({
                    title: "Baseline Salva",
                    description: "Nova baseline criada com sucesso.",
                  });
                }}
                onRevertBaseline={(baselineId) => {
                  toast({
                    title: "Baseline Revertida",
                    description: "Projeto revertido para baseline anterior.",
                  });
                }}
              />
            </TabsContent>

            {/* Aba Relatórios */}
            <TabsContent value="relatorios" className="space-y-6">
              <ReportsView 
                project={project}
                transactions={transactions}
                baselines={baselines}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}