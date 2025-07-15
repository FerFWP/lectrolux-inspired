import { useState } from "react";
import { Search, Filter, Download, Plus, Eye, Edit3, FileText, AlertTriangle, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CompactProjectView } from "@/components/compact-project-view";
import { SmartFilters } from "@/components/smart-filters";
import { IntelligentSearch } from "@/components/intelligent-search";
import { HomeButton } from "@/components/home-button";
import { ProjectCreateDialog } from "@/components/project-create-dialog";
import { ProjectEditDialog } from "@/components/project-edit-dialog";
import { BulkEditDialog } from "@/components/bulk-edit-dialog";
import { PendingUpdatesCard } from "@/components/pending-updates-card";
import { useExport } from "@/hooks/use-export";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  leader: string;
  status: "Em Andamento" | "Concluído" | "Em Atraso" | "Planejado" | "Crítico";
  area: string;
  budget: number;
  realized: number;
  committed: number;
  balance: number;
  currency: "BRL" | "USD" | "SEK";
  isCritical: boolean;
  progress: number;
  deadline: string;
  category: "CAPEX" | "OPEX" | "P&D";
  type: "Tangível" | "Intangível";
  budgetUnit: number; // BU - valor aprovado
}

const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Modernização Linha Produção A",
    leader: "Maria Silva",
    status: "Em Andamento",
    area: "Produção",
    budget: 2500000,
    realized: 1800000,
    committed: 500000,
    balance: 200000,
    currency: "BRL",
    isCritical: false,
    progress: 72,
    deadline: "15/03/2025",
    category: "CAPEX",
    type: "Tangível",
    budgetUnit: 2400000
  },
  {
    id: "PRJ-002", 
    name: "Sistema ERP Integrado",
    leader: "João Santos",
    status: "Crítico",
    area: "TI",
    budget: 1200000,
    realized: 1350000,
    committed: 200000,
    balance: -350000,
    currency: "BRL",
    isCritical: true,
    progress: 85,
    deadline: "28/02/2025",
    category: "OPEX",
    type: "Intangível",
    budgetUnit: 1100000
  },
  {
    id: "PRJ-003",
    name: "Campanha Marketing Digital Q1",
    leader: "Ana Costa",
    status: "Concluído",
    area: "Marketing",
    budget: 800000,
    realized: 750000,
    committed: 0,
    balance: 50000,
    currency: "BRL",
    isCritical: false,
    progress: 100,
    deadline: "31/01/2025",
    category: "OPEX",
    type: "Intangível",
    budgetUnit: 750000
  },
  {
    id: "PRJ-004",
    name: "Expansão Mercado Europeu",
    leader: "Pedro Oliveira",
    status: "Em Atraso",
    area: "Comercial",
    budget: 3500000,
    realized: 2100000,
    committed: 800000,
    balance: 600000,
    currency: "BRL",
    isCritical: true,
    progress: 45,
    deadline: "30/04/2025",
    category: "CAPEX",
    type: "Tangível",
    budgetUnit: 3300000
  },
  {
    id: "PRJ-005",
    name: "Automação Linha Refrigeradores",
    leader: "Carlos Mendes",
    status: "Planejado",
    area: "Produção",
    budget: 1800000,
    realized: 0,
    committed: 450000,
    balance: 1350000,
    currency: "BRL",
    isCritical: false,
    progress: 15,
    deadline: "15/06/2025",
    category: "CAPEX",
    type: "Tangível",
    budgetUnit: 1750000
  },
  {
    id: "PRJ-006",
    name: "Digitalização Processos RH",
    leader: "Lucia Ferreira",
    status: "Em Andamento",
    area: "RH",
    budget: 650000,
    realized: 320000,
    committed: 180000,
    balance: 150000,
    currency: "BRL",
    isCritical: false,
    progress: 55,
    deadline: "20/05/2025",
    category: "OPEX",
    type: "Intangível",
    budgetUnit: 600000
  },
  {
    id: "PRJ-007",
    name: "Expansão Suécia",
    leader: "Erik Johansson",
    status: "Em Andamento",
    area: "Internacional",
    budget: 5200000,
    realized: 2800000,
    committed: 1200000,
    balance: 1200000,
    currency: "SEK",
    isCritical: false,
    progress: 68,
    deadline: "30/09/2025",
    category: "CAPEX",
    type: "Tangível",
    budgetUnit: 5000000
  }
];

