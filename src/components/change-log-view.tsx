import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  User, 
  Clock,
  Edit3,
  Info,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface ChangeLogEntry {
  id: string;
  timestamp: Date;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
  category: string;
  section: string;
}

interface ChangeLogViewProps {
  project: any;
}

export function ChangeLogView({ project }: ChangeLogViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const mockChangeLogs: ChangeLogEntry[] = [
    {
      id: "log-1",
      timestamp: new Date("2024-12-15T10:30:00"),
      field: "Orçamento",
      oldValue: "R$ 1.000.000",
      newValue: "R$ 1.200.000",
      user: "Maria Santos",
      category: "Financeiro",
      section: "Resumo"
    },
    {
      id: "log-2", 
      timestamp: new Date("2024-12-14T15:45:00"),
      field: "Status",
      oldValue: "Planejado",
      newValue: "Em Andamento",
      user: "João Silva",
      category: "Status",
      section: "Dados Cadastrais"
    },
    {
      id: "log-3",
      timestamp: new Date("2024-12-13T09:15:00"),
      field: "Valor Realizado",
      oldValue: "R$ 150.000",
      newValue: "R$ 200.000",
      user: "Ana Costa",
      category: "Financeiro",
      section: "Realizados"
    },
    {
      id: "log-4",
      timestamp: new Date("2024-12-12T14:20:00"),
      field: "Y1 Q1",
      oldValue: "R$ 50.000",
      newValue: "R$ 75.000",
      user: "Carlos Lima",
      category: "Planejamento",
      section: "Capex SOP"
    },
    {
      id: "log-5",
      timestamp: new Date("2024-12-11T11:30:00"),
      field: "Líder do Projeto",
      oldValue: "Pedro Oliveira",
      newValue: "Maria Santos",
      user: "Roberto Admin",
      category: "Equipe",
      section: "Dados Cadastrais"
    },
    {
      id: "log-6",
      timestamp: new Date("2024-12-10T16:45:00"),
      field: "Investment Category",
      oldValue: "Growth",
      newValue: "Maintenance",
      user: "Ana Costa",
      category: "Classificação",
      section: "Capex IR"
    },
    {
      id: "log-7",
      timestamp: new Date("2024-12-09T08:30:00"),
      field: "Data de Término",
      oldValue: "31/12/2024",
      newValue: "31/03/2025",
      user: "João Silva",
      category: "Cronograma",
      section: "Dados Cadastrais"
    }
  ];

  const filteredLogs = useMemo(() => {
    let filtered = mockChangeLogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.oldValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.newValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Filter by section
    if (sectionFilter !== "all") {
      filtered = filtered.filter(log => log.section === sectionFilter);
    }

    // Sort by timestamp
    filtered.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });

    return filtered;
  }, [mockChangeLogs, searchTerm, categoryFilter, sectionFilter, sortOrder]);

  const categories = Array.from(new Set(mockChangeLogs.map(log => log.category)));
  const sections = Array.from(new Set(mockChangeLogs.map(log => log.section)));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Financeiro": "bg-green-100 text-green-800 border-green-200",
      "Status": "bg-blue-100 text-blue-800 border-blue-200",
      "Planejamento": "bg-purple-100 text-purple-800 border-purple-200",
      "Equipe": "bg-orange-100 text-orange-800 border-orange-200",
      "Classificação": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Cronograma": "bg-pink-100 text-pink-800 border-pink-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const exportChangeLogs = () => {
    const csvContent = filteredLogs.map(log => 
      `"${format(log.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}","${log.field}","${log.oldValue}","${log.newValue}","${log.user}","${log.category}","${log.section}"`
    ).join('\n');
    
    const blob = new Blob([`"Data/Hora","Campo Alterado","Valor Anterior","Novo Valor","Responsável","Categoria","Seção"\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-alteracoes-${project.project_code}.csv`;
    a.click();
    
    toast({
      title: "Exportação Concluída",
      description: "Log de alterações exportado com sucesso.",
    });
  };

  if (mockChangeLogs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma alteração registrada para este projeto</h3>
            <p className="text-muted-foreground max-w-md">
              Quando alterações forem feitas no projeto, elas aparecerão aqui com detalhes completos sobre o que foi modificado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={exportChangeLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar log de alterações para CSV</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alterações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as seções</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="justify-start"
              >
                {sortOrder === "desc" ? <SortDesc className="h-4 w-4 mr-2" /> : <SortAsc className="h-4 w-4 mr-2" />}
                {sortOrder === "desc" ? "Mais recente" : "Mais antigo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Log Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Log de Alterações
              <Badge variant="outline" className="ml-2">
                {filteredLogs.length} {filteredLogs.length === 1 ? 'alteração' : 'alterações'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Data/Hora</TableHead>
                    <TableHead className="w-[120px]">Campo</TableHead>
                    <TableHead className="w-[150px]">Valor Anterior</TableHead>
                    <TableHead className="w-[150px]">Novo Valor</TableHead>
                    <TableHead className="w-[120px]">Responsável</TableHead>
                    <TableHead className="w-[100px]">Categoria</TableHead>
                    <TableHead className="w-[100px]">Seção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{format(log.timestamp, 'dd/MM/yyyy', { locale: ptBR })}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(log.timestamp, 'HH:mm', { locale: ptBR })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.field}</TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate text-red-600 bg-red-50 px-2 py-1 rounded text-sm border border-red-200">
                          {log.oldValue}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate text-green-600 bg-green-50 px-2 py-1 rounded text-sm border border-green-200">
                          {log.newValue}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(log.category)}>
                          {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="cursor-help">
                              {log.section}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Seção: {log.section}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma alteração encontrada</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros para encontrar as alterações desejadas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}