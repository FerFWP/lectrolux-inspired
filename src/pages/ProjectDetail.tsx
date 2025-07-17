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
  Eye,
  ChevronDown,
  ChevronUp
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
import { useToast } from "@/hooks/use-toast";
import { ProjectEditDialog } from "@/components/project-edit-dialog";
import { BaselineDialog } from "@/components/baseline-dialog";
import { TransactionDialog } from "@/components/transaction-dialog";
import { PortfolioComparisonDialog } from "@/components/portfolio-comparison-dialog";
import { LogsDialog } from "@/components/logs-dialog";
import { ExecutiveDashboard } from "@/components/executive-dashboard";
import { FinancialSummary } from "@/components/financial-summary";
import { PlanningView } from "@/components/planning-view";
import { TransactionsView } from "@/components/transactions-view";
import { HistoryView } from "@/components/history-view";
import { ReportsView } from "@/components/reports-view";
import { HomeButton } from "@/components/home-button";
import { useExport } from "@/hooks/use-export";
import { useSapImport } from "@/hooks/use-sap-import";
import { InlineEdit } from "@/components/inline-edit";
import { EditHistory } from "@/components/edit-history";
import { ContextualNotifications } from "@/components/contextual-notifications";
import { MotivationalFeedback } from "@/components/motivational-feedback";

