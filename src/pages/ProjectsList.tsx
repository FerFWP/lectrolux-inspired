import { useState } from "react";
import { Search, Filter, Download, Plus, Eye, Edit3, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  currency: "BRL" | "USD" | "EUR" | "SEK";
  isCritical: boolean;
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
    isCritical: false
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
    isCritical: true
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
    isCritical: false
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
    currency: "EUR",
    isCritical: true
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
    isCritical: false
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
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", EUR: "€", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !filters.area || project.area === filters.area;
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesCurrency = !filters.currency || project.currency === filters.currency;
    
    return matchesSearch && matchesArea && matchesStatus && matchesCurrency;
  });

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
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
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  // Simular verificação de permissão
                  const hasPermission = Math.random() > 0.5;
                  if (!hasPermission) {
                    alert("Você não possui permissão para editar este projeto. Entre em contato com o administrador do sistema.");
                  }
                }}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar informações do projeto (requer permissão)</p>
            </TooltipContent>
          </Tooltip>
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
              <h1 className="text-2xl font-bold text-foreground">Lista de Projetos</h1>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Lista
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar lista de projetos para Excel ou PowerBI com filtros aplicados</p>
                  </TooltipContent>
                </Tooltip>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>
            </div>

            {/* Barra de busca e filtros */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Digite o nome ou ID do projeto para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
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
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
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
          {/* Controles de visualização */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} projeto(s) encontrado(s)
              {selectedProjects.length > 0 && ` • ${selectedProjects.length} selecionado(s)`}
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="hidden md:flex"
              >
                Tabela
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="hidden md:flex"
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
              {/* Visualização em tabela - desktop */}
              <div className="hidden md:block">
                {viewMode === "table" ? (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={selectedProjects.length === filteredProjects.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedProjects(filteredProjects.map(p => p.id));
                                } else {
                                  setSelectedProjects([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Projeto</TableHead>
                          <TableHead>Líder</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Área</TableHead>
                          <TableHead className="text-right">Orçamento</TableHead>
                          <TableHead className="text-right">Realizado</TableHead>
                          <TableHead className="text-right">Saldo</TableHead>
                          <TableHead className="w-32">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow 
                            key={project.id} 
                            className={`hover:bg-muted/50 cursor-pointer ${project.isCritical ? 'bg-destructive/5 border-l-4 border-l-destructive' : ''}`}
                          >
                            <TableCell>
                              <Checkbox 
                                checked={selectedProjects.includes(project.id)}
                                onCheckedChange={() => toggleProjectSelection(project.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-primary hover:underline">
                                    {project.name}
                                  </span>
                                  {project.isCritical && (
                                    <Badge variant="destructive" className="gap-1 text-xs">
                                      <AlertTriangle className="h-3 w-3" />
                                      Crítico
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{project.id}</p>
                              </div>
                            </TableCell>
                            <TableCell>{project.leader}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[project.status]}>
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{project.area}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(project.budget, project.currency)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(project.realized, project.currency)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${project.balance < 0 ? 'text-destructive' : 'text-green-600'}`}>
                                {formatCurrency(project.balance, project.currency)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Visualizar projeto</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        // Simular verificação de permissão
                                        const hasPermission = Math.random() > 0.5;
                                        if (!hasPermission) {
                                          alert("Você não possui permissão para editar este projeto. Entre em contato com o administrador do sistema.");
                                        }
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Editar informações do projeto (requer permissão)</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Exportar dados</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>

              {/* Visualização em cards - mobile */}
              <div className="md:hidden space-y-4">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
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