const statusColors = {
  "Em Andamento": "bg-blue-100 text-blue-800 border-blue-200",
  "Concluído": "bg-green-100 text-green-800 border-green-200",
  "Em Atraso": "bg-orange-100 text-orange-800 border-orange-200",
  "Planejado": "bg-gray-100 text-gray-800 border-gray-200",
  "Crítico": "bg-red-100 text-red-800 border-red-200"
};

export default function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    area: "",
    year: "",
    status: "",
    leader: "",
    category: "",
    currency: ""
  });
  const [viewMode, setViewMode] = useState<"executive" | "table" | "cards">("executive");
  const [smartFilter, setSmartFilter] = useState("attention");
  const [intelligentFilters, setIntelligentFilters] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const navigate = useNavigate();
  const { exportData, isExporting } = useExport();
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  const getSmartFilteredProjects = () => {
    let baseProjects = mockProjects;
    
    // Apply smart filter first
    switch (smartFilter) {
      case "attention":
        baseProjects = mockProjects.filter(p => 
          p.isCritical || 
          p.status === "Crítico" || 
          p.status === "Em Atraso" ||
          p.progress < 30
        );
        break;
      case "financial":
        baseProjects = mockProjects.filter(p => 
          p.balance < 0 || 
          (p.realized / p.budget) > 0.9
        );
        break;
      case "area":
        baseProjects = mockProjects.filter(p => p.area === "Produção"); // Example: user's area
        break;
      default:
        baseProjects = mockProjects;
    }
    
    // Apply intelligent filters from search
    intelligentFilters.forEach(filter => {
      const [type, value] = filter.split(':');
      switch (type) {
        case 'líder':
          baseProjects = baseProjects.filter(p => p.leader === value);
          break;
        case 'área':
          baseProjects = baseProjects.filter(p => p.area === value);
          break;
        case 'status':
          baseProjects = baseProjects.filter(p => p.status === value);
          break;
        case 'moeda':
          baseProjects = baseProjects.filter(p => p.currency === value);
          break;
        case 'budget':
          if (value === 'exceeded') {
            baseProjects = baseProjects.filter(p => p.balance < 0);
          }
          break;
      }
    });
    
    // Then apply regular filters
    return baseProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.leader.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = !filters.area || project.area === filters.area;
      const matchesStatus = !filters.status || project.status === filters.status;
      const matchesCurrency = !filters.currency || project.currency === filters.currency;
      
      return matchesSearch && matchesArea && matchesStatus && matchesCurrency;
    });
  };

  const filteredProjects = getSmartFilteredProjects();

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleIntelligentSearch = (query: string, activeFilters: string[]) => {
    setSearchTerm(query);
    setIntelligentFilters(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      area: "",
      year: "",
      status: "",
      leader: "",
      category: "",
      currency: ""
    });
    setIntelligentFilters([]);
    setSearchTerm("");
  };

  const handleExportList = async () => {
    try {
      const projectsData = filteredProjects.map(project => ({
        'Código': project.id,
        'Nome': project.name,
        'Líder': project.leader,
        'Área': project.area,
        'Status': project.status,
        'Orçamento': project.budget,
        'Realizado': project.realized,
        'Comprometido': project.committed,
        'Saldo': project.balance,
        'Moeda': project.currency,
        'Progresso': `${project.progress}%`,
        'Prazo': project.deadline,
        'Categoria': project.category,
        'Tipo': project.type,
        'Crítico': project.isCritical ? 'Sim' : 'Não'
      }));

      await exportData(projectsData, 'lista-projetos', 'excel');
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar a lista de projetos.",
        variant: "destructive",
      });
    }
  };

  const handleProjectCreated = (newProject: any) => {
    toast({
      title: "Projeto criado com sucesso!",
      description: `O projeto "${newProject.name}" foi adicionado à lista.`,
    });
    // Em uma aplicação real, você atualizaria a lista de projetos
  };

  const handleProjectEdited = (updatedProject: any) => {
    toast({
      title: "Projeto atualizado!",
      description: `As alterações do projeto "${updatedProject.name}" foram salvas.`,
    });
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className={`hover:shadow-md transition-shadow ${project.isCritical ? 'border-destructive/20 bg-destructive/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={() => toggleProjectSelection(project.id)}
            />
            <div>
              <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground">{project.id}</p>
            </div>
          </div>
          {project.isCritical && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Crítico
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Líder</p>
            <p className="text-sm font-medium">{project.leader}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Área</p>
            <p className="text-sm font-medium">{project.area}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge className={statusColors[project.status]}>
            {project.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div>
            <span className="text-muted-foreground">Orçamento:</span>
            <div className="font-medium">{formatCurrency(project.budget, project.currency)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Realizado:</span>
            <div className="font-medium">{formatCurrency(project.realized, project.currency)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Saldo:</span>
            <div className={`font-medium ${project.balance < 0 ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(project.balance, project.currency)}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate(`/projetos/${project.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <ProjectEditDialog 
            project={{
              id: project.id,
              project_code: project.id,
              name: project.name,
              leader: project.leader,
              area: project.area,
              status: project.status,
              budget: project.budget,
              currency: project.currency,
              progress: project.progress,
              start_date: new Date(),
              deadline: new Date(project.deadline),
              is_critical: project.isCritical,
              description: `Projeto da área ${project.area}`
            }}
            onProjectUpdate={handleProjectEdited}
          />
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <HomeButton />
                <h1 className="text-2xl font-bold text-foreground">Lista de Projetos</h1>
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={handleExportList}
                      disabled={isExporting || filteredProjects.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isExporting ? "Exportando..." : "Exportar Lista"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar lista de projetos para Excel com filtros aplicados</p>
                  </TooltipContent>
                </Tooltip>
                <ProjectCreateDialog onProjectCreated={handleProjectCreated} />
                {selectedProjects.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkEdit(true)}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar Selecionados ({selectedProjects.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Notificações de Pendências */}
            <PendingUpdatesCard />

            {/* Barra de busca inteligente */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <IntelligentSearch
                    projects={mockProjects}
                    onSearch={handleIntelligentSearch}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({...prev, area: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produção">Produção</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                          <SelectItem value="Concluído">Concluído</SelectItem>
                          <SelectItem value="Em Atraso">Em Atraso</SelectItem>
                          <SelectItem value="Planejado">Planejado</SelectItem>
                          <SelectItem value="Crítico">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtre projetos por status atual: Em Andamento, Concluído, Em Atraso, Planejado ou Crítico</p>
                  </TooltipContent>
                </Tooltip>

                <Select value={filters.currency} onValueChange={(value) => setFilters(prev => ({...prev, currency: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    
                    <SelectItem value="SEK">Coroa Sueca (SEK)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({...prev, year: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.leader} onValueChange={(value) => setFilters(prev => ({...prev, leader: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Líder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maria Silva">Maria Silva</SelectItem>
                    <SelectItem value="João Santos">João Santos</SelectItem>
                    <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAPEX">CAPEX</SelectItem>
                    <SelectItem value="OPEX">OPEX</SelectItem>
                    <SelectItem value="P&D">P&D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="container mx-auto px-6 py-6">
          {/* Smart Filters */}
          <SmartFilters 
            projects={mockProjects}
            activeFilter={smartFilter}
            onFilterChange={setSmartFilter}
          />

          {/* Controles de visualização */}
          <div className="flex items-center justify-between mb-4 mt-6">
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} projeto(s) encontrado(s)
              {selectedProjects.length > 0 && ` • ${selectedProjects.length} selecionado(s)`}
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "executive" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("executive")}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Executiva
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Compacta
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="hidden md:flex gap-2"
              >
                Cards
              </Button>
            </div>
          </div>

          {/* Lista de projetos */}
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nenhum projeto encontrado</h3>
                  <p className="text-muted-foreground">
                    Não encontramos projetos que correspondam aos critérios selecionados. Tente ajustar os filtros ou termo de busca, ou limpe todos os filtros para ver a lista completa.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Visualização Executiva - Lista com métricas financeiras inline */}
              {viewMode === "executive" && (
                <CompactProjectView 
                  projects={filteredProjects}
                  selectedProjects={selectedProjects}
                  onToggleSelection={toggleProjectSelection}
                  formatCurrency={formatCurrency}
                  viewMode="executive"
                />
              )}

              {/* Visualização Compacta - Lista densa com hover details */}
              {viewMode === "table" && (
                <CompactProjectView 
                  projects={filteredProjects}
                  selectedProjects={selectedProjects}
                  onToggleSelection={toggleProjectSelection}
                  formatCurrency={formatCurrency}
                  viewMode="compact"
                />
              )}


              {/* Visualização em cards */}
              {viewMode === "cards" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}

            </>
          )}

          {/* Paginação */}
          {filteredProjects.length > 0 && (
            <div className="flex items-center justify-center mt-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredProjects.length} de {mockProjects.length} projetos
              </p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}