// Mock data for demo purposes - generates dynamic data based on project ID  
const generateMockProject = (projectId: string) => {
  const projectsData = {
    "PRJ-001": {
      id: "mock-uuid-001",
      project_code: "PRJ-001",
      name: "Modernização Linha Produção A",
      leader: "Maria Silva",
      status: "Em Andamento",
      area: "Produção",
      budget: 2500000,
      realized: 1800000,
      committed: 500000,
      currency: "BRL",
      is_critical: false,
      progress: 72,
      deadline: new Date("2025-03-15"),
      description: "Modernização completa da linha de produção A com novas tecnologias e equipamentos automatizados",
      start_date: new Date("2024-05-01"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "mock-user-id",
      diretoria: "Produção e Manufatura",
      planta: "Sumaré - SP",
      pais: "Brasil",
      categoria_projeto: "Modernização",
      linha_produto: "Refrigeradores",
      estagios: "Planejamento, Execução, Controle",
      justificativa: "Necessário para manter competitividade no mercado e reduzir custos operacionais",
      resultados_beneficios: "Redução de 25% nos custos operacionais até dezembro de 2025",
      projeto_it: "Não",
      responsavel_it: "",
      tipo_investimento: "Capex",
      input: "Manual/Excel",
      sap_id: "BR0001234"
    },
    "PRJ-002": {
      id: "mock-uuid-002",
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
      user_id: "mock-user-id",
      diretoria: "Tecnologia da Informação",
      planta: "Curitiba - PR",
      pais: "Brasil",
      categoria_projeto: "Sistemas",
      linha_produto: "ERP",
      estagios: "Análise, Desenvolvimento, Teste, Implantação",
      justificativa: "Integração dos sistemas corporativos para maior eficiência e controle",
      resultados_beneficios: "Redução de 40% no tempo de processamento de dados até março de 2025",
      projeto_it: "Sim",
      responsavel_it: "João Santos",
      tipo_investimento: "Opex",
      input: "Integração",
      sap_id: "BR0005678"
    },
    "PRJ-003": {
      id: "mock-uuid-003",
      project_code: "PRJ-003",
      name: "Campanha Marketing Digital Q1",
      leader: "Ana Costa",
      status: "Concluído",
      area: "Marketing",
      budget: 800000,
      realized: 750000,
      committed: 0,
      currency: "BRL",
      is_critical: false,
      progress: 100,
      deadline: new Date("2025-01-31"),
      description: "Campanha de marketing digital integrada para o primeiro trimestre com foco em redes sociais",
      start_date: new Date("2024-10-01"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "mock-user-id",
      sap_id: ""
    },
    "PRJ-004": {
      id: "mock-uuid-004",
      project_code: "PRJ-004",
      name: "Expansão Mercado Europeu",
      leader: "Pedro Oliveira",
      status: "Em Atraso",
      area: "Comercial",
      budget: 3500000,
      realized: 2100000,
      committed: 800000,
      currency: "BRL",
      is_critical: true,
      progress: 45,
      deadline: new Date("2025-04-30"),
      description: "Expansão das operações para o mercado europeu com abertura de filiais e parcerias estratégicas",
      start_date: new Date("2024-01-15"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "mock-user-id",
      sap_id: "BR0009876"
    },
    "PRJ-005": {
      id: "mock-uuid-005",
      project_code: "PRJ-005",
      name: "Automação Linha Refrigeradores",
      leader: "Carlos Mendes",
      status: "Planejado",
      area: "Produção",
      budget: 1800000,
      realized: 0,
      committed: 450000,
      currency: "BRL",
      is_critical: false,
      progress: 15,
      deadline: new Date("2025-06-15"),
      description: "Implementação de sistema de automação completa na linha de produção de refrigeradores",
      start_date: new Date("2025-02-01"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "mock-user-id",
      sap_id: ""
    },
    "PRJ-006": {
      id: "mock-uuid-006",
      project_code: "PRJ-006",
      name: "Digitalização Processos RH",
      leader: "Lucia Ferreira",
      status: "Em Andamento",
      area: "RH",
      budget: 650000,
      realized: 320000,
      committed: 180000,
      currency: "BRL",
      is_critical: false,
      progress: 55,
      deadline: new Date("2025-05-20"),
      description: "Digitalização completa dos processos de recursos humanos com implementação de novos sistemas",
      start_date: new Date("2024-08-01"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "mock-user-id",
      sap_id: "BR0003456"
    },
    "PRJ-007": {
      id: "mock-uuid-007",
      project_code: "PRJ-007",
      name: "Expansão Suécia",
      leader: "Erik Johansson",
      status: "Em Andamento",
      area: "Internacional",
      budget: 5200000,
      realized: 2800000,
      committed: 1200000,
      currency: "SEK",
      is_critical: false,
      progress: 68,
      deadline: new Date("2025-09-30"),
      description: "Expansão das operações na Suécia com nova fábrica e centro de distribuição",
      start_date: new Date("2024-03-01"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "mock-user-id",
      sap_id: "SE0012345"
    }
  };

  return projectsData[projectId as keyof typeof projectsData] || projectsData["PRJ-002"];
};

const generateMockTransactions = (projectCode: string) => {
  const transactionsData = {
    "PRJ-001": [
      { id: "trans-1-1", transaction_date: new Date("2025-01-15"), description: "Aquisição Equipamentos Linha A", amount: 850000, category: "Equipamentos", transaction_type: "manual" },
      { id: "trans-1-2", transaction_date: new Date("2025-01-10"), description: "Instalação e Configuração", amount: 320000, category: "Serviços", transaction_type: "imported" },
      { id: "trans-1-3", transaction_date: new Date("2025-01-05"), description: "Treinamento Operadores", amount: 45000, category: "Treinamento", transaction_type: "manual" },
    ],
    "PRJ-002": [
      { id: "trans-2-1", transaction_date: new Date("2025-01-15"), description: "Licenças Software SAP", amount: 450000, category: "Software", transaction_type: "manual" },
      { id: "trans-2-2", transaction_date: new Date("2025-01-10"), description: "Consultoria Especializada", amount: 280000, category: "Serviços", transaction_type: "imported" },
      { id: "trans-2-3", transaction_date: new Date("2025-01-05"), description: "Hardware Servidores", amount: 320000, category: "Hardware", transaction_type: "manual" },
    ],
    "PRJ-003": [
      { id: "trans-3-1", transaction_date: new Date("2024-12-20"), description: "Mídia Paga Facebook/Instagram", amount: 180000, category: "Publicidade", transaction_type: "manual" },
      { id: "trans-3-2", transaction_date: new Date("2024-12-15"), description: "Produção de Conteúdo", amount: 95000, category: "Criação", transaction_type: "manual" },
      { id: "trans-3-3", transaction_date: new Date("2024-12-10"), description: "Analytics e Monitoramento", amount: 25000, category: "Ferramentas", transaction_type: "imported" },
    ],
    "PRJ-004": [
      { id: "trans-4-1", transaction_date: new Date("2025-01-12"), description: "Abertura Filial Amsterdam", amount: 420000, category: "Infraestrutura", transaction_type: "manual" },
      { id: "trans-4-2", transaction_date: new Date("2025-01-08"), description: "Contratação Equipe Local", amount: 180000, category: "RH", transaction_type: "manual" },
      { id: "trans-4-3", transaction_date: new Date("2025-01-03"), description: "Licenças e Certificações", amount: 65000, category: "Regulatório", transaction_type: "imported" },
    ],
    "PRJ-005": [
      { id: "trans-5-1", transaction_date: new Date("2025-01-20"), description: "Estudos de Viabilidade", amount: 85000, category: "Consultoria", transaction_type: "manual" },
      { id: "trans-5-2", transaction_date: new Date("2025-01-15"), description: "Projeto Detalhado", amount: 120000, category: "Engenharia", transaction_type: "manual" },
    ],
    "PRJ-006": [
      { id: "trans-6-1", transaction_date: new Date("2025-01-18"), description: "Sistema HRIS", amount: 150000, category: "Software", transaction_type: "manual" },
      { id: "trans-6-2", transaction_date: new Date("2025-01-12"), description: "Migração de Dados", amount: 85000, category: "Serviços", transaction_type: "imported" },
      { id: "trans-6-3", transaction_date: new Date("2025-01-08"), description: "Treinamento Usuários", amount: 35000, category: "Treinamento", transaction_type: "manual" },
    ],
    "PRJ-007": [
      { id: "trans-7-1", transaction_date: new Date("2025-01-14"), description: "Aquisição Terreno", amount: 1200000, category: "Infraestrutura", transaction_type: "manual" },
      { id: "trans-7-2", transaction_date: new Date("2025-01-09"), description: "Licenças Construção", amount: 95000, category: "Regulatório", transaction_type: "imported" },
      { id: "trans-7-3", transaction_date: new Date("2025-01-04"), description: "Projeto Arquitetônico", amount: 180000, category: "Consultoria", transaction_type: "manual" },
    ]
  };

  return transactionsData[projectCode as keyof typeof transactionsData] || transactionsData["PRJ-002"];
};

const generateMockBaselines = (projectCode: string) => {
  const baselinesData = {
    "PRJ-001": [
      { id: "base-1-1", version: "v1.0", created_at: new Date("2024-05-01").toISOString(), budget: 2200000, description: "Baseline inicial - modernização básica" },
      { id: "base-1-2", version: "v1.1", created_at: new Date("2024-08-15").toISOString(), budget: 2400000, description: "Ajuste por equipamentos adicionais" },
      { id: "base-1-3", version: "v1.2", created_at: new Date("2024-11-01").toISOString(), budget: 2500000, description: "Baseline atual - escopo completo" },
    ],
    "PRJ-002": [
      { id: "base-2-1", version: "v1.0", created_at: new Date("2024-06-01").toISOString(), budget: 1000000, description: "Baseline inicial aprovada" },
      { id: "base-2-2", version: "v1.1", created_at: new Date("2024-09-15").toISOString(), budget: 1100000, description: "Ajuste por escopo adicional" },
      { id: "base-2-3", version: "v1.2", created_at: new Date("2024-12-01").toISOString(), budget: 1200000, description: "Baseline atual - revisão Q4" },
    ],
    "PRJ-003": [
      { id: "base-3-1", version: "v1.0", created_at: new Date("2024-10-01").toISOString(), budget: 750000, description: "Baseline inicial - campanha Q1" },
      { id: "base-3-2", version: "v1.1", created_at: new Date("2024-11-15").toISOString(), budget: 800000, description: "Baseline final - canais adicionais" },
    ],
    "PRJ-004": [
      { id: "base-4-1", version: "v1.0", created_at: new Date("2024-01-15").toISOString(), budget: 3000000, description: "Baseline inicial - expansão Europa" },
      { id: "base-4-2", version: "v1.1", created_at: new Date("2024-06-01").toISOString(), budget: 3300000, description: "Ajuste por regulamentações locais" },
      { id: "base-4-3", version: "v1.2", created_at: new Date("2024-10-15").toISOString(), budget: 3500000, description: "Baseline atual - mercados adicionais" },
    ],
    "PRJ-005": [
      { id: "base-5-1", version: "v1.0", created_at: new Date("2024-12-01").toISOString(), budget: 1800000, description: "Baseline inicial - automação refrigeradores" },
    ],
    "PRJ-006": [
      { id: "base-6-1", version: "v1.0", created_at: new Date("2024-08-01").toISOString(), budget: 600000, description: "Baseline inicial - digitalização RH" },
      { id: "base-6-2", version: "v1.1", created_at: new Date("2024-10-15").toISOString(), budget: 650000, description: "Baseline atual - módulos adicionais" },
    ],
    "PRJ-007": [
      { id: "base-7-1", version: "v1.0", created_at: new Date("2024-03-01").toISOString(), budget: 4800000, description: "Baseline inicial - expansão Suécia" },
      { id: "base-7-2", version: "v1.1", created_at: new Date("2024-07-15").toISOString(), budget: 5200000, description: "Baseline atual - centro distribuição" },
    ]
  };

  return baselinesData[projectCode as keyof typeof baselinesData] || baselinesData["PRJ-002"];
};

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
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState<{
    category?: string;
    capex_opex?: string;
  }>({});
  const { toast } = useToast();
  const { exportData, isExporting } = useExport();
  const { importFromSAP, isImporting } = useSapImport();

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
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
        const mockProject = generateMockProject(id);
        const mockBaselines = generateMockBaselines(id);
        const mockTransactions = generateMockTransactions(id);
        setProject(mockProject);
        setBaselines(mockBaselines);
        setTransactions(mockTransactions);
        return;
      }

      if (!projectData) {
        console.log('No project found, using mock data');
        const mockProject = generateMockProject(id);
        const mockBaselines = generateMockBaselines(id);
        const mockTransactions = generateMockTransactions(id);
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
      const mockProject = generateMockProject(id);
      const mockBaselines = generateMockBaselines(id);
      const mockTransactions = generateMockTransactions(id);
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

  const handleFieldUpdate = async (fieldName: string, value: string | number) => {
    try {
      // Simulate API update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProject(prev => ({
        ...prev,
        [fieldName]: value
      }));
      
      setShowFeedback(true);
      
      toast({
        title: "Campo atualizado!",
        description: `${fieldName} foi atualizado com sucesso.`,
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive",
      });
    }
  };

  const handleExportProject = async () => {
    try {
      const projectData = {
        'Código': project.project_code || id,
        'Nome': project.name,
        'Líder': project.leader,
        'Área': project.area,
        'Status': project.status,
        'Orçamento': project.budget,
        'Realizado': project.realized || 0,
        'Comprometido': project.committed || 0,
        'Saldo': project.budget - (project.realized || 0) - (project.committed || 0),
        'Moeda': project.currency,
        'Progresso': `${project.progress}%`,
        'Data Início': project.start_date ? format(new Date(project.start_date), 'dd/MM/yyyy') : '-',
        'Prazo': project.deadline ? format(new Date(project.deadline), 'dd/MM/yyyy') : '-',
        'Crítico': project.is_critical ? 'Sim' : 'Não',
        'Descrição': project.description || '-'
      };

      await exportData([projectData], `projeto-${project.project_code || id}`, 'excel');
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados do projeto.",
        variant: "destructive",
      });
    }
  };

  const handleExportHistory = async () => {
    try {
      const historyData = [
        ...baselines.map(baseline => ({
          'Data': format(new Date(baseline.created_at), 'dd/MM/yyyy HH:mm'),
          'Tipo': 'Baseline',
          'Versão': baseline.version,
          'Valor': baseline.budget,
          'Descrição': baseline.description || '-'
        })),
        ...transactions.map(transaction => ({
          'Data': format(new Date(transaction.transaction_date), 'dd/MM/yyyy'),
          'Tipo': 'Transação',
          'Descrição': transaction.description,
          'Valor': transaction.amount,
          'Categoria': transaction.category
        }))
      ].sort((a, b) => new Date(b.Data).getTime() - new Date(a.Data).getTime());

      await exportData(historyData, `historico-${project.project_code || id}`, 'excel');
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o histórico do projeto.",
        variant: "destructive",
      });
    }
  };

  const handleSapImport = async () => {
    try {
      await importFromSAP(project.id, handleTransactionAdded);
    } catch (error) {
      // Erro já tratado no hook
    }
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
                    <LogsDialog 
                      projectId={project.project_code || id} 
                      projectName={project.name} 
                    />
                  </TooltipTrigger>
                  <TooltipContent>Ver histórico de alterações</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportProject}
                      disabled={isExporting}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isExporting ? "Exportando..." : "Exportar"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar dados do projeto</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div data-edit-project>
                      <ProjectEditDialog 
                        project={project} 
                        onProjectUpdate={handleProjectUpdate}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Editar informações do projeto</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Informações do projeto - Header fixo padronizado */}
            <div className="space-y-4">
              {/* Informações sempre visíveis com layout padronizado */}
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground mb-1">Nome do projeto</p>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-normal">{project.name}</h2>
                            {project.is_critical && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{project.project_code || id}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Especifique um nome para o projeto Electrolux</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Responsável</p>
                    <p className="text-base font-normal">{project.leader}</p>
                  </div>
                  
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground mb-1">Área</p>
                          <p className="text-base font-normal">{project.area}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Qual área irá EXECUTAR este projeto?</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">SAP ID Number</p>
                    <p className="text-base font-normal">
                      {project.sap_id || "—"}
                    </p>
                  </div>
                </div>
                
                {/* Botão de edição - apenas para Input = Manual/Excel */}
                {project.input === "Manual/Excel" && (
                  <div className="absolute top-0 right-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-muted"
                          onClick={() => {
                            // Trigger the edit dialog that's already in the actions
                            const editButton = document.querySelector('[data-edit-project]') as HTMLButtonElement;
                            if (editButton) editButton.click();
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar informações do projeto</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Aviso para projetos com integração */}
              {project.input === "Integração" && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Dados integrados:</strong> Para edições cadastrais, alterar no sistema Pharos
                  </AlertDescription>
                </Alert>
              )}

              {/* Botão para expandir mais informações */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="gap-2"
              >
                {showMoreInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showMoreInfo ? "Ocultar detalhes" : "Ver mais detalhes"}
              </Button>

              {/* Seção expandível com informações detalhadas */}
              {showMoreInfo && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Detalhadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Diretoria</p>
                        <p className="text-sm font-medium">{project.diretoria || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Planta</p>
                        <p className="text-sm font-medium">{project.planta || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">País</p>
                        <p className="text-sm font-medium">{project.pais || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Categoria do projeto</p>
                        <p className="text-sm font-medium">{project.categoria_projeto || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Linha produto</p>
                        <p className="text-sm font-medium">{project.linha_produto || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Estágios</p>
                        <p className="text-sm font-medium">{project.estagios || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Projeto IT</p>
                        <Badge variant={project.projeto_it === "Sim" ? "default" : "secondary"}>
                          {project.projeto_it || "Não"}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Responsável IT</p>
                        <p className="text-sm font-medium">{project.responsavel_it || "-"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo investimento</p>
                        <Badge variant={project.tipo_investimento === "Capex" ? "default" : "outline"}>
                          {project.tipo_investimento || "Capex"}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Input</p>
                        <Badge variant={project.input === "Integração" ? "default" : "secondary"}>
                          {project.input || "Manual/Excel"}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Moeda</p>
                        <p className="text-sm font-medium">{project.currency}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <p className="text-xs text-muted-foreground">Justificativa</p>
                              <p className="text-sm">{project.justificativa || "-"}</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Por que é importante para a empresa executar este projeto?</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <p className="text-xs text-muted-foreground">Resultados e Benefícios</p>
                              <p className="text-sm">{project.resultados_beneficios || "-"}</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Quais KPIs ou métricas serão impactadas por este projeto? Em que medida? Até quando?</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                onChartClick={(filterType, filterValue) => {
                  // Navegar para a aba de realizados com filtros aplicados
                  setActiveTab('realizados');
                  setTransactionFilters({
                    category: filterType === 'category' ? filterValue : undefined,
                    capex_opex: filterType === 'capex_opex' ? filterValue : undefined,
                  });
                  
                  // Feedback visual para o usuário
                  toast({
                    title: "Filtro aplicado",
                    description: `Visualizando lançamentos filtrados por ${filterValue}`,
                    duration: 3000,
                  });
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
                onImportSAP={handleSapImport}
                onAttachDocument={(transactionId) => {
                  toast({
                    title: "Anexar Documento",
                    description: `Anexando documento à transação ${transactionId}`,
                  });
                }}
                initialFilters={transactionFilters}
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